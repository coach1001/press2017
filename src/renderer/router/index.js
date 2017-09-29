import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: require('@/components/Home')
    },
    {
      path: '/selecttest',
      name: 'SelectTest',
      component: require('@/components/SelectTest')
    },
    {
      path: '/viewresults',
      name: 'ViewResults',
      component: require('@/components/ViewResults')
    },
    {
      path: '/settings',
      name: 'Settings',
      component: require('@/components/Settings')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
