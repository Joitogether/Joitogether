<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { NButton, NInputNumber, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { getWalletTransactionAPI, handleTopupAPI } from '@/apis/topupAPI.js'
import { handleError } from '@/utils/handleError.js'

const message = useMessage()
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
  try {
    const result = await getWalletTransactionAPI(userStore.user.uid)

    if (!result || result.length === 0) {
      wallet.value = 0
      return
    }
    wallet.value = result
  } catch (error) {
    handleError(message, undefined, error)
  }
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
      message.loading('頁面跳轉中', {
        duration: 2000,
      })
      setTimeout(() => paymentForm.value.submit(), 500)
    } else {
      throw new Error('Payment form not found')
    }
  } catch (error) {
    handleError(message, undefined, error)
  }
}
const seeRecord = () => {
  router.push({ path: '/walletRecord' })
}

onMounted(() => {
  window.scrollTo({ top: 0 })
  fetchWalletBalance()
})
</script>
<template>
  <div class="bg-gray-100">
    <div class="bg-white relative shadow py-5 px-4 mx-auto w-full md:w-3/4 lg:w-3/5 md:px-8">
      <div class="flex items-center mt-5">
        <div class="absolute left-1/2 -translate-x-1/2 rounded-md font-bold text-2xl text-gray-700">
          儲值中心
        </div>
        <n-button
          tertiary
          type="primary"
          @click="seeRecord"
          class="absolute right-3 border-2 rounded-md px-3 py-1 md:right-16"
        >
          儲值記錄
        </n-button>
      </div>
      <div class="mt-7 flex flex-col gap-8">
        <div>
          <div class="relative flex items-center mb-4 pl-4 text-lg font-semibold">
            <span
              class="before:content-[''] before:absolute before:top-0 before:left-0 before:w-2 before:h-full before:bg-green-600"
              >餘額</span
            >
          </div>
          <div class="rounded-md p-4 flex flex-col gap-3 md:px-10">
            <div class="flex gap-2 items-center border-b-2 border-gray-100 pb-4">
              <div class="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <img
                  class="w-full h-full object-cover"
                  :src="userStore.user.photo_url"
                  alt="personImg"
                />
              </div>
              <div class="w-full">
                <div class="text-base font-semibold">{{ userStore.user.display_name }}</div>
                <div class="tracking-wide">{{ userStore.user.email }}</div>
              </div>
            </div>
            <p class="text-base font-semibold">
              💰 目前富有程度：${{ wallet.balance || '0(就快要變富人了！)' }}
            </p>
          </div>
        </div>

        <div>
          <div class="">
            <div class="relative flex items-center pl-4 text-lg font-semibold">
              <span
                class="before:content-[''] before:absolute before:top-0 before:left-0 before:w-2 before:h-full before:bg-green-600"
                >本次儲值金額</span
              >
            </div>
          </div>
          <div class="grid gap-4 mx-10 my-6 lg:grid-cols-2">
            <n-button
              v-for="value in amounts"
              :key="value"
              tertiary
              type="primary"
              class="border-2 rounded-md px-6 py-2 text-lg"
              @click="formData.amount = value"
            >
              💰 {{ value }}
            </n-button>
          </div>
          <div class="flex justify-center mt-10">
            <div class="amount-input flex mr-5 items-center">
              金額：
              <n-input-number
                v-model:value="formData.amount"
                :min="1"
                placeholder="也可自訂金額唷"
              />
            </div>
            <div></div>
          </div>
          <div class="topup-button flex justify-center mt-6">
            <form
              ref="paymentForm"
              method="POST"
              action="https://ccore.newebpay.com/MPG/mpg_gateway"
            >
              <input
                v-for="(value, key) in newebPayParams"
                :key="key"
                type="hidden"
                :name="key"
                :value="value"
              />
              <n-button type="primary" class="rounded-full px-10 py-4" @click="createOrder">
                立即儲值
              </n-button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
