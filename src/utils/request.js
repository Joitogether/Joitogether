import axios from 'axios'
// import { getIdToken } from 'firebase/auth'
// import { auth } from './firebaseConfig'

const apiAxios = axios.create({
  baseURL: 'https://82f1-2001-b011-3006-5720-da5e-d3ff-fe28-daa2.ngrok-free.app',
  timeout: 1000,
  headers: { 'ngrok-skip-browser-warning': '69420' },
})

apiAxios.interceptors.request.use(
  async function (config) {
    // const token = await getIdToken(auth.currentUser)
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
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
