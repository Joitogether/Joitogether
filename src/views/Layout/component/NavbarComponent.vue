<script setup>
import { Search, User, Menu, BellNotification } from '@iconoir/vue'
import { NButton, NDivider, NBadge, NPopover, NScrollbar, NSpin } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { useUserStore } from '/src/stores/userStore.js'
import { auth } from '@/utils/firebaseConfig.js'
import { useRouter, RouterLink } from 'vue-router'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw.js'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useNotificationStore } from '@/stores/notificationStore'
import { storeToRefs } from 'pinia'
import { getUserSummaryAPI } from '@/apis/userAPIs'
import { ref, onMounted, watch } from 'vue'
import { handleError } from '@/utils/handleError.js'
import { useActivityStore } from '@/stores/useActivityStore'

const activityStore = useActivityStore()
const { filters } = storeToRefs(activityStore)
const { fetchAllActivities } = useActivityStore()
const message = useMessage()
const userStore = useUserStore()
const router = useRouter()
const notificationStore = useNotificationStore()
const { notifications, unreadCount, unreadList } = storeToRefs(notificationStore)
const { updateNotifications } = notificationStore
dayjs.locale('zh-tw')
dayjs.extend(relativeTime)
const loading = ref(true)
const postNumber = ref(null)
const followerNumber = ref(null)
const activityNumber = ref(null)
const userLogin = ref(false)

const clearNumbers = () => {
  followerNumber.value = null
  activityNumber.value = null
  postNumber.value = null
}
// 檢查用戶登入狀態並獲取用戶資料
const fetUserSummary = async () => {
  if (!userStore.user.uid) {
    return
  }
  const res = await getUserSummaryAPI(userStore.user.uid)
  if (res) {
    activityNumber.value = res._count.activities
    followerNumber.value = res._count.followers
    postNumber.value = res._count.posts
  }
  loading.value = false
}

// 註冊登入邏輯
onMounted(() => {
  if (userStore.user.isLogin) {
    userLogin.value = true
    fetUserSummary()
    userLogin.value = true
  } else {
    loading.value = false
  }
})

// 註冊/登入按鈕跳轉
const navigateToLogin = () => {
  router.push({ name: 'login' })
}

// 登出功能
const handleLogout = async () => {
  const currentUser = auth.currentUser
  if (!currentUser) {
    message.warning('🚫 尚未登入，無法執行登出操作喔！💡')
    return
  }

  try {
    userLogin.value = false
    // 調用 Firebase 登出邏輯
    await auth.signOut()

    // 更新 userStore 狀態為未登入
    userStore.clearUser()
    clearNumbers()
    // 顯示成功訊息
    message.success('🎉 成功登出！期待下次見到你～ 👋')
  } catch (error) {
    handleError(message, '😵 登出時發生錯誤啦！請稍後再試一次吧 💔', error)
  }
}

const showPopover = ref(false)
watch(showPopover, async (value) => {
  if (value) {
    if (unreadList.value.length > 0) {
      await updateNotifications(userStore.user.uid, unreadList.value)
    }
  }
})

const handleLoadClick = async () => {
  showLoading.value = true
  await notificationStore.getMoreNotifications(userStore.user.uid)
  showLoading.value = false
}
const showLoading = ref(false)
const searchKeyword = ref('')

const handleSearchClick = (e) => {
  if (e.isComposing) return
  if (searchKeyword.value === '') {
    filters.value.keyword = ''
  } else {
    filters.value.keyword = searchKeyword.value.trim()
  }
  filters.value = {
    ...filters.value,
    page: 1,
  }

  router.push({ name: 'home', query: { ...filters.value } })

  fetchAllActivities(filters.value)
}

const handleCartClick = () => {
  if (userStore.user.isLogin) {
    router.push({ name: 'shpopingcart' })
  } else {
    message.warning('🚫 尚未登入，無法進入購物車喔！💡')
  }
}

const handleTopUpClick = () => {
  if (userStore.user.isLogin) {
    router.push({ name: 'topup' })
  } else {
    message.warning('🚫 尚未登入，無法進入儲值頁面喔！💡')
  }
}
</script>

