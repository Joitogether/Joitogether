import { apiAxios } from '@/utils/request'

export const ratingGetDetailAPI = async (activityId) => {
  const { data } = await apiAxios.get(`/ratings/activity/${activityId}`)
  return data.data
}

export const ratingSubmitAPI = async (data) => {
  const response = await apiAxios.post('/ratings/', data)
  return response.data
}

export const getRatingRecordAPI = async (activityId, userId) => {
  const { data } = await apiAxios.get(`ratings/activityRatings/${activityId}/user/${userId}`)
  return data.data
}
