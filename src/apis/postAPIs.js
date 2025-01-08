import { apiAxios } from '@/utils/request'

// 建立文章
export const createPostAPI = async (postData) => {
  const { data } = await apiAxios.post('/posts', postData)
  return data
}

// 取得分類文章
export const getPostsByCategoryAPI = async (category) => {
  const { data } = await apiAxios.get(`/posts/category/${category}`)
  return data.data
}

// 取得單一文章
export const getPostByIdAPI = async (postId) => {
  const { data } = await apiAxios.get(`/posts/${postId}`)
  return data
}

// 更新文章
export const updatePostAPI = async (postId, updatePostData) => {
  const { data } = await apiAxios.put(`/posts/${postId}`, updatePostData)
  return data
}

// 刪除文章
export const deletePostAPI = async (postId) => {
  const data = await apiAxios.delete(`/posts/${postId}`)
  return data
}

// 取得最新貼文
export const getLatestPostsAPI = async () => {
  const { data } = await apiAxios.get('/posts/latest')
  return data.data
}

// 取得熱門貼文
export const getPopularPostsAPI = async () => {
  const { data } = await apiAxios.get('/posts/popular')
  return data.data
}
