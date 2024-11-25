import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login/LoginPage.vue'
import Profile from '@/views/MyProfile/index.vue'
import Home from '@/views/Home/index.vue'
import PersonInfo from '@/views/MyProfile/component/PersonInfo.vue'
import PersonActivity from '@/views/MyProfile/component/PersonActivity.vue'
import PersonPost from '@/views/MyProfile/component/PersonPost.vue'
import PersonRate from '@/views/MyProfile/component/PersonRate.vue'
import PersonalFocus from '@/views/MyProfile/component/PersonalFocus.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      children: [
        {
          path: 'personInfo',
          name: 'personInfo',
          component: PersonInfo,
        },
        {
          path: 'personalrate',
          name: 'personalrate',
          component: PersonRate,
        },
        {
          path: 'personpost',
          name: 'personpost',
          component: PersonPost,
        },
        {
          path: 'personalfocus',
          name: 'personalfocus',
          component: PersonalFocus,
        },
        {
          path: 'personActivity',
          name: 'personActivity',
          component: PersonActivity,
        },
      ],
    },
    {
      path: '/',
      name: 'home',
      component: Home,
    },
  ],
})

export default router
