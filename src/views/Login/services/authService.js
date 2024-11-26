// services/authService.js
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'

const auth = getAuth()

async function loginWithProvider(provider) {
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    console.log(`${provider.providerId} 登入成功：`, user)
    return user
  } catch (error) {
    console.error(`${provider.providerId} 登入失敗：`, error.code, error.message)
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
