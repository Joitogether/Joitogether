import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import { ref } from 'vue'
import { useNotificationStore } from './notificationStore'
import { useUserStore } from './userStore'

export const useSocketStore = defineStore('socket', () => {
  let socket = ref(null)
  const isConnected = ref(false)
  const notificationStore = useNotificationStore()
  const userStore = useUserStore()
  const initSocket = (userId) => {
    // 如果有先前連線，刪除先前連線
    if (socket.value) {
      socket.value.disconnect()
    }
    // 建立連線
    socket.value = io(import.meta.env.VITE_API_BASE_URL, {
      withCredentials: true,
      query: {
        userId: userId,
      },
    })
    socket.value.emit('authenticate', userId)

    // 連線成功事件
    socket.value.on('connect', () => {
      isConnected.value = true
    })

    // 斷線事件
    socket.value.on('disconnect', () => {
      isConnected.value = false
    })

    // 接收通知事件
    socket.value.on('newNotification', (notification) => {
      if (notification.actor_id == notification.user_id) {
        return
      }
      addNotification(notification)
    })
  }

  // 發送通知的方法
  function sendNotification(data) {
    try {
      if (data.user_id === userStore.user.uid && data.action != 'create') {
        return
      }
      if (socket.value && isConnected.value) {
        socket.value.emit('sendNotification', data)
      }
    } catch (err) {
      return err
    }
  }

  function addNotification(notification) {
    notificationStore.notifications.unshift(notification)
  }

  function disconnectSocket() {
    if (socket.value) {
      socket.value.disconnect()
    }
    isConnected.value = false
    notificationStore.clearNotifications()
  }

  return {
    socket,
    isConnected,
    initSocket,
    sendNotification,
    addNotification,
    disconnectSocket,
  }
})
