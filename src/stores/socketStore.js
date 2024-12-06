import { defineStore } from "pinia";
import { io } from "socket.io-client";
import { ref } from "vue";

export const useSocketStore = defineStore('socket', () => {
  let socket = ref(null)
  const isConnected = ref(false)
  const notifications =  ref([])


  const initSocket = (userId) => {
    // 如果有先前連線，刪除先前連線
    if(socket.value){
      socket.value.disconnect()
    }
    // 建立連線
    socket.value = io('http://localhost:3030', {
      withCredentials: true,
      query: {
        userId: userId
      }
    })
    socket.value.emit('authenticate', userId)


    // 連線成功事件
    socket.value.on('connect', () => {
      isConnected.value = true
      console.log('Socket 已連上')
    })

    // 斷線事件
    socket.value.on('disconnect', () => {
      isConnected.value = false
      console.log('Socket 連線失敗')
    })

    // 接收通知事件
    socket.value.on('newNotification', (notification) => {
      addNotification(notification)
      console.log(notification)
    })
  }

  // 發送通知的方法
  function sendNotification(data) {
    if (socket.value && isConnected.value) {
      socket.value.emit('sendNotification', data)
    }
  }
  // data須包含以下
  // {
  //   user_id,
  //   actor_id,
  //   action,
  //   target_type,
  //   target_id,
  //   message
  // }
  // 添加通知到 state
  function addNotification(notification) {
    notifications.value.unshift({
      ...notification,
      id: Date.now(), // 臨時ID
      isRead: false
    })
  }

  // 清除通知
  function clearNotifications() {
    notifications.value = []
  }

  // 標記通知為已讀
  function markNotificationAsRead(notificationId) {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      notifications.value[index].isRead = true
    }
  }

  return {
    socket,
    isConnected,
    notifications,
    initSocket,
    sendNotification,
    addNotification,
    clearNotifications,
    markNotificationAsRead
  }
})