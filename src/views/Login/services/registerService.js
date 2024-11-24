// 註冊功能
import { auth } from './firebaseConfig.js'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'

const registerUser = async (email, password) => {
  try {
    // 註冊用戶
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // 設定驗證信的跳轉連結
    const actionCodeSettings = {
      url: `${window.location.origin}/signup-success`, // 前面那段是localhost
      handleCodeInApp: true,
    }

    // 發送驗證信件
    await sendEmailVerification(user, actionCodeSettings)
    console.log('驗證信已發送 📧', user)

    return {
      success: true,
      message: '註冊成功，驗證信已發送至您的信箱！',
      user,
    }
  } catch (error) {
    console.log('用戶註冊失敗：' + error.message)
    throw {
      success: false,
      message: error.message,
    }
  }
}

export default registerUser