<template>
  <div
    id="navbar"
    class="fixed z-50 top-0 left-0 w-screen h-16 bg-white py-1 px-4 flex items-center justify-between shadow"
  >
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
            v-model="searchKeyword"
            type="text"
            id="search"
            class="h-8 bg-gray-100 rounded-full p-3 focus:outline-green-600"
            placeholder="運動、美食、唱歌..."
            @keydown.enter="handleSearchClick"
          />
          <div
            class="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center cursor-pointer hover:bg-green-700"
          >
            <Search
              @click="handleSearchClick"
              class="text-white"
              :style="{ width: '20px', height: '20px' }"
            />
          </div>
        </div>
      </div>

      <div class="md:hidden">
        <input type="checkbox" id="menu-toggle" class="hidden" />
        <label for="menu-toggle" class="text-gray-500 cursor-pointer">
          <Menu class="hover:text-green-600 w-8 h-8" />
        </label>
        <!--選單內容-->
        <div id="menu" class="w-full bg-gray-50 text-black p-6 space-y-4 rounded-md">
          <ul>
            <li class="flex gap-3">
              <input
                @keydown.enter="handleSearchClick"
                v-model="searchKeyword"
                type="text"
                placeholder="運動、美食、唱歌..."
                class="w-full h-10 mb-2 rounded-full border border-gray-400 p-2 focus:outline-green-600"
              />
              <div
                class="w-10 h-10 aspect-square rounded-full bg-green-600 flex items-center justify-center cursor-pointer hover:bg-green-700"
              >
                <Search
                  @click="handleSearchClick"
                  class="text-white"
                  :style="{ width: '20px', height: '20px' }"
                />
              </div>
            </li>
            <li>
              <router-link
                v-if="userLogin"
                :to="{ name: 'activityCreate' }"
                class="font-bold py-3 block text-base text-gray-500 hover:text-green-600 border-b border-gray-300"
              >
                •&nbsp;&nbsp;建立活動
              </router-link>
            </li>

            <li
              class="font-bold py-3 block text-base text-gray-500 hover:text-green-600 border-b border-gray-300"
            >
              <RouterLink to="/posts">•&nbsp;&nbsp;社群</RouterLink>
            </li>
            <li>
              <a
                @click="handleCartClick"
                class="font-bold py-3 block text-base text-gray-500 hover:text-green-600 border-b border-gray-300"
              >
                •&nbsp;&nbsp;購物車
              </a>
            </li>
            <li>
              <a
                @click="handleTopUpClick"
                class="font-bold pt-3 block text-base text-gray-500 hover:text-green-600"
              >
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
            <RouterLink to="/posts" class="mx-3 tracking-wide hover:text-green-600"
              >社群
            </RouterLink>
          </li>
          <li class="py-1">
            <button @click="handleCartClick" class="mx-3 tracking-wide hover:text-green-600">
              購物車
            </button>
          </li>
          <li class="py-1">
            <button @click="handleTopUpClick" class="mx-3 tracking-wide hover:text-green-600">
              儲值中心
            </button>
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
            活動建立
          </button>
        </router-link>
      </div>
      <n-popover
        placement="bottom-end"
        class="w-[300px] bellNotice"
        trigger="manual"
        :show="showPopover"
        :style="{
          '--n-arrow-offset': '30px',
          transform: ' translateY(3%) translateX(8%)',
          '--n-color': '#f9fafb',
        }"
      >
        <template #trigger>
          <n-badge
            @click="showPopover = !showPopover"
            :max="15"
            :value="unreadCount"
            class="cursor-pointer"
          >
            <BellNotification class="hover:text-green-600"></BellNotification>
          </n-badge>
        </template>
        <n-scrollbar style="max-height: 500px">
          <div class="flex flex-col">
            <p class="py-2 mb-2 text-xl text-center font-bold border-b-2 border-gray-200">通知</p>
            <div v-if="notifications.length > 0 && userStore.user.uid">
              <div v-for="notification in notifications" :key="notification.id">
                <router-link :to="notification.link">
                  <div
                    :class="{ 'bg-gray-100': !notification.is_read }"
                    class="group hover:bg-gray-200 px-3 overflow-hidden post-onepost-top flex py-2 rounded-md justify-between items-center cursor-pointer"
                  >
                    <div class="w-14 h-14 aspect-square rounded-full overflow-hidden">
                      <img
                        class="w-full h-full object-cover bg-gray-400"
                        :src="notification.users_notifications_actor_idTousers.photo_url"
                        alt=""
                      />
                    </div>

                    <div class="ml-3 w-3/4 h-30 flex flex-col group-hover:text-green-600">
                      <span class="font-bold text-base">
                        {{ notification.users_notifications_actor_idTousers.display_name }}
                      </span>
                      <span class="text-base">
                        {{ notification.message }}
                      </span>
                      <span v-if="notification.target_type === 'activity'" class="text-base">
                        {{ notification.target_detail.name }}
                      </span>
                      <span v-else-if="notification.target_type === 'post'" class="text-base">
                        {{ notification.target_detail.post_title }}
                      </span>
                      <span v-else-if="notification.target_type === 'rating'" class="text-base">
                        {{ notification.target_detail.user_comment }}
                      </span>

                      <p class="w-full text-md text-gray-400">
                        {{ dayjs(notification.created_at).fromNow() }}
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
      <div v-if="loading"></div>

      <div
        v-else
        id="login-menu"
        class="w-full rounded-md bg-gray-50 text-black px-6 py-10 space-y-4 shadow-md md:w-1/3 md:right-2 lg:w-1/4"
      >
        <div
          class="user-photo rounded-full w-40 h-40 aspect-square overflow-hidden flex justify-self-center md:w-24 md:h-24"
        >
          <img
            v-if="userStore.user.photo_url"
            :src="userStore.user.photo_url"
            alt="userPhoto"
            class="w-full h-full object-cover"
          />
          <img
            v-else
            class="w-full h-full object-cover"
            src="https://firebasestorage.googleapis.com/v0/b/login-demo1-9d3cb.firebasestorage.app/o/avatars%2Fcatavatar.png?alt=media&token=ccd02591-0c4f-435c-9a4a-34f219774558"
            alt=""
          />
        </div>
        <div class="user-name text-center font-bold text-xl">
          {{ userStore.user.display_name || '暱稱' }}
        </div>
        <div class="user-info text-md font-bold text-center">
          <span>{{ userStore.user.city || '所在地' }}</span>
          <span> • {{ userStore.user.age || '年齡' }}</span>
          <span> • {{ userStore.user.career || '職業' }}</span>
        </div>
        <div class="flex justify-center">
          <RouterLink to="/profile">
            <button
              class="border border-gray-600 text-gray-600 py-2 px-4 rounded-full hover:border-green-600 hover:text-green-600"
            >
              查看個人頁面
            </button>
          </RouterLink>
        </div>

        <div v class="user-more-info flex justify-center gap-10">
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

