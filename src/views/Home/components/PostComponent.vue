<script setup>
import { ref, onMounted } from 'vue'
import { getLatestPostsAPI, getPopularPostsAPI } from '@/apis/postAPIs.js'
import defaultAvatar from '@/assets/avatar.png'
import { useRouter } from 'vue-router'

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
  const response = await getLatestPostsAPI()
  if (response) {
    latestPosts.value = response.data
    totalPosts.value = latestPosts.value
    return updatePosts()
  }
}

const fetchPopularPostsData = async () => {
  const response = await getPopularPostsAPI()
  if (response) {
    popularPosts.value = response.data.sort((a, b) => {
      return b._count.post_likes - a._count.post_likes
    })
    totalPosts.value = popularPosts.value
    if (activieTab.value === 'popular') {
      totalPosts.value = popularPosts.value
      updatePosts()
    }
  } else {
    console.log('fetchPopularPostsData失敗')
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
  <div class="bg-gray-100 w-full min-w-[300px] p-4 px-28 py-10">
    <div>
      <h2 class="text-3xl min-w-[200px]">最新貼文</h2>
    </div>

    <div class="post-label-area flex py-7 border-b-[1px] border-solid border-[rgba(61,57,44,0.1)]">
      <n-button
        circle
        type="success"
        @click="switchTab('latest')"
        class="w-16 text-white hover:scale-110 transition-all duration-300"
        >最新</n-button
      >
      <n-button
        circle
        type="success"
        @click="switchTab('popular')"
        class="w-16 text-white hover:scale-110 transition-all duration-300 mx-3"
        >熱門</n-button
      >
    </div>
    <div
      class="flex flex-col justify-center items-center bg-gray-100 w-full min-w-[300px] p-4 lg:flex-row lg:gap-6"
    >
      <!-- 卡片區塊 -->

      <div
        @click="router.push(`/post/${item.post_id}`)"
        v-for="item in posts"
        :key="item.id"
        class="flex flex-col justify-center items-center m-6 mb-0 w-full h-full relative max-w-[350px] sm:w-full sm:max-w-[400px] md:w-full md:max-w-[600px] cursor-pointer"
      >
        <!-- 頭貼區 -->
        <div class="flex w-full justify-start items-center px-4 md:px-8 lg:px-4">
          <div class="w-[40px] h-[40px]">
            <img
              :src="item.users.photo_url || defaultAvatar"
              alt="頭像"
              class="bg-slate-700 w-full h-full rounded-full aspect-square object-cover"
              @error="onAvatarImageError"
            />
          </div>
          <div class="ml-3 tracking-wider text-sm lg:text-base">{{ item.users.display_name }}</div>
        </div>

        <!-- 內文區 -->
        <div
          class="flex flex-col bg-white w-full min-w-[250px] my-4 p-4 rounded-xl shadow-md lg:h-[230px]"
        >
          <!-- 小三角形 -->
          <div
            class="absolute top-[44px] left-5 md:left-10 lg:left-5 border-l-[22px] border-b-[15px] border-l-transparent border-b-white"
          ></div>

          <div class="flex w-full py-2 lg:max-h-[150px] flex-nowrap">
            <!-- 內文區塊 -->
            <div class="flex-1 mx-4 tracking-wide min-w-[100px]">
              <div class="text-xs text-gray-400 sm:text-xs md:text-sm lg:text-sm lg:min-w-[150px]">
                {{ formatDate(item.created_at) }}
              </div>
              <div class="my-1 text-base font-bold md:text-lg lg:text-xl lg:min-w-[150px]">
                {{ item.post_title }}
              </div>
              <div
                class="line-clamp-2 tracking-wider text-[12.5px] leading-5 md:text-sm lg:text-base lg:min-w-[150px]"
              >
                {{ item.post_content }}
              </div>
            </div>

            <!-- 圖片區塊 -->
            <div
              class="w-full min-w-[70px] max-w-[100px] sm:max-w-[100px] md:max-w-[120px] lg:h-[130px] lg:w-[130px] h-auto"
            >
              <img
                :src="item.post_img"
                alt="文章照片"
                class="object-cover aspect-square rounded-xl w-full h-full"
                @error="onPostImageError"
                loading="lazy"
              />
            </div>
          </div>

          <!-- 互動區 -->
          <div
            class="flex justify-evenly items-center w-full text-xs border-t-2 mt-2 pt-2 md:text-sm lg:text-[14.5px] lg:py-4"
          >
            <div class="mx-5">👍🏻 {{ item._count.post_likes }} 讚</div>
            <div class="mx-5">💬 {{ item._count.post_comments }} 留言</div>
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
        class="mt-5 p-2 w-40 text-white hover:scale-110 transition-all duration-300"
        >顯示更多貼文</n-button
      >
    </div>
  </div>
</template>
<style scoped>
* {
  font-family: '微軟正黑體';
}
</style>
