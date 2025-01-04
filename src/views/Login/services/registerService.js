import { auth } from '../../../utils/firebaseConfig.js'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'
import { userRegisterAPI } from '@/apis/userAPIs.js'

const registerUser = async ({ email, password, fullName, displayName, phoneNumber, photoURL }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await updateProfile(user, {
      displayName: displayName,
      photoURL,
    })

    const userData = {
      uid: user.uid,
      email: user.email,
      email_verified: false,
      full_name: fullName,
      display_name: displayName,
      phone_number: phoneNumber,
      photo_url: photoURL,
    }

    const backendResponse = await userRegisterAPI(userData)

    const actionCodeSettings = {
      url: `https://joitogether-production.up.railway.app/signup-success`,
      handleCodeInApp: true,
    }

    await sendEmailVerification(user, actionCodeSettings)

    return {
      success: true,
      message: '快去檢查信箱，完成驗證吧！📧',
      user,
      backendResponse: backendResponse.data,
    }
  } catch (error) {
    let errorMessage = '😵 註冊失敗了！稍後再試一次吧 💔'
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = '📧 這個信箱已被註冊了唷～試試其他的吧！💡'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = '✉️ 嗯…這個信箱格式不對哦！請再檢查一下吧～ 🔍'
    } else if (error.code === 'auth/weak-password') {
      errorMessage = '🔑 密碼太簡單了啦！至少6字符，還要有數字和字母喔～ 💪'
    }

    // 清理已建立的使用者帳戶 -> 測試時可以用，生產環境不要用
    // if (auth.currentUser) {
    //   await auth.currentUser.delete()
    // }

    throw {
      success: false,
      message: errorMessage,
      code: error.code,
    }
  }
}

export default registerUser
