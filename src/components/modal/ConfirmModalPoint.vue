<template>
    <v-dialog v-model="visible" width="800px" overlay-color="#000" overlay-opacity="0.8">
      <div class="confirm">
        <div class="top">
          <span class="text1">{{ title }}</span>
          <span class="text2">{{ message }}</span>
        </div>
        <div class="bottom">
          <v-btn outlined class="cancle" v-touchEvent:end="() => visible = false">{{ cancelButtonText }}</v-btn>
          <v-btn outlined class="ok" v-touchEvent:end="done">{{ submitButtonText }}</v-btn>
        </div>
      </div>
    </v-dialog>
</template>

<script>
import ModalMixin from '@/mixins/modal';

export default {
  name: 'AlertModal',
  props: {
    title: String,
    message: String,
    submitButtonText: {
      type: String,
      default: '확인',
    },
    cancelButtonText: {
      type: String,
      default: '취소',
    },
  },
  mixins: [ModalMixin],
  methods: {
    done() {
      this.visible = false;
      this.$emit('submit');
    },
  },
};
</script>

<style lang="scss" scoped>
.confirm {
  background: #fff;
  border-radius: 10px;
  font-size: 28px;
  .top {
    padding: 40px;
    span {
      display: block;
      font-size: 40px;
    }
    span.text1 {
      color: #0085de;
    }
    b {
      color: #0085de;
    }
  }
  .bottom {
    padding: 40px;
    text-align: right;
    .v-btn {
      height: 80px;
      font-size: 28px;
      margin-left: 20px;
      border: 2px solid #c2c2c2;
      border-radius: 10px;
      font-weight: 400;
    }
    .v-btn.ok {
      border-color: #0085de;
      // color: #0085de;
      color: #fff;
      animation: point 0.6s infinite;
    }
  }
  @keyframes point {
    0% {
      background: #005086;
    }
    100% {
      background: #0085de;
    }
  }
}
</style>
