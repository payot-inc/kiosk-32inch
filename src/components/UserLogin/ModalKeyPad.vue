<template>
  <div class="bottom">
    <div class="passwordView">
      <div class="label">
        <v-icon color="#aaa" size="30">fas fa-unlock</v-icon>
        <span>비밀번호 생성</span>
      </div>
      <div class="password">
        <span v-for="num in 4" :key="num" :class="{ active: password.length >= num }"></span>
      </div>
    </div>
    <div class="keypad">
      <div class="rowLine" v-for="(numbers, row_index) in number_pad" :key="row_index">
        <v-btn
          width="180px"
          height="90px"
          class="number"
          elevation="0"
          v-for="number in numbers"
          :key="number"
          @click="inputKey(number)"
          >{{ number }}</v-btn
        >
      </div>
      <div class="rowLine">
        <v-btn width="180px" height="90px" class="number del" elevation="0" @click="inputKey('delete')">
          <v-icon size="40">fa-backspace</v-icon>
        </v-btn>
        <v-btn width="180px" height="90px" class="number" elevation="0" @click="inputKey(0)"
          >0</v-btn
        >
        <v-btn @click="inputKey('clear')" width="180px" height="90px" class="number all" elevation="0"
          >다시입력</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalKeyPad',
  props: {
    type: String,
  },
  data() {
    return {
      number_pad: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      password: '',
    };
  },
  watch: {
    type(newValue) {
      this.clear();
    },
    password(newValue) {
      if(newValue.length === 4) {
        this.$emit('submit', newValue);
        // this.password = '';
      }
    }
  },
  methods: {
    inputKey(value) {
      this.$sound.playTouchSound();
      if (typeof value === 'number' && this.password.length < 4) {
        this.password += value;
      } else if (value === 'delete') {
        this.password = this.password.slice(0, this.password.length - 1);
      } else if (value === 'clear') {
        this.password = '';
      }
    },
    clear() {
      this.password = '';
    }
  },
};
</script>

<style lang="scss" scoped>
.bottom {
  width: 100%;
  background: #f2f2f2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0 120px 0;
  .passwordView {
    width: 560px;
    height: 120px;
    border-bottom: 4px solid #0085de;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    .label {
      span {
        color: #292929;
        display: inline-block;
        margin-left: 20px;
        vertical-align: middle;
        font-size: 28px;
        font-family: 'SCDream';
      }
    }
    .password {
      span {
        display: inline-block;
        vertical-align: middle;
        width: 30px;
        height: 30px;
        line-height: 40px;
        background: #aaa;
        border-radius: 15px;
        margin-left: 15px;
      }
      span.active {
        background: #0085de;
      }
    }
  }
  .keypad {
    .rowLine {
      display: flex;
      flex-direction: row;
      justify-content: center;
      .number {
        font-size: 42px;
        margin: 5px;
        border-radius: 10px;
        background: #fff;
        border: 2px solid #c2c2c2;
      }
      .number.all {
        font-size: 28px;
      }
    }
  }
}
</style>
