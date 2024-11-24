// 註冊功能
import { auth } from './firebaseConfig.js'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'

const registerUser = async (email, password, username) => {
  try {
    // 註冊用戶
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // 更新 displayName
    await updateProfile(user, {
      displayName: username, // 設置為使用者名稱
    })
    console.log('用戶註冊並更新 displayName 成功:', user)

    // 設定驗證信的跳轉連結
    const actionCodeSettings = {
      url: `${window.location.origin}/signup-success`, // 前面那段是localhost
      handleCodeInApp: true,
    }

    // 發送驗證信件
    await sendEmailVerification(user, actionCodeSettings)
    console.log('驗證信已發送 📧')

    return {
      success: true,
      message: '快去檢查信箱，完成驗證吧！📧',
      user,
    }
  } catch (error) {
    console.log('用戶註冊失敗：' + error.message, '錯誤物件：' + error)
    let errorMessage = '😵 註冊失敗了！稍後再試一次吧 💔'
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = '📧 這個信箱已被註冊了唷～試試其他的吧！💡'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = '✉️ 嗯…這個信箱格式不對哦！請再檢查一下吧～ 🔍'
    } else if (error.code === 'auth/weak-password') {
      errorMessage = '🔑 密碼太簡單了啦！至少6字符，還要有數字和字母喔～ 💪'
    }
    throw {
      success: false,
      message: errorMessage,
    }
  }
}

export default registerUser
