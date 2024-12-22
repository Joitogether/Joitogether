<script setup>
import { Search, User, Menu, BellNotification } from '@iconoir/vue'
import { NButton, NDivider, NBadge, NPopover, NScrollbar, NSpin } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { useUserStore } from '/src/stores/userStore.js'
import { auth } from '@/utils/firebaseConfig.js'
import { useRouter, RouterLink } from 'vue-router'
import 'dayjs/locale/zh-tw.js'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { useNotificationStore } from '@/stores/notificationStore'
import { storeToRefs } from 'pinia'
import { userGetAPI } from '@/apis/userAPIs'
import { ref, onMounted } from 'vue'
import { getPostsAPI } from '@/apis/userAPIs'
import { userGetFollowerAPI } from '@/apis/userAPIs'
import { userGetActivityAPI } from '@/apis/userAPIs'

const message = useMessage()
const userStore = useUserStore()
const router = useRouter()
const notificationStore = useNotificationStore()
const { notifications, unreadCount, unreadList } = storeToRefs(notificationStore)
const { updateNotifications } = notificationStore
dayjs.locale('zh-tw')
dayjs.extend(relativeTime)
const user = ref(null) // 儲存使用者資料
const loading = ref(true)
const postNumber = ref(null)
const followerNumber = ref(null)
const activityNumber = ref(null)
const userLogin = ref(false) //檢查登入

defineProps({
  items: {
    type: Object,
    required: true,
    default: () => ({
      display_name: '名字加載中',
      photo_url: '大頭照加載中',
      city: '城市加載中',
      age: '年齡加載中',
      career: '職業加載中',
    }),
  },
  type: {
    type: String,
    required: true,
  },
})
// 檢查用戶登入狀態並獲取用戶資料
const fetchUserData = async () => {
  try {
    const result = await userGetAPI(userStore.user.uid)
    if (result) {
      user.value = result
      loading.value = false
      userLogin.value = true
    }
  } catch {
    message.error('載入用戶資料錯誤')
    loading.value = false
    userLogin.value = false
  }
}
const getPostCount = async () => {
  try {
    const result = await getPostsAPI(userStore.user.uid).catch(() => ({ data: [] }))
    postNumber.value = result.data.length
  } catch (err) {
    console.log('抓取文章數量發生錯誤', err)
    postNumber.value = 0
  }
}
const getFollowerCount = async () => {
  try {
    const result = await userGetFollowerAPI(userStore.user.uid).catch(() => ({ data: [] }))
    followerNumber.value = result.data.length
  } catch (err) {
    console.log('抓取粉絲數量發生錯誤', err)
    followerNumber.value = 0
  }
}
const getActivityCount = async () => {
  try {
    const result = await userGetActivityAPI(userStore.user.uid)
    console.log('活動資料：', result)
    console.log(result.length)

    activityNumber.value = result.length
  } catch (err) {
    console.log('抓取活動數量發生錯誤', err)
    activityNumber.value = 0
  }
}
// 註冊登入邏輯
onMounted(() => {
  if (userStore.user.isLogin) {
    fetchUserData()
    getPostCount()
    getFollowerCount()
    getActivityCount()
  } else {
    loading.value = false
  }
})

// 切換選單顯示

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
  if (!value) {
    if (unreadList.value.length > 0) {
      // 調用 API 更新未讀的通知狀態
      await updateNotifications(userStore.user.uid, unreadList.value)
    }
  }
}

const handleLoadClick = async () => {
  showLoading.value = true
  await notificationStore.getMoreNotifications(userStore.user.uid)
  showLoading.value = false
}
const showLoading = ref(false)
</script>

