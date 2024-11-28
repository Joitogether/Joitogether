import { apiAxios } from '@/utils/request.js'

export const userRegisterAPI = async (data) => {
  try {
    const response = await apiAxios.post('/users/register', data)
    if (response.status >= 200 && response.status < 300) {
      console.log('註冊資料後端傳送成功', response.data)
      return response
    } else {
      console.log('註冊資料後端傳送失敗', response)
      throw new Error(`註冊資料後端回應失敗，狀態碼：${response.status}`)
    }
  } catch (error) {
    console.error('註冊資料 API 呼叫失敗：', error.message)
    throw error
  }
}

export const userUpdateEmailVerifiedAPI = async (uid, data) => {
  try {
    const response = await apiAxios.put(`users/update/${uid}`, data)
    if (response.status >= 200 && response.status < 300) {
      console.log('更新信箱認證成功', response.data)
      return response
    } else {
      console.log('更新信箱認證失敗', response)
      throw new Error(`更新信箱認證失敗，狀態碼：${response.status}`)
    }
  } catch (error) {
    console.error('更新信箱認證 API 呼叫失敗：', error.message)
    throw error
  }
}

export const userAuthLoginAPI = async (data) => {
  try {
    const response = await apiAxios.post('/users/register', data)
    if (response.status >= 200 && response.status < 300) {
      console.log('第三方登入資料後端傳送成功', response.data)
      return response
    } else {
      console.log('第三方登入資料後端傳送失敗', response)
      throw new Error(`第三方登入資料後端回應失敗，狀態碼：${response.status}`)
    }
  } catch (error) {
    console.error('第三方登入資料 API 呼叫失敗：', error.message)
    throw error
  }
}
