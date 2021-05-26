import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

import './plugins/network_event';
import './plugins/sound';
import './plugins/howler';
import './plugins/idle';
import './plugins/hooks';
import './plugins/auto_reboot';
import './plugins/ad';
import { ipcRenderer } from 'electron';

import Vue2TouchEvents from 'vue2-touch-events';

Vue.use(Vue2TouchEvents, {
  disableClick: false,
  namespace: 'touchEvent',
  tapTolerance: 49,
  swipeTolerance: 50
});

if(store.state.company?.id) {
  ipcRenderer.invoke('login', store.state.company.id);
}

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
