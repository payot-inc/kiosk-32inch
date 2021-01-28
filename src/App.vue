<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      ignoreIdlePageName: [
        'AccountLogin', // 키오스크 로그인 페이지
        'CashCharge', // 포인트 충전(현금)
        'PaymentConfirm', // 장비 사용 결제이전 페이지
        'Error', // 에러 페이지
        'Main',
      ],
    };
  },
  onIdle() {
    /**
     * 2분간 아무런 액션이 없다면
     * */
    const { name } = this.$route;
    if (this.ignoreIdlePageName.includes(name)) return;
    this.$router.replace({ name: 'Main' });
  },
};
</script>
