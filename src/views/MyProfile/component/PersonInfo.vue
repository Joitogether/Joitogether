<script setup>
import { userGetAPI } from '../../../apis/userAPIs'
import { ref, onMounted } from 'vue'
import { NSpin } from 'naive-ui'
import { useUserStore } from '@/stores/userStore'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
  type: {
    type: String,
    required: true,
  }
})

const user = ref(null)
const loading = ref(true)
const errorMessage = ref(null)
const userStore = useUserStore()
const fetchUserData = async () => {
  try {
    const result = await userGetAPI(userStore.user.uid)
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
          :src="user.life_photo_1 || 'https://firebasestorage.googleapis.com/v0/b/login-demo1-9d3cb.firebasestorage.app/o/lifephoto%2F1733574359943_defaultimg.jpg?alt=media&token=c5486472-dadd-4276-8666-97a538e46e5f'"
          alt="lifePhoto-1"
          class="rounded-3xl"
        />
      </div>
      <div class="secondPhoto justify-self-center self-center">
        <img
          :src="user.life_photo_2 || 'https://firebasestorage.googleapis.com/v0/b/login-demo1-9d3cb.firebasestorage.app/o/lifephoto%2F1733574359943_defaultimg.jpg?alt=media&token=c5486472-dadd-4276-8666-97a538e46e5f'"
          alt="lifePhoto1-2"
          class="rounded-3xl"
        />
      </div>
    </div>
    <div class="contentArea sm:leading-loose sm:text-xl text-sm mt-5">
      <p class="bg-orange-200">自我介紹：{{ user.self_introduction || '自我介紹還未填寫唷👀'}}</p>
      <p class="bg-red-200">星座：{{ user.zodiac || '星座還未填寫唷👀'}}</p>
      <p class="bg-yellow-200">嗜好：{{ user.hobby || '嗜好還未填寫唷👀'}}</p>
      <p class="bg-lime-200">專長：{{ user.expertise || '專長還未填寫唷👀'}}</p>
      <p class="bg-violet-200">興趣的活動：{{ user.interested_in || '興趣的活動還未填寫唷👀'}}</p>
    </div>
  </div>
</template>

<style scoped>

@media screen and (width < 768px) {
  .photoArea {
    display: block;
  }

  .photoArea img{
    margin-bottom: 20px;
  }
}


.contentArea p{
  margin-bottom: 20px;
  padding: 0 15px;
  line-height: 2.5;
  text-align: center;
  border-radius: 9999px;
}
</style>
