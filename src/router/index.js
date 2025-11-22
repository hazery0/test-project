import Vue from 'vue'
import VueRouter from 'vue-router'

import UserView from '@/views/element/UserView.vue'
import QuestionView from '@/views/element/QuestionView.vue'
import LoginView from '@/views/element/LoginView.vue'

Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/user',
    name: 'user',
    component: UserView
  },
  {
    path: '/question',
    name: 'question',
    component: QuestionView
  }
]

const router = new VueRouter({
  routes
})

export default router
