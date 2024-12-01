import { apiAxios } from '@/utils/request'

export const ActivityGetApplicationsAPI = async (activity_id) => {
  return await apiAxios.get(`/activities/applications/${activity_id}`)
}

export const ActivityReviewApplicationsAPI = async (activity_id, status) => {
  try {
    const res = await apiAxios.put(`/activities/applications/${activity_id}/verify`, {
      status
    })
    return res
  } catch (err) {
    console.log(err)
  }
}

