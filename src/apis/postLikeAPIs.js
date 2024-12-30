import { apiAxios } from '@/utils/request'

// 新增按讚
export const addLikeAPI = async (postId, uid, status) => {
  const { data } = await apiAxios.post(`/posts/like/${postId}`, {
    uid,
    status,
  })
  return data
}

// 取得文章按讚數
export const getPostLikesAPI = async (postId) => {
  const { data } = await apiAxios.get(`/posts/likes/${postId}`)
  return data
}

// 取消按讚
export const deleteLikeAPI = async (postId) => {
  const { data } = await apiAxios.delete(`/posts/like/${postId}`)
  return data
}
