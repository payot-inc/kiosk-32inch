<template>
  <div id="container">
    <SubTitleBar title="포인트충전(카드결제)" />
    <UserInfo />

    <div id="contents">
      <div class="guideText">
        충전금액을 선택해주세요
      </div>

      <div class="pointItems fill-height">
        <v-row>
          <v-col cols="6" v-for="col in pointGoods" :key="col.id">
            <div class="pointItem" @click="$refs.confirmModal.show(true)" v-ripple>
              <div class="priceInfo">
                <strong>{{ col.name }}</strong>
                <span>{{ col.price | numeral('0,0') }} 원</span>
              </div>
              <div class="pointInfo">
                <span>적립보너스</span>
                <strong>+{{ col.bonus | numeral('0,0') }}</strong>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>

    <CardModal 
      ref="cardModal" 
      @onVisible="cardPay"
    />
    <ConfirmModal
      title="2,000포인트를 선택하셨습니다"
      message="결제를 진행할까요?"
      submitButtonText="네, 결제를 진행합니다"
      cancelButtonText="취소"
      ref="confirmModal"
      @submit="$refs.cardModal.show(true)"
    />
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

import SubTitleBar from '@/components/SubTitleBar.vue';
import UserInfo from '@/components/UserInfo.vue';
import CardModal from '@/components/CardCharge/CardModal.vue';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';
export default {
  name: 'CardCharge',
  components: {
    SubTitleBar,
    UserInfo,
    CardModal,
    ConfirmModal,
  },
  data() {
    return {
      pointGoods: [
        {
          name: '2,000 포인트',
          price: 2000,
          bonus: 500,
        },
        {
          name: '3,000 포인트',
          price: 3000,
          bonus: 500,
        },
        {
          name: '5,000 포인트',
          price: 5000,
          bonus: 500,
        },
        {
          name: '10,000 포인트',
          price: 10000,
          bonus: 500,
        },
        {
          name: '20,000 포인트',
          price: 10000,
          bonus: 500,
        },
        {
          name: '30,000 포인트',
          price: 10000,
          bonus: 500,
        },
        {
          name: '40,000 포인트',
          price: 10000,
          bonus: 500,
        },
        {
          name: '50,000 포인트',
          price: 10000,
          bonus: 500,
        },
      ],
    };
  },
  methods: {
    cardPay() {
      ipcRenderer.invoke('card-pay', 1000);
    },
  },
};
</script>


<style lang="scss" scoped>
.guideText{
    font-size:36px;
    text-align:center;
    height:100px;
    line-height:100px;
    color:#fff;
    background: #292929;
    border-radius:10px 10px 0 0;
  }
  .pointItems{
    flex-direction: column;
    background:#fff;
    border-radius:10px;
    overflow-y:auto;
    height:100%;
    padding:40px;
    border:3px solid #e2e2e2;
    .row{overflow:unset;}
    .col{overflow:unset;}
    .pointItem{
      height:240px;
      display:flex;
      flex-direction: column;
      justify-content: space-between;
      border-radius:10px;
      background:#fff;
      width:100%;
      border:3px solid #e2e2e2;
      box-shadow: 5px 5px 25px rgba(0,0,0,0.1);
      .priceInfo{
        flex:1;
        display:flex;
        flex-direction: column;
        align-items: flex-start;
        width:100%;
        padding:20px;
        
        strong{
          display:block;
          text-align:left;
          font-size:36px;
        }
        span{
          display:block;
          text-align:left;
          font-size:26px;
          margin-top:10px;
          color:#EE2073;
          letter-spacing:1px;
        }
      }
      .pointInfo{
        height:80px;
        background:#f2f2f2;
        width:100%;
        display:flex;
        justify-content: space-between;
        align-items: center;
        padding:0 20px;
        font-size:24px;
        border-top:3px solid #e2e2e2;
        
        strong{color:#0085DE}
      }
    }
  }
</style>