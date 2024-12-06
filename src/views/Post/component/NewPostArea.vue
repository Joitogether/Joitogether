<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { submitPost } from '../services/postService'
import { useMessage, NButton, NModal, NAvatar } from 'naive-ui'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

// 版面欄位
const showModal = ref(false)
const currentSmallTalk = ref('')
const userStore = useUserStore()
const message = useMessage()

// 打進後端的資料
const newPostTitle = ref('')
const newPostContent = ref('')
const newPostCategory = ref(null) // 不用 null 的話就不會顯示選擇文章分類
const imageUrl = ref(null)

const postCategories = [
  { label: '美食', value: 'food' },
  { label: '購物', value: 'shopping' },
  { label: '旅遊', value: 'travel' },
  { label: '運動', value: 'sports' },
  { label: '教育', value: 'education' },
  { label: '其他', value: 'others' },
]

// 新增文章
const handleSubmit = async () => {
  if (!userStore.user.isLogin) {
    message.error('請先登入後再發文！')
    return
  }

  const postData = {
    post_title: newPostTitle.value,
    post_content: newPostContent.value,
    uid: userStore.user.uid,
    post_category: newPostCategory.value,
    post_status: 'posted',
    post_img: imageUrl.value || '',
  }
  try {
    await submitPost(postData)
    message.success('文章新增成功')
    console.log('傳送')
    showModal.value = true
    setTimeout(() => {
      showModal.value = false
      newPostTitle.value = ''
      newPostContent.value = ''
      newPostCategory.value = null
    }, 1500) // 設置 1.5 秒後關閉
  } catch (error) {
    console.log(error)
  }
}

// 圖片功能
const selectedFile = ref(null)
const uploadedImage = ref(null)
const imagePreview = ref(null)
const fileInput = ref(null)

// 觸發文件選擇
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click() // 觸發文件選擇框
  }
}

const uploadFile = async (file) => {
  try {
    const storage = getStorage()
    const fileRef = storageRef(storage, `postImages/${file.name}`)
    const result = await uploadBytes(fileRef, file) // 上傳檔案
    const downloadURL = await getDownloadURL(result.ref) // 獲取下載連結
    console.log('上傳成功，下載連結:', downloadURL)
    imageUrl.value = downloadURL
    return downloadURL // 傳回下載連結
  } catch (error) {
    console.error('圖片上傳失敗')
    throw error
  }
}

// 處理圖片上傳與預覽
const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file

    // 建立圖片預覽
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result // 設定預覽 URL
    }
    reader.readAsDataURL(file)
    // 上傳圖片
    try {
      await uploadFile(file)
    } catch (error) {
      console.error('圖片上傳失敗:', error)
      message.error('圖片上傳失敗，請檢查檔案格式或網路連線')
    }
  }
}
// 移除圖片
const removeImage = () => {
  imagePreview.value = null
  uploadedImage.value = null
}

const smallTalk = [
  '沒靈感嗎？🤔 試著寫下第一個想到的想法吧～有時靈感就是這麼突然！✨',
  '靈感是累積的！✏️ 從簡單的幾個字開始吧～慢慢就能捕捉到更多靈感！✨',
  '別擔心！💡 說出內心最真的聲音～你的創意會讓人眼前一亮！✨',
  '讓創意自由翱翔吧！🚀 別被框架束縛～隨意寫下你想說的話！✨',
  '💪 你的想法一定很棒！趁現在動筆吧～世界正期待你的獨特聲音！✨',
  '🌈 期待你的精彩創作！從一點小靈感開始～讓它成為閃耀的作品吧！✨',
  '嘿嘿～想不到寫什麼嗎？🤭 試試胡思亂想一番吧～說不定腦洞會變成驚喜哦！✨',
  '別害羞！😜 隨便寫些有趣的事情吧～好玩的靈感可是不會自己跑出來哦！✨',
  '靈感也需要鍛煉呢！💪 試著寫個沙雕小故事～有趣的點子都藏在裡面！✨',
  '哎呀～還在發呆嗎？🤔 趕緊動手吧～你的創意一定會萌到大家！✨',
  '想不到？🙈 試著想像你是貓咪吧～有趣的靈感就在喵喵叫裡蹦出來！✨',
  '哈哈哈，別糾結啦！😂 寫下第一個腦海中浮現的字，接下來就超順了！✨',
  '喂～放輕鬆點啦！😎 隨意寫些奇思妙想，誰說天馬行空不行呢？✨',
  '靈感賴床了嗎？🛌 快喚醒它～寫點搞笑的內容，笑聲能激發更多靈感！✨',
]

