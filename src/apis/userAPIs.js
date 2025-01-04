import { apiAxios } from '@/utils/request.js'

export const userRegisterAPI = async (data) => {
  return await apiAxios.post('/users/register', data)
}

export const userUpdateEmailVerifiedAPI = async (uid, data) => {
  return await apiAxios.put(`users/update/${uid}`, data)
}

export const userAuthLoginAPI = async (data) => {
  try {
    const response = await apiAxios.post('/users/register', data)
    return response
  } catch (error) {
    if (error.response?.status === 409) {
      return {
        status: 409,
        message: '用戶已存在，繼續登入流程',
        data: null,
      }
    }

    return null
  }
}

export const userGetAPI = async (uid) => {
  const { data } = await apiAxios.get(`/users/${uid}`)
  return data.data
}

export const userGetFollowerAPI = async (uid) => {
  const { data } = await apiAxios.get(`/users/userFollowers/${uid}`)
  return data.data
}

export const userGetFollowingAPI = async (uid) => {
  const { data } = await apiAxios.get(`/users/following/${uid}`)
  return data.data
}

export const userFollowersAddAPI = async (data) => {
  return await apiAxios.post('/users/follow', data)
}

export const userUnfollowersAPI = async (id) => {
  return await apiAxios.post(`/users/unfollow/${id}`)
}

export const userGetActivityAPI = async (uid) => {
  const { data } = await apiAxios.get(`/users/applications/${uid}`)
  return data.data
}

export const userPutAPI = async (uid, data) => {
  return await apiAxios.put(`/users/update/${uid}`, data)
}

export const userPostAPI = async (uid, data) => {
  return await apiAxios.post(`/users/register/${uid}`, data)
}

export const getPostsAPI = async (uid) => {
  const { data } = await apiAxios.get(`/users/posts/${uid}`)
  return data
}

export const getRatingsAPI = async (host_id) => {
  const { data } = await apiAxios.get(`/ratings/hostDetails/${host_id}`)
  return data
}
export const userGetNotificationAPI = async (uid, page, pageSize, additionalSkip) => {
  const { data } = await apiAxios.get(`/users/notifications/${uid}`, {
    params: { page, pageSize, additionalSkip },
  })
  return data
}

export const userUpdateNotificationAPI = async (uid, unreadList) => {
  return await apiAxios.put(`/users/notifications/${uid}`, { unreadList })
}

export const getUserSummaryAPI = async (uid) => {
  const { data } = await apiAxios.get(`/users/summary/${uid}`)
  return data.data
}
