<template>
  <v-dialog 
    v-model="visible" 
    width="800px" 
    transition="slide-y-transition"
    overlay-opacity="0.8"
    overlay-color="#000"
    persistent
  >
    <div class="paymentModal">
      <div class="paymentImg">
        <img src="@/assets/img/paymentCard.png">
      </div>
      <div class="priceInfo">
        <dl>
          <dt>선택상품</dt>
          <dd>{{ selectedItem.name }} 충전</dd>
        </dl>
        <dl>
          <dt>결제금액</dt>
          <dd>{{ parseInt(selectedItem.price, 10) | numeral('0,0') }} 원</dd>
        </dl>
        <dl>
          <dt>나의포인트</dt>
          <dd>{{ parseInt(user.point, 10) | numeral('0,0') }} P</dd>
        </dl>
        <dl>
          <dt>추가적립금</dt>
          <dd>{{ parseInt(selectedItem.bonus, 10) | numeral('0,0') }} P</dd>
        </dl>
        <dl class="lastPoint"> 
          <dt>최종포인트</dt>
          <dd>{{ (parseInt(user.point, 10) + parseInt(selectedItem.bonus, 10)) + parseInt(selectedItem.price, 10) | numeral('0,0') }} P</dd>
        </dl>
      </div>
      <div class="guide">
        <strong>IC카드를 투입구에 넣어주세요</strong>
        <p>삑소리 이후에 카드를 투입하시고, <br>결제가 끝날때까지 카드를 빼지 마세요</p>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import ModalMixin from '@/mixins/modal';
import { mapState } from 'vuex';
export default {
  name: 'CardModal',
  props: {
    selectedItem: {
      type: Object,
      default: null,
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
    }),
  },
  mixins: [ModalMixin],
};
</script>

<style lang="scss" scoped>
.paymentModal{
  width:100%;
  background:#fff;
  padding:60px;
  border-radius:10px;
  position:relative;
  .paymentImg{
    background:#e2e2e2;
    text-align:center;
    padding:40px;
    border-radius:10px;
  }
  .priceInfo{
    margin-top:60px;
    dl{
      display:flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom:20px;
      dt{font-size:32px;font-weight:500;color:#888}
      dd{font-size:32px;font-weight:700}
    }
    dl.nowPrice{
      dd{color:#ee2073}
    }
    dl:last-child{margin-bottom:0px;}
    dl.lastPoint{color:#ee2073}
  }
  .guide{
    text-align:center;
    margin-top:40px;
    border-top:2px solid #e2e2e2;
    padding-top:40px;
    strong{font-size:36px;letter-spacing:-1px;font-weight:500;margin-bottom:20px;display:block;}
    p{font-size:28px;color:#ee2073;word-break:keep-all}
  }
  .counter{
    display:flex;
    align-items: center;
    justify-content: center;
    margin-top:40px;
    span{
      display:inline-block;
      width:120px;height:120px;
      border-radius:60px;
      display:flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background:#f2f2f2;
      font-size:42px;
      font-weight:600;
    }
  }
  .closeBtn{
    position:absolute;
    top:0;
    left:50%;
    width:120px;
    height:120px;
    border-radius:50%;
    margin-left:-60px;
    margin-top:-60px;
    background:#0085DE;
    color:#fff;
    border:0px;
    .v-icon{
      font-size:52px
    }
  }
}
</style>