<template>
  <div class="userLogin" id="container">
    <SubTitleBar title="전화번호 입력" />
    <div class="inner">
      <div v-if="mode === 'UseList'" class="introText">
        사용내역조회를 위한 전화번호를 입력해주세요
      </div>
      <div v-else class="introText">
        포인트적립을 위한 전화번호를 입력해주세요
      </div>
      <LoginBox :setPhone="setPhone" />
      <KioskGuide></KioskGuide>
    </div>

    <PasswordModal
      :type="type"
      :registNewPassword="registNewPassword"
      :login="login"
      :findPassword="findPassword"
      :matchResetPassword="matchResetPassword"
      :updatePassword="updatePassword"
    />
    <AlertModal
      ref="alert"
      mode="alert"
      title="회원조회 실패"
      message="일치하는 회원이 없습니다"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import SubTitleBar from '@/components/SubTitleBar.vue';
import LoginBox from '@/components/UserLogin/LoginBox.vue';
import KioskGuide from '@/components/UserLogin/KioskGuide.vue';
import PasswordModal from '@/components/UserLogin/PasswordModal.vue';
import AlertModal from '@/components/modal/AlertModal.vue';

export default {
  name: 'UserLogin',
  components: {
    SubTitleBar,
    LoginBox,
    KioskGuide,
    PasswordModal,
    AlertModal,
  },
  props: {
    mode: String, // 사용자가 선택했던 기능 : UseMachine(장비이용), PointCharge(포인트 충전), UseKioskList(키오스크 이용내역 조회)
    done: Function, // 회원 검증이 이루어 지고 난 후의 라우트 네임
  },
  data() {
    return {
      /**
       * findUser: 회원조회,
       * matchPassword: 비밀번호 확인
       * inValidePassword: 비밀번호 검증 실패
       *
       * newUser: 신규회원,
       * newUserPassword: 신규회원 비밀번호 확인
       *
       * matchResetPassword: 임시비밀번호 검증
       * inValideResetPassword: 임시비밀번호 검증 실패
       * updatePassword: 기존 회원 비밀번호 변경
       *
       * done: 회원 로그인 완료
       */
      type: 'findUser', //
      phone: '010-',
      resetPassword: '',
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      useUserPassword: state => state.kiosk.useUserPassword,
    }),
  },
  watch: {
    phone(newValue) {
      const validePhoneNumber = /^010-\d{4}-\d{4}$/.test(newValue);
      if (!validePhoneNumber) {
        this.type = 'findUser';
      } else {
        this.findUser(newValue);
      }
    },
    type(newValue) {
      if (newValue === 'findUser') {
        // this.$sound.singlePlay('./sound/input_phone_number.mp3');
        this.$soundManager.singlePlay('input_phone_number.mp3');
      } else if (newValue === 'matchPassword' || newValue === 'newUserPassword') {
        // this.$sound.singlePlay('./sound/input_password.mp3');
        this.$soundManager.singlePlay('input_password.mp3');
      } else if (newValue === 'matchResetPassword') {
        // this.$sound.singlePlay('./sound/forgot_password_send.mp3');
        this.$soundManager.singlePlay('forgot_password_send.mp3');
      } else if (newValue === 'inValideResetPassword' || newValue === 'newUser') {
        // this.$sound.singlePlay('./sound/set_password.mp3');
        this.$soundManager.singlePlay('set_password.mp3');
      }
    },
  },
  mounted() {
    // * 1. 이용하기 : MachineSelect
    // * 2. 충전하기 : ChargeType
    // * 3. 조회하기 : UseList
    const mode = this.$route.params.mode;
    // console.log(mode);
    if (mode === 'MachineSelect') {
      // const soundList = ['./sound/machine_use.mp3', './sound/input_phone_number.mp3'];
      // const delayList = [0];
      // this.$sound.listPlay(soundList, delayList);
      const soundList = ['machine_use.mp3', 'input_phone_number.mp3'];
      const delayList = [0];
      this.$soundManager.listPlay(soundList, delayList);
    } else if (mode === 'PointCharge') {
      // const soundList = ['./sound/point_append.mp3', './sound/input_phone_number.mp3'];
      // const delayList = [0];
      // this.$sound.listPlay(soundList, delayList);
      const soundList = ['point_append.mp3', 'input_phone_number.mp3'];
      const delayList = [0];
      this.$soundManager.listPlay(soundList, delayList);
    } else if (mode === 'UseList') {
      // this.$sound.singlePlay('./sound/input_phone_number.mp3');
      this.$soundManager.singlePlay('input_phone_number.mp3');
    }
  },
  methods: {
    ...mapMutations({
      updateUser: 'SET_USER', // 스토어 회원정보 변경
    }),
    ...mapActions({
      isSignUser: 'hasUser', // 회원의 존재 여부 확인: { phone }
      validePassword: 'userLogin', // 회원의 비밀번호 여부 확인 { password },
      updateUserPassword: 'updateUserPassword', // 회원 비밀번호 변경 { mode: 'forgot' | 'update', password }
    }),
    setPhone(phone) {
      this.phone = phone;
    },
    // 회원정보 조회
    findUser(phone) {
      this.isSignUser({ phone })
        .then(() => {
          if (this.useUserPassword) this.type = 'matchPassword';
          else this.done();
        })
        .catch(() => {
          if (this.mode === 'UseList') {
            this.$refs.alert.show(true);
            return;
          }
          if (this.useUserPassword) this.type = 'newUser';
          else this.done();
        });
    },
    // 신규회원 비밀번호 입력
    registNewPassword(password) {
      this.updateUser(Object.assign({}, this.user, { password }));
      this.type = 'newUserPassword';
    },

    // 비밀번호 초기화
    findPassword() {
      this.updateUserPassword({ mode: 'forgot' })
        .then(({ password }) => {
          this.type = 'matchResetPassword';
          this.resetPassword = password;
        })
        .catch(() => {});
    },
    // 임시비밀번호 확인
    matchResetPassword(password) {
      const valide = this.resetPassword === password;
      this.type = valide ? 'inValideResetPassword' : 'matchResetPassword';
      return valide;
    },
    // 비밀번호 변경
    updatePassword(password) {
      this.updateUserPassword({ mode: 'update', password: password })
        .then(() => {
          this.type = 'matchPassword';
        }) // 변경이 완료되면 다음페이지로 이동
        .catch(() => {});
    },

    // 로그인 시도
    login(password) {
      if (this.type === 'newUserPassword') {
        const valideNewPassword = this.user.password === password;
        valideNewPassword && this.done();
      } else {
        // console.log('로그인 시도', password);
        this.validePassword({ password })
          .then(() => {
            this.done();
          })
          .catch(() => {
            this.type = 'inValidePassword';
          })
          .finally(() => {});
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.userLogin {
  .inner {
    padding: 0 70px;
    .introText {
      font-size: 64px;
      line-height: 88px;
      color: #0085de;
      word-break: keep-all;
      font-weight: 500;
      margin-bottom: 70px;
    }
  }
}
</style>
