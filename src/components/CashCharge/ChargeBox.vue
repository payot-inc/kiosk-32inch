<template>
  <div class="chageBox">
    <div class="coinImg">
      <img src="@/assets/img/paymentCash.gif" />
    </div>
    <div class="chageInfo">
      <dl>
        <dt>충전번호</dt>
        <dd>{{ phone }}</dd>
      </dl>
      <dl>
        <dt>현재 나의 포인트</dt>
        <dd>{{ point | numeral(0, 0) }} P</dd>
      </dl>
      <dl>
        <dt>투입된 금액</dt>
      </dl>
      <div class="getPrice">{{ realAmount | numeral(0, 0) }} 원</div>
      
      <dl style="margin-top:40px;">
        <dt>추가적립 포인트</dt>
        <dd>{{ appendPoint | numeral(0, 0) }} P</dd>
      </dl>
      <dl>
        <dt>최종 나의 포인트</dt>
        <dd>{{ (point + appendPoint + realAmount) | numeral(0, 0) }}</dd>
      </dl>
      <v-btn outlined @click="setPrice">투입완료</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChargeBox',
  props: {
    phone: String,
    point: Number,
    realAmount: Number,
    appendPoint: Number,
    setPrice: Function,
  }
}
</script>

<style lang="scss" scoped>
.chageBox {
  background: #fff;
  display: flex;
  border-radius: 10px;
  margin-top: 40px;
  overflow: hidden;
  border: 3px solid #e2e2e2;
  box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 3;

  .coinImg {
    width: 300px;
    background: #f2f2f2;
    min-height: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
    }
  }
  .chageInfo {
    flex: 1;
    padding: 40px;
    dl {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 70px;

      dt {
        color: #888;
        font-size: 28px;
      }
      dd {
        color: #292929;
        font-weight: 500;
        font-size: 32px;
      }
    }
    p {
      margin-top: 40px;
      background: #fff3f3;
      text-align: center;
      padding: 10px 0;
      color: #ee2073;
    }
    .getPrice {
      font-size: 48px;
      border-bottom: 4px solid #0085de;
      padding-bottom: 20px;
      margin-top: 20px;
      text-align: right;
      font-weight: 600;
      color: #0085de;
    }
    .v-btn {
      width: 100%;
      height: 80px;
      margin-top: 40px;
      border-radius: 10px;
      border: 0px;
      color: #fff;
      font-size: 32px;
      font-weight: 400;
      animation: getBtn 0.5s ease infinite;
    }
    @keyframes getBtn {
      0% {
        background: #ee2073;
      }
      100% {
        background: #cc2073;
      }
    }
  }
}
</style>
