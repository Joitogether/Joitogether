import axios from 'axios'
import { getIdToken } from 'firebase/auth'
import { auth } from './firebaseConfig'
// import { createDiscreteApi } from 'naive-ui'
// const { message } = createDiscreteApi(['message'])

const apiAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

const byPassPaths = [
  '/posts/likes',
  '/posts/like',
  '/posts/comments',
  '/posts/comment',
  '/users/notifications',
  '/users/summary',
]

let requestCount = 0

function showLoadingOverlay() {
  const overlay = document.getElementById('overlay')
  if (overlay) {
    overlay.classList.add('active') // 顯示遮罩
  }
}

function hideLoadingOverlay() {
  const overlay = document.getElementById('overlay')
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

    if (
      byPassPaths.some((path) => {
        return config.url.includes(path)
      })
    ) {
      return config
    }

    if (requestCount === 0) {
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
    if (byPassPaths.some((path) => response.config.url.includes(path))) {
      return response
    }

    if (requestCount > 0) {
      requestCount--
    }
    if (requestCount === 0) {
      hideLoadingOverlay()
    }
    return response
  },
  function (error) {
    if (requestCount > 0) {
      requestCount--
    }
    if (requestCount === 0) {
      hideLoadingOverlay()
    }
    return Promise.reject(error)
  },
)

export { apiAxios }
