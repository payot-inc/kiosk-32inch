<template>
  <div id="container">
    <SubTitleBar title="결제방법 선택" />
    <UserInfo />

    <div id="contents">
      <dl class="visualTitle">
        <dt>
          포인트충전을 위한<br />
          결제방법을 선택해주세요
        </dt>
        <dd>아래 버튼을 터치해주세요</dd>
      </dl>

      <div class="divider" />

      <div class="paymentBtns">
        <v-row>
          <v-col cols="6">
            <div class="btn coin" @click="nextStep('cash')" v-ripple>
              <div class="btnImg">
                <img src="@/assets/img/coin.png" />
              </div>
              <dl>
                <dt>현금(지폐)로 결제하기</dt>
                <dd>포인트 추가적립 10%</dd>
              </dl>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="btn card" @click="nextStep('card')" v-ripple>
              <div class="btnImg">
                <img src="@/assets/img/card.png" />
              </div>
              <dl>
                <dt>신용카드로 결제하기</dt>
                <dd>포인트 추가적립 5%</dd>
              </dl>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import SubTitleBar from '@/components/SubTitleBar.vue';
import UserInfo from '@/components/UserInfo.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'PayTypeSelect',
  components: {
    SubTitleBar,
    UserInfo,
  },
  methods: {
    nextStep(type) {
      this.$sound.playTouchSound();

      const routeName = type === 'cash' ? 'CashCharge' : 'CardCharge';
      this.$router.push({ name: routeName });
    },
  },
  mounted() {
    this.$sound.singlePlay('./sound/select_pay_type.mp3');
  },
};
</script>

<style lang="scss" scoped>
.visualTitle {
  color: #0085de;
  dt {
    font-size: 64px;
    font-weight: 500;
    word-break: keep-all;
  }
  dd {
    font-size: 36px;
    margin-top: 20px;
    color: #888;
  }
}
.divider {
  height: 3px;
  background: #e2e2e2;
  margin: 60px 0;
}
.paymentBtns {
  .btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 80px 0;
    border-radius: 30px;
    box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.1);
    .btnImg {
      width: 320px;
      height: 320px;
      border-radius: 50%;
      background: #eaeaea;
      img {
        width: 100%;
        height: auto;
      }
    }
    dl {
      margin-top: 60px;
      text-align: center;
      dt {
        font-size: 36px;
        color: #fff;
      }
      dd {
        font-size: 28px;
        margin-top: 10px;
        color: #ffeb88;
      }
    }
  }
  .card {
    background: #ee2073;
  }
  .coin {
    background: #0085de;
  }
}
</style>