const bodyStyle = {
  width: '1000px',
}
const segmented = {
  content: 'soft',
}

// 更新 Small Talk
watch(showModal, (newValue) => {
  if (newValue) {
    currentSmallTalk.value = smallTalk[Math.floor(Math.random() * smallTalk.length)]
  }
})
</script>

<template>
  <div class="flex justify-between items-center p-4 border border-gray-300 rounded-md mt-3">
    <div class="w-1/3 flex justify-center">
      <n-avatar
        round
        :size="100"
        :src="
          userStore.user.photoURL ||
          'https://i.pinimg.com/736x/20/3e/d7/203ed7d8550c2c1c145a2fb24b6fbca3.jpg'
        "
      />
    </div>

    <div class="w-2/3 flex flex-col justify-center pl-4 mt-4">
      <div class="mb-0 text-lg font-xl ml-5">
        (｡•̀ᴗ-)✧ {{ userStore.user.displayName || '訪客' }}
      </div>
      <n-button @click="showModal = true" class="w-100 m-4 rounded-full">
        📝 記錄一刻，分享所有 🐾
      </n-button>
    </div>
  </div>

  <n-modal
    v-model:show="showModal"
    class="custom-card overflow-y-scroll"
    preset="card"
    :style="bodyStyle"
    size="huge"
    :bordered="false"
    :segmented="segmented"
  >
    <template #header-extra
      ><span class="hidden sm:block">👋 再見只是為了下一次見面～😊</span></template
    >
    <template #header>
      <div>
        <n-h1 prefix="bar" align-text type="success">
          <n-text type="success">
            <span>{{ newPostTitle || '✏️ 標題' }}</span>
          </n-text>
        </n-h1>
      </div>
    </template>
    <template #default>
      <div class="flex flex-col lg:flex-row">
        <div class="flex-shrink-0 mb-4 lg:mb-0 lg:mr-20">
          <n-avatar
            round
            :size="110"
            :src="
              userStore.user.photoURL ||
              'https://i.pinimg.com/736x/20/3e/d7/203ed7d8550c2c1c145a2fb24b6fbca3.jpg'
            "
          />
        </div>

        <div class="flex flex-col space-y-4">
          <n-h1 prefix="bar" align-text type="success">
            <n-input
              v-model:value="newPostTitle"
              size="large"
              round
              placeholder="🌟 輸入你的超棒標題吧！(๑•̀ㅂ•́)و✧"
            />
          </n-h1>
          <n-space vertical>
            <n-select
              placeholder="請選擇文章分類"
              v-model:value="newPostCategory"
              :options="postCategories"
            />
          </n-space>
          <span class="small-talk lg:inline-block text-sm font-medium text-gray-400">
            {{ currentSmallTalk }}</span
          >
        </div>
      </div>
      <div class="p-4 bg-white border border-gray-300 rounded-lg mt-4 mb-4">
        <!-- 上傳圖片按鈕 -->
        <div class="flex justify-center">
          <button
            class="mt-2 bg-green-600 text-white font-bold py-2 px-4 rounded-full hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-600"
            @click="triggerFileInput"
          >
            上傳圖片
          </button>
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            multiple
            accept="image/*"
            @change="handleImageUpload"
          />
        </div>

        <!-- 圖片預覽 -->
        <div v-if="imagePreview" class="mt-4 flex justify-center">
          <div
            class="relative bg-gray-100 border border-gray-300 rounded-lg overflow-hidden w-32 h-32"
          >
            <img :src="imagePreview" alt="圖片預覽" class="w-full h-full object-cover" />
            <button
              class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 focus:outline-none"
              @click="removeImage"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
      <div>
        <n-input
          type="textarea"
          v-model:value="newPostContent"
          round
          placeholder="📝 快來寫下你的精彩內容吧～ (｡♥‿♥｡)"
          :autosize="{
            minRows: 8,
          }"
          class="w-full"
        />
      </div>
      <div class="flex justify-center lg:justify-end p-4">
        <n-button type="primary" size="large" round @click="handleSubmit" class="px-6 py-3">
          送出 🚀
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<style scoped>
h1 {
  margin: 0 0 0 0;
}
</style>
