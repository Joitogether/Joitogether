import { apiAxios } from '@/utils/request'

export const getPosts = async (uid) => {
  try {
    const response = await apiAxios.get(`/users/posts/${uid}`)
    return response.data
  } catch (error) {
    console.error('找不到文章', error)
    throw error
  }
}

export const getPostsComment = async (post_id) => {
  try {
    const response = await apiAxios.get(`/posts/comments/${post_id}`)
    return response.data
  } catch (error) {
    console.error('沒有留言', error)
    throw error
  }
}

export const getPostsLike = async (post_id) => {
  try {
    const response = await apiAxios.get(`/posts/likes/${post_id}`)
    return response.data
  } catch (error) {
    console.error('沒有人按讚', error)
    throw error
  }
}
