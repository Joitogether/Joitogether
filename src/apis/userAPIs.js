import { apiAxios } from '@/utils/request.js'

export const userRegisterAPI = async (data) => {
  try {
    const response = await apiAxios.post('/users/register', data)
    if (response.data.status === 200 && response.data.status < 300) {
      console.log('後端傳送成功', response.data)
      return response
    } else {
      console.log('後端傳送失敗', response)
      throw new Error(`後端回應失敗，狀態碼：${response.status}`)
    }
  } catch (error) {
    console.error('API呼叫失敗：', error.message)
    throw error
  }
}
