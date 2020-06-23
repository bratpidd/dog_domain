import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter);

import Vuex from 'vuex'
Vue.use(Vuex);

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios);

import VModal from 'vue-js-modal'
Vue.use(VModal, { dynamic: true, dynamicDefaults: { clickToClose: false, height:"auto", width: 400, adaptive:true }, injectModalsContainer: true, dialog: true });

import App from './App.vue';
import routes from './router/routes';
import storeOptions from './store/store';
import "./directives/directives";

Vue.config.productionTip = false;

const store = new Vuex.Store(storeOptions);
const router = new VueRouter({
  routes, // short for `routes: routes`
  mode: 'history'
});

new Vue({
  store,
  render: h => h(App),
  router,
}).$mount('#app');
