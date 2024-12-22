<script setup>
import { ref, computed } from 'vue'

const orderDetails = ref([
  { name: '一起去玩水', quantity: 1, price: 100 },
  { name: '一起去爬山', quantity: 2, price: 200 },
])
const balance = ref(100)
const orderId = ref('1')

const totalPrice = computed(() => {
  return orderDetails.value.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
})
</script>

<template>
  <div class="bg-gray-100 min-h-screen flex justify-center items-center px-4">
    <div class="bg-white rounded-lg shadow-md mt-6 p-6 w-full max-w-4xl sm:w-[90%]">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-green-600 mb-6">付款成功 🎉</h1>
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

      <div class="text-center space-y-4">
        <p class="text-2xl font-semibold text-gray-700">已成功報名活動 ✅</p>
        <p class="text-lg text-gray-600">訂單編號:#{{ orderId }}</p>

        <div class="border-t border-gray-300 my-6"></div>
        <div class="text-lg text-gray-600 space-y-3">
          <div v-for="(item, index) in orderDetails" :key="index">
            <div class="space-y-2">
              <div>
                <span>商品名稱：</span><span>{{ item.name }}</span>
              </div>
              <div>
                <span>購買數量：</span><span>{{ item.quantity }}</span>
              </div>
              <div>
                <span>單價：</span><span>${{ item.price }}</span>
              </div>
            </div>
            <div v-if="index < orderDetails.length - 1" class="border-t border-gray-300 my-4"></div>
          </div>
        </div>

        <div class="border-t border-gray-300 my-6"></div>

        <div class="text-xl text-gray-600 font-medium mb-6">
          <span>總計：</span><span>${{ totalPrice }}</span>
        </div>

        <div class="font-bold text-xl">
          <span>儲值金餘額：</span> <span>${{ balance }}</span>
        </div>
      </div>

      <div class="flex justify-center mt-8">
        <n-button class="font-bold text-lg py-5 px-12 rounded-full shadow-lg" round type="primary"
          >回到首頁</n-button
        >
      </div>
    </div>
  </div>
</template>
