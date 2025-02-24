import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/authView.vue'
import HomeView from '../views/homeView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/auth',
      name: 'authorization',
      component: AuthView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
  ]
});

export default router