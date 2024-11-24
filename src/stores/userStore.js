import { defineStore } from 'pinia'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '/src/views/Login/services/firebaseConfig.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLogin: false, // 用戶登入狀態
    userName: '', // 保存使用者名稱
  }),
  actions: {
    // 初始化 Firebase 狀態監聽
    initAuthState(callback) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log('Firebase 檢測到用戶已登入：', user)
          this.isLogin = true
          this.userName = user.displayName || '使用者' // 假設 displayName 儲存了名稱
        } else {
          console.log('Firebase 檢測到用戶未登入')
          this.isLogin = false
          this.userName = ''
        }
        // 初始化完成後執行回調
        if (callback) callback()
      })
    },

    // 更新登出狀態
    logout() {
      // 設置狀態為未登入
      this.isLogin = false
    },
  },
})
