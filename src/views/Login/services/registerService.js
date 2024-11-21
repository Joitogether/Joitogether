// 註冊功能
import { auth } from './firebaseConfig.js'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.log('用戶註冊失敗：' + error.message)
    throw error
  }
}

export default registerUser
