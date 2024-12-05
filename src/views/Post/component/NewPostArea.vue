<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'

const showModal = ref(false)
const value = ref(null)
const titleText = ref('')
const articleContent = ref('')
const currentSmallTalk = ref('')
const userStore = useUserStore()

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

const options = [
  {
    label: '餐廳 Restaurant',
    value: '餐廳 Restaurant',
  },
  {
    label: '購物 Shopping',
    value: '購物 Shopping',
  },
  {
    label: '旅遊 Travel',
    value: '旅遊 Travel',
  },
  {
    label: '運動 Sports',
    value: '運動 Sports',
  },
  {
    label: '娛樂 Entertainment',
    value: '娛樂 Entertainment',
  },
]

// 送出按鈕
const handleSubmit = () => {
  console.log('送出資料:')
  showModal.value = false
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
            <span>{{ titleText || '✏️ 標題' }}</span>
          </n-text>
        </n-h1>
      </div>
    </template>
    <template #default>
      <div class="flex flex-col lg:flex-row p-3">
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
              v-model:value="titleText"
              size="large"
              round
              placeholder="🌟 輸入你的超棒標題吧！(๑•̀ㅂ•́)و✧"
            />
          </n-h1>

          <div class="relative">
            <n-popselect
              v-model:value="value"
              :options="options"
              trigger="click"
              placement="bottom-start"
            >
              <div class="flex items-center space-x-2">
                <n-button class="px-4 py-2 rounded-md text-gray-700">
                  {{ value || '類別' }}
                </n-button>
                <span class="small-talk lg:inline-block text-sm font-medium text-gray-400">
                  {{ currentSmallTalk }}</span
                >
              </div>
            </n-popselect>
          </div>
        </div>
      </div>

      <div class="p-3">
        <n-upload
          action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
          :default-file-list="previewFileList"
          list-type="image-card"
          @preview="handlePreview"
        />
      </div>

      <div class="p-3">
        <n-input
          type="textarea"
          v-model:value="articleContent"
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
