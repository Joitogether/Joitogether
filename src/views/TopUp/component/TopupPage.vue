<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { NButton, NInputNumber } from 'naive-ui'
import { useRouter } from 'vue-router'
import {
  createPaymentAPI,
  getWalletBalanceAPI,
  saveTopupAPI,
  addDepositAPI,
} from '@/apis/paymentAPI'
import { formatDate } from '@/utils/dayjsDate'

const router = useRouter()
const user = ref([])
const wallet = ref([])
const userStore = useUserStore()
const amounts = [100, 200, 300, 500, 666, 888, 999, 1111]

const formData = reactive({
  amount: 1,
  email: '',
  itemDesc: '儲值金',
})

const fetchWalletBalance = async () => {
  const result = await getWalletBalanceAPI(userStore.user.uid)
  wallet.value = result
  return wallet.value
}

const createOrder = async () => {
  formData.email = user.value.email

  try {
    const response = await createPaymentAPI(formData)

    if (response) {
      const orderData = {
        topuper_id: userStore.user.uid,
        amount: formData.amount,
        topup_number: response.MerchantOrderNo,
        type: formData.itemDesc,
        topup_date: formatDate(new Date()),
        status: 'PENDING',
      }

      const saveResponse = await saveTopupAPI(userStore.user.uid, orderData)
      console.log('saveResponse:', saveResponse)
      if (saveResponse) {
        console.log('訂單資料儲存成功')
      } else {
        console.log('儲存訂單資料失敗')
      }
      //將儲值金額加至錢包（這部分之後移到儲值完成頁面）
      const increaseWallet = await addDepositAPI(userStore.user.uid, { amount: orderData.amount })
      console.log('increaseWallet', increaseWallet.data)
      if (increaseWallet) {
        console.log('錢包增加成功')
      } else {
        console.log('錢包增加失敗')
      }

      const form = document.createElement('form')
      form.method = 'POST'
      form.action = 'https://ccore.newebpay.com/MPG/mpg_gateway'

      const newebPayParams = {
        MerchantID: response.MerchantID,
        TradeSha: response.shaEncrypt,
        TradeInfo: response.aesEncrypt,
        TimeStamp: response.TimeStamp,
        Version: response.Version,
        MerchantOrderNo: response.MerchantOrderNo,
        Amt: response.Amt,
        ItemDesc: formData.itemDesc,
        Email: response.Email,
        RespondType: 'JSON',
      }

      Object.keys(newebPayParams).forEach((key) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = newebPayParams[key]
        form.appendChild(input)
      })

      document.body.appendChild(form)
      console.log('已加密：', newebPayParams)

      form.submit()
    }
  } catch (err) {
    console.error(err)
  }
}
const seeRecord = () => {
  router.push({ path: '/topupRecord' })
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
      <div class="mx-10">
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
        <div class="first-area-bottom grid grid-cols-12 mb-6 gap-2">
          <div
            class="img-container overflow-hidden col-start-2 justify-self-end rounded-full grid- w-16 h-16 aspect-square"
          >
            <img class="card-img w-full relative" :src="userStore.user.photo_url" alt="personImg" />
          </div>
          <div class="block col-span-3 content-end">
            <div class="mb-1">{{ userStore.user.display_name }}</div>
            <div class="mb-1">{{ userStore.user.email }}</div>
          </div>
          <div class="py-2 col-span-4 text-xl content-end">
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
        <div class="second-area-bottom grid grid-cols-4 gap-4 mx-14 my-6">
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
  </body>
</template>