<template>
  <div id="navbar" class="h-12 py-1 px-4 flex items-center justify-between relative shadow">
    <div class="flex items-center">
      <div class="hidden md:block w-16 md:h-9 md:overflow-hidden">
        <RouterLink to="/">
          <img src="../../../assets/Joi.png" alt="logo" class="w-full h-full object-contain" />
        </RouterLink>
      </div>

      <div class="hidden lg:flex flex-row items-center gap-2 mx-3">
        <label for="search" class="cursor-pointer hover:text-green-600">找聚會</label>
        <div class="flex items-center gap-2">
          <input
            type="text"
            id="search"
            class="h-8 bg-gray-100 rounded-full p-3 focus:outline-green-600"
            placeholder="運動、美食、唱歌..."
          />
          <div
            class="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center cursor-pointer hover:bg-green-700"
          >
            <Search class="text-white" :style="{ width: '20px', height: '20px' }" />
          </div>
        </div>
      </div>

      <div class="md:hidden">
        <input type="checkbox" id="menu-toggle" class="hidden" />
        <label for="menu-toggle" class="text-gray-500 cursor-pointer">
          <Menu class="hover:text-green-600" />
        </label>
        <!--選單內容-->
        <div
          id="menu"
          class="w-full absolute top-12 left-0 bg-gray-50 text-white p-6 space-y-4 shadow-md"
        >
          <ul>
            <li class="flex gap-3">
              <input
                type="text"
                placeholder="運動、美食、唱歌..."
                class="w-full h-10 mb-2 rounded-full border border-gray-400 p-2 focus:outline-green-600"
              />
              <div
                class="w-10 h-10 aspect-square rounded-full bg-green-600 flex items-center justify-center cursor-pointer hover:bg-green-700"
              >
                <Search class="text-white" :style="{ width: '20px', height: '20px' }" />
              </div>
            </li>
            <li>
              <a
                href="#"
                class="font-bold py-3 block text-base text-gray-500 hover:text-green-600 border-b border-gray-300"
              >
                •&nbsp;&nbsp;加入聚會
              </a>
            </li>
            <li
              class="font-bold py-3 block text-base text-gray-500 hover:text-green-600 border-b border-gray-300"
            >
              <RouterLink to="/post">•&nbsp;&nbsp;社群</RouterLink>
            </li>
            <li>
              <a
                href="#"
                class="font-bold py-3 block text-base text-gray-500 hover:text-green-600 border-b border-gray-300"
              >
                •&nbsp;&nbsp;活動中心
              </a>
            </li>
            <li>
              <a href="#" class="font-bold pt-3 block text-base text-gray-500 hover:text-green-600">
                •&nbsp;&nbsp;儲值中心
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="md:hidden w-16 h-9 overflow-hidden absolute left-1/2 transform -translate-x-1/2">
        <RouterLink to="/">
          <img src="../../../assets/Joi.png" alt="logo" class="w-full h-full object-contain" />
        </RouterLink>
      </div>

      <div class="hidden md:block">
        <ul class="md:flex flex-wrap items-center">
          <li class="lg:hidden py-1">
            <a href="#" class="mx-3 tracking-wide hover:text-green-600"> 加入聚會</a>
          </li>
          <li class="py-1">
            <RouterLink to="/post" class="mx-3 tracking-wide hover:text-green-600">社群</RouterLink>
          </li>
          <li class="py-1">
            <a href="#" class="mx-3 tracking-wide hover:text-green-600"> 購物車</a>
          </li>
          <li class="py-1">
            <a href="#" class="mx-3 tracking-wide hover:text-green-600"> 儲值中心</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- 登入/註冊 -->
    <div class="flex items-center gap-4">
      <div class="hidden md:flex items-center" v-if="userLogin">
        <router-link :to="{ name: 'activityCreate' }">
          <button
            class="border border-gray-600 text-gray-600 rounded-full px-3 py-1 hover:border-green-600 hover:text-green-600"
          >
            活動創建
          </button>
        </router-link>
      </div>
      <n-popover
        :on-update:show="handleNotificationRead"
        placement="bottom-end"
        :on-clickoutside="() => (showPopover = false)"
        class="w-[377px] bellNotice"
        :style="{
          '--v-offset-left': '50px',
          transform: 'translateX(429px) translateX(-100%)',
          '--n-color': '#f9fafb',
        }"
        trigger="click"
        :show="showPopover"
      >
        <template #trigger>
          <n-badge :max="15" :value="unreadCount" class="cursor-pointer">
            <BellNotification class="hover:text-green-600"></BellNotification>
          </n-badge>
        </template>
        <n-scrollbar style="max-height: 500px">
          <div class="flex flex-col">
            <p class="pl-2 text-xl font-bold">通知</p>
            <div v-if="notifications.length > 0 && userStore.user.uid">
              <div v-for="notification in notifications" :key="notification.id">
                <router-link :to="notification.link">
                  <div
                    :class="{ 'bg-yellow-100': !notification.is_read }"
                    class="hover:bg-yellow-100 pl-2 overflow-hidden hover:transition-colors post-onepost-top flex py-2 rounded-md items-center cursor-pointer"
                  >
                    <img
                      class="w-14 aspect-square rounded-full"
                      :src="notification.users_notifications_actor_idTousers.photo_url"
                      alt=""
                    />
                    <div class="ml-3 relative w-full h-14">
                      <p class="font-bold text-lg absolute top-0">
                        {{ notification.users_notifications_actor_idTousers.display_name
                        }}<span class="pl-1 font-normal">{{ notification.message }}</span>
                      </p>
                      <p class="absolute bottom-0 w-full text-md truncate">
                        {{ dayjs(notification.created_at).fromNow() }}
                        <span
                          v-if="notification.target_type === 'activity'"
                          class="pl-1 font-normal text-lg"
                          >{{ notification.target_detail.name }}</span
                        >
                        <span
                          v-else-if="notification.target_type === 'post'"
                          class="pl-1 font-normal text-lg"
                          >{{ notification.target_detail.post_title }}</span
                        >
                        <span
                          v-else-if="notification.target_type === 'rating'"
                          class="pl-1 font-normal text-lg"
                          >{{ notification.target_detail.user_comment }}</span
                        >
                      </p>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
            <div v-else-if="userStore.user.uid && notifications.length === 0">暫無通知</div>
            <div v-else>登入以查看通知</div>
            <n-spin v-if="!notificationStore.hideLoadBtn" :show="showLoading">
              <n-button @click="handleLoadClick" class="w-full h-12 mt-2 text-lg font-bold"
                >加載更多</n-button
              >
            </n-spin>
            <div
              v-else
              class="text-center font-bold text-lg border-[1px] cursor-not-allowed rounded-md py-2 mt-1"
            >
              已經到底囉～
            </div>
          </div>
        </n-scrollbar>
      </n-popover>
      <!-- <div class="hidden md:flex min-w-20 items-center">登入/註冊</div> -->

      <input type="checkbox" id="login-toggle" />
      <label
        for="login-toggle"
        class="inline-flex items-center justify-center text-sm text-gray-500 cursor-pointer"
      >
        <User class="w-7 h-7 hover:text-green-600" />
      </label>
      <div v-if="loading">加载中...</div>

      <div
        v-else
        id="login-menu"
        class="w-full bg-gray-50 text-black p-6 space-y-4 absolute top-12 right-0 shadow-md md:w-1/3 lg:w-1/4"
      >
        <div
          v-if="userStore.user.isLogin"
          class="user-photo rounded-full w-40 h-40 aspect-square overflow-hidden flex justify-self-center md:w-24 md:h-24"
        >
          <img
            :src="user.photo_url || 'default_image_path.jpg'"
            alt="userPhoto"
            class="w-full h-full object-cover"
          />
        </div>
        <div v-if="userStore.user.isLogin" class="user-name text-center font-bold text-xl">
          {{ user.display_name || '暱稱' }}
        </div>
        <div v-if="userStore.user.isLogin" class="user-info text-md font-bold text-center">
          <span>{{ user.city || '所在地' }}</span>
          <span> • {{ user.age || '年齡' }}</span>
          <span> • {{ user.career || '職業' }}</span>
        </div>
        <div v-if="userStore.user.isLogin" class="flex justify-center">
          <RouterLink to="/profile">
            <button
              class="border border-gray-600 text-gray-600 py-2 px-4 rounded-full hover:border-green-600 hover:text-green-600"
            >
              查看個人頁面
            </button>
          </RouterLink>
        </div>

        <div v-if="userStore.user.isLogin" class="user-more-info flex justify-center gap-10">
          <div class="grid text-center">
            <span>{{ activityNumber || 0 }}</span>
            <span>聚會</span>
          </div>
          <div class="grid text-center">
            <span>{{ followerNumber || 0 }}</span>
            <span>粉絲</span>
          </div>
          <div class="grid text-center">
            <span>{{ postNumber || 0 }}</span>
            <span>文章</span>
          </div>
        </div>
        <n-divider />
        <!-- 登出/登入 按鈕 -->
        <div class="flex justify-center">
          <n-button
            strong
            secondary
            type="tertiary"
            @click="userStore.user.isLogin ? handleLogout() : navigateToLogin()"
          >
            {{ userStore.user.isLogin ? '登出' : '登入' }}
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-name {
  text-align: center;
}
.user-photo {
  justify-content: center;
}

#navbar {
  position: relative;
  z-index: 999;
}

#login-toggle {
  display: none;
}

#login-menu {
  z-index: 1;
  position: absolute;
  pointer-events: none;
  opacity: 0;
  transition: all 0.1s ease-in-out;
}
#login-toggle:checked ~ #login-menu {
  pointer-events: auto;
  opacity: 1;
}

#menu {
  opacity: 0;
  pointer-events: none;
  transition: all 0.1s ease-in-out;
}
#menu-toggle:checked ~ #menu {
  pointer-events: auto;
  opacity: 1;
}
/* 預設情況下隱藏選單 */
/* #menu,
#login-menu {
  display: none;
} */
</style>
