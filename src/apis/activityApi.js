import { apiAxios } from '@/utils/request'

export const ActivityGetApplicationsAPI = async (activity_id) => {
  // return await apiAxios.get(`/activities/applications/${activity_id}`)
  return await apiAxios.get(`/applications/${activity_id}`)
}
// 這支是新增的
export const ActivityGetActivitiesAPI = async (activity_id) => {
  return await apiAxios.get(`/activities/${activity_id}`)
}

export const ActivityReviewApplicationsAPI = async (application_id, status) => {
  try {
    const res = await apiAxios.put(
      `/applications/verify/${application_id}`,
      { status }, // 傳遞 status 作為請求數據
      { headers: { 'Content-Type': 'application/json' } }, // 確保正確的 header
    )
    return res // 返回伺服器回應
  } catch (err) {
    console.error('審核失敗:', err.response?.data || err.message)
    throw err // 把錯誤丟出去，方便捕捉
  }
}
