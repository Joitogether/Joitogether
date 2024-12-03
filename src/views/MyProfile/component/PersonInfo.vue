<script setup>
import { UserGetApi } from '../../../../apis/UserApi'
import { ref, onMounted } from 'vue'
import { NSpin } from 'naive-ui'

defineProps({
  items: {
    type: Object,
    required: true,
    default: () => ({
      life_photo_1: '圖片加載中',
      life_photo_2: '圖片加載中',
      self_introduction: '自我介紹加載中',
      zodiac: '星座加載中',
      hobby: '興趣加載中',
      expertise: '專長加載中',
      interested_in: '興趣活動加載中',
    }),
  },
  type: {
    type: String,
    required: true,
  },
})
const user = ref(null)
const loading = ref(true)
const errorMessage = ref(null)
const userUid = '3465767889ddgijjljk'

const fetchUserData = async () => {
  try {
    const result = await UserGetApi(userUid)
    console.log('API回傳資料:', result)

    if (result) {
      user.value = result
      loading.value = false
      return user.value
    }
  } catch (err) {
    errorMessage.value = err.message || '資料加載錯誤'
    loading.value = false
  }
}

onMounted(() => {
  fetchUserData()
})
</script>
<template>
  <div v-if="loading">
    <n-spin size="medium" />
    資料正在跑來的路上...
  </div>
  <div v-else class="personInfo mx-8 my-5">
    <div class="photoArea grid grid-cols-2 gap-4 overflow-hidden">
      <div class="firstPhoto justify-self-center self-center">
        <img
          :src="user.life_photo_1 || 'default_image_path.jpg'"
          alt="lifePhoto-1"
          class="rounded-3xl"
        />
      </div>
      <div class="secondPhoto justify-self-center self-center">
        <img
          :src="user.life_photo_2 || 'default_image_path.jpg'"
          alt="lifePhoto1-2"
          class="rounded-3xl"
        />
      </div>
    </div>
    <div class="contentArea sm:leading-loose sm:text-xl text-sm mx-5 mt-5 px-5">
      <p class="bg-orange-200">自我介紹：{{ user.self_introduction || '這裡是您的自我介紹。' }}</p>
      <p class="bg-red-200">星座：{{ user.zodiac || '這裡是您的星座。' }}</p>
      <p class="bg-yellow-200">嗜好：{{ user.hobby || '這裡是您的興趣。' }}</p>
      <p class="bg-lime-200">專長：{{ user.expertise || '這裡是您的專長。' }}</p>
      <p class="bg-violet-200">興趣的活動：{{ user.interested_in || '這裡是您的興趣得活動。' }}</p>
    </div>
  </div>
</template>

<style scoped>
.contentArea p {
  margin-bottom: 20px;
  padding: 0 15px;
  line-height: 2.5;
  text-align: center;
  border-radius: 9999px;
}
</style>
