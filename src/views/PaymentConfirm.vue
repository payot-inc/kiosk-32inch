<template>
  <div id="container">
    <SubTitleBar title="결제확인" />

    <div id="contents" class="order">
      <div class="orderDetail">
        <div class="myPointBox">
          <div class="top">
            <span>내 포인트</span>
            <v-btn text @click="$router.push({ name: 'ChargeType' })">포인트충전</v-btn>
          </div>
          <div class="pointView">
            <span>{{ point | numeral('0,0') }}P</span>
            <v-btn outlined @click="$refs.pointUseModal.open(true)">포인트 사용하기</v-btn>
          </div>

          <p>사용하실 포인트가 없다면 바로 <b>결제버튼</b>을 터치해주세요</p>
        </div>
        <!-- myPointBox -->

        <div class="orderInfo">
          <dl>
            <dt>내 번호</dt>
            <dd>{{ user.phone }}</dd>
          </dl>
          <dl v-if="selectedMachine">
            <dt>장비명</dt>
            <dd>{{ selectedMachine.name }}</dd>
            <!-- <dd>세탁기2</dd> -->
          </dl>
          <dl v-if="productName">
            <dt>상품명</dt>
            <dd>{{ productName }}</dd>
          </dl>
          <dl>
            <dt>투입 예정금액</dt>
            <dd>{{ inputAmount | numeral('0,0') }} 원</dd>
          </dl>
          <div class="divider"></div>
          <dl class="pointUse">
            <dt>포인트사용</dt>
            <dd>{{ usePoint | numeral('0,0') }} P</dd>
          </dl>
          <div class="divider"></div>
          <!-- <dl>
            <dt>결제방법</dt>
            <dd>신용카드</dd>
          </dl> -->
          <dl class="lastPrice">
            <dt>최종결제금액</dt>
            <dd>{{ parseInt(realAmount, 10) | numeral('0,0') }} 원</dd>
          </dl>
        </div>
        <!-- orderInfo -->

        <div class="orderBtn">
          <v-btn width="100%" height="100px" elevation="0" outlined @click="selectPayment">
            <span v-if="usePoint !== inputAmount"
              >{{ realAmount | numeral('0,0') }}원 결제하기</span
            >
            <span v-else>이용하기</span>
            <v-icon size="46">mdi-chevron-right</v-icon>
          </v-btn>
        </div>
        <!-- orderBtn -->
      </div>
      <!-- orderDetail -->
    </div>
    <!-- order -->

    <!-- contents -->

    <PointUseModal
      ref="pointUseModal"
      @updateUsePoint="usePoint = $event"
      :point="point"
      :min="0"
      :max="this.inputAmount"
    />

    <CashModal 
      ref="cashModal" 
      :realAmount="realAmount" 
      @submit="payment($event, 'cash')" 
    />
    
    <CardModal 
      ref="cardModal" 
      :realAmount="realAmount" 
      @submit="payment($event, 'card')" 
      @fail="failCardPay($event)"
    />

    <AlertModal 
      ref="alertModal"
      mode="alert"
      title="결제 실패"
      :message="alertMessage"
    />

    <ProgressModal ref="progress" title="결제를 진행중입니다" />

    <CreditSelectModal ref="creditSelectModal" @done="selectDone($event)" />

    <ConfirmModal
      ref="confirm"
      submitButtonText="네, 사용합니다"
      cancelButtonText="아니요, 직접 입력하겠습니다"
      :title="`가지고 계신 ${point >= inputAmount ? inputAmount : point} 포인트`"
      message="바로 사용할까요?"
      @submit="pointDone(point >= inputAmount ? inputAmount : point)"
    />

    <!-- 포인트사용하기 모달 -->
  </div>
  <!-- container -->
</template>

<script>
import SubTitleBar from '@/components/SubTitleBar.vue';
import ProgressModal from '@/components/modal/ProgressModal.vue';
import ConfirmModal from '@/components/modal/ConfirmModalPoint.vue';
import AlertModal from '@/components/modal/AlertModal.vue';
import CreditSelectModal from '@/components/PaymentConfirm/CreditSelectModal.vue';
import PointUseModal from '@/components/PaymentConfirm/PointUseModal.vue';
import CashModal from '@/components/PaymentConfirm/CashModal.vue';
import CardModal from '@/components/PaymentConfirm/CardModal.vue';
import { mapActions, mapMutations, mapState } from 'vuex';
import { debounce } from 'lodash';

