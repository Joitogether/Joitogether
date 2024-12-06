import { apiAxios } from '@/utils/request'

export const getRatings = async (user_id) => {
  try {
    const response = await apiAxios.get(`/ratings/userDetails/${user_id}`)
    return response.data
  } catch (error) {
    console.error('找不到留言者', error)
    throw error
  }
}
