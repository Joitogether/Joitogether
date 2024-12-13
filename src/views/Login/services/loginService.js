// 用戶驗證--登入、登出
import { auth } from '../../../utils/firebaseConfig.js'
import {
  signInWithEmailAndPassword,
  browserLocalPersistence,
  browserSessionPersistence,
  // signOut,
} from 'firebase/auth'
import { useUserStore } from '@/stores/userStore.js'
// import axios from 'axios'
// 登入
const loginUser = async (email, password, rememberMe) => {
  try {
    const userStore = useUserStore()
    // 根據是否記住我設置持久性
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence
    await auth.setPersistence(persistence)
    // console.log(`持久性已設置為: ${rememberMe ? '本地持久性' : '會話持久性'}`)

    // 使用 Firebase 驗證用戶登入
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    console.log('用戶登入成功：', user)

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
    console.error('用戶登入失敗：', error.message)
    console.error('完整錯誤物件：', error)

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

// 登出 -> 在 NavbarComponent.vue 已寫好登出邏輯
// 但未來如有重複登出的需求可用

// export const logoutUser = async () => {
//   try {
//     // 執行 Firebase 登出
//     await signOut(auth)
//     console.log('登出成功')
//     return { success: true, message: '👋 已成功登出！期待下次見面喔！🌟' } // 返回正確的成功訊息
//   } catch (error) {
//     console.error('登出失敗：', error)
//     return { success: false, message: '😵 登出失敗了！稍後再試一次吧 💔' } // 返回失敗訊息
//   }
// }
