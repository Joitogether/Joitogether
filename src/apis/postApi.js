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

export const HomePostGetUserAPI = async () => {
  try {
    const response = await apiAxios.get('/posts')
    if (response && response.status === 200) {
      console.log('成功', response.data.data)
      return response.data
    }
  } catch (err) {
    return null
  }
}
