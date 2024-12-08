<script setup>
import { NButton, NSpin } from 'naive-ui'
import { UserGetApi } from '../../../apis/UserApi'
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'

defineProps({
  items: {
    type: Object,
    required: true,
    default: () => ({
      display_name: '名字加載中',
      city: '城市加載中',
      age: '年齡加載中',
      career: '職業加載中',
      favorite_sentence: '喜愛的句子加載中',
      tag: '標籤加載中',
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
const userStore = useUserStore()
const showModal = ref(false) // 控制 modal 顯示

if (userStore.user.isLogin) {
  const fetchUserData = async () => {
    try {
      const result = await UserGetApi(userStore.user.uid)

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
  fetchUserData()
}
// 控制 modal 開啟
const openModal = () => {
  showModal.value = true
  emit('edit', user.value)
}

const emit = defineEmits(['edit', 'close'])
</script>
<template>
  <div v-if="loading">
    <n-spin size="medium" />
    資料正在跑來的路上...
  </div>
  <div v-else class="card-container py-8 border rounded-lg overflow-hidden bg-white">
    <div class="img-container w-full">
      <img class="card-img w-full h-full object-cover" :src="user.photo_url" alt="personImg" />
    </div>

    <div class="card-content-container ml-5">
      <h3 class="user-name text-2xl text-center font-bold">
        {{ user.display_name || '大名還未填寫唷👀' }}
      </h3>
      <div class="user-detail text-md font-bold text-center">
        <span>{{ user.city || '所在地還未填寫唷👀' }}</span>
        <span> • {{ user.age || '年齡還未填寫唷👀' }}</span>
        <span> • {{ user.career || '職業還未填寫唷👀' }}</span>
      </div>
      <p class="user-description text-2xl font-bold mt-1">
        : {{ user.favorite_sentence || '座右銘還未填寫唷👀' }}
      </p>
      <div class="tag-container flex gap-3 flex-wrap my-4">
        <span v-if="!user.tags">還沒有標籤喔</span>
        <span
          v-else
          v-for="(item, index) in (user.tags || '').split(',')"
          :key="index"
          class="border-2 px-3 py-1 rounded"
        >
          # {{ item || '未填寫' }}</span
        >
      </div>
      <n-button
        @click="emit('edit', 'close', user)"
        @open-modal="openModal"
        type="primary"
        ghost
        round
        >編輯檔案
      </n-button>


    </div>
  </div>
</template>
<style scope>
@media screen and (width >= 768px) {
  .container {
    max-width: 80%;
  }

  .card-container {
    display: flex;
    /* padding: 2rem; */
  }

  .img-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card-img {
    border-radius: 50%;
    aspect-ratio: 1 / 1;
    height: auto;
  }

  .card-content-container {
    flex: 3;
    padding: 0;
    margin-left: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .user-name,
  .user-detail
  {
    text-align: start;
  }

  .user-description {
    font-size: 1rem;
    margin-top: -0.1rem;
  }
}

@media screen and (width >= 1024px) {
  .container {
    max-width: 880px;
  }

  .card-content-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>
