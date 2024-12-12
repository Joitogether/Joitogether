<script setup>
import { ref, computed, onMounted } from 'vue'
import {} from 'naive-ui'

const currentPage = ref(1)
const nextPage = () => {
  if (currentPage.value >= 5) {
    return
  }
  currentPage.value++
}
const previousPage = () => {
  if (currentPage.value <= 1) {
    return
  }
  currentPage.value--
}

const posts = ref([
  {
    id: 1,
    title: '文章標題 1',
    content: '內文內容 1',
    author: '發文者 1',
    date: '2024-11-16',
    likes: 20,
    comments: 5,
  },
  {
    id: 2,
    title: '文章標題 2',
    content: '內文內容 2',
    author: '發文者 2',
    date: '2024-11-17',
    likes: 15,
    comments: 10,
  },
  {
    id: 3,
    title: '文章標題 3',
    content: '內文內容 3',
    author: '發文者 3',
    date: '2024-11-18',
    likes: 10,
    comments: 8,
  },
  {
    id: 4,
    title: '文章標題 4',
    content: '內文內容 4',
    author: '發文者 4',
    date: '2024-11-19',
    likes: 30,
    comments: 12,
  },
  {
    id: 5,
    title: '文章標題 5',
    content: '內文內容 5',
    author: '發文者 5',
    date: '2024-11-20',
    likes: 25,
    comments: 6,
  },
  {
    id: 6,
    title: '文章標題 6',
    content: '內文內容 6',
    author: '發文者 6',
    date: '2024-11-21',
    likes: 18,
    comments: 3,
  },
  {
    id: 7,
    title: '文章標題 7',
    content: '內文內容 7',
    author: '發文者 7',
    date: '2024-11-22',
    likes: 22,
    comments: 8,
  },
  {
    id: 8,
    title: '文章標題 8',
    content: '內文內容 8',
    author: '發文者 8',
    date: '2024-11-23',
    likes: 12,
    comments: 5,
  },
  {
    id: 9,
    title: '文章標題 9',
    content: '內文內容 9',
    author: '發文者 9',
    date: '2024-11-24',
    likes: 28,
    comments: 9,
  },
  {
    id: 10,
    title: '文章標題 10',
    content: '內文內容 10',
    author: '發文者 10',
    date: '2024-11-25',
    likes: 16,
    comments: 4,
  },
  {
    id: 11,
    title: '文章標題 11',
    content: '內文內容 11',
    author: '發文者 11',
    date: '2024-11-25',
    likes: 16,
    comments: 4,
  },
  {
    id: 12,
    title: '文章標題 12',
    content: '內文內容 12',
    author: '發文者 12',
    date: '2024-11-25',
    likes: 16,
    comments: 4,
  },
  {
    id: 13,
    title: '文章標題 13',
    content: '內文內容 13',
    author: '發文者 13',
    date: '2024-11-25',
    likes: 16,
    comments: 4,
  },
  {
    id: 14,
    title: '文章標題 14',
    content: '內文內容 14',
    author: '發文者 14',
    date: '2024-11-25',
    likes: 16,
    comments: 4,
  },
  {
    id: 15,
    title: '文章標題 15',
    content: '內文內容 15',
    author: '發文者 15',
    date: '2024-11-25',
    likes: 16,
    comments: 4,
  },
])

const postsPerPage = 3
const totalPages = computed(() => Math.ceil(posts.value.length / postsPerPage))
// 當前頁的貼文
const currentPosts = computed(() =>
  posts.value.slice((currentPage.value - 1) * postsPerPage, currentPage.value * postsPerPage),
)
// 切換頁碼
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
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
      <div v-for="(post, index) in posts" :key="post.id" class="post-onepost">
        <div class="post-onepost-top flex pt-5 pl-10 items-center cursor-pointer">
          <div class="one-post-img w-10 h-10 rounded-full overflow-hidden">
            <img
              src="https://image1.gamme.com.tw/news2/2017/49/24/q6CVnZ2YlKOesA.jpg"
              alt="發文者大頭照"
              class="object-cover w-full h-full"
            />
          </div>
          <p class="ml-5 text-sm"></p>
        </div>
        <div class="one-post-bottom mt-2.5 px-6 bg-white rounded-2xl pb-4 cursor-pointer">
          <div
            class="post-bottom-top flex h-[180px] border-b-[1px] border-solid border-[rgba(61,57,44,0.1)]"
          >
            <div class="post-bottom-left w-52 leading-loose">
              <p class="text-slate-300 text-sm h-8 mt-6">2024-11-16 23:59</p>
              <h3 class="text-xl font-bold">{{ post.title }}</h3>
              <p class="text-[16px]">{{ post.content }}</p>
            </div>
            <div class="post-bottom-right h-24 w-24 rounded-3xl overflow-hidden ml-2.5 mt-4">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTloBdf4Wa_JxRmW-03mPB_wfP-lBvTGh8-CQ&s"
                alt="文章照片"
              />
            </div>
          </div>
          <div class="post-bottom-bottom flex leading-loose mt-6 mx-6">
            <div class="mr-8">👍🏻 {{ post.likes }}讚</div>
            <div>💬 {{ post.comments }} 留言</div>
          </div>
        </div>
      </div>
    </div>

    <div class="post-area-bottom mt-5 grid grid-cols-3">
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
</style>
