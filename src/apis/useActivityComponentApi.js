import { apiAxios } from "@/utils/request"

export const ActivityComponentApi = async () => {
  try{
    const response =  await apiAxios.get(`/activities/`)
    if(response && response.status === 200) {
        return response.data
      }
  }catch(err){
    return err.response.data
  }
}


export const ActivityUseApi = async () => {
  try{
    const response =  await apiAxios.get(`/users/`)
    if(response && response.status === 200) {
        return response.data
      }
  }catch(err){
    return err.response.data
  }
}
