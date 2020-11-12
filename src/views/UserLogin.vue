<template>
  <div>
    사용자 로그인 페이지
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'UserLogin',
  props: {
    mode: String, // 사용자가 선택했던 기능 : UseMachine(장비이용), PointCharge(포인트 충전), UseKioskList(키오스크 이용내역 조회)
    done: Function, // 회원 검증이 이루어 지고 난 후의 액션
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
    ...mapState({ user: state => state.user }),
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
      // 사운드 출력
    },
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
    // 회원정보 조회
    findUser(phone) {
      this.isSignUser({ phone })
        .then(() => (this.type = 'matchPassword'))
        .catch(() => (this.type = 'newUser'));
    },
    // 신규회원 비밀번호 입력
    registNewPassword(password) {
      this.updateUser(Object.assign({}, this.user, { password }));
      this.type = 'newUserPassword';
    },

    // 비밀번호 초기화
    findPassword() {
      this.updateUserPassword({ mode: 'forgot' })
        .then(({ data }) => {
          this.type = 'matchResetPassword';
        })
        .catch(() => {});
    },
    // 임시비밀번호 확인
    matchResetPassword(password) {
      const valide = this.resetPassword === password;
      this.type === valide ? 'inValideResetPassword' : 'matchResetPassword';
      return valide;
    },
    // 비밀번호 변경
    updatePassword(password) {
      this.updateUserPassword()
        .then(this.done) // 변경이 완료되면 다음페이지로 이동
        .catch(() => {});
    },

    // 로그인 시도
    login(password) {
      if (this.type === 'newUserPassword') {
        const valideNewPassword = this.user.password === password;
        valideNewPassword && this.done();
      } else {
        this.validePassword(password)
          .then(this.done)
          .catch(() => {
            this.type = 'inValidePassword';
          })
          .finally(() => {});
      }
    },
  },
};
</script>
