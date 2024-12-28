import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useMessage } from 'naive-ui'

import App from './App.vue'
import router from './router'
import Naive from 'naive-ui'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Naive)

const message = useMessage()
app.config.errorHandler = () => {
  // 統一處理沒有抓到的錯誤
  message.error('發生未知錯誤，請稍後再試')
}

app.mount('#app')
