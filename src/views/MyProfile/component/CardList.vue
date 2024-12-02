<script setup>
import { NButton, NSpin } from 'naive-ui';
import { UserGetApi } from '../../../apis/UserApi'
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';

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
      tag: '標籤加載中'
    })
  },
  type: {
    type: String,
    required: true,
  }
})
const user = ref(null);  // 儲存使用者資料
const loading = ref(true);
const errorMessage = ref(null);
const userStore = useUserStore()
if (userStore.user.isLogin) {
  const fetchUserData = async () => {
  try {
    const result = await UserGetApi(userStore.user.uid);

    if (result) {
      user.value = result;
      loading.value = false;  // 資料加載完成，關閉加載狀態
      return user.value
    }
  } catch (err) {
    errorMessage.value = err.message || '資料加載錯誤';
    loading.value = false;  // 發生錯誤時也關閉加載狀態
  }
    };
    fetchUserData();
}


const emit = defineEmits(['edit'])
</script>
<template>
  <div v-if="loading">
    <n-spin size="medium" />
    資料正在跑來的路上...
  </div>
  <div v-else class="card-container border rounded-lg overflow-hidden bg-white">
    <div class="img-container w-full">
      <img
        class="card-img w-full h-full object-cover"
        :src="user.photo_url"
        alt="personImg"
      />
    </div>

    <div class="card-content-container">
      <h3 class="user-name text-2xl text-center font-bold">{{ user.display_name  }}</h3>
      <div class="text-md font-bold">
        <span>{{ user.city }}</span>
        <span> • {{ user.age }}</span>
        <span> • {{ user.career }}</span>
      </div>
      <p class="user-description text-2xl font-bold mt-1 md:mb-5">
        : {{ user.favorite_sentence }}
      </p>
      <n-button @click="emit('edit', 'users')" type="primary" ghost round >編輯檔案</n-button>
      <div class="tag-container flex gap-3 flex-wrap">
        <span v-for="(item, index) in user.tags.split(',')" :key="index"  class="border-2 px-3 py-1 rounded">
          # {{ item }}</span>
      </div>
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
    padding: 2rem;
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
    padding-left: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .btn-container {
    margin-bottom: 0.5rem;
    margin-top: 0;
    width: 70%;
  }

  .user-name {
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
