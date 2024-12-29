<script setup>
import { ref, onMounted } from 'vue'
import { getLatestPostsAPI, getPopularPostsAPI } from '@/apis/postAPIs.js'
import defaultAvatar from '@/assets/avatar.png'
import { useRouter } from 'vue-router'
import { handleError } from '@/utils/handleError.js'
import { useMessage } from 'naive-ui'

const message = useMessage()
const router = useRouter()
const currentPage = ref(1) // 當前頁碼
const totalPosts = ref([]) // 全部貼文資料
const postsPerPage = 3 // 每頁顯示 15 個貼文

const posts = ref([]) // 用來抓貼文
const latestPosts = ref([]) // 最新貼文
const popularPosts = ref([]) // 熱門貼文
const activieTab = ref('latest') //切換
const goToPostsPage = () => {
  router.push('/post') //
}

const postImgUrl =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTloBdf4Wa_JxRmW-03mPB_wfP-lBvTGh8-CQ&s'
const onPostImageError = (event) => {
  event.target.src = postImgUrl
}
const onAvatarImageError = (event) => {
  event.target.src = defaultAvatar
}

// 根據當前頁碼更新貼文顯示
const updatePosts = () => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  posts.value = totalPosts.value.slice(start, end)
}
// 當頁碼變動時更新貼文
const handlePageChange = (page) => {
  currentPage.value = page
  updatePosts()
}

const switchTab = (tab) => {
  activieTab.value = tab
  currentPage.value = 1
  if (tab === 'latest') {
    totalPosts.value = latestPosts.value
  } else {
    totalPosts.value = popularPosts.value
  }
  updatePosts()
}

const fetchLatestPostsData = async () => {
  try {
    const response = await getLatestPostsAPI()

    if (!response || response.data.length === 0) {
      latestPosts.value = []
      totalPosts.value = []
      return updatePosts()
    }

    latestPosts.value = response.data
    totalPosts.value = latestPosts.value
    updatePosts()
  } catch (error) {
    handleError(message, error)
    latestPosts.value = []
    totalPosts.value = []
    updatePosts()
  }
}

const fetchPopularPostsData = async () => {
  try {
    const response = await getPopularPostsAPI()

    if (!response || response.data.length === 0) {
      popularPosts.value = []
      totalPosts.value = []
      if (activieTab.value === 'popular') {
        updatePosts()
      }
      return
    }

    popularPosts.value = response.data.sort((a, b) => {
      return b._count.post_likes - a._count.post_likes
    })
    totalPosts.value = popularPosts.value
    if (activieTab.value === 'popular') {
      updatePosts()
    }
  } catch (error) {
    handleError(message, error)
    popularPosts.value = []
    totalPosts.value = []
    if (activieTab.value === 'popular') {
      updatePosts()
    }
  }
}

onMounted(() => {
  fetchLatestPostsData()
  fetchPopularPostsData()
})

