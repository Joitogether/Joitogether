<script setup>
import { Search, User, Menu, Sweep3d, BellNotificationSolid } from '@iconoir/vue'
import { NButton, NDivider, NBadge, NPopover, NScrollbar } from 'naive-ui'
import userInfo from '../../MyProfile/component/person'
import { RouterLink } from 'vue-router'
import { useMessage } from 'naive-ui'
import { useUserStore } from '/src/stores/userStore.js'
import { auth } from '@/utils/firebaseConfig.js'
import { useRouter } from 'vue-router'
import {  ref } from 'vue'
import 'dayjs/locale/zh-tw.js'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { useNotificationStore } from '@/stores/notificationStore'
import { storeToRefs } from 'pinia'
const message = useMessage()
const userStore = useUserStore()
const router = useRouter()
const notificationSotre = useNotificationStore()
const { notifications, unreadCount, unreadList } = storeToRefs(notificationSotre)
const {  updateNotifications } = notificationSotre
dayjs.locale('zh-tw') 
dayjs.extend(relativeTime)
// 註冊/登入按鈕跳轉
const navigateToLogin = () => {
  router.push({ name: 'login' })
}

// 登出功能
const handleLogout = async () => {
  const currentUser = auth.currentUser
  if (!currentUser) {
    // 如果用戶未登入，顯示未登入提示
    message.warning('🚫 尚未登入，無法執行登出操作喔！💡')
    return
  }

  try {
    // 調用 Firebase 登出邏輯
    await auth.signOut()

    // 更新 userStore 狀態為未登入
    userStore.clearUser() // 清空使用者狀態，方法來自 userStore.js

    // 顯示成功訊息
    message.success('🎉 成功登出！期待下次見到你～ 👋')
  } catch (error) {
    message.error('😵 登出時發生錯誤啦！請稍後再試一次吧 💔')
    console.error('登出錯誤：', error)
  }
}

const showPopover = ref(false)


const handleNotificationRead = async (value) => {
  // 掌握開關
  showPopover.value = value
  // 關起來的話做檢查
  if(!value){
    console.log('yes')
    if(unreadList.value.length > 0) {
      // 調用 API 更新未讀的通知狀態
      await updateNotifications(userStore.user.uid, unreadList.value)
    }
}
}


</script>

