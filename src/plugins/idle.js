import Vue from 'vue';
import idle from 'idle-vue';

const IDLE_TIME = parseInt(process.env.VUE_APP_IDLE_TIMEOUT, 10);

Vue.use(idle, {
  eventEmitter: new Vue(),
  idleTime: IDLE_TIME,
});
