import { apiAxios } from '@/utils/request.js'

export const userRegisterAPI = async (data) => {
  try {
    const response = await apiAxios.post('/users/register', data)
    if (response.status >= 200 && response.status < 300) {
      console.log('註冊資料後端傳送成功', response.data)
      return response
    } else {
      console.log('註冊資料後端傳送失敗', response)
      throw new Error(`註冊資料後端回應失敗，狀態碼：${response.status}`)
    }
  } catch (error) {
    console.error('註冊資料 API 呼叫失敗：', error.message)
    throw error
  }
}

export const userUpdateEmailVerifiedAPI = async (uid, data) => {
  try {
    const response = await apiAxios.put(`users/update/${uid}`, data)
    if (response.status >= 200 && response.status < 300) {
      console.log('更新信箱認證成功', response.data)
      return response
    } else {
      console.log('更新信箱認證失敗', response)
      throw new Error(`更新信箱認證失敗，狀態碼：${response.status}`)
    }
  } catch (error) {
    console.error('更新信箱認證 API 呼叫失敗：', error.message)
    throw error
  }
}

export const userAuthLoginAPI = async (data) => {
  try {
    const response = await apiAxios.post('/users/register', data)
    if (response.status >= 200 && response.status < 300) {
      console.log('第三方登入資料後端傳送成功', response.data)
      return response
    } else {
      console.log('第三方登入資料後端傳送失敗', response)
      throw new Error(`第三方登入資料後端回應失敗，狀態碼：${response.status}`)
    }
  } catch (error) {
    if (error.response?.status === 409) {
      // 特殊處理 409 錯誤，返回結構化數據
      console.log('用戶已存在 (409)，處理登入流程')
      return {
        status: 409,
        message: '用戶已存在，繼續登入流程',
        data: null,
      }
    }

    console.error('第三方登入資料 API 呼叫失敗：', error.message)
    throw error
  }
}

export const UserGetApi = async (uid) => {
  try {
    const response = await apiAxios.get(`/users/${uid}`)

    if (response && response.status === 200) {
      return response.data.data
    }
  } catch (err) {
    return err.response.message
  }
}

export const UserGetFollowerApi = async (uid) => {
  try {
    const response = await apiAxios.get(`/users/userFollowers/${uid}`);

    if (response && response.status === 200) {
      return response.data
    }
  } catch (err) {

    return err.response.message

  }
};

export const UserGetFollowingApi = async (uid) => {
  try {
    const response = await apiAxios.get(`/users/following/${uid}`);

    if (response && response.status === 200) {
      return response.data
    }
  } catch (err) {
    return err.response.message
  }
};

export const UserGetActivityApi = async (uid) => {
  try {
    const response = await apiAxios.get(`/users/applications/${uid}`);

    if (response && response.status === 200) {
      return response.data.data
    }
  } catch (err) {
    return err.response.message
  }
};


export const UserPutApi = async(uid, data) => {
  try {
    const response = await apiAxios.put(`/users/update/${uid}`, data)
    return response
  } catch (err) {
    return err.response.data
  }
}

export const UserPostApi = async (uid, data) => {
  try {
    return await apiAxios.post(`/users/register/${uid}`, data)
  } catch (err) {
    return err.response.data
  }
}

export const getPostsApi = async (uid) => {
  try {
    const response = await apiAxios.get(`/users/posts/${uid}`)
    return response.data
  } catch (error) {
    console.error('找不到文章', error)
    throw error
  }
}

export const getPostsCommentApi = async (post_id) => {
  try {
    const response = await apiAxios.get(`/posts/comments/${post_id}`)
    return response.data
  } catch (error) {
    console.error('沒有留言', error)
    throw error
  }
}

export const getPostsLikeApi = async (post_id) => {
  try {
    const response = await apiAxios.get(`/posts/likes/${post_id}`)
    return response.data
  } catch (error) {
    console.error('沒有人按讚', error)
    throw error
  }
}

export const getRatingsApi = async (user_id) => {
  try {
    const response = await apiAxios.get(`/ratings/userDetails/${user_id}`)
    return response.data
  } catch (error) {
    console.error('找不到留言者', error)
    throw error
  }
}
export const userGetNotificationAPI = async (uid, page, pageSize, additionalSkip) => {
  try {

    const { data } = await apiAxios.get(`/users/notifications/${uid}`, { params: {  page, pageSize, additionalSkip } })
    return data
  }catch(error){
    if(error){
      return null
    }
  }
}


export const userUpdateNotificationAPI = async (uid, unreadList) => {
  try{
    const response = await apiAxios.put(`/users/notifications/${uid}`, { unreadList})
    return response
  }catch(error){
    if(error){
      return null
    }
  }
}
