import { ipcRenderer } from 'electron';
import Vue from 'vue';
import Vuex from 'vuex';
import { createPersistedState } from 'vuex-electron';
import { coreAPI, kioskAPI } from '../plugins/axios';
// import sound from '../plugins/sound';
import soundManager from '../plugins/howler';
import { sortBy } from 'lodash';
import moment from 'moment';
import { Howl } from 'howler';
import path from 'path';
import fs from 'fs';

Vue.use(Vuex);

/** 사용자 액션 초기값 생성 */
function generateDefaultAction(companyId, userId) {
  return {
    request: 'kiosk',
    companyId,
    userId,
    type: null, // use | charge
    payMethod: null, // cash | card
    machineId: null, // 금액이 투입되고자 하는 장비
    inputAmount: 0, // 장비에 투입되고자 하는 금액
    usePoint: 0, // 장비에 투입시 사용하고자하는 포인트
    realAmount: 0, // 실결제 금액
    appendPoint: 0, // 추가 적립금액
    eventRate: 0, // 추가지급률
    totalPoint: 0, // 총 변동 포인트
  };
}

const rootDir = path.join(
  'C:',
  'server_api_logs',
);


function hasTodayDirOrCreate(isRequest) {
  const todayDir = path.join(
    rootDir, 
    moment().format('YYYY-MM-DD'), 
    isRequest ? 'request' : 'response',
  );
  const hasDir = fs.existsSync(todayDir);
  if(hasDir) return;
  fs.mkdirSync(todayDir, { recursive: true });
}

