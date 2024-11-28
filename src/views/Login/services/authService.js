// services/authService.js
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
} from 'firebase/auth'
import { userAuthLoginAPI } from '@/apis/userAPIs'

const auth = getAuth()

async function loginWithProvider(provider) {
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    console.log(`${provider.providerId} 登入成功：`, user)

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
    console.log(userData)

    // 傳送資料到後端
    const backendResponse = await userAuthLoginAPI(userData)
    // console.log('第三方登入資料已傳送到後端：', backendResponse)

    // 返回後端處理結果
    return backendResponse.data
  } catch (error) {
    console.error(`${provider.providerId} 登入失敗：`, error.code, error.message)

    // 若後端失敗則執行登出
    await signOut(auth)
    console.log('後端失敗，執行登出')

    const errorMessage = handleAuthError(error)
    throw new Error(errorMessage)
  }
}
function handleAuthError(error) {
  let errorMessage = '發生未知錯誤，請稍後再試。'

  if (error.code === 'auth/account-exists-with-different-credential') {
    console.warn('該帳號已使用其他方式註冊')
    errorMessage = '此帳戶已使用其他登入方式註冊囉'
  } else if (error.code === 'auth/popup-closed-by-user') {
    console.warn('使用者關閉了登入彈窗')
    errorMessage = '使用者關閉了登入彈窗，請重新嘗試。'
  } else if (error.code === 'auth/network-request-failed') {
    console.warn('網路請求失敗')
    errorMessage = '網路請求失敗，請檢查網路連線。'
  } else {
    console.error('未識別的錯誤代碼：', error.code)
  }
  return errorMessage
}

export function loginWithGoogle() {
  const provider = new GoogleAuthProvider()
  return loginWithProvider(provider)
}

export function loginWithFacebook() {
  const provider = new FacebookAuthProvider()
  return loginWithProvider(provider)
}
