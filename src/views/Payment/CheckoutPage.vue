<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import { useMessage } from 'naive-ui'
import * as PaymentAPIs from '../../apis/paymentAPIs.js'

const router = useRouter()
const userStore = useUserStore()
const message = useMessage()

// 抓取購物車明細
const cartItems = ref([])
const subtotal = ref(0)
const fetchCartItems = async () => {
  try {
    const response = await PaymentAPIs.getCheckoutItemsAPI(userStore.user.uid)

    cartItems.value = response.data.cartItems.map((item) => ({
      id: item.id,
      activity_id: item.activity_id,
      title: item.activities.name,
      photo: item.activities.img_url,
      price: Number(item.activities.price),
      require_approval: item.activities.require_approval,
    }))

    subtotal.value = cartItems.value.reduce((total, item) => total + item.price, 0)
  } catch (error) {
    message.error('購物車資料獲取失敗')
    console.error('購物車資料獲取失敗:', error)
  }
}

// 計算總金額
const total = computed(() => {
  return subtotal.value
})

// 抓取餘額
const balance = ref(0)
const fetchWalletBalance = async () => {
  try {
    const response = await PaymentAPIs.getWalletBalanceAPI(userStore.user.uid)
    balance.value = response.data.balance
    return balance.value
  } catch (error) {
    message.error('餘額獲取失敗')
    console.error('餘額獲取失敗:', error)
  }
}

// 判斷餘額是否足夠
const isBalanceEnough = computed(() => {
  return balance.value >= total.value
})

// 結帳流程
const showModal = ref(false)
const handleCheckout = async () => {
  try {
    // 檢查餘額
    if (!isBalanceEnough.value) {
      message.error('餘額不足，請先充值')
      return
    }

    // 整理訂單資料
    const orderData = {
      uid: userStore.user.uid,
      total_amount: total.value,
      order_items: cartItems.value.map((item) => ({
        activity_id: item.activity_id,
        quantity: 1,
        price: item.price,
        subtotal: item.price,
        require_approval: item.require_approval,
      })),
      activity_id: cartItems.value[0]?.id,
      comment: '已付款，自動報名',
    }

    const response = await PaymentAPIs.processOrder(orderData)
    if (response.success) {
      message.success('訂單與報名成功完成')
      goCheckoutSuccess(response.data.order.order_id)
    }
  } catch (error) {
    if (error.message === 409) {
      message.error('已有待處理的訂單，請先完成或取消該訂單')
    } else if (error.message === 402) {
      message.error('餘額不足，請先充值')
    } else {
      message.error('結帳失敗，請稍後再試')
    }
    console.error('結帳失敗:', error)
  }
}

// 回到購物車頁面時將購物車明細清空
const backToCart = async () => {
  try {
    const selectedIds = cartItems.value.map((item) => item.id)
    await Promise.all(selectedIds.map((id) => PaymentAPIs.updateCartSelectionAPI(id, false)))
    goShoppingCart()
  } catch (error) {
    console.error('清空購物車失敗:', error)
  }
}

// 頁面跳轉
const goShoppingCart = () => {
  router.push('/shoppingcart')
}

const goTopUp = () => {
  router.push('/topup')
}

const goCheckoutSuccess = (orderId) => {
  router.push({ name: 'checkoutSuccess', params: { order_id: orderId } })
}

onMounted(async () => {
  try {
    await Promise.all([fetchCartItems(), fetchWalletBalance()])
  } catch (error) {
    console.error('資料加載失敗:', error)
  }
})
</script>

<template>
  <div class="w-full min-h-screen bg-gray-200 flex flex-col gap-4 py-14 px-4 md:px-10 lg:px-40">
    <div class="flex flex-col gap-4">
      <p class="text-center text-neutral-800 text-2xl">購物車明細</p>
      <div class="space-y-4">
        <div
          v-for="(item, index) in cartItems"
          :key="index"
          class="flex flex-col justify-between px-4 py-4 bg-gray-100 rounded-md md:px-10"
        >
          <div class="flex flex-row gap-3 md:gap-5">
            <div class="w-28 h-28 bg-gray-300 rounded-md shrink-0 overflow-hidden">
              <img :src="item.photo" alt="活動圖片" />
            </div>
            <div class="w-2/3 md:w-full flex flex-col justify-between">
              <div class="">
                <h3 class="text-neutral-950">{{ item.title }}</h3>
                <!-- <p class="text-sm text-neutral-800">活動付款內容</p> -->
              </div>

              <span class="text-neutral-950 font-semibold">NT$ {{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <p class="text-center text-neutral-800 text-2xl">訂單明細</p>
        <div class="space-y-4 bg-gray-100 rounded-md px-4 py-4 md:px-10">
          <!-- <div>
            <label for="discount-code" class="block text-sm text-neutral-800">折扣碼</label>
            <input
              type="text"
              id="discount-code"
              placeholder="輸入欄位"
              class="mt-1 block w-full bg-white border border-gray-300 rounded-md px-3 py-2"
            />
          </div> -->
          <div>
            <div class="flex justify-between text-sm py-1">
              <span>小計</span>
              <span>$ {{ subtotal }}</span>
            </div>

            <!-- <div class="flex justify-between text-sm py-1">
              <span>已使用折扣碼</span> <span>-$15</span>
            </div> -->

            <div class="flex justify-between text-sm font-semibold py-1">
              <span>總計</span> <span>$ {{ total }}</span>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-sm py-1">
              <span>儲值金餘額</span> <span>$ {{ balance }}</span>
            </div>
            <div v-if="!isBalanceEnough" class="flex justify-between text-sm font-semibold py-1">
              <span>餘額不足</span> <span>$ - {{ total - balance }}</span>
            </div>
            <div v-if="isBalanceEnough" class="flex justify-between text-sm font-semibold py-1">
              <span>扣除後剩餘儲值金</span> <span>${{ balance - total }}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!isBalanceEnough"
        class="rounded-lg text-center text-sm text-red-500 bg-red-100 py-2 px-4"
      >
        餘額不足請前往儲值!
      </div>
      <div class="flex justify-between items-center gap-4">
        <button @click="backToCart" class="flex-1 text-sm text-white bg-gray-500 rounded-md py-2">
          上一步
        </button>
        <button
          @click="goTopUp"
          v-if="!isBalanceEnough"
          class="flex-1 text-sm text-white bg-red-500 rounded-md py-2"
        >
          前往儲值頁
        </button>
        <button
          @click="showModal = true"
          class="flex-1 text-sm text-white bg-gray-500 rounded-md py-2"
        >
          結帳
        </button>
        <n-modal
          v-model:show="showModal"
          :mask-closable="false"
          preset="dialog"
          title="確認付款"
          content="最後機會了！即將扣除餘額 💰"
          positive-text="買了 💸"
          negative-text="再想想"
          @positive-click="handleCheckout"
          @negative-click="showModal = false"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
