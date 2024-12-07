import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { userGetNotificationAPI, userUpdateNotificationAPI } from "@/apis/userAPIs";

export const useNotificationStore = defineStore('notification', () => {

  const notifications = ref([]) 

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

  const getNotifications = async (uid) => {
    const response = await userGetNotificationAPI(uid)
    if(!response || response.length === 0) {
      return notifications.value = []
    }
    notifications.value = response.data.data
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
    updateNotifications
  }
})