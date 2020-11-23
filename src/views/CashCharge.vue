<template>
  <div id="container">
    <SubTitleBar title="포인트충전(현금결제)" :realAmount="realAmount" @cantBack="cantBack" />

    <div class="pointChage">
      <dl class="visualTitle">
        <dt>충전하실 금액만큼 지폐를 넣어주세요</dt>
        <dd>※ 투입하신 금액만큼 포인트가 적립되며, <br />한번 넣은 금액은 반환되지 않습니다.</dd>
      </dl>
      <ChargeBox
        :phone="user.phone"
        :point="user.point"
        :realAmount="realAmount"
        :appendPoint="appendPoint"
        :setPrice="setPrice"
      />
      <EventTable :realAmount="realAmount" :rules="kioskEvent.rule['cash']" />
    </div>

    <ProgressModal ref="progress" title="포인트를 적립 중 입니다" />
    <AlertModal
      ref="alert"
      title="투입된 금액이 0원 입니다"
      message="충전하실 금액만큼 지폐투입기에 현금을 넣고 완료버튼을 눌러주세요"
      mode="alert"
    />
    <AlertModal
      ref="backAlert"
      title="투입된 금액이 있습니다"
      message="투입된 금액이 있어 뒤로 가실수 없습니다"
      mode="alert"
    />

    <!-- <div class="black-background" :class="black ? 'active': ''">
      <div class="back-text">
        <p><span>60</span>초 후 </p>
        <p>메인으로 이동합니다</p>
      </div>
    </div> -->
  </div>
</template>

<script>
import SubTitleBar from '@/components/SubTitleBar.vue';
import ChargeBox from '@/components/CashCharge/ChargeBox.vue';
import EventTable from '@/components/CashCharge/EventTable.vue';
import AlertModal from '@/components/modal/AlertModal.vue';
import ProgressModal from '@/components/modal/ProgressModal.vue';
import { mapActions, mapMutations, mapState } from 'vuex';
import { ipcRenderer } from 'electron';
import { debounce } from 'lodash';
export default {
  name: 'CashCharge',
  components: {
    SubTitleBar,
    ChargeBox,
    EventTable,
    AlertModal,
    ProgressModal,
  },
  data() {
    return {
      realAmount: 0,
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
    }),
    kioskEvent() {
      return this.$store.getters.kioskEvent;
    },
    eventRate() {
      return this.$store.getters.getEventRate('cash', this.realAmount);
    },
    appendPoint() {
      const { eventRate, realAmount } = this;
      console.log(eventRate);
      return Math.floor(eventRate * realAmount);
    },
  },
  methods: {
    ...mapMutations({
      appendAction: 'APPEND_ACTION',
      setUser: 'SET_USER',
    }),
    ...mapActions({
      userSignUp: 'userSignUp',
      pay: 'pay',
    }),
    onInputMoneyEvent(event, money) {
      console.log('money', money);
      this.realAmount += money;
    },
    setPrice() {
      if (this.realAmount <= 0) {
        this.$refs.alert.show(true);
      } else {
        ipcRenderer.invoke('cash-open', false);

        this.$refs.progress.show(true);
        this.serverChargeRequest();
      }
    },
    serverChargeRequest: debounce(async function() {
      const { realAmount, appendPoint, eventRate } = this;
      const totalPoint = realAmount + appendPoint;
      this.appendAction({ realAmount, appendPoint, eventRate, totalPoint });

      const pay = await this.pay();

      this.$router.push({ name: 'Result', params: { response: pay } });
    }, 2000),
    cantBack() {
      console.log("can't back in CashCharge.vue");
      this.$refs.backAlert.show(true);
    },
    delay(millisec) {
      return new Promise(resolve => setTimeout(resolve, millisec));
    },
  },
  mounted() {
    console.log('cash charge mount');
    ipcRenderer.invoke('cash-open', true);

    ipcRenderer.on('cash-input', this.onInputMoneyEvent);

    const soundList = ['./sound/select_cash.mp3', './sound/point_append_cash_helper.mp3'];
    const delayList = [250];
    this.$sound.listPlay(soundList, delayList);
  },
  beforeDestroy() {
    ipcRenderer.invoke('cash-open', false);
    ipcRenderer.removeListener('cash-input', this.onInputMoneyEvent);
  },
};
</script>

<style lang="scss" scoped>
.pointChage {
  padding: 0 60px 60px 60px;
  flex: 1;
  width: 100%;
}
.black-background {
  display: none;
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 2;
  .back-text {
    position: absolute;
    padding: 0 60px;
    width: 100%;
    top: 200px;
    left: 0px;
    color: #fff;
    font-size: 36px;
    p {
      margin-bottom: 0px;
      span {
        font-size: 64px;
        margin-right: 10px;
      }
    }
  }
}
.black-background.active {
  display: none;
}
.visualTitle {
  color: #0085de;
  dt {
    font-size: 48px;
    font-weight: 500;
    word-break: keep-all;
  }
  dd {
    font-size: 32px;
    margin-top: 20px;
    color: #888;
  }
}
</style>
