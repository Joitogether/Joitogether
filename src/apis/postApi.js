import { apiAxios } from '@/utils/request'

// export const HomePostGetUserAPI = async () => {
//   try {
//     const response = await apiAxios.get('/posts')
//     if (response && response.status === 200) {
//       console.log('成功獲取資料', response.data.data)
//       return response.data
//     }
//   } catch (err) {
//     return null
//   }
// }

export const HomePostGetPostAuthorAPI = async () => {
  try {
    const response = await apiAxios.get('/posts')
    if (response && response.status === 200) {
      console.log('成功', response.data.data)
      return response.data
      // return response.data.map((item) => ({
      //   post_id: item.post_id,
      //   post_title: item.post_title,
      //   post_content: item.post_content,
      //   uid: item.uid,
      //   created_at: item.created_at,
      //   post_img: item.post_img,
      // }))
    } else {
      return console.log('失敗')
    }
  } catch (err) {
    return null
  }
}
