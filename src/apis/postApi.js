import { apiAxios } from '@/utils/request'

// export const HomePostGetUserAPI = async () => {
//   try {
//     const response = await apiAxios.get('/posts')
//     if (response && response.status === 200) {
//       console.log('成功獲取資料', response.data.data)
//       return response.data
//     }
//   } catch (err) {
//     return null
//   }
// }

export const getAllPostsAPI = async () => {
  try {
    const response = await apiAxios.get('/posts')
    if (response && response.status === 200) {
      console.log('API 請求成功:', response.data.data)
      return response.data.data // 回傳資料
    } else {
      console.log('API 返回非 200 狀態碼:', response.status)
      return
    }
  } catch (error) {
    console.error('API 請求失敗:', error.message)
    return null
  }
}
