<template>
  <div class="examine">
    <div class="leftTop" v-touchEvent:tap="() => exitCount++"></div>
    <div class="rightTop" v-touchEvent:tap="rebootPC">키오스크 PC 재부팅</div>
    <v-icon>mdi-lightbulb</v-icon>
    <dl>
      <dt>{{ title }}</dt>
      <dd v-if="message">
        {{ message }}
      </dd>
      <dd>고객센터 : {{ companyTel }}</dd>
    </dl>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import { mapState } from 'vuex';
import { reboot } from 'electron-shutdown-command';
export default {
  name: 'ErrorPage',
  props: {
    title: {
      type: String,
      default: '지금은 사용할 수 없습니다',
    },
    message: String,
  },
  data() {
    return {
      exitCount: 0,
    };
  },
  computed: {
    ...mapState({
      companyTel: state => state.company.phone,
    }),
  },
  watch: {
    exitCount(newValue) {
      if (newValue >= 15) {
        ipcRenderer.invoke('exit-app');
      }
    },
  },
  methods: {
    rebootPC() {
      reboot();
    },
  },
};
</script>

<style lang="scss" scoped>
.examine {
  .leftTop {
    position: absolute;
    left: 0;
    top: 0;
    width: 100px;
    height: 100px;
  }
  .rightTop {
    position: absolute;
    right: 0;
    top: 0;
    margin-right: 20px;
    margin-top: 20px;
    color: #292929;
    background: #fff;
    padding: 5px 20px;
    border-radius: 10px;
  }

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  background: #292929;
  .v-icon {
    font-size: 150px;
    color: #fff;
    text-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
  }
  dl {
    margin-top: 60px;
    color: #fff;
    text-align: center;
    dt {
      font-size: 72px;
      font-weight: 500;
      text-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
    }
    dd {
      font-size: 36px;
      margin-top: 20px;
      word-break: keep-all;
      color: #292929;
      background: #fff;
      padding: 0 20px;
      border-radius: 10px;
    }
  }
}
</style>
