<template>
  <div class="userInfoWrap">
    <div class="userInfo">
      <div class="left">
        <div class="label">나의 보유 포인트</div>
        <div class="phone">{{this.user.phone}}</div>
      </div>
      <div class="right">
        <div class="myPoint">{{this.user.point | numeral('0,0')}} <span>포인트</span></div>
        <v-btn
          v-if="$route.name !== 'ChargeType'"
          class="pointChageBtn"
          width="160px"
          height="80px"
          elevation="0"
          text
          >포인트충전</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      user: state => state.user,
    }),
  }
};
</script>

<style lang="scss" scoped>
.userInfoWrap {
  padding: 0 60px;
  width: 100%;
}
.userInfo {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  background:#fff;
  padding: 30px;
  color: #292929;
  border-radius: 10px;
  border:3px solid #0085DE;
  .left {
    .label {
      color:#888;
    }
    .phone {
      margin-top: 10px;
      font-weight:500;
      color: #292929;
    }
  }
  .right {
    display: flex;
    flex-direction: row;
    align-items: center;
    .myPoint {
      font-size: 42px;
      margin-right: 30px;
      font-weight: 500;
      color:#0085DE;
  
      span {
        font-size: 24px;
        font-weight: 400;
        color: #888;
      }
    }
    .pointChageBtn {
      font-size: 24px;
      background: #0085DE;
      border-radius: 10px;
      border: 0px;
      color:#fff;
    }
  }
}
</style>
