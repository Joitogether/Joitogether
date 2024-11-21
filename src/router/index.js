import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login/LoginPage.vue'
import Profile from '@/views/MyProfile/index.vue'
import Home from '@/views/Home/index.vue'
import PersonInfo from '@/views/MyProfile/component/PersonInfo.vue'
import PersonActivity from '@/views/MyProfile/component/PersonActivity.vue'
import PersonPost from '@/views/MyProfile/component/PersonPost.vue'


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
    component: Profile,
    children: [
      {
        path: 'personInfo',
        name: 'personInfo',
        component: PersonInfo
      },
      {
        path: 'personpost',
        name: 'personpost',
        component: PersonPost,
      },
      {
        path: 'personActivity',
        name: 'personActivity',
        component: PersonActivity,
      },
    ]
  },
  {
    path: '/',
    name: 'home',
    component: Home
  }

],
})

export default router
