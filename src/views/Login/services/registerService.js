// 用戶驗證--註冊、上傳大頭照
// import { error } from 'naive-ui/es/_utils/naive/warn.js'
import { auth } from './firebaseConfig.js'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    // 註冊成功，返回用戶資料
    return userCredential.user
  } catch (error) {
    // 錯誤處理
    console.error('用戶在註冊時失敗:', error)
    throw error
  }
}

export default registerUser
