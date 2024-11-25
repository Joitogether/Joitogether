import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login/LoginPage.vue'
import Profile from '@/views/MyProfile/index.vue'
import Home from '@/views/Home/index.vue'
import Activity from '@/views/Activity/index.vue'
import ActivityDetail from '@/views/Activity/components/ActivityDetail.vue'
import ActivityCreate from '@/views/Activity/components/ActivityCreate.vue'
import ActivityReview from '@/views/Activity/components/ActivityReview.vue'

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
  },
  {
    path: '/activity',
    name: 'activity',
    component: Activity,
    children: [
      {
        path: 'detail/:id',
        name: 'activityDetail',
        component: ActivityDetail
      }, {
        path: 'create',
        name: 'activityCreate',
        component: ActivityCreate
      },

      {
        path: 'review',
        name: 'activityReview',
        component: ActivityReview                
      }
    ]
  }

],
})

export default router
