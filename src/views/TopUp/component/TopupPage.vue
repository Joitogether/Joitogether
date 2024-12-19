<script setup>
import { UserGetApi, UserPutApi } from '@/apis/userAPIs'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { NButton, NInputNumber } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref([])
const userStore = useUserStore()
const amount = ref(1)
const errorMessage = ref(null)

const fetchUserData = async () => {
  try {
    const result = await UserGetApi(userStore.user.uid)

    if (result) {
      user.value = result
      return user.value
    } else {
      console.log('沒有結果')
    }
  } catch (err) {
    errorMessage.value = err.message || '資料加載錯誤'
  }
}
const createOrder = async() => {
  user.value.pocket_money = user.value.pocket_money + amount.value
  try {
    const response = await UserPutApi(userStore.user.uid, user.value)

    if(response.status == '201') {
      router.push({path: '/topupFinish'})
    }
  } catch(err) {

  }
}

onMounted(() => {
  fetchUserData()
})
</script>
<template>
  <body>
    <div>
      <div class="text-center mb-6">
        <div class="border-2 rounded-md mt-4 py-4 font-title text-2xl">儲值中心</div>
      </div>
      <div class="mx-10">
        <div class="flex justify-end items-center mb-6">
          <button class="border-2 rounded-md px-4 py-2 flex justify-center items-center w-[100px]">
            儲值記錄
          </button>
        </div>
        <div class="first-area-title flex items-center mb-4">
          <div
            class="flex items-center justify-center border-2 rounded-full w-[40px] h-[40px] text-lg"
          >
            1
          </div>
          <span class="ml-4 text-lg">餘額</span>
        </div>
        <div class="first-area-bottom grid grid-cols-12 mb-6">
          <div
            class="img-container overflow-hidden col-start-2 rounded-full grid- w-16 h-16 aspect-square"
          >
            <img class="card-img w-full relative" :src="user.photo_url" alt="personImg" />
          </div>
          <div class="block col-span-2">
            <div class="text-lg mb-1">{{ user.display_name }}</div>
            <div class="text-lg mb-1">{{ user.email }}</div>
          </div>
          <div class="py-2 col-span-2">目前富有程度：💰{{ user.pocket_money }}</div>
        </div>
        <div class="second-area-title flex items-center mb-4">
          <div
            class="flex items-center justify-center border-2 rounded-full w-[40px] h-[40px] text-lg"
          >
            2
          </div>
          <span class="ml-4 text-lg">本次儲值金額</span>
        </div>
        <div class="second-area-bottom grid grid-cols-4 gap-4 mx-14 my-6">
          <n-button
            secondary
            type="warning"
            class="border-2 rounded-md px-6 py-2 text-lg"
            @click="amount = 100"
          >
            💰100
          </n-button>
          <n-button
            secondary
            type="warning"
            class="border-2 rounded-md px-6 py-2 text-lg"
            @click="amount = 200"
          >
            💰200
          </n-button>
          <n-button
            secondary
            type="warning"
            class="border-2 rounded-md px-6 py-2 text-lg"
            @click="amount = 300"
          >
            💰300
          </n-button>
          <n-button
            secondary
            type="warning"
            class="border-2 rounded-md px-6 py-2 text-lg"
            @click="amount = 500"
          >
            💰500
          </n-button>
          <n-button
            secondary
            type="warning"
            class="border-2 rounded-md px-6 py-2 text-lg"
            @click="amount = 666"
          >
            💰666
          </n-button>
          <n-button
            secondary
            type="warning"
            class="border-2 rounded-md px-6 py-2 text-lg"
            @click="amount = 888"
          >
            💰888
          </n-button>
          <n-button
            secondary
            type="warning"
            class="border-2 rounded-md px-6 py-2 text-lg"
            @click="amount = 999"
          >
            💰999
          </n-button>
          <n-button
            secondary
            type="warning"
            class="border-2 rounded-md px-6 py-2 text-lg"
            @click="amount = 1111"
          >
            💰1111
          </n-button>
        </div>
        <div class="flex justify-center mt-10">
          <div class="amount-input flex mr-5 items-center">
            金額：
            <n-input-number :min="1" :value="amount" placeholder="也可自訂金額唷" />
          </div>
          <div class="topup-button">
            <n-button
              type="warning"
              class="text-center border-2 rounded-md py-2 px-10 text-lg"
              @click="createOrder"
            >
              立即儲值
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>
