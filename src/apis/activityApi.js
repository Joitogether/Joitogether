import { apiAxios } from '@/utils/request'

export const ActivityGetApplicationsAPI = async (activity_id, defaultAvatar) => {
  try {
    const response = await apiAxios.get(`/applications/${activity_id}`)
    if (response.status === 200) {
      return response.data.data.map((item) => ({
        id: item.application_id,
        name: item.participant_info.full_name,
        avatar: item.participant_info.photo_url || defaultAvatar,
        number: `@${item.participant_id}` || '未提供 ID',
        message: item.comment || '這位參加者尚無留言',
        date: new Date().toLocaleDateString(),
        approved: item.status === 'approved',
        host_declined: item.status === 'host_declined',
        registered: item.status === 'registered',
        participant_cancelled: item.status === 'participant_cancelled',
        replies: '',
      }))
    } else {
      console.error('拉取參加者資料失敗:', response.data)
      return []
    }
  } catch (error) {
    console.error('數據刷新失敗:', error)
    return []
  }
}

// 用來抓host_id判斷的API
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
