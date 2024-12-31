import { apiAxios } from '@/utils/request'

// 新增按讚
export const addLikeAPI = async (postId, uid, status) => {
  try {
    const response = await apiAxios.post(`/posts/like/${postId}`, {
      uid,
      status,
    })
    return response.data
  } catch {
    return null
  }
}

// 取得文章按讚數
export const getPostLikesAPI = async (postId) => {
  try {
    const response = await apiAxios.get(`/posts/likes/${postId}`)
    return response.data
  } catch {
    return null
  }
}

// 取消按讚
export const deleteLikeAPI = async (postId) => {
  try {
    const response = await apiAxios.delete(`/posts/like/${postId}`)
    return response.data
  } catch {
    return null
  }
}
