<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as PaymentAPIs from '../../../apis/paymentAPIs.js'
import { useUserStore } from '@/stores/userStore'
import { useMessage } from 'naive-ui'
import { handleError } from '../../../utils/handleError.js'

const cartItems = ref([])
const isLoading = ref(true)
const userStore = useUserStore()
const message = useMessage()

// 取得購物車資料並轉換格式
const fetchCartItems = async () => {
  isLoading.value = true
  cartItems.value = []
  try {
    const response = await PaymentAPIs.getUserCartDetailsAPI(userStore.user.uid)
    if (!response || response.cartItems.length === 0) {
      cartItems.value = []
      message.info('🛒 購物車是空的，快去挑選你的商品吧！')
      return
    }

    const cartItemsData = response.cartItems
    cartItems.value = cartItemsData.map((item) => ({
      cartItemsId: item.id,
      cartActivityId: item.activity_id,
      name: item.activities.name,
      location: item.activities.location,
      time: new Date(item.activities.event_time).toLocaleString(),
      price: Number(item.activities.price),
      image: item.activities.img_url || 'https://via.placeholder.com/200',
      selected: item.is_selected,
    }))
  } catch (error) {
    handleError(message, undefined, error)
  } finally {
    isLoading.value = false
  }
}

// 全選控制
const selectAll = ref(false)

// 計算總金額
const totalPrice = computed(() => {
  return cartItems.value.filter((item) => item.Selected).reduce((sum, item) => sum + item.price, 0)
})

// 計算總項目數
const totalItems = computed(() => cartItems.value.length)

// 切換全選狀態
const toggleSelectAll = () => {
  cartItems.value.forEach((item) => (item.Selected = selectAll.value))
}

// 刪除所選項目
const removeSelected = async () => {
  try {
    const selectedItems = cartItems.value.filter((item) => item.Selected)
    const selectedIds = selectedItems.map((item) => item.cartActivityId)

    await Promise.all(
      selectedIds.map((id) => PaymentAPIs.deleteUserCartDetailsAPI(userStore.user.uid, id)),
    )
    cartItems.value = cartItems.value.filter((item) => !item.Selected)
  } catch (error) {
    handleError(message, undefined, error)
  }
}

// 將選中商品送往結帳頁面
const router = useRouter()
const goToCheckout = async () => {
  const selectedItems = cartItems.value.filter((item) => item.Selected)
  if (selectedItems.length === 0) {
    message.info('🛒 請選擇你的商品，我們馬上幫你打包結帳！ 🎉✨')
    return
  }
  try {
    await Promise.all(
      selectedItems.map((item) => PaymentAPIs.updateCartSelectionAPI(item.cartItemsId, true)),
    )
    goCheckoutPage()
  } catch (error) {
    handleError(message, undefined, error)
  }
}

// 頁面跳轉
const goCheckoutPage = () => {
  router.push('/checkout')
}

onMounted(() => {
  fetchCartItems()
})
</script>

<template>
  <div id="webcrumbs" class="bg-gray-100">
    <div class="w-full bg-white rounded-lg shadow p-3 mx-auto h-screen md:w-3/4 lg:w-3/5">
      <!-- Header -->
      <header class="text-center text-2xl font-bold mb-6">購物車</header>

      <!-- 全選和刪除按鈕 -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" class="mr-2" />
          <span class="font-title">全選</span>
        </div>
        <button @click="removeSelected" class="px-4 py-2 border border-neutral-300 rounded-md">
          刪除
        </button>
      </div>
      <!-- 購物車內容 -->
      <div class="bg-gray-100 p-2 rounded-lg">
        <div v-for="(item, idx) in cartItems" :key="idx" class="flex gap-3">
          <input type="checkbox" v-model="item.Selected" class="" />
          <div class="flex flex-col gap-2 w-full">
            <div class="flex gap-2">
              <div class="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 md:w-24 md:h-24">
                <img :src="item.image" alt="商品圖片" class="w-full h-full object-cover" />
              </div>
              <div class="w-full flex flex-col justify-between">
                <div class="">
                  <p class="font-bold text-base tracking-wide line-clamp-1 md:text-lg">
                    {{ item.name }}
                  </p>
                  <p class="line-clamp-2 tracking-wide">{{ item.location }}</p>
                </div>
                <div class="flex justify-between items-center">
                  <p class="hidden md:block tracking-wider text-gray-500">{{ item.time }}</p>
                  <p class="hidden md:block font-bold text-red-500">NT$ {{ item.price }}</p>
                </div>
              </div>
            </div>
            <div class="flex justify-between items-center md:hidden">
              <p class="tracking-wider text-gray-500">{{ item.time }}</p>
              <p class="font-bold text-red-500">NT$ {{ item.price }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer 總計 -->
      <footer class="mt-12 border-t border-neutral-300 pt-4">
        <div class="flex justify-between items-center pb-4">
          <span class="font-title">總計有 {{ totalItems }} 項揪團活動</span>
          <div class="text-lg font-bold">NT$ {{ totalPrice }}</div>
        </div>
        <div>
          <button
            @click="goToCheckout"
            class="w-full bg-green-600 text-white rounded-full py-3 hover:bg-green-500"
          >
            前往結帳
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>
