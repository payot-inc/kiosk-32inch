import { mapState } from 'vuex';

export default {
  computed: {
    machineList() {
      
      this.$store.state.machines;
    },
  },
};
