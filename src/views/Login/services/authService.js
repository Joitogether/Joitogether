// services/authService.js
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'

const auth = getAuth()

// google
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    console.log('Google 登入成功：', user)
    return user
  } catch (error) {
    console.error('Google 登入失敗：', error.message)
    throw new Error(error.message)
  }
}

// facebook
export async function loginWithFacebook() {
  const provider = new FacebookAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    console.log('Facebook 登入成功：', user)
    return user
  } catch (error) {
    console.error('Facebook 登入失敗：', error.message)
    throw new Error(error.message)
  }
}
