<script setup>
import { Search, User, Menu, Sweep3d, Activity } from '@iconoir/vue'
import { NButton, NDivider, useMessage } from 'naive-ui'
import { useUserStore } from '/src/stores/userStore.js'
import { auth } from '@/utils/firebaseConfig.js'
import { useRouter, RouterLink } from 'vue-router'
import { UserGetApi } from '@/apis/UserApi'
import { ref, onMounted } from 'vue'
import { getPosts } from '@/apis/postsApi'
import { UserGetFollowerApi } from '@/apis/UserApi'
import { UserGetActivityApi } from '@/apis/UserApi';


const message = useMessage()
const userStore = useUserStore()
const router = useRouter()
const user = ref(null);  // 儲存使用者資料
const loading = ref(true);
const errorMessage = ref(null);
const isMenuOpen = ref(false); // 用來控制選單顯示狀態
const postNumber = ref(null)
const followerNumber = ref(null)
const activityNumber = ref(null)
const userLogin = ref(false); //檢查登入

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
    })
  },
  type: {
    type: String,
    required: true,
  }
})
// 檢查用戶登入狀態並獲取用戶資料
const fetchUserData = async () => {
  try {
    const result = await UserGetApi(userStore.user.uid);
    if (result) {
      user.value = result;
      loading.value = false;
      userLogin.value = true;
    }
  } catch (err) {
    message.error('載入用戶資料錯誤');
    loading.value = false;
    userLogin.value = false
  }
};
const getPostCount = async() => {
      try {
        const result = await getPosts(userStore.user.uid).catch(() => ({ data: []}))
        postNumber.value = result.data.length
      } catch(err) {
        console.log('抓取文章數量發生錯誤',err)
          postNumber.value = 0

      }
    }
const getFollowerCount = async() => {
  try {
    const result = await UserGetFollowerApi(userStore.user.uid).catch(() => ({ data: []}))
    followerNumber.value = result.data.length
  } catch(err) {
    console.log('抓取粉絲數量發生錯誤',err)
      followerNumber.value = 0

  }
}
const getActivityCount = async() => {
  try{
    const result = await UserGetActivityApi(userStore.user.uid);
    console.log('活動資料：', result);
    console.log(result.length);

    activityNumber.value = result.length
  } catch (err) {
    console.log('抓取活動數量發生錯誤', err);
    activityNumber.value = 0
  }
}
// 註冊登入邏輯
onMounted(() => {
  if (userStore.user.isLogin) {
    fetchUserData();
    getPostCount();
    getFollowerCount();
    getActivityCount()
  } else {
    loading.value = false;
  }
});

// 切換選單顯示
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

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
</script>

<template>
  <div id="navbar" class="flex items-center space-x-2 justify-evenly">
    <div>
      <a href="/"><Sweep3d /></a>
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
        class="hidden md:hidden bg-gray-200 text-white p-6 space-y-4 absolute top-10 inset-x-0">
        <ul>
          <li class="flex">
            <Search />
            <input type="text" placeholder="運動、美食、唱歌..." />
          </li>
          <li>
            <a
              href="#"
              class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-black dark:hover:text-white">
              加入聚會</a>
          </li>
          <li
            class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-black dark:hover:text-white">
            <RouterLink to="/post">社群</RouterLink>
          </li>
          <li>
            <a
              href="#"
              class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-black dark:hover:text-white">
              活動中心</a>
          </li>
          <li>
            <a
              href="#"
              class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-black dark:hover:text-white">
              儲值中心</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="hidden md:flex min-w-96">
      <ul class="hidden md:flex flex-wrap items-center gap-2">
        <li>
          <a
            href="#"
            class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-black dark:hover:text-white">
            加入聚會</a>
        </li>
        <li
          class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-black dark:hover:text-white">
          <RouterLink to="/post">社群</RouterLink>
        </li>
        <li>
          <a
            href="#"
            class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-black dark:hover:text-white">
            活動中心</a>
        </li>
        <li>
          <a
            href="#"
            class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-black dark:hover:text-white">
            儲值中心</a
          >
        </li>
      </ul>
    </div>
    <!-- 登入/註冊 -->
    <div class="flex">
      <div class="hidden md:flex min-w-20 items-center">登入/註冊</div>
      <div class="hidden md:flex min-w-20 items-center" v-if="userLogin">
        <router-link :to="{ name: 'activityCreate' }">
          <button>活動創建</button>
        </router-link>
      </div>
      <input type="checkbox" id="login-toggle" class="hidden" />
      <label
        for="login-toggle"
        class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-black"
      >
        <User />
      </label>
      <div v-if="loading"> 加载中... </div>

      <div
        v-else
        id="login-menu"
        class="hidden w-1/4 bg-gray-50 text-black p-6 space-y-4 absolute top-10 right-0">
        <div v-if="userStore.user.isLogin" class="user-photo rounded-full w-1/2 h-1/2 aspect-square overflow-hidden flex justify-self-center">
          <img :src="user.photo_url || 'default_image_path.jpg'" alt="userPhoto" class="w-full"/>
        </div>
        <div v-if="userStore.user.isLogin" class="user-name text-center font-bold text-xl">{{ user.display_name || '暱稱'}}</div>
        <div v-if="userStore.user.isLogin" class="user-info text-md font-bold text-center">
          <span>{{ user.city  || '所在地'}}</span>
          <span> • {{ user.age || '年齡'}}</span>
          <span> • {{ user.career || '職業' }}</span>
        </div>
        <div v-if="userStore.user.isLogin" class="flex justify-center">
          <RouterLink to="/profile">
            <n-button type="primary" ghost round class="goinfo-pc"> 查看個人頁面 </n-button>
            <n-button type="primary" ghost class="hidden goinfo-mob"> 查看個人頁面 </n-button>
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
            @click="userStore.user.isLogin ? handleLogout() : navigateToLogin()">
            {{ userStore.user.isLogin ? '登出' : '登入' }}
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media screen and (width < 768px) {
  .user-photo,
  .user-name,
  .user-info,
  .user-more-info{
    display: none
  }
  .goinfo-mob {
    display: contents;
    writing-mode: vertical-lr; /* 使文字垂直顯示，從右到左 */
    transform: rotate(360deg);  /* 旋轉180度，讓文字從上到下排列 */
    white-space: nowrap;        /* 防止文字換行 */
    text-align: center;         /* 讓文字在按鈕內部居中 */
  }
  .goinfo-pc{
    display: none
  }
}
.user-name{
  text-align: center
}
.user-photo{
  justify-content: center
}

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
