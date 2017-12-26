import Vue from 'vue'
import axios from 'axios'
import Vuetify from 'vuetify'
import VueCharts from 'vue-chartjs'
import App from './App'
import router from './router'
import store from './store'

Vue.use(Vuetify)
Vue.use(VueCharts)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  created () {
    router.push('/settings')
  }
}).$mount('#app')
