import { apiAxios } from "@/utils/request";

export const activityCancelRegisterAPI = async (activityId, participant_id) => {
  try{
    return await apiAxios.put(`/applications/cancel/${activityId}`, { participant_id })
  }catch(err){
    return err.response.data
  }
}

export const activityRegisterAPI = async (activity_id ,data) => {
  try{
    return await apiAxios.post(`/applications/register/${activity_id}`, data)
  }catch(err){
    return err.response.data
  }
}

export const activityGetDetailAPI = async (activityId) => {
  try{
    const response = await apiAxios.get(`/activities/${activityId}`)
    if(response && response.status === 200) {
        return response.data.data
      }
    }catch(err){
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

export const activityNewCommentAPI = async (activity_id, data) => {
  try{
    return await apiAxios.post(`/activities/comment/${activity_id}`, data)
  }catch (err) {
    return err.response.data
  }
}

export const activityDeleteCommentAPI = async (comment_id) => {
  try{
    return await apiAxios.delete(`/activities/comment/${comment_id}`)
  }catch (err) {
    return err.response.data
  }
}