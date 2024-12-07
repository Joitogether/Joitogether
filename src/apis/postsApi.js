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
