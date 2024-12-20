import axios from 'axios'
import { getIdToken } from 'firebase/auth'
import { auth } from './firebaseConfig'

const apiAxios = axios.create({
<<<<<<< HEAD
  baseURL: 'https://joitogetherbackend-production-5e45.up.railway.app/',
  timeout: 5000,
=======
  baseURL: 'http://localhost:3030',
  timeout: 1000,
>>>>>>> HomeLatestPosts
})
//
// const apiAxios = axios.create({
//   baseURL: 'https://main-vervet-sincerely.ngrok-free.app',
//   timeout: 1000,
//   headers: { 'ngrok-skip-browser-warning': '69420' },
// })

apiAxios.interceptors.request.use(
  async function (config) {
<<<<<<< HEAD
    if(!auth.currentUser){
      return config
    }
    const token = await getIdToken(auth.currentUser)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
=======
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
>>>>>>> HomeLatestPosts
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
