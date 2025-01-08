import { apiAxios } from '@/utils/request'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import DefaultImage from '../assets/UserUpdata1.jpg'

export const activityCancelRegisterAPI = async (activityId, participant_id) => {
  return await apiAxios.put(`/applications/cancel/${activityId}`, { participant_id })
}

export const activityRegisterAPI = async (activity_id, data) => {
  return await apiAxios.post(`/applications/register/${activity_id}`, data)
}

export const activityGetDetailAPI = async (activityId) => {
  const { data } = await apiAxios.get(`/activities/${activityId}`)
  return data.data
}

export const activityCancelAPI = async (activityId) => {
  return await apiAxios.put(`/activities/cancel/${activityId}`)
}

export const activityNewCommentAPI = async (activity_id, data) => {
  return await apiAxios.post(`/activities/comment/${activity_id}`, data)
}

export const activityDeleteCommentAPI = async (comment_id) => {
  return await apiAxios.delete(`/activities/comment/${comment_id}`)
}

export const ActivityGetApplicationsAPI = async (activity_id) => {
  try {
    const response = await apiAxios.get(`/applications/${activity_id}`)
    return response.data.data
  } catch {
    return null
  }
}

// 用來抓host_id判斷的API
export const ActivityGetActivitiesAPI = async (activity_id) => {
  return await apiAxios.get(`/activities/${activity_id}`)
}

export const ActivityReviewApplicationsAPI = async (application_id, data) => {
  return await apiAxios.put(`/applications/verify/${application_id}`, data)
}

export const activityUserCreateAPI = async (file, otherData) => {
  const storage = getStorage()
  let imgUrl

  if (file) {
    const filePath = `activities/${Date.now()}_${file.name}`
    const fileRef = storageRef(storage, filePath)

    // 上傳文件至 Firebase Storage
    const snapshot = await uploadBytes(fileRef, file)

    // 獲取下載 URL
    imgUrl = await getDownloadURL(snapshot.ref)
  } else {
    // 如果沒有上傳文件，使用預設圖片的 URL
    imgUrl = DefaultImage
  }
  // 組合發送的資料
  const activityData = {
    img_url: imgUrl,
    ...otherData,
  }
  // 將資料發送到後端
  const { data } = await apiAxios.post('/activities', activityData)
  return data
}

export const activityAutocompleteAPI = async (query) => {
  return await apiAxios.post('/activities/autocomplete', { query })
}

export const activityGeocodeAPI = async (address) => {
  return await apiAxios.post('/activities/geocode', { address })
}

export const activityGetAllAndSearchAPI = async (params) => {
  // 處理URL 字串查詢
  const query = new URLSearchParams(params).toString()
  const { data } = await apiAxios.get(`/activities?${query}`)
  return data
}

export const activityAddToCartAPI = async (userId, activityId) => {
  await apiAxios.post(`/carts/${userId}`, {
    activityId,
  })
}
