import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createDiscreteApi } from 'naive-ui'
const { message } = createDiscreteApi(['message'])

import App from './App.vue'
import router from './router'
import Naive from 'naive-ui'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Naive)

app.config.errorHandler = (err) => {
  // 統一處理沒有抓到的錯誤
  console.log(err)
  message.error('發生未知錯誤，請稍後再試')
}

// 全局圖片錯誤處理
const defaultImg =
  'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg'

document.addEventListener(
  'error',
  (event) => {
    const target = event.target
    if (target.tagName === 'IMG') {
      target.src = defaultImg
    }
  },
  true,
)

app.mount('#app')
