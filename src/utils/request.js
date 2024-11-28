import axios from 'axios'
import { getIdToken } from 'firebase/auth'
import { auth } from './firebaseConfig'

const apiAxios = axios.create({
  baseURL: 'http://localhost:3030',
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
})

apiAxios.interceptors.request.use(
  async function (config) {
    const token = await getIdToken(auth.currentUser)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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
