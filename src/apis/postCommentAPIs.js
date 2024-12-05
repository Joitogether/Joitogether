import { apiAxios } from '@/utils/request'

// 新增留言
export const createPostComment = async (postId, commentData) => {
  try {
    const response = await apiAxios.post(`/posts/comment/${postId}`, commentData)
    return response.data
  } catch (error) {
    console.error('新增留言失敗:', error)
  }
}

// 取得文章的所有留言
export const getPostComments = async (postId) => {
  try {
    const response = await apiAxios.get(`/posts/comment/${postId}`)
    return response.data
  } catch (error) {
    console.error('取得文章留言失敗:', error)
    throw error
  }
}

// 刪除留言
export const deletePostComment = async (postId, commentId) => {
  try {
    const response = await apiAxios.delete(`/posts/comment/${postId}/${commentId}`)
    return response.data
  } catch (error) {
    console.error('刪除留言失敗:', error)
    throw error
  }
}
