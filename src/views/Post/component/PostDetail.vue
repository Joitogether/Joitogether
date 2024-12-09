<script setup>
import { onMounted, reactive, ref } from 'vue'
// import NaveBar from '@/views/Home/components/NavbarComponent.vue'
import { NavArrowLeft } from '@iconoir/vue'
import { useRoute, useRouter } from 'vue-router'
import { getPostById } from '@/apis/postAPIs'

const route = useRoute()
const router = useRouter()

const postId = Number(route.params.post_id) // 轉換為數字
console.log('postId:', postId)

const postDetails = reactive({
  title: '',
  content: '',
  time: '',
  img: '',
  name: '',
  avatar: '',
})

const fetchPostDetails = async () => {
  console.log('發送 API 請求到:', `/posts/${postId}`)

  try {
    const post = await getPostById(postId)
    console.log(`API回傳的文章：`, post)

    const userRes = await getPostById(postId)
    const user = userRes.data

    postDetails.title = post.data.post_title
    postDetails.content = post.data.post_content
    postDetails.time = post.data.updated_at
    postDetails.img = post.data.post_img
    postDetails.name = user.users.display_name // 文章發佈者的名稱
    postDetails.avatar = user.users.photo_url // 文章發佈者的頭像 URL
  } catch (error) {
    console.error(`獲取 ${postId}文章資料失敗`, error.response?.data || error.message)
  }
}
const goPostPage = () => {
  router.push('/post')
}

onMounted(() => {
  console.log('正在加載文章', postId)

  fetchPostDetails()
})
</script>

<template>
  <!-- <NaveBar /> -->
  <div class="bg-gray-100 h-12 flex items-center p-4 relative">
    <NavArrowLeft
      stroke-width="2"
      class="w-6 h-6 cursor-pointer"
      @click="goPostPage"
    ></NavArrowLeft>
    <p class="text-lg absolute left-1/2 transform -translate-x-1/2">美食</p>
  </div>
  <div class="p-6">
    <div class="">
      <p class="text-xl font-bold">{{ postDetails.title }}</p>
    </div>
    <div class="">
      <!-- 發文者的資訊區 -->
      <div class="flex flex-row items-center mt-4 mb-4">
        <div class="w-16 h-16 rounded-full overflow-hidden mr-4">
          <img
            class="w-full h-full object-cover"
            alt=""
            :src="
              postDetails.avatar ||
              'https://i.pinimg.com/736x/20/3e/d7/203ed7d8550c2c1c145a2fb24b6fbca3.jpg'
            "
          />
        </div>
        <div>
          <div class="text-lg">{{ postDetails.name }}</div>
          <div class="text-sm text-gray-400">{{ postDetails.time }}</div>
        </div>
      </div>
      <!-- 文章資訊區 -->
      <div class="items-center">
        <div class="mb-6 text-base">文章內容{{ postDetails.content }}</div>
        <div v-if="postDetails.img" class="w-full h-full rounded-lg overflow-hidden">
          <img class="w-full h-full object-cover" :src="postDetails.img" alt="發文者圖片" />
        </div>
        <div class="flex justify-between my-6">
          <div class="flex">
            <div class="px-2 text-sm">👍🏻 20 讚</div>
            <div class="px-2 text-sm">💬 10 留言</div>
          </div>
        </div>
        <!-- <hr /> -->
        <!-- 功能操作區 -->
        <div class="flex justify-between gap-4 items-center h-12">
          <button class="w-1/2 h-full flex justify-center items-center bg-yellow-300 rounded-full">
            讚
          </button>
          <button class="w-1/2 h-full flex justify-center items-center bg-yellow-300 rounded-full">
            留言
          </button>
        </div>
        <!-- <hr /> -->
        <!-- 留言區 -->
        <div class="my-3">
          <!-- 目前使用者 -->
          <div class="flex">
            <div class="aspect-square w-20 rounded-full">
              <img
                class="w-3/4 h-3/4 rounded-full"
                alt=""
                :src="'https://i.pinimg.com/736x/20/3e/d7/203ed7d8550c2c1c145a2fb24b6fbca3.jpg'"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="說說你的看法"
                class="flex-grow p-3 border-none focus:outline-none text-base"
              />
              <button>留言</button>
            </div>
          </div>
          <!-- 其他使用者留言 -->
          <div class="flex my-3">
            <div class="aspect-square w-20 rounded-full">
              <img
                class="w-3/4 h-3/4 rounded-full"
                alt=""
                :src="'https://i.pinimg.com/736x/20/3e/d7/203ed7d8550c2c1c145a2fb24b6fbca3.jpg'"
              />
            </div>
            <div class="items-center p-2 border border-gray-300 rounded-md w-56">
              <div class="text-sm">留言者名稱</div>
              <div class="text-sm">留言內容</div>
            </div>
          </div>
          <div>
            <button>查看更多留言.....</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
