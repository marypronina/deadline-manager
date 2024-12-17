import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/authView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/auth',
      name: 'authorization',
      component: AuthView
    },
    // {
    //   path: '/home',
    //   name: 'home',
    //   component: homeView
    // },
  ]
})

console.log(router);

export default router