<template>
  <div id="navbar" class="flex items-center space-x-2 justify-evenly">
    <div>
      <a href="#"><Sweep3d /></a>
    </div>
    <div class="flex items-center space-x-6">
      <div class="hidden md:flex min-w-12">找聚會</div>
      <div class="hidden md:flex">
        <input type="text" placeholder="運動、美食、唱歌..." />
      </div>
      <div>
        <a href="#"><Search /></a>
      </div>
    </div>

    <div class="md:hidden flex">
      <input type="checkbox" id="menu-toggle" class="hidden" />
      <label
        for="menu-toggle"
        class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-black"
      >
        <Menu />
      </label>
      <!--選單內容-->
      <div
        id="menu"
        class="hidden md:hidden bg-gray-200 text-white p-6 space-y-4 absolute top-10 inset-x-0"
      >
        <ul>
          <li class="flex">
            <Search />
            <input type="text" placeholder="運動、美食、唱歌..." />
          </li>
          <li>
            <a
              href="#"
              class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-black dark:hover:text-white"
              >加入聚會</a
            >
          </li>
          <li
            class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-black dark:hover:text-white"
          >
            <RouterLink to="/post">社群</RouterLink>
          </li>
          <li>
            <a
              href="#"
              class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-black dark:hover:text-white"
            >
              活動中心</a
            >
          </li>
          <li>
            <a
              href="#"
              class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-black dark:hover:text-white"
              >儲值中心</a
            >
          </li>
        </ul>
      </div>
    </div>

    <div class="hidden md:flex min-w-96">
      <ul class="hidden md:flex flex-wrap items-center gap-2">
        <li>
          <a
            href="#"
            class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-black dark:hover:text-white"
            >加入聚會</a
          >
        </li>
        <li
          class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-black dark:hover:text-white"
        >
          <RouterLink to="/post">社群</RouterLink>
        </li>
        <li>
          <a
            href="#"
            class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-black dark:hover:text-white"
            >活動中心</a
          >
        </li>
        <li>
          <a
            href="#"
            class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-black dark:hover:text-white"
            >儲值中心</a
          >
        </li>
      </ul>
    </div>
    <!-- 登入/註冊 -->
    <div class="flex items-center">
      <n-popover :disabled="notifications.length === 0" :on-update:show="handleNotificationRead" placement="bottom-end" :on-clickoutside="() => showPopover = false" class="w-[400px]" style="padding: 10px"  trigger="click" :show="showPopover">
        <template #trigger>
          <n-badge :max="15"  :value="unreadCount" class="mr-3 cursor-pointer">
            <BellNotificationSolid></BellNotificationSolid>
          </n-badge>
        </template>
        <n-scrollbar style="max-height: 500px">
          <div class="flex flex-col ">
            <p class="pl-2 text-xl font-bold">通知</p>
            <div   v-for="notification in notifications" :key="notification.id" >
              <router-link :to="notification.link">

                <div :class="{ 'bg-yellow-100' : !notification.is_read}" class="hover:bg-yellow-100 overflow-hidden hover:transition-colors post-onepost-top flex py-2 pl-2 rounded-md items-center	cursor-pointer ">
                  <img class="w-14 aspect-square rounded-full" :src="notification.users_notifications_actor_idTousers.photo_url" alt="">
                  <div class="ml-3 relative w-full h-14 ">
                    <p class="font-bold text-lg absolute top-0"> {{notification.users_notifications_actor_idTousers.display_name }}<span class="pl-1 font-normal">{{ notification.message}}</span> </p>
                    <p class="absolute bottom-0 w-full text-md truncate">{{dayjs(notification.created_at).fromNow()}}
                      <span v-if="notification.target_type === 'activity'"  class="pl-1 font-normal text-lg ">{{ notification.target_detail.name }}</span>
                      <span v-else-if="notification.target_type === 'post'"  class="pl-1 font-normal text-lg ">{{ notification.target_detail.post_title }}</span>
                      <span v-else-if="notification.target_type === 'rating'"  class="pl-1 font-normal text-lg ">{{ notification.target_detail.user_comment }}</span>
                    </p>
                  </div>
                </div>
              
              </router-link>
            </div>
          </div>
        </n-scrollbar>

      </n-popover>
      <div class="hidden md:flex min-w-20 items-center">登入/註冊</div>

      <input type="checkbox" id="login-toggle" class="hidden" />
      <label
        for="login-toggle"
        class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-black"
      >
        <User />
      </label>
      <div
        id="login-menu"
        class="hidden md:hidden w-1/4 bg-gray-50 text-black p-6 space-y-4 absolute top-10 right-0"
      >
        <div class="w-1/2 rounded-full overflow-hidden flex justify-self-center">
          <img :src="userInfo.imgUrl" alt="userPhoto" />
        </div>
        <div class="text-center font-bold text-xl">{{ userInfo.nickName }}</div>
        <div class="text-md font-bold text-center">
          <span>{{ userInfo.city }}</span>
          <span> • {{ userInfo.age }}</span>
          <span> • {{ userInfo.career }}</span>
        </div>
        <div class="flex justify-center">
          <RouterLink to="/profile">
            <n-button type="primary" ghost round> 查看個人頁面 </n-button>
          </RouterLink>
        </div>

        <div class="flex justify-center gap-10">
          <div class="grid text-center">
            <span>0</span>
            <span>聚會</span>
          </div>
          <div class="grid text-center">
            <span>0</span>
            <span>收藏</span>
          </div>
          <div class="grid text-center">
            <span>0</span>
            <span>文章</span>
          </div>
        </div>
        <n-divider />
        <div class="flex justify-center">
          <n-button strong secondary type="tertiary"> 登出 </n-button>
        </div>
        <ul>
          <li>
            <a
              @click="navigateToLogin"
              href="#"
              class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-black dark:hover:text-white"
            >
              登入
            </a>
          </li>
          <li>
            <a
              @click="navigateToLogin"
              href="#"
              class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-black dark:hover:text-white"
            >
              註冊
            </a>
          </li>
          <li>
            <a
              @click="handleLogout"
              href="#"
              class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-black dark:hover:text-white"
              >登出</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>

<!-- 登入/註冊顯示選單 -->
</template>

<style scoped>
/* 當checkbox被選中時顯示選單 */
#menu-toggle:checked + label + #menu {
  display: block;
}

/* 當checkbox被選中時顯示登入註冊選單 */
#login-toggle:checked ~ label + #login-menu {
  display: block;
}

/* 預設情況下隱藏選單 */
#menu,
#login-menu {
  display: none;
}

#navbar {
  position: relative;
  z-index: 999;
}
</style>
