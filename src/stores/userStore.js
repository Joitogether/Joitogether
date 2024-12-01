import { defineStore } from 'pinia'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/utils/firebaseConfig.js'
// import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      uid: '',
      email: '',
      emailVerified: false,
      displayName: '',
      photoURL: '',
      isLogin: false,
    },
  }),
  actions: {
    // 初始化 Firebase 狀態監聽
    // async initAuthState(callback) {
    //   onAuthStateChanged(auth, (firebaseUser) => {
    //     if (firebaseUser) {
    //       console.log('Firebase 檢測到用戶已登入：', firebaseUser)

    //       // 更新 user 狀態
    //       this.user = {
    //         uid: firebaseUser.uid,
    //         email: firebaseUser.email,
    //         emailVerified: firebaseUser.emailVerified,
    //         displayName: firebaseUser.displayName || '使用者',
    //         photoURL: firebaseUser.photoURL || '',
    //         isLogin: true,
    //       }
    //     } else {
    //       console.log('Firebase 檢測到用戶未登入')
    //       this.clearUser() // 清空用戶狀態
    //     }

    //     // 初始化完成後執行回調
    //     if (callback) callback()
    //   })
    // },

    // 設定用戶資料
    setUser(user) {
      this.user = {
        ...this.user, // 保留現有屬性
        ...user, // 合併新的用戶資料
        isLogin: true, // 設定為已登入
      }
    },

    // 清空用戶資料
    clearUser() {
      this.user = {
        uid: '',
        email: '',
        emailVerified: false,
        displayName: '',
        photoURL: '',
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
