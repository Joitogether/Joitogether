import { apiAxios } from '@/utils/request'
import axios from 'axios'
export const HomePostGetUsersAPI = async () => {
  return await axios.get('/post')
}
