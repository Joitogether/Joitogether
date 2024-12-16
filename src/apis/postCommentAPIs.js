import { apiAxios } from '@/utils/request'

// 新增留言
export const createPostCommentAPI = async (postId, commentData) => {
  try {
    console.log(commentData)
    const response = await apiAxios.post(`/posts/comment/${postId}`, commentData)
    return response.data
  } catch (error) {
    console.error('新增留言失敗:', error)
    return null
  }
}

// 取得文章的所有留言
export const getPostCommentsAPI = async (postId) => {
  try {
    const response = await apiAxios.get(`/posts/comments/${postId}`)
    return response.data
  } catch (error) {
    console.error('取得文章留言失敗:', error)
    return null
  }
}

// 刪除留言
export const deletePostCommentAPI = async (commentId) => {
  try {
    const response = await apiAxios.delete(`/posts/comment/${commentId}`)
    return response.data
  } catch (error) {
    console.error('刪除留言失敗:', error)
    return null
  }
}
