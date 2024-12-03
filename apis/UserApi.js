import axios from 'axios'

export const UserGetApi = async (uid) => {
  try {
    const response = await axios.get(`http://localhost:3030/users/${uid}`)

    if (response && response.status === 200) {
      return response.data.data
    }
  } catch (err) {
    return err.response.message
  }
}

export const UserPutApi = async (uid, data) => {
  try {
    const response = await axios.put(`http://localhost:3030/users/update/${uid}`, data)
    if (response.data.status === 220) {
      console.log('更新成功：', response.data)
      return { success: true, data: response.data }
    } else {
      console.log('更新失敗：', response.data)
      return { success: false, error: response.data.message }
    }
  } catch (err) {
    console.error('更新失敗：', err.message)
    return { success: false, error: err.message }
  }
}

export const UserPostApi = async (uid, data) => {
  try {
    return await axios.post(`http://localhost:3030/users/register/${uid}`, data)
  } catch (err) {
    return err.response.data
  }
}
