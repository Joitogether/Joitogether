<script setup>
  import NavbarComponent from '../Home/components/NavbarComponent.vue';
  import { UserGetApi } from '@/apis/userAPIs';
  import { ref } from 'vue'
  import { useUserStore } from '@/stores/userStore'


  const user = ref(null)
  const userStore = useUserStore()
  const Amount = ref(0)

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
</script>
<template>
  <header>
    <NavbarComponent/>
  </header>
  <body>
    <div class=" bg-white shadow">
      <div class="text-center mb-6">
        <div class="border-2  rounded-md mt-4 py-4 font-title text-2xl"> 儲值中心 </div>
      </div>
      <div class="flex justify-end items-center mb-6">
        <button class="border-2  rounded-md px-4 py-2 flex justify-center items-center w-[100px]"> 儲值記錄 </button>
      </div>
      <div class="first-area-title flex items-center mb-4">
        <div class="flex items-center justify-center border-2  rounded-full w-[40px] h-[40px] text-lg"> 1 </div>
        <span class="ml-4 text-lg">餘額</span>
      </div>
      <div class="first-area-bottom grid grid-cols-12 mb-6">
        <div class="img-container overflow-hidden col-start-2 rounded-full grid- w-16 h-16 aspect-square">
          <img class="card-img w-full relative" :src="user.photo_url" alt="personImg" />
        </div>
        <div class="block col-span-2">
          <div class= "text-lg mb-1">{{ user.display_name }}</div>
          <div class= "text-lg mb-1">{{ user.email }}</div>
        </div>
        <div class="py-2 col-span-2">目前富有程度：💰999</div>
      </div>
      <div class="second-area-title flex items-center mb-4">
        <div class="flex items-center justify-center border-2  rounded-full w-[40px] h-[40px] text-lg"> 2 </div>
        <span class="ml-4 text-lg">本次儲值金額</span>
      </div>
      <div class="second-area-bottom grid grid-cols-4 gap-4 mb-6">
          <button class="border-2 rounded-md px-6 py-2 text-lg" @click="Amount=100"> 💰100 </button>
          <button class="border-2 rounded-md px-6 py-2 text-lg" @click="Amount=200"> 💰200 </button>
          <button class="border-2 rounded-md px-6 py-2 text-lg" @click="Amount=300"> 💰300 </button>
          <button class="border-2 rounded-md px-6 py-2 text-lg" @click="Amount=500"> 💰500 </button>
      </div>
      <div class="flex border-2 rounded-md px-4 py-2 mr-5 mb-10">
        <p>金額：</p><input type="text" :value="Amount"/>
      </div>
      <button class="text-center border-2 rounded-md py-2 px-10 text-lg" @click="createOrder"> 立即儲值 </button>
    </div>
  </body>

</template>

<style scoped>

</style>
