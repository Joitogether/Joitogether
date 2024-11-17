import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login/LoginPage.vue'
import Profile from '@/views/MyProfile/index.vue'
import Home from '@/views/Home/index.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile
  },
  {
    path: '/',
    name: 'home',
    component: Home
  }

],
})

export default router
