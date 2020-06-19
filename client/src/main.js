import Vue from 'vue'
import 'jquery'
import 'popper.js'
import 'bootstrap'
import 'bootswatch/dist/simplex/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.css';

import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
