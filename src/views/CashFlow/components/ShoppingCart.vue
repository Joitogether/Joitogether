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
  } catch {
    handleError()
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
  } catch {
    handleError()
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
    handleError(error)
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
  <div id="webcrumbs">
    <div class="m-auto w-[1000px] bg-white shadow rounded-lg p-6 text-neutral-950">
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
      <section class="space-y-6">
        <div
          v-for="(item, idx) in cartItems"
          :key="idx"
          class="border-solid flex items-start gap-4"
        >
          <input type="checkbox" v-model="item.Selected" class="mt-4" />
          <div class="flex items-stretch gap-4 flex-1">
            <div class="w-[200px] h-[200px] bg-neutral-200 rounded-md">
              <img :src="item.image" alt="商品圖片" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 space-y-4">
              <div class="w-full bg-slate-50 rounded-md px-3 py-2">{{ item.name }}</div>
              <div class="w-full rounded-md px-3 py-2">{{ item.location }}</div>
              <div class="w-full rounded-md px-3 py-2">{{ item.time }}</div>
              <div class="w-full rounded-md px-3 py-2 font-bold text-red-500">
                NT$ {{ item.price }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer 總計 -->
      <footer class="mt-12 border-t border-neutral-300 pt-6">
        <div class="flex justify-between pb-4">
          <span class="font-title">總計有 {{ totalItems }} 項揪團活動</span>
          <div class="text-lg font-bold">NT$ {{ totalPrice }}</div>
        </div>
        <div>
          <button @click="goToCheckout" class="w-full bg-sky-500 text-white rounded-md py-3">
            前往結帳
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>
