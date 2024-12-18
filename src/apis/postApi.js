import { apiAxios } from '@/utils/request'

// 抓 15 筆最新貼文
export const getLatestPostsAPI = async () => {
  try {
    const response = await apiAxios.get('/posts/latest')
    if (response && response.status === 200) {
      console.log('getLatestPostsAPI 請求成功:', response.data.data)
      return response.data.data
    } else {
      console.log('getLatestPostsAPI 返回非 200 狀態碼:', response.status)
      return
    }
  } catch (error) {
    return 
  }
}

// 抓 15 天區間熱門貼文
export const getPopularPostsAPI = async () => {
  try {
    const response = await apiAxios.get('/posts/popular')
    if (response && response.status === 200) {
      return response.data.data
    } else {
      console.log('getPopularPostsAPI 返回非 200 狀態碼:', response.status)
      return
    }
  } catch (error) {
    return null
  }
}
