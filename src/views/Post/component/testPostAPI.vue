<template>
  <div class="p-6 font-sans">
    <h1 class="text-2xl font-bold mb-4">測試文章 API</h1>
    <p class="text-green-600" v-if="message">{{ message }}</p>

    <!-- 新增文章區塊 -->
    <section class="mb-6 bg-gray-100 p-4 rounded shadow">
      <h2 class="text-xl font-semibold mb-4">新增文章</h2>
      <input
        v-model="newPostTitle"
        placeholder="文章標題"
        class="mb-3 w-full p-2 border border-gray-300 rounded"
      />
      <select v-model="newPostCategory" class="mb-3 w-full p-2 border border-gray-300 rounded">
        <option value="" disabled>選擇分類</option>
        <option v-for="(label, key) in postCategories" :key="key" :value="key">
          {{ label }}
        </option>
      </select>
      <textarea
        v-model="newPostContent"
        placeholder="文章內容"
        class="mb-3 w-full p-2 border border-gray-300 rounded"
        rows="4"
      ></textarea>
      <button
        @click="submitPost"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        提交文章
      </button>
    </section>

    <!-- 留言區塊 -->
    <div class="mt-4">
      <input
        v-model="newComment"
        placeholder="新增留言"
        class="w-full p-2 border border-gray-300 rounded"
      />
      <button
        @click="submitComment"
        class="bg-green-500 text-white px-4 py-2 mt-2 rounded hover:bg-green-600"
      >
        提交留言
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getPosts, createPost } from '../../../apis/postAPIs'
import { createPostComment } from '../../../apis/postCommentAPIs'

// 儲存文章列表
const posts = ref([])

// 表單列表
const newPostTitle = ref('')
const newPostContent = ref('')
const newComment = ref('')
const newPostCategory = ref('')

// 狀態訊息
const message = ref('')

const postCategories = {
  food: '美食',
  shopping: '購物',
  travel: '旅遊',
  sports: '運動',
  education: '教育',
  others: '其他',
}

// const fetchPosts = async () => {
//   try {
//     const response = await getPosts()
//     posts.value = response.data // 假設後端返回 { data: [...] }
//     message.value = '文章列表載入成功'
//   } catch (error) {
//     console.error('載入文章列表失敗:', error)
//     message.value = '載入文章列表失敗'
//   }

// 測試新增文章
const submitPost = async () => {
  try {
    if (!newPostTitle.value) {
      message.value = '請選擇文章分類'
      return
    }
    const postData = {
      post_title: newPostTitle.value,
      post_content: newPostContent.value,
      uid: '7P6ocyCefPc8oTzjfAEs16RZThR2',
      post_category: newPostCategory.value,
      post_status: 'onEdit',
    }
    await createPost(postData)
    message.value = '文章新增成功'
    newPostTitle.value = ''
    newPostContent.value = ''
    console.log('傳送')
  } catch (error) {
    console.error('新增文章失敗:', error)
    message.value = '新增文章失敗'
  }
}

// 新增留言
const submitComment = async () => {
  try {
    const mockPostId = 13 // 測試用假的文章 ID
    const commentData = {
      comment_content: newComment.value,
      uid: '7P6ocyCefPc8oTzjfAEs16RZThR2',
    }
    await createPostComment(mockPostId, commentData) // mockPostId 之後要記得改掉
    message.value = '（測試用）留言新增成功'
    newComment.value = ''
    console.log('傳送')
  } catch (error) {
    console.error('新增留言失敗:', error)
    message.value = '新增留言失敗'
  }
}
// fetchPosts()
</script>

<style></style>
