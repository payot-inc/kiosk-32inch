<template>
  <div class="pageTitle">
    <v-btn width="90px" height="90px" color="#0085de" class="back" elevation="0" v-touchEvent:tap="backPage">
      <v-icon size="50" color="#fff">mdi-arrow-left</v-icon>
    </v-btn>
    <h2>{{ title }}</h2>
    <ConfirmModal
      ref="confirm"
      title="메인으로 이동"
      message="메인으로 이동하면 로그아웃이 됩니다"
      @submit="$router.replace({ name: 'Main' })"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ConfirmModal from '@/components/modal/ConfirmModal.vue'
export default {
  name: 'SubTitleBar',
  components: {
    ConfirmModal,
  },
  props: {
    title: String,
    realAmount: {
      type: Number,
      default: -1,
    },
  },
  computed: {
    ...mapState({
      cardPay: state => state.kiosk.payType.card,
      cashPay: state => state.kiosk.payType.cash,
      useDeviceInputMode: state => state.kiosk.useDeviceInputMode,
    }),
  },
  methods: {
    backPage() {
      // this.$sound.playTouchSound();
      this.$soundManager.playTouchSound();


      if(this.realAmount > 0) {
        this.$emit('cantBack');
      } else if(
        ['ChargeType', 'CategorySelect', 'UseList'].includes(this.$route.name) ||
        (this.$route.name === 'CashCharge' && !this.cardPay) ||
        (this.$route.name === 'CardCharge' && !this.cashPay)) {
          this.$refs.confirm.show(true);
      } else if(this.$route.name === 'UserLogin') {
        this.$router.replace({ name: 'Main' });
      } else if(this.$route.name === 'CustomPay') {
        this.$router.go(-2);
      } else if(this.$route.name === 'PaymentConfirm') {
        if(this.useDeviceInputMode === 'custom') {
          this.$router.go(-1);
        } else {
          this.$router.go(-2);
        }
      } else {
        this.$router.go(-1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pageTitle {
  height: 180px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 0 30px;
  h2 {
    font-size: 42px;
    color: #292929;
    font-weight: 500;
  }
  .back {
    border-radius: 50px;
    margin-right: 30px;
    /* position: absolute;
    right: 0; */
    // 뒤로가기 우측으로 이동(5.4.1)
  }
}
</style>
