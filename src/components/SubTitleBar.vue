<template>
  <div class="pageTitle">
    <v-btn width="90px" height="90px" color="#0085de" class="back" elevation="0" @click="backPage">
      <v-icon size="50" color="#fff">fa-arrow-left</v-icon>
    </v-btn>
    <h2>{{ title }}</h2>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
  },
  methods: {
    backPage() {
      console.log('Click back page!');
      if(['UserLogin', 'ChargeType', 'MachineSelect'].includes(this.$route.name)) {
        this.$router.replace({ name: 'Main' });
      } else {
        this.$router.go(-1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pageTitle {
  height: 180px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 0 30px;
  h2 {
    font-size: 42px;
    color: #292929;
    font-weight: 500;
  }
  .back {
    border-radius: 50px;
    margin-right: 30px;
  }
}
</style>
