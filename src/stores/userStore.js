import { defineStore } from 'pinia'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '/src/views/Login/services/firebaseConfig.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    // 用戶登入狀態
    isLogin: false,
    // 保存使用者名稱
    userName: '',
  }),
  actions: {
    // 初始化 Firebase 狀態監聽
    async initAuthState(callback) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log('Firebase 檢測到用戶已登入：', user)
          this.isLogin = true
          // 假設 displayName 儲存了名稱
          this.userName = user.displayName || '使用者'
        } else {
          console.log('Firebase 檢測到用戶未登入')
          // 使用通用清空方法
          this.clearUserState()
        }
        // 初始化完成後執行回調
        if (callback) callback()
      })
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
