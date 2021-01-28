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
          <v-col cols="6" v-for="(col, i) in pointGoods" :key="col.id">
            <div class="pointItem" @click="selectItem(col, bonus[i])" v-ripple>
              <div class="priceInfo">
                <strong>{{ col.name }}</strong>
                <span>{{ col.price | numeral('0,0') }} 원</span>
              </div>
              <div class="pointInfo">
                <span>적립보너스</span>
                <strong>+{{ bonus[i] | numeral('0,0') }} P</strong>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>

    <CardModal 
      ref="cardModal" 
      :selectedItem="selectedItem"
      @onVisible="cardPay" 
    />
    <ConfirmModal
      :title="`${selectedItem.name}를 선택하셨습니다`"
      message="결제를 진행할까요?"
      submitButtonText="네, 결제를 진행합니다"
      cancelButtonText="취소"
      ref="confirmModal"
      @submit="$refs.cardModal.show(true)"
    />
    <ProgressModal ref="progress" title="포인트를 적립 중 입니다" />
    <AlertModal 
      ref="alertModal"
      mode="alert"
      title="결제 실패"
      :message="alertMessage"
    />
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

import SubTitleBar from '@/components/SubTitleBar.vue';
import UserInfo from '@/components/UserInfo.vue';
import CardModal from '@/components/CardCharge/CardModal.vue';
import ConfirmModal from '@/components/modal/ConfirmModalPoint.vue';
import AlertModal from '@/components/modal/AlertModal.vue';
import ProgressModal from '@/components/modal/ProgressModal.vue';
import { mapActions, mapMutations } from 'vuex';
import { debounce } from 'lodash';
export default {
  name: 'CardCharge',
  components: {
    SubTitleBar,
    UserInfo,
    CardModal,
    ConfirmModal,
    ProgressModal,
    AlertModal,
  },
  data() {
    return {
      alertMessage: '',
      selectedItem: {},
      pointGoods: [
        {
          name: '2,000 포인트',
          price: 2000,
        },
        {
          name: '3,000 포인트',
          price: 3000,
        },
        {
          name: '5,000 포인트',
          price: 5000,
        },
        {
          name: '10,000 포인트',
          price: 10000,
        },
        {
          name: '20,000 포인트',
          price: 20000,
        },
        {
          name: '30,000 포인트',
          price: 30000,
        },
        {
          name: '40,000 포인트',
          price: 40000,
        },
        {
          name: '50,000 포인트',
          price: 50000,
        },
      ],
    };
  },
  computed: {
    bonus() {
      return this.pointGoods.map(({ price }) => {
        return price * this.$store.getters.getEventRate('card', price);
      });
    },
  },
  mounted() {
    // const soundList = ['./sound/select_card.mp3', './sound/point_append_card_helper.mp3'];
    // const delayList = [250];
    // this.$sound.listPlay(soundList, delayList);
    const soundList = ['select_card.mp3', 'point_append_card_helper.mp3'];
    const delayList = [250];
    this.$soundManager.listPlay(soundList, delayList);
  },
  methods: {
    ...mapMutations({
      appendAction: 'APPEND_ACTION',
    }),
    ...mapActions({
      pay: 'pay',
    }),
    selectItem(item, bonus) {
      this.selectedItem = Object.assign({}, item, { bonus });
      this.$refs.confirmModal.show(true);
    },
    async cardPay() {
      // this.$sound.singlePlay('./sound/card_use_helper.mp3');
      this.$soundManager.singlePlay('card_use_helper.mp3');
      await this.delay(1000);

      ipcRenderer.invoke('card-pay', null, this.selectedItem.price)
        .then((value) => {
          value = parseInt(value, 10);
          const realAmount = value;
          const eventRate = this.$store.getters.getEventRate('card', value);
          const appendPoint = value * eventRate;
          const totalPoint = realAmount + appendPoint;

          this.appendAction({ realAmount, appendPoint, totalPoint, eventRate });
          this.$refs.progress.show(true);
          this.serverChargeRequest();
        })
        .catch(err => {
          // console.log(err.toString(), JSON.stringify(err, null, 2));
          // console.log(err.message);
          this.alertMessage = err.message.substr(err.message.lastIndexOf(':') + 1);
          this.$refs.alertModal.show(true);
          // this.$sound.singlePlay('./sound/cancel_pay.mp3');
          this.$soundManager.singlePlay('cancel_pay.mp3');
          this.$refs.cardModal.show(false);
        });
    },
    delay(ms) {
      return new Promise((resolve, reject) => setTimeout(resolve, ms));
    },
    serverChargeRequest: debounce(async function() {
      const pay = await this.pay();

      this.$refs.progress.show(false);
      this.$refs.cardModal.show(false);
      this.$router.push({ name: 'Result', params: { response: pay } });
    }, 2000),
  },
};
</script>

<style lang="scss" scoped>
.guideText {
  font-size: 36px;
  text-align: center;
  height: 100px;
  line-height: 100px;
  color: #fff;
  background: #292929;
  border-radius: 10px 10px 0 0;
}
.pointItems {
  flex-direction: column;
  background: #fff;
  border-radius: 10px;
  overflow-y: auto;
  height: 100%;
  padding: 40px;
  border: 3px solid #e2e2e2;
  .row {
    overflow: unset;
  }
  .col {
    overflow: unset;
  }
  .pointItem {
    height: 240px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 10px;
    background: #fff;
    width: 100%;
    border: 3px solid #e2e2e2;
    box-shadow: 5px 5px 25px rgba(0, 0, 0, 0.1);
    .priceInfo {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      padding: 20px;

      strong {
        display: block;
        text-align: left;
        font-size: 36px;
      }
      span {
        display: block;
        text-align: left;
        font-size: 26px;
        margin-top: 10px;
        color: #ee2073;
        letter-spacing: 1px;
      }
    }
    .pointInfo {
      height: 80px;
      background: #f2f2f2;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      font-size: 24px;
      border-top: 3px solid #e2e2e2;

      strong {
        color: #0085de;
      }
    }
  }
}
</style>
