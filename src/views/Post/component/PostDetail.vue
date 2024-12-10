<script setup>
import { onMounted, reactive, ref } from 'vue'
// import NaveBar from '@/views/Home/components/NavbarComponent.vue'
import { NavArrowLeft } from '@iconoir/vue'
import { useRoute, useRouter } from 'vue-router'
import { getPostById } from '@/apis/postAPIs'
import { getPostComments } from '@/apis/postCommentAPIs'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw.js'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('zh-tw')
dayjs.extend(relativeTime)
const route = useRoute()
const router = useRouter()

const postId = Number(route.params.post_id) // 轉換為數字
console.log('postId:', postId)

const postDetails = reactive({
  category: '',
  title: '',
  content: '',
  time: '',
  img: '',
  name: '',
  avatar: '',
})

const categoryMap = {
  food: '美食',
  shopping: '購物',
  travel: '旅遊',
  sports: '運動',
  education: '教育',
  others: '其他',
}

const commentList = ref([])
const commentCount = ref(0)

const fetchPostDetails = async () => {
  try {
    const post = await getPostById(postId)
    console.log(`API回傳的文章：`, post)

    const userRes = await getPostById(postId)
    const user = userRes.data

    postDetails.category = categoryMap[post.data.post_category] || '未分類'
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

const fetchComments = async () => {
  try {
    const res = await getPostComments(postId)

    const comments = res.data

    console.log(`API回傳的留言：`, comments)

    commentCount.value = comments.length || 0

    const formattedComments = comments.map((comment) => ({
      id: comment.comment_id,
      content: comment.comment_content,
      time: comment.created_at,
      name: comment.uid,
      // avatar: user.users.photo_url || '',
    }))

    commentList.value = formattedComments

    console.log(`文章 ${postId} 的留言已更新：`, commentList.value)
    console.log(`文章 ${postId} 的留言數量：`, commentCount.value)
  } catch (error) {
    console.error(`取得使用者資料失敗`, error)
  }
}

const goPostPage = () => {
  router.push('/post')
}

onMounted(() => {
  console.log('正在加載文章', postId)

  fetchPostDetails()
  fetchComments()
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
    <p class="text-lg absolute left-1/2 transform -translate-x-1/2">{{ postDetails.category }}</p>
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
        <div class="mb-6 text-base">{{ postDetails.content }}</div>
        <div v-if="postDetails.img" class="w-full h-full rounded-lg overflow-hidden">
          <img class="w-full h-full object-cover" :src="postDetails.img" alt="發文者圖片" />
        </div>
        <div class="flex justify-between my-6">
          <div class="flex">
            <div class="px-2 text-sm">👍🏻 20 讚</div>
            <div class="px-2 text-sm">💬 {{ commentCount }} 留言</div>
          </div>
        </div>
        <!-- <hr /> -->
        <!-- 功能操作區 -->
        <div class="flex justify-between gap-4 items-center h-12 mb-4">
          <button
            class="w-1/2 h-full flex justify-center items-center bg-yellow-300 rounded-full hover:bg-yellow-400"
          >
            讚
          </button>
          <button
            class="w-1/2 h-full flex justify-center items-center bg-yellow-300 rounded-full hover:bg-yellow-400"
          >
            留言
          </button>
        </div>
        <!-- <hr /> -->
        <!-- 留言區 -->
        <div class="p-6 bg-gray-100 rounded-lg shadow-md">
          <!-- 留言列表 -->
          <div v-if="commentList.length" class="space-y-6">
            <div
              v-for="comment in commentList"
              :key="comment.id"
              class="flex items-start space-x-3 border-b pb-4"
            >
              <div class="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center">
                <img alt="User Avatar" class="w-full h-full bg-yellow-200 object-cover" />
              </div>
              <div>
                <p class="font-semibold text-gray-800 text-sm">{{ comment.name }}</p>
                <p class="text-gray-600 text-base">{{ comment.content }}</p>
                <p class="text-gray-400 text-sm">{{ dayjs(comment.time).fromNow() }}</p>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500">目前沒有留言，快來留下第一則吧！</p>

          <!-- 新增留言 -->
          <div class="mt-6 flex justify-between space-x-3">
            <div class="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
              <img alt="User Avatar" class="w-full h-full bg-yellow-200 object-cover" />
            </div>
            <textarea
              rows="3"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="原本想說點什麼 但想想還是算了"
              style="resize: none"
            ></textarea>
          </div>
          <div class="flex justify-end">
            <button
              @click="addComment"
              class="mt-2 px-6 py-2 bg-yellow-300 text-black rounded-full hover:bg-yellow-400 focus:outline-none"
            >
              送出
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
