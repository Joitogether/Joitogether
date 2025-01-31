import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createDiscreteApi } from 'naive-ui'
const { message } = createDiscreteApi(['message'])

import App from './App.vue'
import router from './router'
import Naive from 'naive-ui'
import VueLazyload from 'vue-lazyload'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Naive)
app.use(VueLazyload)

app.config.errorHandler = (err) => {
  // 統一處理沒有抓到的錯誤
  console.error(err)
  message.error('發生未知錯誤，請稍後再試')
}

app.mount('#app')
