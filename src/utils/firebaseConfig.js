// firebase 初始化配置
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { useSocketStore } from '@/stores/socketStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { useUserStore } from '@/stores/userStore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const storage = getStorage(app)

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      const userStore = useUserStore()
      const socketStore = useSocketStore()
      const notificationStore = useNotificationStore()
      if (user) {
        const notificationStore = useNotificationStore()
        userStore.setUser(user)
        // 登入完就開啟socket去拿通知
        socketStore.initSocket(user.uid)
        notificationStore.getNotifications(user.uid, 1, 5)
      } else {
        socketStore.disconnectSocket()
        userStore.clearUser()
        notificationStore.clearNotifications()
      }
      resolve(user)
    })
  })

}
export { auth, storage, getCurrentUser }
