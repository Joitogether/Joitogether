import { apiAxios } from '@/utils/request'

// 新增按讚
export const addLikeAPI = async (postId, uid, status) => {
  try {
    const response = await apiAxios.post(`/posts/like/${postId}`, {
      uid,
      status,
    })
    console.log('新增按讚成功', response.data.data)
    return response.data
  } catch (error) {
    console.error('新增按讚失敗:', error)
    return null
  }
}

// 取得文章按讚數
export const getPostLikesAPI = async (postId) => {
  try {
    const response = await apiAxios.get(`/posts/likes/${postId}`)
    console.log(response)
    console.log('取得文章按讚數成功', response.data)
    return response.data
  } catch (error) {
    console.error('取得文章按讚數失敗:', error)
    return null
  }
}

// 取消按讚
export const deleteLikeAPI = async (postId) => {
  try {
    const response = await apiAxios.delete(`/posts/like/${postId}`)
    console.log('取消按讚成功', response.data)
    return response.data
  } catch (error) {
    console.error('取消按讚失敗:', error.response.data)
    return null
  }
}
