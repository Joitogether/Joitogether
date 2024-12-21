<script setup>
import { ref, computed, onMounted } from 'vue'
import { deleteUserCartDetailsAPI, getUserCartDetailsAPI } from '@/apis/userShoppingCartApi'
import { useUserStore } from '@/stores/userStore'

const cartItems = ref([]) // 存放購物車資料
const isLoading = ref(true) // 載入狀態
const userStore = useUserStore()
// 取得購物車資料並轉換格式
const fetchCartItems = async () => {
  try {
    isLoading.value = true
    const data = await getUserCartDetailsAPI(userStore.user.uid)

    cartItems.value = data.map((item) => ({
      cartActivityId: item.activityId,
      name: item.activityName,
      location: item.location,
      time: new Date(item.eventTime).toLocaleString(), // 格式化時間
      price: Number(item.price),
      image: item.image || 'https://via.placeholder.com/200', // 預設圖片
      // selected: false, // 初始未選中
    }))
  } catch {
    return false
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCartItems()
})

const selectAll = ref(false) // 全選控制

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
    // 1. 篩選出被選中的項目
    const selectedItems = cartItems.value.filter((item) => item.Selected)

    // 2. 提取選中項目的 cartActivityId
    const selectedIds = selectedItems.map((item) => item.cartActivityId)

    // 3. 打印所有的 cartActivityId（用於確認）
    // console.log('Selected cartActivityIds:', selectedIds)

    // 4. 使用 Promise.all 並行執行刪除請求
    await Promise.all(selectedIds.map((id) => deleteUserCartDetailsAPI(userStore.user.uid, id)))

    // 5. 更新本地 cartItems 列表，移除已刪除的項目
    cartItems.value = cartItems.value.filter((item) => !item.Selected)
  } catch {
    return false
  }
}
// 模擬結帳動作
const checkout = () => {
  alert(`總金額 NT$${totalPrice.value}，前往結帳！`)
}
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
          <button class="w-full bg-sky-500 text-white rounded-md py-3" @click="checkout">
            前往結帳
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>
