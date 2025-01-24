<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import * as PaymentAPIs from '../../apis/paymentAPIs.js'
import { handleError } from '../../utils/handleError.js'
import { useMessage } from 'naive-ui'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const message = useMessage()

// 獲取訂單資料
const orderDetails = ref([])
const orderId = ref(null)

const fetchOrderDetails = async () => {
  try {
    if (!route.params.order_id) {
      throw new Error('無法獲取 order_id')
    }
    orderId.value = route.params.order_id

    const response = await PaymentAPIs.getOrderAPI(orderId.value)
    if (response) {
      orderDetails.value = response.order_items.map((item) => ({
        name: item.activities.name || '活動名稱',
        price: item.price || 0,
        quantity: item.quantity || 0,
        activity_id: item.activity_id,
      }))
    } else {
      throw new Error('無法獲取訂單資料')
    }
  } catch (error) {
    handleError(message, undefined, error)
  }
}

// 計算總價
const totalPrice = computed(() => {
  return orderDetails.value.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
})

// 餘額顯示
const balance = ref(0)
const fetchWalletBalance = async () => {
  try {
    const response = await PaymentAPIs.getWalletBalanceAPI(userStore.user.uid)
    balance.value = response.balance
    return balance.value
  } catch (error) {
    handleError(message, undefined, error)
  }
}

const goHome = () => {
  router.replace('/')
}

onMounted(async () => {
  try {
    await Promise.all([fetchOrderDetails(), fetchWalletBalance()])
  } catch {
    message.error('😢 資料溜走了，找不到它們！\n不過別擔心，我們正在努力召喚它們回來 🚀✨')
  }
})
</script>

<template>
  <div class="bg-gray-100">
    <div class="bg-white min-h-screen rounded-md shadow p-6 mx-auto w-full md:w-3/4 lg:w-3/5">
      <div class="text-center">
        <h1 class="text-2xl font-bold mb-6 text-gray-700">付款成功 🎉</h1>
      </div>

      <div class="flex justify-center my-6">
        <svg
          width="100px"
          height="100px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" stroke="#18A058" stroke-width="1.5" />
          <path
            d="M8.5 12.5L10.5 14.5L15.5 9.5"
            stroke="#18A058"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <div class="">
        <div class="text-center flex flex-col gap-2">
          <p class="text-2xl font-semibold text-gray-700">已成功報名活動 ✅</p>
          <p class="text-base text-gray-600">🎉 感謝您的購買，期待您玩得開心！✨</p>
          <p class="text-base text-gray-600">訂單編號：#{{ orderId }}</p>
        </div>

        <div class="border-t border-gray-300 my-6"></div>
        <div class="text-lg text-gray-600 space-y-3">
          <div v-for="(item, index) in orderDetails" :key="index" class="flex flex-col gap-3">
            <div
              class="bg-gray-100 rounded-md text-start text-base tracking-wide p-3 flex flex-col gap-1"
            >
              <div class="">
                <span class="font-bold">📦 商品名稱：</span>
                <span>{{ item.name }}</span>
              </div>
              <div class="flex justify-between">
                <div>
                  <span class="font-bold">🔢 購買數量：</span>
                  <span>{{ item.quantity }}</span>
                </div>
                <div>
                  <!-- <span>💰 商品單價：</span> -->
                  <span class="font-bold text-red-500">${{ item.price }}</span>
                </div>
              </div>
            </div>
            <div v-if="index < orderDetails.length - 1" class="border-t border-gray-300 my-4"></div>
          </div>
        </div>
        <div class="border-t border-gray-300 my-6"></div>
        <div class="text-start px-3">
          <div class="text-base text-gray-600 font-medium">
            <span>總計：</span>
            <span class="font-bold text-red-500">${{ totalPrice }}</span>
          </div>
          <div class="text-base text-gray-600 font-medium mb-6">
            <span>儲值金餘額：</span>
            <span class="text-red-500 font-bold">${{ balance }}</span>
          </div>
        </div>
      </div>
      <div class="flex justify-center">
        <n-button
          @click="goHome"
          class="font-bold text-lg py-5 px-12 rounded-full"
          round
          type="primary"
        >
          回到首頁
        </n-button>
      </div>
    </div>
  </div>
</template>
