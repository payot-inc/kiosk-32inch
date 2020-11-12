import { ipcRenderer } from 'electron';

export default {
  data() {
    return {
      amount: 0,
    };
  },
  mounted() {
    ipcRenderer.on('input', this.inputEvent);
  },
  beforeDestroy() {
    ipcRenderer.removeListener('input', this.inputEvent);
  },
  methods: {
    open(state) {
      return ipcRenderer.invoke('open', state);
    },
    inputEvent(_, input) {
      this.amount += input;
    },
  },
};
