import { defineStore } from 'pinia'
import { auth } from '@/utils/firebaseConfig.js'
import { userGetAPI } from '@/apis/userAPIs'
import { handleError } from '@/utils/handleError.js'
import { useMessage } from 'naive-ui'

const message = useMessage()

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
        ...user,
        isLogin: true,
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
        await auth.signOut()
        this.clearUser()
      } catch (error) {
        handleError(message, undefined, error)
      }
    },
  },
})
