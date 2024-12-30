import { apiAxios } from '@/utils/request'

// 建立文章
export const createPostAPI = async (postData) => {
  try {
    const response = await apiAxios.post('/posts', postData)
    return response.data
  } catch {
    return null
  }
}

// 取得分類文章
export const getPostsByCategoryAPI = async (category) => {
  try {
    const response = await apiAxios.get(`/posts/category/${category}`)
    return response.data.data
  } catch {
    return null
  }
}

// 取得單一文章
export const getPostByIdAPI = async (postId) => {
  try {
    const response = await apiAxios.get(`/posts/${postId}`)
    return response.data
  } catch {
    return null
  }
}

// 更新文章
export const updatePostAPI = async (postId, updatePostData) => {
  try {
    const response = await apiAxios.put(`/posts/${postId}`, updatePostData)
    return response.data
  } catch {
    return null
  }
}

// 刪除文章
export const deletePostAPI = async (postId) => {
  try {
    const response = await apiAxios.delete(`/posts/${postId}`)
    return response.data
  } catch {
    return null
  }
}

// 抓 15 筆最新貼文
export const getLatestPostsAPI = async () => {
  try {
    const response = await apiAxios.get('/posts/latest')
    return response.data.data
  } catch {
    return null
  }
}

// 抓 15 天區間熱門貼文
export const getPopularPostsAPI = async () => {
  try {
    const response = await apiAxios.get('/posts/popular')
    return response.data.data
  } catch {
    return null
  }
}
