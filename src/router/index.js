import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login/LoginPage.vue'
import Profile from '@/views/MyProfile/index.vue'
import Home from '@/views/Home/index.vue'
import PersonInfo from '@/views/MyProfile/component/PersonInfo.vue'
import PersonActivity from '@/views/MyProfile/component/PersonActivity.vue'
import PersonPost from '@/views/MyProfile/component/PersonPost.vue'
import Post from '../views/Post/index.vue'
import PersonRate from '@/views/MyProfile/component/PersonRate.vue'
import PersonFollow from '@/views/MyProfile/component/PersonFollow.vue'
import Activity from '@/views/Activity/index.vue'
import ActivityDetail from '@/views/Activity/components/ActivityDetail.vue'
import ActivityCreate from '@/views/Activity/components/ActivityCreate.vue'
import ActivityReview from '@/views/Activity/components/ActivityReview.vue'
import SignupSuccess from '@/views/Login/SignupSuccess.vue'
import ResetPassword from '@/views/Login/ResetPassword.vue'
import forgotPassword from '@/views/Login/ForgotPassword.vue'
import TopUp from '@/views/TopUp/index.vue'
import TopupFinish from '@/views/TopUp/component/TopupFinish.vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/utils/firebaseConfig.js'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/signup-success',
      name: 'signupSuccess',
      component: SignupSuccess,
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: forgotPassword,
    },
    {
      path: '/reset-password',
      name: 'resetPassword',
      component: ResetPassword,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      redirect: { name: 'personInfo' },
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
          path: 'personfollow',
          name: 'personfollow',
          component: PersonFollow,
        },
        {
          path: 'personActivity',
          name: 'personActivity',
          component: PersonActivity,
        },
      ],
    },
    {
      path: '/post',
      name: 'post',
      component: Post,
    },
    {
      path: '/activity',
      name: 'activity',
      component: Activity,
      children: [
        {
          path: 'detail/:id',
          name: 'activityDetail',
          component: ActivityDetail,
        },
        {
          path: 'create',
          name: 'activityCreate',
          component: ActivityCreate,
        },

        {
          path: 'review/:activity_id',
          name: 'activityReview',
          component: ActivityReview,
        },
      ],
    },
    {
      path:'/topup',
      name: 'topup',
      component: TopUp,
    },
    {
      path: '/topupFinish',
      name: 'topupFinish',
      component: TopupFinish
    }
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userStore.setUser(user)
      next()
    } else {
      // next('/login')
      console.log('尚未登入')
      userStore.clearUser()
      next()
    }
  })
})

export default router
