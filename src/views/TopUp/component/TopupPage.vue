<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { NButton, NInputNumber } from 'naive-ui'
import { useRouter } from 'vue-router'
import { getWalletTransactionAPI, handleTopupAPI } from '@/apis/topupAPI.js'

const router = useRouter()
const wallet = ref([])
const userStore = useUserStore()
const amounts = [100, 200, 300, 500, 666, 888, 999, 1111]
const paymentForm = ref(null)
const newebPayParams = ref(null)

const formData = reactive({
  amount: 1,
  itemDesc: '儲值金',
})

const fetchWalletBalance = async () => {
  const result = await getWalletTransactionAPI(userStore.user.uid)
  console.log('walletbalance', result.balance)

  wallet.value = result
  return wallet.value
}

const createOrder = async () => {
  try {
    const orderData = {
      email: userStore.user.email,
      topuper_id: userStore.user.uid,
      amount: formData.amount,
      type: formData.itemDesc,
      payment_status: 'PENDING',
    }
    const response = await handleTopupAPI(orderData)
    const newebpay_data = response
    newebPayParams.value = {
      MerchantID: newebpay_data.MerchantID,
      TradeSha: newebpay_data.shaEncrypt,
      TradeInfo: newebpay_data.aesEncrypt,
      TimeStamp: newebpay_data.TimeStamp,
      Version: newebpay_data.Version,
      MerchantOrderNo: newebpay_data.MerchantOrderNo,
      Amt: newebpay_data.Amt,
      ItemDesc: newebpay_data.itemDesc,
      Email: newebpay_data.email,
      RespondType: 'JSON',
    }
    if (paymentForm.value) {
      setTimeout(() => paymentForm.value.submit(), 3000)
    } else {
      throw new Error('Payment form not found')
    }
  } catch (err) {
    console.error(err)
  }
}
const seeRecord = () => {
  router.push({ path: '/walletRecord' })
}

onMounted(() => {
  fetchWalletBalance()
})
</script>
<template>
  <body>
    <div>
      <div class="text-center mb-6">
        <div class="border-2 rounded-md mt-4 py-4 font-title text-2xl">儲值中心</div>
      </div>
      <div class="mx-10 mb-10 topup-body">
        <div class="flex justify-end items-center mb-6">
          <button
            @click="seeRecord"
            class="border-2 rounded-md px-4 py-2 flex justify-center items-center w-[100px]"
          >
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
        <div class="first-area-bottom grid mb-6 gap-2 sm:grid-cols-12">
          <div
            class="img-container overflow-hidden rounded-full grid- w-16 h-16 aspect-square justify-self-end sm:col-start-2"
          >
            <img class="card-img w-full relative" :src="userStore.user.photo_url" alt="personImg" />
          </div>
          <div class="block content-end sm:col-span-3">
            <div class="mb-1">{{ userStore.user.display_name }}</div>
            <div class="mb-1">{{ userStore.user.email }}</div>
          </div>
          <div class="py-2 text-xl text-center col-span-4 sm:content-end">
            目前富有程度：💰{{ wallet.balance || '0(就快要變富人了！)' }}
          </div>
        </div>
        <div class="second-area-title flex items-center mb-4">
          <div
            class="flex items-center justify-center border-2 rounded-full w-[40px] h-[40px] text-lg"
          >
            2
          </div>
          <span class="ml-4 text-lg">本次儲值金額</span>
        </div>
        <div class="second-area-bottom grid gap-4 mx-14 my-6 sm:grid-cols-4">
          <n-button
            v-for="value in amounts"
            :key="value"
            secondary
            type="warning"
            class="border-2 rounded-md px-6 py-2 text-lg"
            @click="formData.amount = value"
          >
            💰{{ value }}
          </n-button>
        </div>
        <div class="flex justify-center mt-10">
          <div class="amount-input flex mr-5 items-center">
            金額：
            <n-input-number v-model:value="formData.amount" :min="1" placeholder="也可自訂金額唷" />
          </div>
          <div></div>
        </div>
        <div class="topup-button flex justify-center mt-10">
          <form ref="paymentForm" method="POST" action="https://ccore.newebpay.com/MPG/mpg_gateway">
            <input
              v-for="(value, key) in newebPayParams"
              :key="key"
              type="hidden"
              :name="key"
              :value="value"
            />
            <n-button
              type="warning"
              class="text-center border-2 rounded-md py-2 px-10 text-lg"
              @click="createOrder"
            >
              立即儲值
            </n-button>
          </form>
        </div>
      </div>
    </div>
  </body>
</template>
