<template>
  <div class="overlayGuide">
    <v-overlay
      v-model="visible"
      opacity="0"
      transition="fade-transition"
      z-index="11"
      
    >
      <a v-touchEvent:end="overlayClose" class="close_bg">
        <slot />
      </a>
    </v-overlay>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    overlayClose() {
      this.visible = !this.visible;
    },
  },
};
</script>

<style lang="scss" scoped>
.v-dialog {
  height: 100%;
}
.v-overlay__content {
  width: 100%;
  height: 100%;
}
.overlayGuide {
  display: flex;
  flex: 1;
  background: #fff;
  width: 100%;
  height: 100%;
  .close_bg {
    display: flex;
    flex: 1;
    width: 100%;
    height: 100%;
    flex-direction: column;
  }
}
</style>