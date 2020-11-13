<template>
  <div id="container">
    <SubTitleBar title="포인트충전(현금결제)" />

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
      <EventTable 
        :realAmount="realAmount" 
        :rules="kioskEvent.rule['cash']"
      />
    </div>

    <ProgressModal 
      ref="progress"
      title="포인트를 적립 중 입니다"
    />
    <AlertModal
      ref="alert"
      title="투입된 금액이 0원 입니다. "
      message="충전하실 금액만큼 지폐투입기에 현금을 넣고 완료버튼을 눌러주세요"
      mode="alert"
    />
    <AlertModal
      ref="info"
      :title="`투입된 금액이 ${realAmount}원 입니다. `"
      message="충전이 완료되었습니다"
      mode="info"
      @onDismiss="nextPage()"
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
import { mapState } from 'vuex';
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
      const { realAmount, kioskEvent } = this;
      const eventTarget = [
        { min: 0, max: 10000 }, // 1만원 이상시
        { min: 10000, max: 20000 }, // 1 ~ 2만원
        { min: 20000, max: 30000 }, // 2 ~ 3만원
        { min: 30000, max: 40000 }, // 4 ~ 5만원
        { min: 40000, max: 50000 }, // 4 ~ 5만원
        { min: 50000, max: Number.MAX_VALUE }, // 5 ~ 만원
      ];

      const index = eventTarget.findIndex(({ min, max }) => realAmount >= min && realAmount < max);
      return kioskEvent.rule['cash'][index] / 100;
    },
    appendPoint() {
      const { eventRate, realAmount } = this;
      console.log(eventRate);
      return Math.floor(eventRate * realAmount);
    },
  },
  methods: {
    addMoney(newMoney) {
      this.realAmount += newMoney;
    },
    setPrice() {
      console.log('setPrice');
      if(this.realAmount <= 0) {
        this.$refs.alert.show(true);
      } else {
        this.$refs.info.show(true);
      }
    },
    nextPage() {
      this.$router.push({ name: 'Result' });
    },
  }
}
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