#login-toggle {
  display: none;
}

#login-menu {
  z-index: 1;
  position: absolute;
  top: 65px;
  right: 0px;
  pointer-events: none;
  opacity: 0;
  transition: all 0.1s ease-in-out;
  box-shadow:
    0 -3px 6px -4px rgba(0, 0, 0, 0.12),
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05); /* 套用指定的陰影 */
}
#login-menu::after {
  content: '';
  position: absolute;
  top: -7px;
  right: 20px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 8px 10px 8px;
  border-color: transparent transparent #fff transparent;
}

#login-toggle:checked ~ #login-menu {
  pointer-events: auto;
  opacity: 1;
}

#menu {
  position: absolute;
  top: 65px;
  right: 0px;
  opacity: 0;
  pointer-events: none;
  transition: all 0.1s ease-in-out;
  box-shadow:
    0 -3px 6px -4px rgba(0, 0, 0, 0.12),
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05); /* 套用指定的陰影 */
}
#menu::after {
  content: '';
  position: absolute;
  top: -7px;
  left: 25px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 8px 10px 8px;
  border-color: transparent transparent #fff transparent;
}

#menu-toggle:checked ~ #menu {
  pointer-events: auto;
  opacity: 1;
}

@media screen and (width >= 768px) {
  #login-menu {
    right: 3px;
  }
}
</style>
