<template>
  <div>
    현금 충전 페이지
    <v-btn @click="open">열기</v-btn>
    <!-- <button @click="open">열기</button> -->
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

export default {
  name: 'ChargeCash',
  data() {
    return {
      amount: 0,
    };
  },
  mounted() {
    ipcRenderer.on('cash-input', this.onInputAmount);
  },
  beforeDestroy() {
    ipcRenderer.removeListener('cash-input', this.onInputAmount);
  },
  methods: {
    open(state) {
      ipcRenderer.invoke('cash-open', state);
    },
    onInputAmount(event, amount) {
      this.amount += amount;
      console.log(amount, this.amount);
    },
  },
};
</script>
