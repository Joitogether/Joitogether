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
  <div class="flex flex-col justify-center items-center bg-gray-100 w-full p-4">
    <div v-for="item in posts" :key="item.id" class="m-6 mb-0 w-full h-full max-w-[600px] relative">
      <!-- 頭貼區 -->
      <div class="flex items-center pl-10">
        <div class="w-[40px] h-[40px]">
          <img
            :src="item.user_photo || defaultAvatar"
            alt=""
            class="bg-slate-700 w-full h-full rounded-full"
            @error="onAvatarImageError"
          />
        </div>
        <div class="mx-2">{{ item.users.display_name }}</div>
      </div>
      <div
        class="absolute top-[44px] left-5 border-l-[20px] border-l-transparent border-b-[20px] border-b-red-700"
      ></div>
      <!-- 內文 -->
      <div class="flex flex-col bg-white w-full my-4 p-4 rounded-xl">
        <div class="flex">
          <div class="mx-4 w-full min-w-[180px] max-w-[200px]">
            <div class="">{{ formatDate(item.created_at) }}</div>
            <div class="my-2">{{ item.post_title }}</div>
            <div class="line-clamp-2 w-full">
              {{ item.post_content }}
            </div>
          </div>
          <div class="">
            <img
              :src="item.post_img"
              alt="文章照片"
              class="object-cover aspect-square rounded-xl max-w-[100px] max-h-[100px]"
              @error="onPostImageError"
            />
          </div>
        </div>
        <div class="flex border-t-2 mt-4 pt-4">
          <div class="">👍🏻{{ item._count.post_likes }}讚</div>
          <div class="">💬{{ item._count.post_comments }}留言</div>
        </div>
      </div>
    </div>
  </div>

  <div class="home-posts-area bg-gray-100 px-28 py-10">
    <div>
      <h2 class="text-3xl">最新貼文</h2>
    </div>

    <div class="post-label-area flex py-7 border-b-[1px] border-solid border-[rgba(61,57,44,0.1)]">
      <n-button
        circle
        type="warning"
        @click="switchTab('latest')"
        class="w-16 text-gray-700 hover:font-bold hover:scale-110 transition-all duration-300"
        >最新</n-button
      >
      <n-button
        circle
        type="warning"
        @click="switchTab('popular')"
        class="w-16 text-gray-700 hover:font-bold hover:scale-110 transition-all duration-300 mx-3"
        >熱門</n-button
      >
    </div>

    <div class="post-posts-area grid grid-cols-1 gap-4">
      <div
        @click="router.push(`/post/${item.post_id}`)"
        v-for="item in posts"
        :key="item.id"
        class="post-onepost"
      >
        <div class="post-onepost-top flex pt-5 pl-10 items-center cursor-pointer">
          <div class="one-post-img w-10 h-10 rounded-full overflow-hidden">
            <img
              :src="item.user_photo || defaultAvatar"
              alt="發文者大頭照"
              class="object-cover w-full h-full"
              @error="onAvatarImageError"
            />
          </div>

          <p class="ml-5 text-sm">{{ item.users.display_name }}</p>
        </div>
        <div class="one-post-bottom mt-2.5 px-6 bg-white rounded-2xl pb-4 cursor-pointer">
          <div
            class="post-bottom-top flex flex-row items-start w-full h-full border-b-[1px] border-solid border-[rgba(61,57,44,0.1)]"
          >
            <div class="post-bottom-left w-full h-full lg:max-w-[300px] leading-loose">
              <p class="text-slate-300 text-sm h-8 mt-6">{{ formatDate(item.created_at) }}</p>

              <h3 class="text-xl font-bold">{{ item.post_title }}</h3>
              <p class="post_content text-[16px]">
                {{ item.post_content }}
              </p>
            </div>
            <div
              class="post-bottom-right max-h-[180px] max-w-[180px] rounded-3xl overflow-hidden ml-2.5 mt-4"
            >
              <img
                :src="item.post_img"
                alt="文章照片"
                @error="onPostImageError"
                class="w-full h-full max-h-[180px] max-w-[180px] object-cover aspect-square"
              />
            </div>
          </div>
          <div class="post-bottom-bottom flex leading-loose mt-6 mx-6">
            <div class="mr-8">👍🏻 {{ item._count.post_likes }}讚</div>
            <div>💬 {{ item._count.post_comments }} 留言</div>
          </div>
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
      type="warning"
      @click="goToPostsPage"
      class="mt-5 p-2 w-40 text-gray-700 hover:font-bold hover:scale-110 transition-all duration-300"
      >顯示更多貼文</n-button
    >
  </div>
</template>
<style scoped>
.one-post-bottom::before {
  content: '';
  float: left;
  border-color: transparent transparent rgb(255, 255, 255);
  border-style: solid;
  border-width: 8px 0px 10px 19px;
  position: relative;
  top: -18px;
}
@media screen and (768px <= width < 1024px) {
  .post-posts-area {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media screen and (width >= 1024px) {
  .switch-btn-left,
  .switch-btn-right {
    display: flex;
  }
  .page-number {
    display: block;
  }
  .post-posts-area {
    grid-template-columns: repeat(3, 1fr);
  }
}
.post_content {
  display: -webkit-box; /* 設定為彈性盒子 */
  -webkit-line-clamp: 2; /* 限制顯示的行數 */
  -webkit-box-orient: vertical; /* 垂直方向排列 */
  overflow: hidden; /* 隱藏多餘內容 */
  text-overflow: ellipsis; /* 添加省略號 */
}
</style>
