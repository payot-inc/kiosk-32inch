import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

import Layout from '@/components/layout/Layout.vue';

import AccountLogin from '../views/AccountLogin.vue';
import Main from '../views/Main.vue';

import UserLogin from '../views/UserLogin.vue';

import ChargeType from '../views/ChargeType.vue';
import CashCharge from '../views/CashCharge.vue';
import CardCharge from '../views/CardCharge.vue';

import MachineSelect from '../views/MachineSelect.vue';
import UseMachine from '../views/UseMachine.vue';
import Result from '../views/Result.vue';

import CustomPay from '../views/CustomPay.vue';
import PaymentConfirm from '../views/PaymentConfirm.vue';

import UseList from '../views/UseList.vue';

import ErrorPage from '../views/Error.vue';
import EmptyPage from '../views/404.vue';

Vue.use(VueRouter);

const routes = [
  {
    /** 키오스크 계정 로그인 */
    path: '/AccountLogin',
    name: 'AccountLogin',
    component: AccountLogin,
  },
  {
    /** 메인페이지 */
    path: '/',
    name: 'Main',
    component: Main,
    // 메인페이지 이동시 회원 정보 초기화
    beforeRouteEnter(to, from, next) {
      store.commit('CLEAR_ACTION');
      next();
    },
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        /** 회원 로그인 페이지 */
        path: '/UserLogin',
        name: 'UserLogin',
        component: UserLogin,
        props: route => route.params,
      },
      {
        /** 결제 수단 선택 페이지 */
        path: '/ChargeType',
        name: 'ChargeType',
        component: ChargeType,
        beforeEnter: (to, from, next) => {
          const allPayMode = Object.values(store.state.kiosk.payType).every(state => state);
          if (allPayMode) {
            // 모든 결제 수단을 지원한다면
            next();
          } else {
            // 일부 결제 수단을 지원한다면
            const redirectionName = store.state.kiosk.payType.cash ? 'CashCharge' : 'CardCharge';
            next({ name: redirectionName });
          }
        },
      },
      {
        /** 현금 충전 페이지 */
        path: '/CashCharge',
        name: 'CashCharge',
        component: CashCharge,
        beforeEnter: (to, from, next) => {
          // console.log(to, from ,next);
          store.commit('APPEND_ACTION', {
            type: 'charge',
            payMethod: 'cash',
          });
          next();
        },
      },
      {
        /** 카드 충전 페이지 */
        path: '/CardCharge',
        name: 'CardCharge',
        component: CardCharge,
        beforeEnter: (to, from, next) => {
          store.commit('APPEND_ACTION', {
            type: 'charge',
            payMethod: 'card',
          });
          next();
        },
      },
      {
        /** 장비 및 상품선택 페이지 */
        path: '/MachineSelect',
        name: 'MachineSelect',
        component: MachineSelect,
      },
      {
        /** 장비사용 결제 및 확인 페이지 */
        path: '/UseMachine',
        name: 'UseMachine',
        component: UseMachine,
      },
      {
        /** 결제처리 결과 안내 페이지 */
        path: '/Result',
        name: 'Result',
        component: Result,
        props: route => {
          const { params } = route;
          // const { totalPoint } = params;
          // let cloneUser = Object.assign({}, store.state.user);
          // cloneUser.point += totalPoint;

          return params;
        },
      },
      {
        //** 포인트 및 사용내역 조회 페이지 */
        path: '/UseList',
        name: 'UseList',
        component: UseList,
      },
      {
        //** 커스텀 결제금액 선택 페이지 */
        path: '/CustomPay',
        name: 'CustomPay',
        component: CustomPay,
      },
      {
        //** 결제예정 확인 및 결제 페이지 */
        path: '/PaymentConfirm',
        name: 'PaymentConfirm',
        component: PaymentConfirm,
      },
    ],
  },
  {
    path: '/Error',
    name: 'Error',
    component: ErrorPage,
    props: route => route.params,
  },
  {
    path: '*',
    component: EmptyPage,
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const isAccountLogin = store.state.company.id;
  const loginLessPageName = ['AccountLogin', 'Error'].includes(to.name);

  if (!isAccountLogin && !loginLessPageName) {
    next({ name: 'AccountLogin' });
  } else {
    next();
  }
});

export default router;
