<script async setup>
import { ref, onMounted } from 'vue'
import { ProfileCircle, BrightStar, Heart, Post, Group } from '@iconoir/vue'
import CardList from './component/CardList.vue'
import EditModal from './component/EditModal.vue'
import PersonInfo from './component/PersonInfo.vue'
import PersonRate from './component/PersonRate.vue'
import PersonFollow from './component/PersonFollow.vue'
import PersonPost from './component/PersonPost.vue'
import PersonActivity from './component/PersonActivity.vue'

import { userGetAPI } from '@/apis/userAPIs'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const user = ref({})
const loading = ref(true)
const errorMessage = ref(null)

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

const handleSave = async () => {
  await fetchUserData()
  isEditModalOpen.value = false
}
onMounted(async () => {
  await fetchUserData()
})

const isEditModalOpen = ref(false)
// 開啟編輯視窗
const openEditModal = () => {
  isEditModalOpen.value = true // 顯示編輯視窗
}

// 關閉編輯視窗
const closeEditModal = () => {
  isEditModalOpen.value = false
}
const currentPage = ref('PersonInfo')
</script>

<template>
  <div class="container mx-auto p-4">
    <CardList
      :display_name="user.display_name"
      :age="user.age"
      :career="user.career"
      :city="user.city"
      :favorite_sentence="user.favorite_sentence"
      :tags="user.tags"
      :photo_url="user.photo_url"
      @edit="openEditModal"
    />
    <EditModal v-if="isEditModalOpen" @close="closeEditModal" @save="handleSave" />
    <div class="flex justify-between px-4 py-5 md:px-8">
      <button
        @click="currentPage = 'PersonInfo'"
        :class="{ 'text-green-600': currentPage === 'PersonInfo' }"
      >
        <ProfileCircle class="justify-self-center" />
      </button>
      <button
        @click="currentPage = 'PersonRate'"
        :class="{ 'text-green-600': currentPage === 'PersonRate' }"
      >
        <BrightStar class="justify-self-center" />
      </button>
      <button
        @click="currentPage = 'PersonFollow'"
        :class="{ 'text-green-600': currentPage === 'PersonFollow' }"
      >
        <Heart class="justify-self-center" />
      </button>
      <button
        @click="currentPage = 'PersonPost'"
        :class="{ 'text-green-600': currentPage === 'PersonPost' }"
      >
        <Post class="justify-self-center" />
      </button>
      <button
        @click="currentPage = 'PersonActivity'"
        :class="{ 'text-green-600': currentPage === 'PersonActivity' }"
      >
        <Group class="justify-self-center" />
      </button>
    </div>
    <PersonInfo
      v-if="currentPage === 'PersonInfo'"
      :life_photo_1="user.life_photo_1"
      :life_photo_2="user.life_photo_2"
      :self_introduction="user.self_introduction"
      :zodiac="user.zodiac"
      :hobby="user.hobby"
      :expertise="user.expertise"
      :interested_in="user.interested_in"
    />
    <PersonRate v-if="currentPage === 'PersonRate'" />
    <PersonFollow v-if="currentPage === 'PersonFollow'" />
    <PersonPost v-if="currentPage === 'PersonPost'" />
    <PersonActivity v-if="currentPage === 'PersonActivity'" />
  </div>
</template>

<style scoped>
@media screen and (width < 768px) {
  .container {
    max-width: 550px;
    box-sizing: border-box;
  }
}

@media screen and (width >= 768px) {
  header {
    margin-bottom: 2%;
  }
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
