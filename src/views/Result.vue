<template>
  <div class="finish" id="container">
    <div class="contents">
      <div class="finishTitle">
        <v-icon>fa-check-circle</v-icon>
        <h2>결제가 완료되었습니다</h2>
        <p v-if="userAction.machineId">결제하신 장비에서 시작하기 버튼을 눌러주세요</p>
      </div>
      <div class="finishContents">
        <div class="orderInfo">
          <div class="in">
            <dl>
              <dt>사용자번호</dt>
              <dd>{{ user.phone }}</dd>
            </dl>
            <dl v-if="userAction.machineId">
              <dt>장비명</dt>
              <dd>1번세탁기</dd>
            </dl>
            <dl>
              <dt>최종결제금액</dt>
              <dd>{{ userAction.realAmount | numeral(0, 0) }} 원</dd>
            </dl>
            <div class="divider"></div>
            <dl>
              <dt>추가적립 포인트</dt>
              <dd>{{ userAction.appendPoint | numeral(0, 0) }} 포인트</dd>
            </dl>
            <dl>
              <dt>현금 초과 적립포인트</dt>
              <dd>0</dd>
            </dl>
            <dl class="myPoint">
              <dt>나의 남은 포인트</dt>
              <dd>{{ user.point }} 포인트</dd>
            </dl>
          </div>

          <div class="counterText">
            <span>{{ counter }} 초</span> 후 로그아웃 후 메인화면으로 이동합니다
          </div>
        </div>

        <div class="finishBtns">
          <v-btn class="left" height="100px" outlined>
            <v-icon size="36px">fa-desktop</v-icon>
            <span>장비추가이용</span>
          </v-btn>
          <v-btn class="right" height="100px" outlined>
            <v-icon size="36px">fa-home</v-icon>
            <span>메인으로</span>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Result',
  data() {
    return {
      counter: 10,
    };
  },
  mounted() {
    setInterval(() => this.counter--, 1000);
  },
  // watch: {
  //   counter(newValue) {
  //     if(newValue === 0) this.$router.replace({ name: 'Main' });
  //   },
  // },
  computed: {
    ...mapState({
      user: state => state.user,
      userAction: state => state.userAction,
    }),
  },
}
</script>

<style lang="scss" scoped>
.finish {
  justify-content: center;
  padding: 80px;
  .contents {
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    border:3px solid #e2e2e2;
    box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.1);
  }
  .finishTitle {
    width: 100%;
    color: #292929;
    background: #FFF3F3;
    padding: 60px;
    min-height: 500px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .v-icon {
      font-size: 150px;
      color: #ee2073;
      font-size: 120px;
    }
    h2 {
      font-size: 64px;
      font-weight: 600;
      margin-top: 40px;
      letter-spacing: -1px;
      text-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
    }
    p {
      padding: 0 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32px;
      background: #ee2073;
      color: #fff;
      margin-top: 15px;
      border-radius: 10px;
    }
  }
  .finishContents {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    flex: 1;
    padding: 60px;
    .orderInfo {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      .in {
        display: flex;
        flex-direction: column;
        flex: 1;
        width: 100%;
        border-radius: 10px;
        dl {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
          font-size: 32px;
          dt {
            color: #888;
          }
          dd {
            color: #292929;
            font-weight: 500;
          }
        }
        dl.myPoint {
          dd {
            color: #ee2073;
          }
        }
      }
      .counterText {
        font-size: 28px;
        text-align: center;
        color: #292929;
        background: #f2f2f2;
        padding: 10px 0;
        border-radius: 10px;
        margin-bottom: 60px;
        color: #888;
        span {
          color: #ee2073;
        }
      }
    }
    .divider {
      margin: 30px 0;
      border: 2px;
      border-style: dashed;
      border-color: #d2d2d2;
    }
    .finishBtns {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      overflow: hidden;
      .v-btn {
        font-size: 32px;
        width: 50%;
        border: 0px;
        .v-icon {
          margin-right: 10px;
        }
      }
      .left {
        background: #292929;
        color: #fff;
      }
      .right {
        background: #f2f2f2;
        color: #292929;
      }
    }
  }
}
</style>