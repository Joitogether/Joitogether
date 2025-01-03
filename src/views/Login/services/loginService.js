// 用戶驗證--登入、登出
import { auth } from '../../../utils/firebaseConfig.js'
import {
  signInWithEmailAndPassword,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth'
import { useUserStore } from '@/stores/userStore.js'

// 登入
const loginUser = async (email, password, rememberMe) => {
  try {
    const userStore = useUserStore()
    // 根據是否記住我設置持久性
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence
    await auth.setPersistence(persistence)

    // 使用 Firebase 驗證用戶登入
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // 檢查是否驗證信箱
    if (!user.emailVerified) {
      throw {
        success: false,
        message: '😵‍💫 這個帳號還沒被驗證哦！請前往信箱進行驗證！📧',
      }
    }

    return {
      success: true,
      message: `🎉 登入成功 ${userStore.user.display_name || '使用者'}！✨`,
      user,
    }
  } catch (error) {
    let errorMessage = '登入失敗！好像出了點問題 😅'

    if (error.code === 'auth/invalid-credential') {
      errorMessage = '😭 帳號或密碼不對哦！請再試一次！🔐'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = '✉️ 信箱格式不對哦！請再確認一下！🔍'
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = '😵 為了保護您的帳號安全，請稍後再試一次！🚫'
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = '😵‍💫 這個帳號已被停用，請聯絡管理員！'
    } else {
      errorMessage
    }

    throw {
      success: false,
      message: errorMessage,
      code: error.code,
    }
  }
}

export default loginUser
