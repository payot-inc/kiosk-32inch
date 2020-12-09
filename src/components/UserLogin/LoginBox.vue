<template>
  <div class="loginBox">
    <div class="phoneNumber-view">
      <h4>전화번호입력(필수)<span>*</span></h4>
      <div class="number-view">
        <span class="number">{{ phone[0] }}</span>
        <span class="bar">-</span>
        <span class="number">{{ phone[1] }}</span>
        <span class="bar">-</span>
        <span class="number">{{ phone[2] }}</span>
      </div>
      <p>오른쪽 키패드에서 전화번호를 입력해주세요</p>
    </div>
    <div class="keypad">
      <div class="rowLine" v-for="(numbers, rowindex) in number_pad" :key="rowindex">
        <v-btn
          width="100px"
          height="100px"
          class="key"
          outlined
          v-for="number in numbers"
          :key="number"
          @click="inputKey(number)"
          >{{ number }}</v-btn
        >
      </div>
      <div class="rowLine">
        <v-btn width="100px" height="100px" class="key del" outlined @click="inputKey('delete')">
          <v-icon>mdi-backspace</v-icon>
        </v-btn>
        <v-btn width="100px" height="100px" class="key" outlined @click="inputKey(0)">
          0
        </v-btn>
        <v-btn width="100px" height="100px" class="key re" outlined @click="inputKey('clear')"
          >다시입력</v-btn
        >
      </div>
    </div>
    <!-- keypad -->
  </div>
  <!-- loginBox -->
</template>

<script>

export default {
  name: 'LoginBox',
  props: {
    setPhone: Function,
  },
  data() {
    return {
      number_pad: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      phone: ['010', '', ''],
    };
  },
  methods: {
    inputKey(value) {
      // this.$sound.playTouchSound();
      this.$soundManager.playTouchSound();
      if (typeof value === 'number' && this.phone[2].length < 4) {
        if (this.phone[1].length < 4) {
          this.phone[1] += value;
        } else {
          this.phone[2] += value;
        }
      } else if (value === 'delete' && this.phone[1].length > 0) {
        if (this.phone[2].length > 0) {
          this.phone[2] = this.phone[2].slice(0, this.phone[2].length - 1);
        } else {
          this.phone[1] = this.phone[1].slice(0, this.phone[1].length - 1);
        }
      } else if (value === 'clear') {
        this.phone = ['010', '', ''];
      }
      this.phone = Array.from(this.phone);
      this.setPhone(this.phone.join('-'));
    },
  },
};
</script>

<style lang="scss" scoped>
.loginBox {
  display: flex;
  width: 100%;
  flex-direction: row;
  background: #fff;
  overflow: hidden;
  box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  .phoneNumber-view {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 40px;
    overflow: hidden;
    background: #fff;
    border: 3px solid #e2e2e2;
    border-radius: 30px 0 0 30px;
    h4 {
      font-weight: 500;
      font-size: 28px;
      color: #292929;
      span {
        color: #d22828;
        margin-left: 10px;
      }
    }
    .number-view {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      min-height: 100px;
      border-bottom: 4px solid #0085de;
      animation: numberViewLine 1.5s infinite;
      @keyframes numberViewLine {
        0% {
          border-bottom: 4px solid #f2f2f2;
        }
        100% {
          border-bottom: 4px solid #0085de;
        }
      }
      span.number {
        width: 120px;
        font-size: 40px;
        font-weight: 600;
        text-align: center;
      }
      span.bar {
        font-size: 32px;
        font-weight: 600;
        color: #c2c2c2;
      }
    }
    p {
      margin-top: 30px;
      word-break: keep-all;
      color: #888;
    }
  }
  .keypad {
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: center;
    padding: 40px;
    background: rgb(0, 133, 222);
    // background: linear-gradient(138deg, rgba(0,133,222,1) 30%, rgba(0,53,222,1) 100%);
    .rowLine {
      margin-bottom: 20px;
    }
    .key {
      font-size: 32px;
      border-radius: 50px;
      background-color: #fff;
      border: 0px;
      margin: 0 10px;
      overflow: hidden;
    }
    .key.re {
      font-size: 18px;
    }
  }
}
</style>
