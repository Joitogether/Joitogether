import { defineStore } from 'pinia'
import { auth } from '@/utils/firebaseConfig.js'
import { userGetAPI } from '@/apis/userAPIs'
// import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      isLogin: false,
    },
  }),
  actions: {
    async getUser(uid) {
      const user = await userGetAPI(uid)
      this.setUser(user)
    },
    // 設定用戶資料
    setUser(user) {
      this.user = {
        ...user, // 合併新的用戶資料
        isLogin: true, // 設定為已登入
      }
    },

    // 清空用戶資料
    clearUser() {
      this.user = {
        isLogin: false,
      }
    },

    // 登出
    async logout() {
      try {
        await auth.signOut() // 確保登出 Firebase
        this.clearUser() // 清空用戶狀態
        console.log('用戶已成功登出')
      } catch (error) {
        console.error('登出失敗：', error)
      }
    },
  },
})
