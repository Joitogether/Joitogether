import axios from 'axios'
import { getIdToken } from 'firebase/auth'
import { auth } from './firebaseConfig'
import { createDiscreteApi } from 'naive-ui'
const { message } = createDiscreteApi(['message'])

const apiAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
})

let requestCount = 0
let messageInstance

function showLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay')
  if (overlay) {
    overlay.classList.add('active') // 顯示遮罩
  }
}

function hideLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay')
  if (overlay) {
    overlay.classList.remove('active') // 隱藏遮罩
  }
}

apiAxios.interceptors.request.use(
  async function (config) {
    if (auth.currentUser) {
      const token = await getIdToken(auth.currentUser)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    if (requestCount === 0) {
      messageInstance = message.loading('請稍後...', { duration: 0 })
      showLoadingOverlay()
    }
    requestCount++
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

apiAxios.interceptors.response.use(
  function (response) {
    requestCount--
    if (requestCount === 0 && messageInstance) {
      hideLoadingOverlay()
      messageInstance.destroy()
      messageInstance = null
    }
    return response
  },
  function (error) {
    requestCount--
    if (requestCount === 0 && messageInstance) {
      hideLoadingOverlay()
      messageInstance.destroy()
      messageInstance = null
    }
    return Promise.reject(error)
  },
)

export { apiAxios }