export default {
  name: 'PaymentConfirm',
  components: {
    SubTitleBar,
    ProgressModal,
    AlertModal,
    PointUseModal,
    CreditSelectModal,
    ConfirmModal,
    CashModal,
    CardModal,
  },
  data() {
    return {
      productName: this.$route.params.productName,
      usePoint: 0,
      alertMessage: '',
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      point: state => state.user.point,
      userAction: state => state.userAction,
      inputAmount: state => state.userAction.inputAmount,
      payType: state => state.kiosk.payType,
    }),
    selectedMachine() {
      const machines = this.$store.state.machines;
      return machines.find(machine => machine.id === this.userAction.machineId);
    },
    realAmount() {
      return this.inputAmount - this.usePoint;
    },
  },
  mounted() {
    if (this.point >= 500) {
      this.$refs.confirm.show(true);
      // this.$sound.singlePlay('./sound/has_point_and_use.mp3');
      this.$soundManager.singlePlay('has_point_and_use.mp3');
    } else {
      this.$soundManager.singlePlay('pay_use_machine.mp3');
    }
  },
  methods: {
    ...mapMutations({
      appendAction: 'APPEND_ACTION',
    }),
    ...mapActions({
      pay: 'pay',
    }),
    pointDone(point) {
      this.usePoint = point;
      this.$refs.pointUseModal.setPoint(point);
    },
    delay(millisec) {
      return new Promise(resolve => setTimeout(resolve, millisec));
    },
    selectPayment() {
      if (this.usePoint === this.inputAmount) {
        this.payment();
        return;
      }
      const allPayMode = Object.values(this.payType).every(state => state);
      if (allPayMode) {
        this.$refs.creditSelectModal.open(true);
      } else {
        const payMode = this.payType.cash ? 'cashPay' : 'cardPay';
        if (payMode === 'cashPay') {
          this.appendAction({ payMethod: 'cash', usePoint: this.usePoint });
          this.$refs.cashModal.open(true);
        } else {
          this.appendAction({ payMethod: 'card', usePoint: this.usePoint });
          this.$refs.cardModal.open(true);
        }
      }
    },
    /**
     * realAmount: 사용자가 이용시 실제 지불한 금액
     * payMethod = 지불 수단
     * userAction.type = use // 사용자가 이용하려는 서비스 타입
     * userAction.inputAmount // 장비로 부터 넣을 금액
     * userAction.totalPoint = realAmount + (결제수단으로 인한 추가 결제포인트) - userAction.inputAmount
     *
     * realAmount 가 없는 경우 전액으로 포인트 사용
     * userAction.usePoint = userAction.inputAmount
     * userAction.totalPoint = userAction.inputAmount * -1
     *
     * payment는 이벤트의 상황에따라 여러번이 호출되어질 수 있음
     * 이벤트는 2초를 대기후 마지막 신호를 정상으로 판단한다
     * */
    serverPaymentRequest: debounce(async function(realAmount = 0, payMethod = 'point') {
      realAmount = parseInt(realAmount, 10);
      // 결제 정보 검증
      if (payMethod === 'point') { // 포인트 전액결제
        this.appendAction({
          payMethod: 'point',
          usePoint: this.usePoint,
          totalPoint: -this.usePoint,
        });
      } else if (payMethod === 'cash' && this.inputAmount <= this.usePoint + realAmount) { // 현금결제 + 포인트사용이 투입해야할 금액보다 큰 경우 차액 충전
        const eventRate = this.$store.getters.getEventRate(payMethod, realAmount);
        const appendPoint = Math.floor(realAmount * eventRate);
        const totalPoint = realAmount + appendPoint - this.userAction.inputAmount;
        this.appendAction({ realAmount, eventRate, appendPoint, totalPoint });
      } else if (payMethod === 'cash' && this.inputAmount > this.usePoint + realAmount) { // 현금결제 + 포인트사용이 투입해야할 금액보다 작은 경우 전액 충전
        const eventRate = this.$store.getters.getEventRate(payMethod, realAmount);
        const appendPoint = Math.floor(realAmount * eventRate);
        const totalPoint = realAmount + appendPoint;
        const type = 'charge';
        const usePoint = 0;
        const machineId = null;
        this.appendAction({
          realAmount,
          eventRate,
          appendPoint,
          totalPoint,
          type,
          usePoint,
          machineId,
        });
      } else if (payMethod === 'card') {
        const eventRate = this.$store.getters.getEventRate(payMethod, realAmount);
        const appendPoint = Math.floor(realAmount * eventRate);
        const totalPoint = realAmount + appendPoint - this.userAction.inputAmount;
        this.appendAction({ realAmount, eventRate, appendPoint, totalPoint });
      }

      try {
        const pay = await this.pay();
        this.$router.push({ name: 'Result', params: { response: pay } });
      } catch (error) {
        if (error.response.status === 400) {
          // console.log('전액포인트 결제시 장비연결실패');
          this.appendAction({
            inputAmount: 0,
            machineId: null,
            realAmount: 0,
            totalPoint: 0,
            usePoint: 0,
          });
          this.$router.push({ name: 'Result', params: { pointPayError: true } });
        }
      } finally {
        this.$refs.progress.show(false);
      }
    }, 2000),
    payment(realAmount = 0, payMethod = 'point') {
      // console.log('realAmount', realAmount, 'payMethod', payMethod);
      this.$refs.progress.show(true);
      this.serverPaymentRequest(realAmount, payMethod);
    },
    selectDone(payMode) {
      if (payMode === 'cash') {
        this.appendAction({ payMethod: 'cash', usePoint: this.usePoint });
        this.$refs.cashModal.open(true);
      } else if (payMode === 'card') {
        this.appendAction({ payMethod: 'card', usePoint: this.usePoint });
        this.$refs.cardModal.open(true);
      }
    },
    failCardPay(message) {
      this.alertMessage = message.substr(message.lastIndexOf(':') + 1);
      this.$refs.alertModal.show(true);
    },
  },
};
</script>

