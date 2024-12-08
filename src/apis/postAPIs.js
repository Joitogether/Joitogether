import { apiAxios } from '@/utils/request'

// 創建文章
export const createPost = async (postData) => {
  try {
    const response = await apiAxios.post('/posts', postData)
    return response.data
  } catch (error) {
    console.error('創建文章失敗:', error)
    throw error
  }
}

// 取得所有文章
export const getPosts = async () => {
  try {
    const response = await apiAxios.get('/posts')
    return response.data
  } catch (error) {
    console.error('找不到文章', error)
    throw error
  }
}

// 取得分類文章
export const getPostsByCategory = async (category) => {
  try {
    const response = await apiAxios.get(`/posts/category/${category}`)
    return response.data
  } catch (error) {
    console.error('找不到分類文章', error)
    throw error
  }
}

// 取得單一文章
export const getPostById = async (postId) => {
  try {
    const response = await apiAxios.get(`/posts/${postId}`)
    return response.data
  } catch (error) {
    console.error('找不到單一文章', error)
    throw error
  }
}

// 更新文章
export const updatePost = async (postId, updatePostData) => {
  try {
    const response = await apiAxios.put(`/posts/${postId}`, updatePostData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('更新文章失敗:', error)
    throw error
  }
}

// 刪除文章
export const deletePost = async (postId) => {
  try {
    const response = await apiAxios.delete(`/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('刪除文章失敗:', error)
    throw error
  }
}