const formatDate = (isoString) => {
  const date = new Date(isoString)
  const formattedDate = date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  return formattedDate.replace(/\//g, '-').replace(/:\d{2}$/, '')
}
</script>

<template>
  <div class="bg-gray-100 w-full min-w-[300px] p-4 py-10 sm:px-[140px] md:px-[180px] lg:px-[140px]">
    <div
      class="w-full flex justify-center px-[20px] sm:px-[20px] md:px-[20px] lg:px-[24px] lg:justify-start"
    >
      <h2 class="text-[28px] text-gray-800 font-bold min-w-[120px] lg:text-[34px]">最新貼文</h2>
    </div>

    <div
      class="flex justify-around gap-4 p-5 border-b-[1px] border-solid border-[rgba(61,57,44,0.1)] ] px-[80px] sm:px-[20px] md:px-[20px] lg:px-[22px] lg:justify-start"
    >
      <div
        class="w-full h-[40px] min-w-[100px] text-base text-white hover:scale-[1.1] transition-all duration-300 lg:max-w-[100px]"
      >
        <n-button
          circle
          type="success"
          @click="switchTab('latest')"
          class="w-full h-full hover:font-bold text-base"
          >最新</n-button
        >
      </div>
      <div
        class="w-full h-[40px] min-w-[100px] text-base text-white hover:scale-[1.1] transition-all duration-300 lg:max-w-[100px]"
      >
        <n-button
          circle
          type="success"
          @click="switchTab('popular')"
          class="w-full h-full hover:font-bold text-base"
          >熱門</n-button
        >
      </div>
    </div>
    <div
      class="flex flex-col justify-center items-center bg-gray-100 w-full min-w-[300px] p-4 lg:flex-row lg:gap-[30px] lg:justify-between"
    >
      <!-- 卡片區塊 -->

      <div
        @click="router.push(`/post/${item.post_id}`)"
        v-for="item in posts"
        :key="item.id"
        class="flex flex-col justify-center items-center m-0 mb-0 text-gray-800 w-full h-full relative max-w-[350px] sm:w-full sm:max-w-[400px] md:w-full md:max-w-[600px] cursor-pointer lg:max-w-[1000px]"
      >
        <!-- 頭貼區 -->
        <div class="flex w-full justify-start items-center px-4 md:px-8 lg:px-8">
          <div class="w-[40px] h-[40px] lg:w-[44px] lg:h-[44px]">
            <img
              :src="item.users.photo_url || defaultAvatar"
              alt="頭像"
              class="w-full h-full rounded-full aspect-square object-cover border-[2px] border-white shadow"
              @error="onAvatarImageError"
            />
          </div>
          <div class="line-clamp-2 ml-3 tracking-wider text-sm lg:text-[18px]">
            {{ item.users.display_name }}
          </div>
        </div>

        <!-- 內文區 -->
        <div
          class="a flex flex-col bg-white w-full min-w-[250px] my-4 p-4 rounded-xl shadow-md lg:max-h-[350px] lg:min-h-[300px] hover:scale-[1.05] transition-all duration-300"
        >
          <!-- 小三角形 -->
          <div
            class="b absolute top-[44px] left-5 md:left-10 lg:left-5 lg:top-[48px] border-l-[22px] border-b-[15px] border-l-transparent border-b-white"
          ></div>

          <div class="flex w-full py-2 lg:max-h-[350px] flex-nowrap">
            <!-- 內文區塊 -->
            <div class="flex-1 w-full mx-4 tracking-wide lg:min-h-[196px]">
              <div class="text-xs text-gray-400 sm:text-xs md:text-sm lg:text-sm">
                {{ formatDate(item.created_at) }}
              </div>
              <div class="line-clamp-2 my-1 text-base font-bold md:text-lg lg:text-xl">
                {{ item.post_title }}
              </div>
              <div
                class="line-clamp-2 tracking-wider text-[12.5px] leading-5 md:text-sm lg:text-base"
              >
                {{ item.post_content }}
              </div>
            </div>

            <!-- 圖片區塊 -->
            <div
              class="w-full min-w-[70px] max-w-[100px] sm:max-w-[100px] md:max-w-[120px] lg:max-h-[180px] lg:max-w-[180px] lg:min-w-[120px]"
            >
              <img
                :src="item.post_img"
                alt="文章照片"
                class="object-cover aspect-square rounded-xl w-full h-full shadow"
                @error="onPostImageError"
                loading="lazy"
              />
            </div>
          </div>

          <!-- 互動區 -->
          <div
            class="flex justify-evenly items-center w-full text-xs border-t-2 border-gray-100 pt-2 md:text-sm lg:text-[14.5px] lg:pt-3 lg:text-lg"
          >
            <div class="">👍🏻 {{ item._count.post_likes }} 讚</div>
            <div class="">💬 {{ item._count.post_comments }} 留言</div>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination-container mt-5 flex justify-center">
      <n-pagination
        v-model:page="currentPage"
        :page-count="Math.min(Math.ceil(totalPosts.length / postsPerPage), 5)"
        @update:page="handlePageChange"
      />
    </div>
    <div class="flex justify-center">
      <n-button
        circle
        type="success"
        @click="goToPostsPage"
        class="mt-5 p-2 w-40 text-white hover:scale-110 transition-all duration-300 hover:font-bold"
        >顯示更多貼文</n-button
      >
    </div>
  </div>
</template>
<style scoped>
* {
  font-family: '微軟正黑體';
}
/* 小三角形的預設樣式 */
.a .b {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 0.3s step-end,
    transform 0.5s step-end;
}

/* 滑鼠懸停時小三角形消失 */
.a:hover .b {
  opacity: 0;
  transition:
    opacity 0.5s step-start,
    transform 0.1s ease-in;
}
</style>
