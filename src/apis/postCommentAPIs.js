import { apiAxios } from '@/utils/request'

// 新增留言
export const createPostCommentAPI = async (postId, commentData) => {
  try {
    const response = await apiAxios.post(`/posts/comment/${postId}`, commentData)
    return response.data
  } catch {
    return null
  }
}

// 取得文章的所有留言
export const getPostCommentsAPI = async (postId) => {
  try {
    const response = await apiAxios.get(`/posts/comments/${postId}`)
    return response.data
  } catch {
    return null
  }
}

// 刪除留言
export const deletePostCommentAPI = async (commentId) => {
  try {
    const response = await apiAxios.delete(`/posts/comment/${commentId}`)
    return response.data
  } catch {
    return null
  }
}
