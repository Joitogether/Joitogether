// services/authService.js
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
} from 'firebase/auth'
import { userAuthLoginAPI } from '@/apis/userAPIs'
import router from '@/router'
import { handleError } from '@/utils/handleError.js'
import { useMessage } from 'naive-ui'

const message = useMessage()
const auth = getAuth()

async function loginWithProvider(provider) {
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    // 結合用戶資料，準備回傳給後端
    const userData = {
      uid: user.uid,
      email: user.email,
      email_verified: user.emailVerified,
      full_name: user.displayName || '使用者',
      display_name: user.displayName,
      phone_number: '0912345678',
      photo_url: user.photoURL,
    }

    // 傳送資料到後端
    const backendResponse = await userAuthLoginAPI(userData)
    backToIndex()

    // 返回後端處理結果
    return backendResponse.data
  } catch (error) {
    handleError(message, undefined, error)

    // 若後端失敗則執行登出
    await signOut(auth)

    // const errorMessage = handleAuthError(error)
    // throw new Error(errorMessage)
  }
}

const backToIndex = () => {
  router.push('/')
}
// function handleAuthError(error) {
//   let errorMessage = '發生未知錯誤，請稍後再試。'

//   if (error.code === 'auth/account-exists-with-different-credential') {
//     errorMessage = '此帳戶已使用其他登入方式註冊囉'
//   } else if (error.code === 'auth/popup-closed-by-user') {
//     errorMessage = '使用者關閉了登入彈窗，請重新嘗試。'
//   } else if (error.code === 'auth/network-request-failed') {
//     errorMessage = '網路請求失敗，請檢查網路連線。'
//   } else {
//     handleError(message, undefined, error)
//   }
//   return errorMessage
// }

export function loginWithGoogle() {
  const provider = new GoogleAuthProvider()
  return loginWithProvider(provider)
}

export function loginWithFacebook() {
  const provider = new FacebookAuthProvider()
  return loginWithProvider(provider)
}
