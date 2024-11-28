import { auth } from '../../../utils/firebaseConfig.js'
import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth'

export const passwordService = {
  async checkUserRegistered(email) {
    try {
      // 檢查該 email 是否有註冊
      const methods = await fetchSignInMethodsForEmail(auth, email)
      console.log('該信箱已註冊的方法：', methods)

      if (methods.length === 0) {
        throw {
          success: false,
          message: '😵‍💫 該信箱尚未註冊！請檢查後再試！',
        }
      }

      return {
        success: true,
        message: '🎉 該信箱已註冊，可以繼續操作！',
      }
    } catch (error) {
      console.error('檢查用戶是否註冊失敗：', error.message)

      let errorMessage = '檢查註冊狀態失敗！請稍後再試！'

      if (error.code === 'auth/invalid-email') {
        errorMessage = '✉️ 信箱格式不對哦！請再確認一下！🔍'
      } else if (error.message === '😵‍💫 該信箱尚未註冊！請檢查後再試！') {
        errorMessage = error.message
      } else {
        console.error('未識別的錯誤代碼：', error.code)
      }

      throw {
        success: false,
        message: errorMessage,
      }
    }
  },

  async sendPasswordResetEmail(email) {
    try {
      // 設定驗證信的跳轉連結
      const actionCodeSettings = {
        url: `${window.location.origin}/reset-password`, // 前面那段是localhost
        handleCodeInApp: true,
      }

      // 發送重設密碼的信件
      await sendPasswordResetEmail(auth, email, actionCodeSettings)

      return {
        success: true,
        message: '🎉 已成功發送重設密碼信，請檢查您的信箱！📧',
      }
    } catch (error) {
      console.error('發送重設密碼信失敗：', error.message)
      console.error('完整錯誤物件：', error)

      let errorMessage = '發送重設密碼信失敗！請稍後再試！'

      if (error.code === 'auth/user-not-found') {
        errorMessage = '😵‍💫 該信箱尚未註冊，無法發送密碼重設信！'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = '✉️ 信箱格式不對哦！請重新輸入！🔍'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = '😵 請求過於頻繁，請稍後再試！🚫'
      } else {
        console.error('未識別的錯誤代碼：', error.code)
      }

      throw {
        success: false,
        message: errorMessage,
      }
    }
  },
}

export default passwordService
