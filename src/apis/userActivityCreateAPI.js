import { apiAxios } from "@/utils/request"


export const userActivityCreateAPI = async (data) => {
try {
  const response = await apiAxios.post('/activities',data)
  if(response.status >=200 && response.status < 300){
  console.log('活動資料送出成功:',response.data)
  return response.data;
  }
} catch(err){
  console.error('活動資料失敗:',err.message)
  throw err;
}
};
