import { apiAxios } from '@/utils/request'

// 新增留言
export const createPostCommentAPI = async (postId, commentData) => {
  const { data } = await apiAxios.post(`/posts/comment/${postId}`, commentData)
  return data
}

// 取得文章的所有留言
export const getPostCommentsAPI = async (postId) => {
  const { data } = await apiAxios.get(`/posts/comments/${postId}`)
  return data
}

// 刪除留言
export const deletePostCommentAPI = async (commentId) => {
  const { data } = await apiAxios.delete(`/posts/comment/${commentId}`)
  return data
}
