import axios from 'axios'
import { getIdToken } from 'firebase/auth'
import { auth } from './firebaseConfig'

const apiAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
})
//
// const apiAxios = axios.create({
//   baseURL: 'https://main-vervet-sincerely.ngrok-free.app',
//   timeout: 1000,
//   headers: { 'ngrok-skip-browser-warning': '69420' },
// })

apiAxios.interceptors.request.use(
  async function (config) {
    if (auth.currentUser) {
      try {
        const token = await getIdToken(auth.currentUser)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (error) {
        console.warn('無法獲取 Token，繼續發送請求', error)
      }
    } else {
      console.log('用戶未登入，跳過 Authorization 設置')
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

apiAxios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    return Promise.reject(error)
  },
)

export { apiAxios }
