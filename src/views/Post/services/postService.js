import { createPost } from '../../../apis/postAPIs'

// 測試新增文章
export const submitPost = async (postData) => {
  try {
    const response = await createPost(postData)
    console.log('文章創建成功')
    console.log('傳送至後端的資料：', postData)
  } catch (error) {
    console.error('新增文章失敗:', error.response?.data || error.message)
    throw error
  }
}
