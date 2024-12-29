import { apiAxios } from '@/utils/request'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import DefaultImage from '@/assets/UserUpdata1.jpg'

export const activityCancelRegisterAPI = async (activityId, participant_id) => {
  try {
    return await apiAxios.put(`/applications/cancel/${activityId}`, { participant_id })
  } catch {
    return null
  }
}

export const activityRegisterAPI = async (activity_id, data) => {
  try {
    return await apiAxios.post(`/applications/register/${activity_id}`, data)
  } catch {
    return null
  }
}

export const activityGetDetailAPI = async (activityId) => {
  try {
    const response = await apiAxios.get(`/activities/${activityId}`)
    return response.data.data
  } catch {
    return null
  }
}

export const activityCancelAPI = async (activityId) => {
  try {
    return await apiAxios.put(`/activities/cancel/${activityId}`)
  } catch {
    return null
  }
}

// export const activityGetAPI = async () => {
//   try {
//     const response = await apiAxios.get(`/activities`)
//     return response.data.data
//   } catch {
//     return null
//   }
// }

export const activityNewCommentAPI = async (activity_id, data) => {
  try {
    return await apiAxios.post(`/activities/comment/${activity_id}`, data)
  } catch {
    return null
  }
}

export const activityDeleteCommentAPI = async (comment_id) => {
  try {
    return await apiAxios.delete(`/activities/comment/${comment_id}`)
  } catch {
    return null
  }
}

export const ActivityGetApplicationsAPI = async (activity_id, defaultAvatar) => {
  try {
    const response = await apiAxios.get(`/applications/${activity_id}`)
    return response.data.data.map((item) => ({
      id: item.application_id,
      name: item.participant_info.full_name,
      avatar: item.participant_info.photo_url || defaultAvatar,
      number: `@${item.participant_id}`,
      message: item.comment || '這位參加者尚無留言',
      date: new Date().toLocaleDateString(),
      approved: item.status === 'approved',
      host_declined: item.status === 'host_declined',
      registered: item.status === 'registered',
      participant_cancelled: item.status === 'participant_cancelled',
      replies: '',
    }))
  } catch {
    return null
  }
}

// 用來抓host_id判斷的API
export const ActivityGetActivitiesAPI = async (activity_id) => {
  try {
    return await apiAxios.get(`/activities/${activity_id}`)
  } catch {
    return null
  }
}

export const ActivityReviewApplicationsAPI = async (application_id, status) => {
  try {
    const response = await apiAxios.put(
      `/applications/verify/${application_id}`,
      { status },
      { headers: { 'Content-Type': 'application/json' } },
    )
    return response
  } catch {
    return null
  }
}

export const activityGetAllAPI = async () => {
  try {
    const response = await apiAxios.get(`/activities/`)
    return response.data
  } catch {
    return null
  }
}

// export const activityGetUsersAPI = async () => {
//   try {
//     const response = await apiAxios.get(`/users/`)
//     return response.data
//   } catch {
//     return null
//   }
// }

export const activityUserCreateAPI = async (file, otherData) => {
  try {
    const storage = getStorage()
    let imgUrl

    if (file) {
      const filePath = `activities/${Date.now()}_${file.name}` // 設定文件路徑
      const fileRef = storageRef(storage, filePath) // 建立文件參考

      // 上傳文件至 Firebase Storage
      const snapshot = await uploadBytes(fileRef, file)

      // 獲取下載 URL
      imgUrl = await getDownloadURL(snapshot.ref)
      console.log('下載的 URL:', imgUrl)
    } else {
      // 如果沒有上傳文件，使用預設圖片的 URL
      imgUrl = DefaultImage
    }
    // 組合發送的資料
    const activityData = {
      img_url: imgUrl,
      ...otherData, // 包含其他活動資訊
    }
    // 將資料發送到後端
    const response = await apiAxios.post('/activities', activityData)
    return response.data // 返回成功響應
  } catch {
    return null
  }
}

export const activityAutocompleteAPI = async (query) => {
  try {
    return await apiAxios.post('/activities/autocomplete', { query })
  } catch {
    return null
  }
}

export const activityGeocodeAPI = async (address) => {
  try {
    return await apiAxios.post('/activities/geocode', { address })
  } catch {
    return null
  }
}

export const activitySearchAPI = async (keyword) => {
  try {
    const response = await apiAxios.post('/activities/search', {
      keyword,
    })
    return response.data.data
  } catch {
    return null
  }
}

export const activityCategoryAPI = async (type, data) => {
  try {
    const response = await apiAxios.post(`/activities/category/${type}`, data)
    return response.data
  } catch {
    return null
  }
}
