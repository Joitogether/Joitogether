// 用戶驗證--登入、登出
import { auth } from './firebaseConfig.js'
import { signInWithEmailAndPassword } from 'firebase/auth'

const loginUser = async (email, password) => {
  try {
    // 問題排查
    // console.log('用戶嘗試登入：', email, password)
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    if (!user.emailVerified) {
      throw {
        success: false,
        message: '😵‍💫 這個帳號還沒被驗證哦！請前往信箱進行驗證！📧',
      }
    }
    return {
      success: true,
      message: '🎉 登入成功！歡迎回來！✨',
      user,
    }
  } catch (error) {
    console.log('用戶登入失敗：', error.message)
    console.log('完整錯誤物件：', error)

    let errorMessage = '登入失敗！好像出了點問題 😅'

    if (error.code === 'auth/invalid-credential') {
      errorMessage = '😭 帳號或密碼不對哦！請再試一次！🔐'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = '✉️ 信箱格式不對哦！請再確認一下！🔍'
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = '😵 為了保護您的帳號安全，請稍後再試一次！🚫'
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = '😵‍💫 這個帳號已被停用，請聯絡管理員！'
    } else if (error.message === '😵‍💫 這個帳號還沒被驗證哦！請前往信箱進行驗證！📧') {
      errorMessage = error.message
    } else {
      console.error('未識別的錯誤代碼：', error.code)
    }

    throw {
      success: false,
      message: errorMessage,
    }
  }
}

export default loginUser
