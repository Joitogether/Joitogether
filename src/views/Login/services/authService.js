// services/authService.js
import axios from 'axios'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
} from 'firebase/auth'

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
      full_name: user.displayName,
      display_name: user.displayName,
      phone_number: null,
      photo_url: user.photoURL,
      created_at: new Date(),
    }

    // 傳送資料到後端
    const backendResponse = await axios.post('http://localhost:3030/users/register', userData)
    console.log('後端回應：', backendResponse.data)

    // 返回後端處理結果
    return backendResponse.data
  } catch (error) {
    console.error(`${provider.providerId} 登入失敗：`, error.code, error.message)

    // 若後端失敗則執行登出
    await signOut(auth)
    console.log('後端失敗，執行登出')

    throw new Error(`登入失敗 (${error.code}): ${error.message}`)
  }
}

export function loginWithGoogle() {
  const provider = new GoogleAuthProvider()
  return loginWithProvider(provider)
}

export function loginWithFacebook() {
  const provider = new FacebookAuthProvider()
  return loginWithProvider(provider)
}
