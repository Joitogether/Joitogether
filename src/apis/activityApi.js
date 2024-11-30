import { apiAxios } from '@/utils/request'

export const ActivityGetApplicationsAPI = async (activity_id) => {
  return await apiAxios.get(`/activities/applications/${activity_id}`)
}
