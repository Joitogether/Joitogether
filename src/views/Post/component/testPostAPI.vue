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
      <input type="file" @change="handleFileUpload" class="mb-3 w-full" />
      <div v-if="imagePreview" class="mb-3">
        <p class="text-gray-500">圖片預覽：</p>
        <img :src="imagePreview" alt="預覽圖片" class="w-32 h-32 object-cover rounded border" />
      </div>
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
import { useUserStore } from '@/stores/userStore'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const auth = getAuth()
const storage = getStorage()

const uploadFile = async (file) => {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error('未登入，無法上傳')
    }
    const fileRef = ref(storage, `postImages/${file.name}`)
    const result = await uploadBytes(fileRef, file) // 上傳檔案
    const downloadURL = await getDownloadURL(result.ref) // 獲取下載連結
    console.log('上傳成功，下載連結:', downloadURL)
    return downloadURL // 傳回下載連結
  } catch (error) {
    console.error(error)
    throw error
  }
}

// 監聽登入狀態
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('登入成功')
  } else {
    console.log('未登入')
  }
})

// 儲存文章列表
const posts = ref([])

// 表單列表
const newPostTitle = ref('')
const newPostContent = ref('')
const newComment = ref('')
const newPostCategory = ref('')
const selectedFile = ref(null)
const uploadedImage = ref(null)
const imagePreview = ref(null)

// 狀態訊息
const message = ref('')

const userStore = useUserStore()

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

// 處理圖片上傳與預覽
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file

    // 建立圖片預覽
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result // 設定預覽 URL
    }
    reader.readAsDataURL(file)
  }
}

// 測試新增文章
const submitPost = async () => {
  if (!userStore.user.isLogin) {
    message.value = '請先登入'
    return
  }

  try {
    if (!newPostTitle.value) {
      message.value = '請選擇文章分類'
      return
    }
    let imageUrl = ''
    if (selectedFile.value) {
      const fileRef = storageRef(storage, `postImages/${selectedFile.value.name}`) // 使用 postImages 資料夾
      const snapshot = await uploadBytes(fileRef, selectedFile.value)
      imageUrl = await getDownloadURL(snapshot.ref) // 取得圖片 URL
    }
    const postData = {
      post_title: newPostTitle.value,
      post_content: newPostContent.value,
      uid: userStore.user.uid,
      post_category: newPostCategory.value,
      post_status: 'onEdit',
      post_img: imageUrl,
    }
    await createPost(postData)

    message.value = '文章新增成功'

    // 清空表單
    newPostTitle.value = ''
    newPostContent.value = ''
    newPostCategory.value = ''
    selectedFile.value = null
    uploadedImage.value = null
    imagePreview.value = null

    const fileInput = document.querySelector('input[type="file"]')
    fileInput.value = '' // 重設檔案選擇

    console.log('傳送')
  } catch (error) {
    console.error('新增文章失敗:', error)
    message.value = '新增文章失敗'
  }
}

// 新增留言
const submitComment = async () => {
  if (!userStore.user.isLogin) {
    message.value = '請先登入'
    return
  }
  try {
    const mockPostId = 13 // 測試用假的文章 ID
    const commentData = {
      comment_content: newComment.value,
      uid: userStore.user.uid,
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
