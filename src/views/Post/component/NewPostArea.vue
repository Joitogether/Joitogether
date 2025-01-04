<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from '@/stores/userStore.js'
import { createPostAPI } from '@/apis/postAPIs'
import { useMessage, NButton, NModal } from 'naive-ui'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { handleError } from '@/utils/handleError.js'
import { useSocketStore } from '@/stores/socketStore.js'

// 版面欄位
const showModal = ref(false)
const currentSmallTalk = ref('')
const userStore = useUserStore()
const message = useMessage()
const modalStyle = ref({
  width: '100%',
})

// 圖片功能
const selectedFile = ref(null)
const uploadedImage = ref(null)
const imagePreview = ref(null)
const fileInput = ref(null)

// 打進後端的資料
const newPostTitle = ref('')
const newPostContent = ref('')
const newPostCategory = ref(null)
const imageUrl = ref(null)
const socketStore = useSocketStore()

const postCategories = [
  { label: '美食', value: 'food' },
  { label: '購物', value: 'shopping' },
  { label: '旅遊', value: 'travel' },
  { label: '運動', value: 'sports' },
  { label: '教育', value: 'education' },
  { label: '其他', value: 'others' },
]

const handleNewPost = () => {
  if (!userStore.user.isLogin) {
    message.error('登入後就可以發廢文囉！')
  } else {
    showModal.value = true
  }
}

// 新增文章
const handleSubmit = async () => {
  if (!userStore.user.isLogin) {
    message.error('請先登入後再發文！')
    return
  }
  if (!newPostTitle.value) {
    message.error('文章標題不可為空')
    return
  }
  if (!newPostContent.value) {
    message.error('文章內容不可為空')
    return
  }
  if (!newPostCategory.value) {
    message.error('請選擇文章分類')
    return
  }
  // 檢查標題字數
  if (newPostTitle.value.length > 10) {
    message.error('標題不可超過 10 個字！')
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
    const response = await createPostAPI(postData)
    const postId = response.data.post_id

    message.success('文章新增成功')
    emit('update')
    showModal.value = true

    const notiData = {
      actor_id: userStore.user.uid,
      user_id: postData.uid,
      target_id: postId,
      action: 'create',
      target_type: 'post',
      message: '發表了新文章',
      link: `/post/${postId}`,
    }

    console.log(notiData)

    socketStore.sendNotification(notiData) // 送出提醒

    setTimeout(() => {
      showModal.value = false
      newPostTitle.value = ''
      newPostContent.value = ''
      newPostCategory.value = null
      imagePreview.value = null
      uploadedImage.value = null
    }, 1500) // 設置 1.5 秒後關閉
  } catch (error) {
    handleError(message, undefined, error)
  }
}

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
    imageUrl.value = downloadURL
    return downloadURL // 傳回下載連結
  } catch (error) {
    handleError(message, undefined, error)
  }
}

// 處理圖片上傳與預覽
const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file

    const maxFileSize = 2 * 1024 * 1024
    if (file.size > maxFileSize) {
      message.error('檔案大小不可超過 2 MB')
      selectedFile.value = null
      imagePreview.value = null
      return
    }

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
      handleError(message, '圖片上傳失敗，請檢查檔案格式或網路連線', error)
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

// 彈窗寬度
const updateWidth = () => {
  const width = window.innerWidth

  if (width >= 768) {
    modalStyle.value = { width: '75%' } // 平板及大螢幕設備
  } else {
    modalStyle.value = { width: '100%' } // 手機設備
  }
}
// 初始化時檢查並設置寬度
onMounted(() => {
  updateWidth() // 先執行一次
  window.addEventListener('resize', updateWidth) // 監聽窗口大小變動
})

// 在組件銷毀時移除事件監聽
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWidth)
})

const segmented = {
  content: 'soft',
}
const emit = defineEmits(['update'])
// 更新 Small Talk
watch(showModal, (newValue) => {
  if (newValue) {
    currentSmallTalk.value = smallTalk[Math.floor(Math.random() * smallTalk.length)]
  }
})
</script>

<template>
  <div class="flex justify-between items-center p-4 border border-gray-300 rounded-md mt-3">
    <div class="flex justify-center">
      <div class="w-28 h-28 aspect-square rounded-full overflow-hidden md:w-36 md:h-36">
        <img
          class="w-full h-full object-cover"
          :src="
            userStore.user.photo_url ||
            'https://i.pinimg.com/736x/20/3e/d7/203ed7d8550c2c1c145a2fb24b6fbca3.jpg'
          "
          alt=""
        />
      </div>
    </div>

    <div class="w-3/4 flex flex-col justify-center mt-4 md:ml-3">
      <div class="mb-0 text-lg font-xl ml-5">
        (｡•̀ᴗ-)✧ {{ userStore.user.display_name || '訪客' }}
      </div>
      <n-button
        :disabled="!userStore.user.isLogin"
        @click="handleNewPost"
        class="w-100 m-4 rounded-full"
      >
        {{ userStore.user.isLogin ? '📝 記錄一刻，分享所有 🐾' : '登入就可以發廢文囉💃' }}
      </n-button>
    </div>
  </div>

  <n-modal
    v-model:show="showModal"
    class="custom-card overflow-y-scroll"
    preset="card"
    size="huge"
    :style="modalStyle"
    :bordered="false"
    :segmented="segmented"
  >
    <template #header-extra>
      <span class="hidden sm:block">👋 再見只是為了下一次見面～😊</span>
    </template>
    <template #header>
      <div class="flex flex-row items-center">
        <div class="w-3/4">
          <n-h1 prefix="bar" align-text type="success">
            <n-text type="success">
              <span>{{ newPostTitle || '✏️ 標題' }}</span>
            </n-text>
          </n-h1>
        </div>
      </div>
    </template>
    <template #default>
      <div class="flex flex-row w-full">
        <div class="flex-shrink-0 hidden md:block md:mb-0 md:mr-8">
          <div class="w-36 h-36 rounded-full overflow-hidden">
            <img class="w-full h-full object-cover" :src="userStore.user.photo_url" alt="" />
          </div>
        </div>
        <div class="flex flex-col justify-center gap-3">
          <n-h1 prefix="bar" align-text type="success" class="flex justify-center">
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
  margin: 0 0 0 15px;
}
</style>
