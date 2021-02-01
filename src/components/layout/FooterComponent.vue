<template>
  <div class="footer">
    <div class="customer">
      <span>고객센터</span>
      <strong>{{ tel }}</strong>
    </div>
    <div class="btns">
      <v-btn text height="60px" color="rgba(255,255,255,0.7)" class="footerBtn" @click="$refs.terms.open('user')">
        개인정보 취급방침</v-btn
      >
      <v-btn text height="60px" color="rgba(255,255,255,0.7)" class="footerBtn" @click="$refs.terms.open('info')">
        키오스크 이용약관</v-btn
      >
      <div class="version">V{{ version }} ({{ cardVersion }})</div>
    </div>

    <Terms ref="terms" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Terms from '@/components/modal/Terms.vue';
import { remote } from 'electron';
export default {
  components: {
    Terms,
  },
  methods: {
    tremsOpen(value) {
      this.$refs.terms.open(value);
    },
  },
  computed: {
    ...mapState({
      tel: state => state.company.phone,
      cardModule: state => state.cardModule.type,
    }),
    version() {
      return remote.app.getVersion();
    },
    cardVersion() {
      return this.cardModule ? this.cardModule.toUpperCase() : '';
    }
  },
};
</script>

<style lang="scss" scoped>
.footer {
  background: #000;
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
  z-index: 9;
  
  .customer {
    padding-left: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #fff;
    span {
      display: block;
      font-weight: 400;
      margin-right: 20px;
      color: rgba(255, 255, 255, 0.6);
    }
    strong {
      display: block;
      font-weight: 400;
    }
  }
  .btns {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
    .footerBtn {
      font-size: 18px;
      font-weight: 300;
      border-radius: 0;
    }
    .version {
      display: flex;
      align-items: center;
      color: #fff;
      height: 60px;
      font-size: 18px;
      margin-left: 20px;
      margin-right: 30px;
    }
  }
}
</style>
