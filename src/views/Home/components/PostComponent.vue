<script setup>
import { ref, computed, onMounted } from 'vue'
import {} from 'naive-ui'
import { getAllPostsAPI,getAllUsersAPI,getAllLikesAPI,getAllCommentsAPI } from '@/apis/postApi'
import { useUserStore } from '@/stores/userStore'
const users = ref([]) // 用來抓使用者資料
const posts = ref([]) // 用來抓貼文
const userStore = useUserStore()
console.log('123', userStore)


// 抓取貼文與使用者
const fetchData = async () => {
  try {
    // 同時發送四個 API 請求
    const [postsData, usersData, likesData, commentsData] = await Promise.all([
      getAllPostsAPI(),
      getAllUsersAPI(),
      getAllLikesAPI(),
      getAllCommentsAPI()
    ])

    if (postsData && usersData && likesData && commentsData) {
      users.value = usersData

      // 合併貼文、使用者、按讚、留言資料
      posts.value = postsData.map(post => {
        // 找到對應的使用者資料
        const user = users.value.find(user => user.uid === post.uid) || {}

        // 找到對應的按讚資料
        const likeData = likesData.find(like => like.post_id === post.id) || {}
        const likeCount = likeData.count || 0

        // 找到對應的留言資料
        const commentData = commentsData.find(comment => comment.post_id === post.id) || {}
        const commentCount = commentData.count || 0

        // 合併所有資料
        return {
          ...post,
          user_name: user.full_name || '未知用戶',
          user_photo: user.photo_url || 'https://default-profile.jpg',
          likes: likeCount,
          comments: commentCount
        }
      })

      console.log('最終合併後的貼文資料:', posts.value)
    }
  } catch (error) {
    console.error('資料加載失敗:', error)
  }
}

onMounted(() => {
  fetchData()
})
// const fetchPosts = async () => {
//   const response = await getAllPostsAPI()
//   if (response) {
//     posts.value = response
//     console.log('貼文資料', posts.value)
//   } else {
//     console.log('貼文資料失敗')
//   }
// }

// onMounted(() => {
//   fetchPosts()
// })

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
      <div v-for="(item, index) in posts" :key="item.id" class="post-onepost">
        <div class="post-onepost-top flex pt-5 pl-10 items-center cursor-pointer">
          <div class="one-post-img w-10 h-10 rounded-full overflow-hidden">
            <img
              src="https://image1.gamme.com.tw/news2/2017/49/24/q6CVnZ2YlKOesA.jpg"
              alt="發文者大頭照"
              class="object-cover w-full h-full"
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
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTloBdf4Wa_JxRmW-03mPB_wfP-lBvTGh8-CQ&s"
                alt="文章照片"
              />
            </div>
          </div>
          <div class="post-bottom-bottom flex leading-loose mt-6 mx-6">
            <div class="mr-8">👍🏻 {{}}讚</div>
            <div>💬 {{}} 留言</div>
          </div>
        </div>
      </div>
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
      <n-pagination v-model:previousPage="nextPage" :page-count="5" />

      <!-- 原本的分頁按鈕 -->
      <div class="change-post-btn flex justify-end text-zinc-600 leading-loose">
        <p class="page-number content-center hidden">{{ currentPage }} / 5</p>
        <button
          @click="previousPage"
          class="switch-btn-left hidden ml-5 text-base rounded-full bg-gray-300 w-10 h-10 text-center justify-center items-center"
        >
          <p class="font-black">＜</p>
        </button>
        <button
          @click="nextPage"
          class="switch-btn-right hidden ml-5 text-base rounded-full bg-gray-300 w-10 h-10 text-cente justify-center items-center"
        >
          <label class="font-black" type="number">＞</label>
        </button>
      </div>
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
