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
