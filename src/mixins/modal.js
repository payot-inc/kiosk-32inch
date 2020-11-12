export default {
  data() {
    return {
      visible: false,
    };
  },
  watch: {
    visible(newValue) {
      const eventName = newValue ? 'onVisible' : 'onDismiss';
      this.$emit(eventName);
    },
  },
  methods: {
    toggle() {
      this.visible = !this.visible;
    },
    show(state) {
      this.visible = state;
    },
  },
};
