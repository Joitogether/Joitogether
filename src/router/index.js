import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login/LoginPage.vue'
import Profile from '@/views/MyProfile/index.vue'
import Home from '@/views/Home/index.vue'
import PersonInfo from '@/views/MyProfile/component/PersonInfo.vue'
import PersonActivity from '@/views/MyProfile/component/PersonActivity.vue'
import PersonPost from '@/views/MyProfile/component/PersonPost.vue'
import PostHomePage from '../views/Post/postHomePage.vue'
import PostDetail from '@/views/Post/component/PostDetail.vue'
import PersonRate from '@/views/MyProfile/component/PersonRate.vue'
import PersonFollow from '@/views/MyProfile/component/PersonFollow.vue'
import Activity from '@/views/Activity/index.vue'
import ActivityDetail from '@/views/Activity/components/ActivityDetail.vue'
import ActivityCreate from '@/views/Activity/components/ActivityCreate.vue'
import ActivityReview from '@/views/Activity/components/ActivityReview.vue'
import ActivityRating from '@/views/Activity/components/ActivityRating.vue'
import SignupSuccess from '@/views/Login/SignupSuccess.vue'
import ResetPassword from '@/views/Login/ResetPassword.vue'
import forgotPassword from '@/views/Login/ForgotPassword.vue'
import ShoppingCart from '@/views/CashFlow/index.vue'
import Layout from '@/views/Layout/index.vue'
import { getCurrentUser } from '@/utils/firebaseConfig'
import TopUp from '@/views/TopUp/index.vue'
import TopupFinish from '@/views/TopUp/component/TopupFinish.vue'
import TopupRecord from '@/views/TopUp/component/TopupRecord.vue'
import NotFound from '@/views/Error/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: '/shoppingcart',
      name: 'shpopingcart',
      component: ShoppingCart,
    },
    {
      path: '/',
      name: 'layout',
      component: Layout,
      redirect: { name: 'home' },
      children: [
        {
          path: 'home',
          name: 'home',
          component: Home,
        },
        {
          path: 'profile',
          name: 'profile',
          component: Profile,
          meta: { requiresAuth: true },
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
          path: 'posts',
          name: 'posts',
          component: PostHomePage,
        },
        {
          path: 'post/:post_id',
          name: 'PostDetail',
          component: PostDetail,
        },
        {
          path: 'activity',
          name: 'activity',
          component: Activity,
          redirect: { name: 'home' },
          children: [
            {
              path: 'detail/:id',
              name: 'activityDetail',
              component: ActivityDetail,
            },
            {
              path: 'create',
              name: 'activityCreate',
              meta: { requiresAuth: true },
              component: ActivityCreate,
            },
            {
              path: 'review/:activity_id',
              name: 'activityReview',
              component: ActivityReview,
            },
            {
              path: 'rating/:activity_id',
              name: 'activityRating',
              meta: { requiresAuth: true },
              component: ActivityRating,
            },
          ],
        },
        {
          path: '/topup',
          name: 'topup',
          component: TopUp,
        },
        {
          path: '/topupFinish',
          name: 'topupFinish',
          component: TopupFinish,
        },
        {
          path: '/topupRecord',
          name: 'topupRecord',
          component: TopupRecord,
        },
        {
          path: '/:catchAll(.*)', // 匹配所有未定義路由
          name: 'notFound',
          component: NotFound, // 導向自訂的 404 頁面 隨時可改
        },
      ],
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const user = await getCurrentUser()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  if (requiresAuth && !user) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
