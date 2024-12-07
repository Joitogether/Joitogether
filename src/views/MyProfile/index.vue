<script async setup>
import { ref, onMounted } from 'vue'
import { ProfileCircle, BrightStar, Heart, Post, Group } from '@iconoir/vue'
import { RouterLink, RouterView } from 'vue-router'
import CardList from './component/CardList.vue'
import EditModal from './component/EditModal.vue'

const showModal = ref(false)
const editingItem = ref(null)
const editingType = ref(null)


const isEditModalOpen = ref(false)
// 開啟編輯視窗
const openEditModal = (param) => {
  console.log(param) // 查看傳遞的參數
  isEditModalOpen.value = true // 顯示編輯視窗
}

// 關閉編輯視窗
const closeEditModal = () => {
  isEditModalOpen.value = false

}

// 編輯
const handleEdit = (item, type) => {
  editingItem.value = { ...item }
  editingType.value = type
  showModal.value = true
}

</script>

<template>
  <div class="container mx-auto">
    <CardList type="users" @edit="openEditModal" @close="closeEditModal" />
    <EditModal v-if="isEditModalOpen" @close="closeEditModal" @edit="openEditModal" />

  <div>
    <ul class="flex justify-between px-10 py-5">
      <li
        class="hover:cursor-pointer w-24"
        :class="{
          'border-b-4 border-solid border-green-600': $route.path === '/profile/personInfo',
        }"
      >
        <RouterLink to="/profile/personInfo"
          ><ProfileCircle class="justify-self-center"
        /></RouterLink>
      </li>
      <li class="hover:cursor-pointer w-24"
          :class="{
              'border-b-4 border-solid border-green-600': $route.path === '/profile/personalrate',
            }"
      >
        <RouterLink to="/profile/personalrate"
          ><BrightStar class="justify-self-center"
        /></RouterLink>
      </li>
      <li class="hover:cursor-pointer w-24"
          :class="{
              'border-b-4 border-solid border-green-600': $route.path === '/profile/personalfocus',
            }"
      >
        <RouterLink to="/profile/personalfocus">
          <Heart class="justify-self-center" />
        </RouterLink>
      </li>
      <li
        class="hover:cursor-pointer w-24"
        :class="{
          'border-b-4 border-solid border-green-600': $route.path === '/profile/personpost',
        }"
      >
        <RouterLink to="/profile/personpost"><Post class="justify-self-center" /></RouterLink>
      </li>
      <li
        class="hover:cursor-pointer w-24"
        :class="{
          'border-b-4 border-solid border-green-600': $route.path === '/profile/personActivity',
        }"
      >
        <RouterLink to="/profile/personActivity"
          ><Group class="justify-self-center"
        /></RouterLink>
      </li>
    </ul>
  </div>
  <div class="border">
    <router-view></router-view>
  </div>
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
