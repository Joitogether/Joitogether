import { createRouter, createWebHistory } from 'vue-router'
import HiThere from '@/components/HiThere.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/hi',
      name: 'hi',
      component: HiThere
    },
  ],
})

export default router
