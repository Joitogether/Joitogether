import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { userGetNotificationAPI, userUpdateNotificationAPI } from "@/apis/userAPIs";

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([]) 
  const loadCount = ref(0)
  const hideLoadBtn = ref(false)
  // 未讀的提醒
  const unreadCount = computed(() => { 
    if(notifications.value.length === 0) {
      return 0
    }
    return notifications.value.reduce((count, notification) => notification.is_read === 0 ? count + 1 : count , 0)
  })

  const unreadList = computed(() => {
    return notifications.value
      .filter((notification) =>  notification.is_read === 0 )
      .map(notification => notification.id)
  })

  const getNotifications = async (uid, page, pageSize) => {
    if(page === 1){
      loadCount.value = 1
      hideLoadBtn.value = false
    }
    const response = await userGetNotificationAPI(uid, page, pageSize)
    if(!response || response.data.length === 0) {
      notifications.value = []
      hideLoadBtn.value = true
      return
    }
    notifications.value = response.data
    loadCount.value++
  }

  const getMoreNotifications = async (uid) => {
    const additionalSkip = notifications.value.length - 3
    const response = await userGetNotificationAPI(uid, loadCount.value, 3, additionalSkip)
    if(!response || response.data.length === 0) {
      hideLoadBtn.value = true
      return
    }
    notifications.value.push(...response.data)
    loadCount.value++
  }

  const updateNotifications = async (uid, unreadList) => {
   const res = await userUpdateNotificationAPI(uid, unreadList)
   if(res){
    await getNotifications(uid)
   }
  }  

  return {
    notifications,
    unreadCount,
    unreadList,
    getNotifications,
    updateNotifications,
    getMoreNotifications,
    hideLoadBtn
  }
})