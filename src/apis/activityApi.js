import { apiAxios } from '@/utils/request'

export const ActivityGetApplicationsAPI = async (activity_id) => {
  // return await apiAxios.get(`/activities/applications/${activity_id}`)
  return await apiAxios.get(`/applications/${activity_id}`)
}

// export const ActivityReviewApplicationsAPI = async (application_id, status) => {
//   try {
//     const res = await apiAxios.put(`/applications/verify/${application_id}`, {
//       status, // 傳送 status
//     })
//     return res // 返回伺服器回應
//   } catch (err) {
//     // 捕捉錯誤訊息
//     if (err.response) {
//       console.log('Error Response Data:', err.response.data) // 錯誤內容
//       console.log('Error Status:', err.response.status) // HTTP 狀態碼
//     } else {
//       console.log('Error:', err.message)
//     }
//   }
// }

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
