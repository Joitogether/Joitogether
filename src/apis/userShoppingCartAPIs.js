import { apiAxios } from '@/utils/request'

export const getUserCartDetailsAPI = async (userId) => {
  try {
    // 呼叫購物車 API，帶入使用者 ID
    const response = await apiAxios.get(`/carts/${userId}`)
    // 檢查回傳結果
    if (response.data && response.data.status === 200) {
      const cartItems = response.data.data.cartItems
      // 將 cartItems 解析，取出活動所需資訊
      const result = cartItems.map((item) => {
        return {
          activityId: item.activity_id,
          activityName: item.activities.name,
          location: item.activities.location,
          eventTime: item.activities.event_time,
          price: item.activities.price,
          image: item.activities.img_url,
        }
      })

      return result
    } else {
      throw new Error('獲取購物車資料失敗')
    }
  } catch (error) {
    console.error('API 錯誤:', error.message)
    throw error
  }
}

export const deleteUserCartDetailsAPI = async (userId, activityId) => {
  try {
    return await apiAxios.delete(`/carts/${userId}/${activityId}`)
  } catch (err) {
    return err.response
  }
}
