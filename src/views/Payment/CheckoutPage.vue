<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import { useMessage } from 'naive-ui'
import * as PaymentAPIs from '../../apis/paymentAPIs.js'
import { handleError } from '../../utils/handleError.js'
import { useSocketStore } from '@/stores/socketStore.js'

const router = useRouter()
const userStore = useUserStore()
const message = useMessage()

// 抓取購物車明細
const cartItems = ref([])
const subtotal = ref(0)
const fetchCartItems = async () => {
  try {
    const response = await PaymentAPIs.getCheckoutItemsAPI(userStore.user.uid)

    if (!response || !response.length === 0) {
      cartItems.value = []
      return
    }

    cartItems.value = response.cartItems.map((item) => ({
      id: item.id,
      activity_id: item.activity_id,
      title: item.activities.name,
      photo: item.activities.img_url,
      price: Number(item.activities.price),
      require_approval: item.activities.require_approval,
    }))

    subtotal.value = cartItems.value.reduce((total, item) => total + item.price, 0)
  } catch (error) {
    handleError(message, undefined, error)
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

    if (!response || !response.balance || isNaN(Number(response.balance))) {
      balance.value = 0
      return balance.value
    }

    balance.value = Number(response.balance)
    return balance.value
  } catch (error) {
    handleError(message, undefined, error)
    balance.value = 0
    return balance.value
  }
}

// 判斷餘額是否足夠
const isBalanceEnough = computed(() => {
  return balance.value >= total.value
})

// 結帳流程
const socketStore = useSocketStore()
const showModal = ref(false)

const handleCheckout = async () => {
  try {
    // 檢查餘額
    if (!isBalanceEnough.value) {
      message.error('餘額不足！')
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
    goCheckoutSuccess(response.data.order.order_id)
    message.success('訂單完成，報名成功！🚀 快準備迎接精彩的活動吧！')

    const orderItems = response?.data?.order?.order_items

    for (const item of orderItems) {
      const hostId = item?.activities?.host_id
      const activityId = item?.activity_id

      if (!hostId || !activityId) {
        continue
      }

      // 通知功能
      const notiData = {
        actor_id: userStore.user.uid,
        user_id: hostId,
        target_id: activityId,
        action: 'register',
        target_type: 'activity',
        message: '報名了你的活動',
        link: `/activity/detail/${activityId}`,
      }

      try {
        socketStore.sendNotification(notiData)
      } catch {
        return null
      }
    }
  } catch (error) {
    handleError(message, '結帳失敗，請稍後再試 🙇‍♂️', error)
  }
}

// 回到購物車頁面時將購物車明細清空
const backToCart = async () => {
  try {
    const selectedIds = cartItems.value.map((item) => item.id)
    await Promise.all(selectedIds.map((id) => PaymentAPIs.updateCartSelectionAPI(id, false)))
    goShoppingCart()
  } catch (error) {
    handleError(message, undefined, error)
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
  router.replace({ name: 'checkoutSuccess', params: { order_id: orderId } })
}

onMounted(async () => {
  try {
    await Promise.all([fetchCartItems(), fetchWalletBalance()])
  } catch (error) {
    handleError(
      message,
      '😢 資料溜走了，找不到它們！不過別擔心，我們正在努力召喚它們回來 🚀✨',
      error,
    )
  }
})
</script>

<template>
  <div class="w-full bg-gray-100 flex flex-col gap-4">
    <div
      class="flex flex-col gap-4 px-4 py-5 bg-white shadow rounded-md w-full min-h-screen mx-auto md:w-3/4 lg:w-3/5"
    >
      <p class="text-center text-gray-700 text-2xl font-bold">購物車明細</p>
      <div class="">
        <div
          v-for="(item, index) in cartItems"
          :key="index"
          class="flex flex-col justify-between gap-4 rounded-md md:p-2"
        >
          <div class="flex flex-row gap-2 bg-gray-100 rounded-md mb-3 p-2 md:gap-5 md:mb-0">
            <div class="w-16 h-16 bg-gray-300 rounded-md shrink-0 overflow-hidden">
              <img :src="item.photo" class="w-full h-full object-cover" alt="活動圖片" />
            </div>
            <div class="w-3/4 md:w-full flex flex-col justify-between">
              <div class="">
                <p class="text-gray-700 text-base font-semibold line-clamp-2 tracking-wide">
                  {{ item.title }}
                </p>
              </div>
              <span class="text-red-500 font-bold">NT$ {{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <p class="text-center text-gray-700 text-2xl font-bold">訂單明細</p>
        <div class="space-y-4 bg-gray-100 rounded-md px-4 py-4 md:m-2">
          <div>
            <div class="flex justify-between text-sm py-1">
              <span>小計</span>
              <span>$ {{ subtotal }}</span>
            </div>
            <div class="flex justify-between text-sm font-semibold py-1">
              <span>總計</span>
              <span>$ {{ total }}</span>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-sm py-1">
              <span>儲值金餘額</span>
              <span>$ {{ balance }}</span>
            </div>
            <div v-if="!isBalanceEnough" class="flex justify-between text-sm font-semibold py-1">
              <span>餘額不足</span>
              <span>$ - {{ total - balance }}</span>
            </div>
            <div v-if="isBalanceEnough" class="flex justify-between text-sm font-semibold py-1">
              <span>扣除後剩餘儲值金</span>
              <span>$ {{ balance - total }}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!isBalanceEnough"
        class="rounded-md text-center text-sm text-red-500 bg-red-100 py-2 px-4 md:m-2"
      >
        餘額不足請前往儲值!
      </div>
      <div class="flex justify-between items-center gap-4 md:m-2">
        <button
          @click="backToCart"
          class="flex-1 text-sm text-white bg-green-600 rounded-full py-2 hover:bg-green-500"
        >
          上一步
        </button>
        <button
          @click="goTopUp"
          v-if="!isBalanceEnough"
          class="flex-1 text-sm text-white bg-red-400 rounded-full py-2 hover:bg-red-300"
        >
          前往儲值頁
        </button>
        <button
          @click="showModal = true"
          class="flex-1 text-sm text-white bg-green-600 rounded-full py-2 hover:bg-green-500"
        >
          結帳
        </button>
        <n-modal
          v-model:show="showModal"
          :mask-closable="false"
          preset="dialog"
          title="確認付款"
          content="🌟 最後確認！按下去後你就正式擁有這些活動了 🎉"
          positive-text="我準備好了！💸"
          negative-text="再猶豫一下 🥸"
          @positive-click="handleCheckout"
          @negative-click="showModal = false"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
