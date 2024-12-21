import { apiAxios } from '@/utils/request'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import DefaultImage from '@/assets/UserUpdata1.jpg'


export const activityCancelRegisterAPI = async (activityId, participant_id) => {
  try {
    return await apiAxios.put(`/applications/cancel/${activityId}`, { participant_id })
  } catch (err) {
    return err.response.data
  }
}

export const activityRegisterAPI = async (activity_id, data) => {
  try {
    return await apiAxios.post(`/applications/register/${activity_id}`, data)
  } catch (err) {
    return err.response.data
  }
}

export const activityGetDetailAPI = async (activityId) => {
  try {
    const response = await apiAxios.get(`/activities/${activityId}`)
    if (response && response.status === 200) {
      return response.data.data
    }
  } catch{
    //沒抓到
    return null
  }
}

export const activityCancelAPI = async (activityId) => {
  try {
    return await apiAxios.put(`/activities/cancel/${activityId}`)
  } catch (err) {
    return err.response.data
  }
}

export const activityGetAPI = async () => {
  try {
    const response = await apiAxios.get(`/activities`)
    if (response && response.status === 200) {
      return response.data.data
    }
  } catch {
    //沒抓到
    return null
  }
}

export const activityNewCommentAPI = async (activity_id, data) => {
  try {
    return await apiAxios.post(`/activities/comment/${activity_id}`, data)
  } catch (err) {
    return err.response.data
  }
}



export const activityDeleteCommentAPI = async (comment_id) => {
  try {
    return await apiAxios.delete(`/activities/comment/${comment_id}`)
  } catch (err) {
    return err.response.data
  }
}

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
      { status },
      { headers: { 'Content-Type': 'application/json' } },
    )
    return res
  } catch (err) {
    console.error('審核失敗:', err.response?.data || err.message)
    throw err
  }
}


export const activityGetAllAPI = async () => {
  try{
    const response =  await apiAxios.get(`/activities/`)
    if(response && response.status === 200) {
        return response.data
      }
  }catch(err){
    return err.response.data
  }
}


export const activityGetUsersAPI = async () => {
  try{
    const response =  await apiAxios.get(`/users/`)
    if(response && response.status === 200) {
        return response.data
      }
  }catch(err){
    return err.response.data
  }
}


export const activityUserCreateAPI = async (file, otherData) => {
  try {
    const storage = getStorage();
    let imgUrl;

    if (file) {
      const filePath = `activities/${Date.now()}_${file.name}`; // 設定文件路徑
      const fileRef = storageRef(storage, filePath); // 創建文件參考

      // 上傳文件至 Firebase Storage
      const snapshot = await uploadBytes(fileRef, file);

      // 獲取下載 URL
      imgUrl = await getDownloadURL(snapshot.ref);
      console.log('下載的 URL:', imgUrl);
    } else {
      // 如果沒有上傳文件，使用預設圖片的 URL
      imgUrl = DefaultImage;
    }
    // 組合發送的資料
    const activityData = {
      img_url: imgUrl,
      ...otherData, // 包含其他活動資訊
    };
    console.log('活動資料:', activityData);
    // 將資料發送到後端
    const response = await apiAxios.post('/activities', activityData);
    if (response.status >= 200 && response.status < 300) {
      console.log('活動資料送出成功:', response.data);
      return response.data; // 返回成功響應
    }
  } catch (error) {
    console.error('上傳或資料發送失敗:', error);
    throw error; // 重新拋出錯誤以便處理
  }
};



