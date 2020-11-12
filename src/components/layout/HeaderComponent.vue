<template>
  <div class="header">
    <div class="date_time">
      <div class="time">
        {{ now | moment('HH:mm') }}
      </div>
      <div class="date_wrap">
        <div class="date">{{ now | moment('YYYY-MM-DD') }}</div>
        <div class="shop_name">{{ companyName }}</div>
      </div>
    </div>
    <div class="right-cont">
      <v-btn
        v-if="$route.name !== 'Main'"
        class="home_btn"
        color="rgba(0,0,0,0.3)"
        width="140px"
        height="140px"
        text-color="#fff"
        @click="$refs.confirm.show(true)"
      >
        <v-icon size="60">mdi-home</v-icon>
      </v-btn>
    </div>

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

export default {
  name: 'Header',
  data() {
    return {
      now: Date.now(),
      listener: null,
    };
  },
  mounted() {
    const updateTime = () => {
      this.now = Date.now();
    };
    this.listener = setInterval(updateTime, 1000);
  },
  beforeDestroy() {
    clearInterval(this.listener);
  },
  computed: {
    ...mapState({
      companyName: state => state.company.name,
    }),
  },
};
</script>

<style lang="scss" scoped>
.header {
  height: 140px;
  background: #0085de;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: #fff;
  overflow: hidden;
  z-index: 9;
  position: relative;
  .date_time {
    display: flex;
    flex-direction: row;
    padding-left: 30px;
    .time {
      font-family: 'SCDream';
      font-weight: 700;
      font-size: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .date_wrap {
      margin-left: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-family: 'SCDream';
      font-weight: 400;
      font-size: 24px;
      color: rgba(255, 255, 255, 0.6);
      .shop_name {
        color: #fff;
      }
    }
  }
  .right-cont {
    display: flex;
    align-items: center;

    .prograss {
      width: 240px;
      margin-right: 30px;
      span {
        display: block;
        margin-top: 15px;
        text-align: right;
        color: rgba(255, 255, 255, 0.6);
        b {
          color: #fff;
          font-weight: normal;
        }
      }
    }
    .home_btn {
      color: #fff;
      border-radius: 0px;
    }
  }
}
</style>
