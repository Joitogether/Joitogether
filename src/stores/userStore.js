import { defineStore } from 'pinia'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '/src/views/Login/services/firebaseConfig.js'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    // 用戶登入狀態
    isLogin: false,
    // 保存使用者名稱
    userName: '',
    // 使用者對象
    user: null,
    // 信箱是否驗證
    emailVerified: false,
  }),
  actions: {
    // 初始化 Firebase 狀態監聽
    async initAuthState(callback) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log('Firebase 檢測到用戶已登入：', user)
          this.isLogin = true
          this.setUser(user)
          // 假設 displayName 儲存了名稱
          this.userName = user.displayName || '使用者'

          // 更新 emailVerified 狀態
          this.emailVerified = user.emailVerified

          // 如果信箱已驗證，觸發後端同步
          if (user.emailVerified) {
            this.updateEmailVerifiedInBackend(user.uid)
          }
        } else {
          console.log('Firebase 檢測到用戶未登入')
          // 使用通用清空方法
          this.clearUserState()
          this.clearUser()
        }
        // 初始化完成後執行回調
        if (callback) callback()
      })
    },
    async updateEmailVerifiedInBackend(uid) {
      try {
        const response = await axios.put(`http://localhost:3030/users/update/${uid}`, {
          email_verified: true,
        })
        console.log('後端 email_verified 更新成功：', response.data)
      } catch (error) {
        console.error('後端 email_verified 更新失敗：', error.message)
      }
    },

    setUser(value) {
      this.user = value
    },
    clearUser() {
      this.user = null
    },
    // 更新登出狀態
    async logout() {
      try {
        await auth.signOut() // 確保登出 Firebase
        this.clearUserState()
        console.log('用戶已成功登出')
      } catch (error) {
        console.error('登出失敗：', error)
      }
    },

    // 通用清空方法 -> 僅處理 isLogin 和 userName
    clearUserState() {
      this.isLogin = false
      this.userName = ''
    },

    // 清空所有使用者相關狀態
    clearAuth() {
      this.isLogin = false
      this.userName = ''
      this.user = {
        uid: '',
        email: '',
        displayName: '',
        photoURL: '',
      }
      this.auth = {
        accessToken: '',
      }
    },
  },
  getters: {
    // 確認是否登入
    isAuthenticated: (state) => state.isLogin,
  },
})
