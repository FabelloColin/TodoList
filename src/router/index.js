import Vue from 'vue'
import Router from 'vue-router'
import Todos from '@/components/Todos'
import Login from '@/views/login'
import Register from '@/views/register'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Todos',
      component: Todos
    },
    {
      path: '/logout',
      name: 'logout',
      component: Login
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    }
  ]
})