<style lang="scss" scoped>
#wrap #contents.order {
  padding: 0 60px 60px 60px;
}
.orderDetail {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  border-radius: 10px;
  height: 100%;
  overflow: hidden;
  border: 3px solid #e2e2e2;
  box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.1);
  .myPointBox {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    padding: 40px;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 32px;
        height: 50px;
      }
      .v-btn {
        font-size: 32px;
        color: #0085de;
        height: 50px;
        border-radius: 10px;
      }
    }
    .pointView {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      span {
        font-size: 90px;
        font-weight: 600;
        color: #0085de;
      }
      .v-btn {
        width: 300px;
        height: 80px;
        border-radius: 40px;
        font-size: 32px;
        color: #0085de;
        border: 4px solid #0085de;
        margin-top: 20px;
        animation: pointColor 0.8s ease-in-out forwards;
      }
      @keyframes pointColor {
        0% {
          opacity: 0;
          transform: scale(2);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
    }
    p {
      text-align: center;
      font-size: 28px;
      color: #888;
      margin-top: 40px;
      b {
        color: #ee2073;
        font-weight: 400;
      }
    }
  } // myPointBox
  .orderInfo {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 40px;
    background: #f8f8f8;
    dl {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 70px;
      dt {
        font-size: 32px;
        color: #888;
      }
      dd {
        font-size: 32px;
        color: #292929;
      }
    }
    dl.pointUse {
      dd {
        color: #0085de;
        font-size: 42px;
        font-weight: 500;
      }
    }
    dl.lastPrice {
      dd {
        font-size: 42px;
        font-weight: 600;
        color: #ee2073;
      }
    }
  }
  .divider {
    height: 2px;
    background: #e2e2e2;
    margin: 40px 0;
  }

  .pointUseBtn {
    border: 2px solid #0085de;
    border-radius: 10px;
    font-size: 32px;
    font-weight: 400;
    justify-content: space-between;
  }
  .orderBtn {
    padding: 40px;
    .v-btn {
      align-items: center;
      border-radius: 10px;
      font-size: 36px;
      color: #fff;
      border: 0px;
      animation: point 0.6s infinite;
      .v-icon {
        margin-left: 20px;
        font-size: 36px;
      }
    }
  }
  @keyframes point {
    0% {
      background: #7d0032;
    }
    100% {
      background: #ee2073;
    }
  }
}
</style>
