import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { apiAxios } from "@/utils/request"
import DefaultImage from '@/assets/UserUpdata1.jpg'


export const userActivityCreateAPI = async (file, otherData) => {
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





// export const userActivityCreateAPI = async (data) => {
// try {
//   const response = await apiAxios.post('/activities',data)
//   if(response.status >=200 && response.status < 300){
//   console.log('活動資料送出成功:',response.data)
//   return response.data;
//   }
// } catch(err){
//   console.error('活動資料失敗:',err.message)
//   throw err;
// }
// };
