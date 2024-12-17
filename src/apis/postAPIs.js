import { apiAxios } from '@/utils/request'

// 創建文章
export const createPostAPI = async (postData) => {
  try {
    const response = await apiAxios.post('/posts', postData)
    return response.data
  } catch (error) {
    console.error('創建文章失敗:', error)
    return null
  }
}

// 取得所有文章
export const getPostsAPI = async () => {
  try {
    const response = await apiAxios.get('/posts')
    return response.data
  } catch (error) {
    console.error('找不到文章', error)
    return null
  }
}

// 取得分類文章
export const getPostsByCategoryAPI = async (category) => {
  try {
    const response = await apiAxios.get(`/posts/category/${category}`)
    return response.data
  } catch (error) {
    console.error('找不到分類文章', error)
    return null
  }
}

// 取得單一文章
export const getPostByIdAPI = async (postId) => {
  try {
    const response = await apiAxios.get(`/posts/${postId}`)
    return response.data
  } catch (error) {
    console.error('找不到單一文章', error)
    return null
  }
}

// 更新文章
export const updatePostAPI = async (postId, updatePostData) => {
  try {
    const response = await apiAxios.put(`/posts/${postId}`, updatePostData)
    return response.data
  } catch (error) {
    console.error('更新文章失敗:', error)
    return null
  }
}

// 刪除文章
export const deletePostAPI = async (postId) => {
  try {
    const response = await apiAxios.delete(`/posts/${postId}`)
    return response.data
  } catch (error) {
    console.error('刪除文章失敗:', error)
    return null
  }
}
