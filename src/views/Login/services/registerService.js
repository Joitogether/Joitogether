// 註冊功能
import { auth } from './firebaseConfig.js'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'
import axios from 'axios'

// 用戶註冊邏輯整合
// 1. Firebase 註冊
// 2. 發送驗證信件
// 3. 傳遞用戶資料至後端
//
// @param {Object} formData - 使用者的註冊資訊
// @param {string} formData.email - 用戶信箱
// @param {string} formData.password - 密碼
// @param {string} formData.username - 顯示名稱/使用者名稱
// @param {string} formData.phoneNumber - 手機號碼
// @param {string} formData.photoURL - 頭像 URL
// @returns {Promise<Object>} - 結果物件

const registerUser = async ({ email, password, fullName, displayName, phoneNumber, photoURL }) => {
  try {
    // Step 1: Firebase 註冊用戶
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    console.log('接收到的表單資料:', {
      email,
      password,
      fullName,
      displayName,
      phoneNumber,
      photoURL,
    })

    // 更新 displayName
    await updateProfile(user, {
      // 設置為使用者名稱
      displayName: displayName,
      photoURL,
    })
    console.log('用戶註冊並更新 displayName 成功:', user)

    // Step 2: 發送驗證信件
    // 設定驗證信的跳轉連結
    const actionCodeSettings = {
      url: `${window.location.origin}/signup-success`, // 前面那段是localhost
      handleCodeInApp: true,
    }
    // 發送驗證信件
    await sendEmailVerification(user, actionCodeSettings)
    console.log('驗證信已發送 📧')

    // Step 3: 傳遞用戶資料至後端
    const userData = {
      uid: user.uid,
      email: user.email,
      email_verified: 0, // 初始值：未驗證
      full_name: fullName,
      display_name: displayName,
      phone_number: phoneNumber,
      photo_url: photoURL,
      created_at: new Date(),
    }
    console.log(' 傳送至後端的用戶註冊資料：', userData)

    const backendResponse = await axios.post('http://172.20.10.8:3030/users/register', userData)
    console.log(backendResponse)

    return {
      success: true,
      message: '快去檢查信箱，完成驗證吧！📧',
      user,
      backendResponse: backendResponse.data,
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
    console.error('更新使用者資料失敗，清理帳戶：', error)
    if (auth.currentUser) {
      await auth.currentUser.delete() // 刪除已創建的使用者帳戶
    }
    throw (
      ({
        success: false,
        message: errorMessage,
      },
      error)
    )
  }
}

export default registerUser
