import { apiAxios } from '@/utils/request'

export const ratingGetDetailAPI = async (activityId) => {
  try {
    const res = await apiAxios.get(`/ratings/activity/${activityId}`)
    return res.data.data
  } catch {
    return null
  }
}

export const ratingSubmitAPI = async (data) => {
  try {
    const res = await apiAxios.post('/ratings/', data)
    return res.data
  } catch {
    return null
  }
}
