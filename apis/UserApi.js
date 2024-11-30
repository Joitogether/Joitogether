import axios from "axios";
import { ref } from "vue";


const user = ref([])

export const UserGetApi = async (uid) => {
  try {
    const response = await axios.get(`http://localhost:3030/users/${uid}`);

    if (response.data.status === 200) {
      user.value = response.data.data;
      return { success: true, data: user.value };
    } else {
      console.error('API 返回錯誤：', response.data.message);
      return { success: false, error: response.data.message };
    }
  } catch (error) {
    console.error('獲取使用者資料失敗：', error.message);
    return { success: false, error: error.message };
  }
};

export const UserPutApi = async(uid, data) => {
  try {
  const response = await axios.put(`http://localhost:3030/users/${uid}`, data)
  if (response.data.status === 220) {
  console.log('更新成功：', response.data);
  return { success: true, data: response.data };
} else {
    console.log('更新失敗：', response.data);
    return { success: false, error: response.data.message };
  }
  } catch (err) {
    console.error('更新失敗：', err.message);
    return { success: false, error: err.message };
  }

}


export const UserPostApi = async(data) => {
  try {
    const response = await axios.post('http://localhost:3030/users', data);
    if (response.data.status === 230) {
      console.log('新增成功：', response.data);
      return { success: true, data: response.data };
  } else {
    console.log('新增失敗：', response.data);
    return { success: false, error: response.data.message };
  }
  } catch (error) {
    console.error('發送 POST 請求失敗：', error.message);
    return { success: false, error: error.message };
  }
}
