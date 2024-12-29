import { apiAxios } from '@/utils/request.js'

export const userRegisterAPI = async (data) => {
  try {
    const response = await apiAxios.post('/users/register', data)
    return response
  } catch {
    return null
  }
}

export const userUpdateEmailVerifiedAPI = async (uid, data) => {
  try {
    const response = await apiAxios.put(`users/update/${uid}`, data)
    return response
  } catch {
    return null
  }
}

export const userAuthLoginAPI = async (data) => {
  try {
    const response = await apiAxios.post('/users/register', data)

    return response
  } catch (error) {
    // 特殊處理 409 錯誤
    if (error.response?.status === 409) {
      return {
        status: 409,
        message: '用戶已存在，繼續登入流程',
        data: null,
      }
    }

    throw null
  }
}

export const userGetAPI = async (uid) => {
  try {
    const response = await apiAxios.get(`/users/${uid}`)
    return response.data.data
  } catch {
    return null
  }
}

export const userGetFollowerAPI = async (uid) => {
  try {
    const response = await apiAxios.get(`/users/userFollowers/${uid}`)
    return response.data
  } catch {
    return null
  }
}

export const userGetFollowingAPI = async (uid) => {
  try {
    const response = await apiAxios.get(`/users/following/${uid}`)
    return response.data
  } catch {
    return null
  }
}

export const userGetActivityAPI = async (uid) => {
  try {
    const response = await apiAxios.get(`/users/applications/${uid}`)
    return response.data.data
  } catch {
    return null
  }
}

export const userPutAPI = async (uid, data) => {
  try {
    const response = await apiAxios.put(`/users/update/${uid}`, data)
    return response
  } catch {
    return null
  }
}

export const userPostAPI = async (uid, data) => {
  try {
    return await apiAxios.post(`/users/register/${uid}`, data)
  } catch {
    return null
  }
}

export const getPostsAPI = async (uid) => {
  try {
    const response = await apiAxios.get(`/users/posts/${uid}`)
    return response.data
  } catch {
    return null
  }
}

export const getRatingsAPI = async (user_id) => {
  try {
    const response = await apiAxios.get(`/ratings/userDetails/${user_id}`)
    return response.data
  } catch {
    return null
  }
}
export const userGetNotificationAPI = async (uid, page, pageSize, additionalSkip) => {
  try {
    const { data } = await apiAxios.get(`/users/notifications/${uid}`, {
      params: { page, pageSize, additionalSkip },
    })
    return data
  } catch (error) {
    if (error) {
      return null
    }
  }
}

export const userUpdateNotificationAPI = async (uid, unreadList) => {
  try {
    const response = await apiAxios.put(`/users/notifications/${uid}`, { unreadList })
    return response
  } catch (error) {
    if (error) {
      return null
    }
  }
}
