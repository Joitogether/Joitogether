<script setup>
import { ref, computed, onMounted } from 'vue'
import {} from 'naive-ui'
import { getAllPostsAPI, getAllUsersAPI } from '@/apis/postApi'
import defaultAvatar from '@/assets/avatar.png'

const postsPerPage = 3 // 每頁顯示 15 個貼文
const currentPage = ref(1) // 當前頁碼
const totalPosts = ref([]) // 全部貼文資料

const users = ref([]) // 用來抓使用者資料
const posts = ref([]) // 用來抓貼文

const fetchData = async () => {
  try {
    const [postsData, usersData] = await Promise.all([getAllPostsAPI(), getAllUsersAPI()])

    if (postsData && usersData) {
      // 限制總貼文數量為 15 筆
      const limitedPosts = postsData.slice(0, 15)

      // 合併貼文和使用者資料
      totalPosts.value = limitedPosts.map((post) => {
        const user = usersData.find((user) => user.uid === post.uid) || {}
        return {
          ...post,
          user_name: user.full_name || '未知用戶',
          user_photo: user.photo_url || '@/assets/avatar.png',
          post_img: post.post_img,
          post_comments: post._count?.post_comments || 0,
          post_likes: post._count?.post_likes || 0,
        }
      })

      updatePosts() // 初始化顯示第一頁的資料
    }
  } catch (error) {
    console.error('資料加載失敗:', error)
  }
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

onMounted(() => {
  fetchData()
})
const postImgUrl =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTloBdf4Wa_JxRmW-03mPB_wfP-lBvTGh8-CQ&s'
const onPostImageError = (event) => {
  event.target.src = postImgUrl
}
const onAvatarImageError = (event) => {
  event.target.src = defaultAvatar
}
const formatDate = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}
</script>

<template>
  <div class="home-posts-area bg-gray-100 px-28 py-10">
    <div>
      <h2 class="text-3xl">最新貼文</h2>
    </div>
    <div class="post-label-area flex py-7 border-b-[1px] border-solid border-[rgba(61,57,44,0.1)]">
      <n-button
        circle
        type="warning"
        class="w-16 bg-yellow-400 text-gray-800 hover:font-bold hover:scale-110 transition-all duration-300"
        >最新</n-button
      >
      <n-button
        circle
        type="warning"
        class="w-16 bg-yellow-400 text-gray-800 hover:font-bold hover:scale-110 transition-all duration-300 mx-3"
        >熱門</n-button
      >
    </div>
    <div class="post-posts-area grid grid-cols-1 gap-4">
      <div v-for="item in posts" :key="item.id" class="post-onepost">
        <div class="post-onepost-top flex pt-5 pl-10 items-center cursor-pointer">
          <div class="one-post-img w-10 h-10 rounded-full overflow-hidden">
            <img
              :src="item.user_photo || defaultAvatar"
              alt="發文者大頭照"
              class="object-cover w-full h-full"
              @error="onAvatarImageError"
            />
          </div>

          <p class="ml-5 text-sm">{{ item.user_name }}</p>
        </div>
        <div class="one-post-bottom mt-2.5 px-6 bg-white rounded-2xl pb-4 cursor-pointer">
          <div
            class="post-bottom-top flex h-[180px] border-b-[1px] border-solid border-[rgba(61,57,44,0.1)]"
          >
            <div class="post-bottom-left w-52 leading-loose">
              <p class="text-slate-300 text-sm h-8 mt-6">{{ formatDate(item.created_at) }}</p>

              <h3 class="text-xl font-bold">{{ item.post_title }}</h3>
              <p class="post_content text-[16px]">
                {{ item.post_content }}
              </p>
            </div>
            <div class="post-bottom-right h-24 w-24 rounded-3xl overflow-hidden ml-2.5 mt-4">
              <img :src="item.post_img" alt="文章照片" @error="onPostImageError" />
            </div>
          </div>
          <div class="post-bottom-bottom flex leading-loose mt-6 mx-6">
            <div class="mr-8">👍🏻 {{ item.post_likes }}讚</div>
            <div>💬 {{ item.post_comments }} 留言</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="pagination-container mt-5 flex justify-center">
    <n-pagination
      v-model:page="currentPage"
      :page-count="Math.ceil(totalPosts.length / postsPerPage)"
      @update:page="handlePageChange"
    />
  </div>
  <div class="po-bottom mt-5 grid grid-cols-3">
    <div class="more-post-btn flex justify-center text-sm col-start-2">
      <n-button
        circle
        type="warning"
        class="w-40 bg-yellow-400 text-gray-800 hover:font-bold hover:scale-110 transition-all duration-300 mx-3"
        >更多熱門貼文</n-button
      >
    </div>
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
