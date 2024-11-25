import { getAuth, sendPasswordResetEmail } from 'firebase/auth'

// 驗證電子郵件格式的正則表達式
const validateEmailFormat = (email) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailPattern.test(email)
}

// 發送重設密碼郵件
export const sendPasswordResetLink = async (email, showMessage) => {
  const auth = getAuth()

  // 檢查是否提供了電子郵件
  if (!email) {
    showMessage('請輸入您的電子郵件地址', 'error')
    return
  }

  // 檢查電子郵件格式是否正確
  if (!validateEmailFormat(email)) {
    showMessage('請輸入有效的電子郵件地址', 'error')
    return
  }

  try {
    // 發送重設密碼郵件
    await sendPasswordResetEmail(auth, email)
    showMessage('重設密碼的連結已發送至您的信箱！請查收。', 'success')
  } catch (error) {
    // 根據錯誤碼顯示不同的錯誤消息
    if (error.code === 'auth/invalid-email') {
      showMessage('無效的電子郵件地址，請檢查格式', 'error')
    } else if (error.code === 'auth/user-not-found') {
      showMessage('找不到與此電子郵件相關聯的帳戶', 'error')
    } else {
      showMessage('發生錯誤，請稍後再試', 'error')
    }
    console.error('Error sending password reset email:', error)
  }
}