function saveLog(res, isRequest) {
  hasTodayDirOrCreate(isRequest);
  const savePath = path.join(
    rootDir, 
    moment().format('YYYY-MM-DD'), 
    isRequest ? 'request' : 'response',
    `${moment().format('a_hh_mm_ss_SSS')}.json`
  );
  fs.writeFileSync(savePath, JSON.stringify(res, null, 2));
}

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    company: {},
    kiosk: {},
    machines: [],
    user: {},
    userAction: generateDefaultAction(null, null),
    remote: {
      isSales: true, // 키오스크 가동 여부
    },
    cardModule: {
      type: null,
    },
    useGuide: true,
    now: moment().format('YYYY-MM-DD HH:mm:ss'),
  },
  getters: {
    getEventRate: (state, getters) => (type, amount) => {
      const kioskEvent = getters.kioskEvent;
      const eventTarget = [
        { min: 0, max: 10000 }, // 1만원 이상시
        { min: 10000, max: 20000 }, // 1 ~ 2만원
        { min: 20000, max: 30000 }, // 2 ~ 3만원
        { min: 30000, max: 40000 }, // 4 ~ 5만원
        { min: 40000, max: 50000 }, // 4 ~ 5만원
        { min: 50000, max: Number.MAX_VALUE }, // 5 ~ 만원
      ];
      const index = eventTarget.findIndex(({ min, max }) => amount >= min && amount < max);
      return kioskEvent.rule[type][index] / 100;
    },
    kioskEvent(state) {
      // if(state.kiosk.events) {
      //   return state.kiosk.events
      //     .sort((a, b) => b.weekDay - a.weekDay)
      //     .find(({ weekDay }) => [-1, new Date().getDay()].includes(weekDay));
      // }
      if (state.kiosk.events) {
        const currentEvent = state.kiosk.events.find(event => {
          return (
            event.weekDay === parseInt(moment(state.now).format('d'), 10) &&
            moment(`${state.now.slice(0, 10)} ${event.startTime}`) <= moment(state.now) &&
            moment(`${state.now.slice(0, 10)} ${event.endTime}`) >= moment(state.now)
          );
        });

        if (currentEvent) {
          return currentEvent;
        } else {
          return state.kiosk.events.find(event => event.weekDay === -1);
        }
      }
    },
  },
  mutations: {
    SET_NOW(state) {
      state.now = moment().format('YYYY-MM-DD HH:mm:ss');
    },
    SET_USEGUIDE(state, value) {
      state.useGuide = value;
    },
    /** 계정 정보 */
    SET_COMPANY(state, value) {
      state.company = value;
    },
    /** 키오스크 설정 정보 */
    SET_KIOSK(state, value) {
      state.kiosk = value;
    },
    /** 키오스크 장비 목록 갱신 */
    SET_MACHINES(state, value) {
      const sortedProductsMachines = value.map(m => {
        const { products } = m;
        return { ...m, products: sortBy(products, ['sort', 'id']) };
      });
      state.machines = sortBy(sortedProductsMachines, ['category', 'sort', 'id']);
    },
    CLEAR_KIOSK(state) {
      ipcRenderer.invoke('logout', state.company.id);
      state.company = {};
      state.kiosk = {};
      state.machines = {};
      state.cardModule.type = null;
    },
    /** 회원 정보 변경 */
    SET_USER(state, value) {
      state.user = value;
      state.userAction = generateDefaultAction(state.company.id, value.id);
    },
    APPEND_USER(state, value) {
      state.user = Object.assign({}, state.user, value);
    },
    /** 사용자 키오스크 액션 추가 */
    APPEND_ACTION(state, value) {
      state.userAction = Object.assign({}, state.userAction, value);
    },
    /** 사용자 키오스크 액션 */
    CLEAR_ACTION(state) {
      state.user = {};
      state.userAction = generateDefaultAction(state.company.id, null);
    },
    SET_IS_SALES(state, value) {
      state.remote.isSales = value;
    },
    SET_CARD_MODULE(state, value) {
      state.cardModule.type = value;
    },
  },
  actions: {
    /** 키오스크 계정 로그인 */
    async accountLogin({ commit }, { email, password }) {
      const { data } = await kioskAPI({
        method: 'post',
        url: '/login',
        data: { email, password },
      });

      const { company, kiosk, machines } = data;
      commit('SET_COMPANY', company);
      commit('SET_KIOSK', kiosk);
      commit('SET_MACHINES', machines);
      ipcRenderer.invoke('login', company.id);

      return data;
    },

    /** 키오스크 계정 정보 초기화 */
    async refreshKioskConfig({ commit, state }) {
      const { id } = state.company;
      if (!id) throw new Error('로그인을 먼저 진행해 주세요');

      const { data } = await kioskAPI({
        method: 'GET',
        url: `/${id}`,
      });
      const { company, kiosk, machines } = data;
      commit('SET_COMPANY', company);
      commit('SET_KIOSK', kiosk);
      commit('SET_MACHINES', machines);
    },

    /** 회원 가입여부 조회 */
    async hasUser({ state, commit }, { phone }) {
      try {
        const { id: companyId } = state.company;
        const { data: user } = await kioskAPI({
          method: 'GET',
          url: `/${companyId}/user`,
          params: { phone },
        });
        commit('SET_USER', user);
        return user;
      } catch (error) {
        commit('SET_USER', { id: null, phone, point: 0 });
        throw error;
      }
    },

    /** 회원 비밀번호 확인 */
    async userLogin({ state }, { password }) {
      const { id } = state.user;
      // console.log('id', id, 'password', password);
      const res = await kioskAPI({
        method: 'POST',
        url: `/${id}/user/login`,
        data: { password },
      });
      // console.log(res);
    },

    /** 회원 비밀번호 변경 및 초기화 */
    async updateUserPassword({ commit, state }, { mode = 'forgot', password = null }) {
      const { id } = state.user;
      // console.log('id', id, 'mode', mode, 'password', password);
      const { data: user } = await kioskAPI({
        method: 'PUT',
        url: `/${id}/password`,
        data: { mode, password },
      });
      commit('SET_USER', Object.assign({}, state.user, { tempPassword: user.password }));

      return user;
    },

    /** 회원 가입 */
    async userSignUp({ state }, { phone, password }) {
      const { id: companyId } = state.company;
      const { data: user } = await kioskAPI({
        method: 'POST',
        url: `/${companyId}/user/signup`,
        data: { phone, password },
      });
      const { id: userId } = user;
      this.commit('APPEND_USER', { id: userId });
      this.commit('APPEND_ACTION', { userId });

      return user;
    },

    /** 장비 네트워크 연결상태 확인 */
    async deviceNetworkTest(_, mac) {
      await coreAPI({ method: 'POST', url: '/device/check', data: { mac } });
    },

    /** 포인트 충전 및 장비 이용하기 */
    async pay({ state, dispatch }) {
      let form = state.userAction;

      /** 가입되어있지 않은 회원이라면 */
      if (!form.userId) {
        const { phone, password } = state.user;
        const user = await dispatch('userSignUp', { phone, password });
        form.userId = user.id;
      }
      saveLog(form, true);
      const { data } = await kioskAPI({
        method: 'POST',
        url: `/pay`,
        data: { params: form },
        timeout:
          parseInt(form.inputAmount, 10) < 500 ? 5000 : parseInt(form.inputAmount / 500, 10) * 5000,
        // timeout: 1,
      }).catch((err) => saveLog(err, false));
      saveLog(data, false);

      return data;
    },
    async warningPlay({ state }, src = 'alertSound.mp3') {
      soundManager.warningPlay(src);
    },
    async warningPlayV2({ state }, src = 'http://192.168.0.16:3000/sound/alertSound.mp3') {
      const warning = new Howl({
        src,
        volume: 1,
      });
      warning.play();
    },
  },
  modules: {},
});
