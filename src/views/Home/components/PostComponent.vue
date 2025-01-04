<script setup>
import { ref, onMounted } from 'vue'
import { getLatestPostsAPI, getPopularPostsAPI } from '@/apis/postAPIs.js'
import defaultAvatar from '@/assets/avatar.png'
import { useRouter } from 'vue-router'
import { handleError } from '@/utils/handleError.js'
import { useMessage } from 'naive-ui'

const message = useMessage()
const router = useRouter()
const currentPage = ref(1)
const totalPosts = ref([])
const postsPerPage = 3

const posts = ref([])
const latestPosts = ref([])
const popularPosts = ref([])
const activieTab = ref('latest')
const goToPostsPage = () => {
  router.push('/posts')
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
    handleError(message, undefined, error)
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
    handleError(message, undefined, error)
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
  <div class="bg-gray-100 flex flex-col gap-5 w-full py-10 lg:gap-7">
    <div class="w-full flex justify-center">
      <h2 class="text-[28px] text-gray-800 font-bold min-w-[120px] lg:text-[34px]">最新貼文</h2>
    </div>

    <div class="flex justify-center">
      <div class="flex justify-between w-3/5 h-9 gap-5 md:w-1/2 lg:w-4/12 lg:h-10 lg:gap-10">
        <div class="w-1/2 text-base text-white hover:scale-[1.1] transition-all duration-300">
          <n-button
            circle
            type="success"
            @click="switchTab('latest')"
            class="w-full h-full hover:font-bold text-base"
            >最新</n-button
          >
        </div>
        <div class="w-1/2 text-base text-white hover:scale-[1.1] transition-all duration-300">
          <n-button
            circle
            type="success"
            @click="switchTab('popular')"
            class="w-full h-full hover:font-bold text-base"
            >熱門</n-button
          >
        </div>
      </div>
    </div>

    <div
      class="flex flex-col w-4/5 mx-auto justify-center items-center bg-gray-100 md:w-3/4 lg:flex-row lg:w-11/12 lg:max-w-[1150px] lg:justify-between"
    >
      <!-- 卡片區塊 -->

      <div
        @click="router.push(`/post/${item.post_id}`)"
        v-for="item in posts"
        :key="item.id"
        class="flex flex-col justify-center items-center text-gray-800 w-full h-full relative md:max-w-[600px] cursor-pointer lg:max-w-[350px]"
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
          <div class="line-clamp-2 ml-3 tracking-wide text-base font-bold lg:text-[18px]">
            {{ item.users.display_name }}
          </div>
        </div>

        <!-- 內文區 -->
        <div
          class="a flex flex-col bg-white w-full my-4 p-4 rounded-xl shadow-md hover:scale-[1.05] transition-all duration-300"
        >
          <!-- 小三角形 -->
          <div
            class="b absolute top-[44px] left-5 md:left-10 lg:left-5 lg:top-[48px] border-l-[22px] border-b-[15px] border-l-transparent border-b-white"
          ></div>

          <div class="flex gap-2 w-full py-2 flex-nowrap items-center">
            <!-- 內文區塊 -->
            <div class="flex-1 w-full tracking-wide lg:min-h-28">
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
            <div class="w-24 h-24 aspect-square">
              <img
                v-if="item.post_img"
                :src="item.post_img"
                alt="文章照片"
                class="object-cover aspect-square rounded-xl w-full h-full shadow"
                @error="onPostImageError"
                loading="lazy"
              />
              <div v-else class="aspect-square w-full h-full"></div>
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
        class="mt-5 p-2 w-40 h-10 text-white hover:scale-110 transition-all duration-300 hover:font-bold"
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
