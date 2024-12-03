import { apiAxios } from '../utils/request'

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

export const UserPutApi = async (uid, data) => {
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
