import { apiAxios } from '@/utils/request'

// 所有貼文
export const getAllPostsAPI = async () => {
  try {
    const response = await apiAxios.get('/posts')
    if (response && response.status === 200) {
      console.log('PostsAPI 請求成功:', response.data.data)
      return response.data.data
    } else {
      console.log('PostsAPI 返回非 200 狀態碼:', response.status)
      return
    }
  } catch (error) {
    console.error('PostsAPI 請求失敗:', error.message)
    return null
  }
}

// 所有使用者
export const getAllUsersAPI = async () => {
  try {
    const response = await apiAxios.get('/users')
    if (response && response.status === 200) {
      console.log('UsersAPI 請求成功:', response.data.data)
      return response.data.data
    } else {
      console.log('UsersAPI 返回非 200 狀態碼:', response.status)
      return
    }
  } catch (error) {
    console.error('UsersAPI 請求失敗:', error.message)
    return null
  }
}

// 所有按讚
export const getAllLikesAPI = async (post_id) => {
  try {
    const response = await apiAxios.get(`/posts/likes/${post_id}`)
    if (response && response.status === 200) {
      console.log('LikesAPI 請求成功:', response.data)
      return response.data
    } else {
      console.log('LikesAPI 返回非 200 狀態碼:', response.status)
      return
    }
  } catch (error) {
    console.error('LikesAPI 請求失敗:', error.message)
    return null
  }
}

// 所有留言
export const getAllCommentsAPI = async (post_id) => {
  try {
    const response = await apiAxios.get(`/posts/comments/${post_id}`)
    if (response && response.status === 200) {
      console.log('CommentsAPI 請求成功:', response.data.data)
      return response.data
    } else {
      console.log('CommentsAPI 返回非 200 狀態碼:', response.status)
      return
    }
  } catch (error) {
    console.error('CommentsAPI 請求失敗:', error.message)
    return null
  }
}
