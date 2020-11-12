<template>
  <v-dialog v-model="visible" width="640px" overlay-opacity="0.8" overlay-color="#000" persistent>
    <div class="progressBox">
      <v-progress-circular indeterminate color="#EE2073" :size="150" :width="15" />
      <dl>
        <dt>{{ title }}</dt>
        <dd>{{ message }}</dd>
      </dl>
    </div>
  </v-dialog>
</template>

<script>
import ModalMixin from '@/mixins/modal';

export default {
  name: 'ProgressModal',
  props: {
    title: {
      type: String,
      default: '자료를 가져오는 중 입니다',
    },
    message: {
      type: String,
      default: '잠시만 기다려 주세요',
    },
  },
  mixins: [ModalMixin],
};
</script>
