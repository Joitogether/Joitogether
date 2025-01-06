<script setup>
import { NButton, NTable } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getTopupRecordAPI } from '@/apis/topupAPI'
import { useUserStore } from '@/stores/userStore'
import { formatDate } from '@/utils/useDateTime'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const oneRecord = ref(null)

const getOneTopupRecord = async () => {
  const id = route.params.id
  const response = await getTopupRecordAPI(userStore.user.uid)

  if (response) {
    oneRecord.value = response.find((record) => record.id == id)
    return oneRecord.value
  }
}
const goSpend = () => {
  router.push({ path: '/' })
}
const seeRecord = () => {
  router.push({ path: '/walletRecord' })
}
onMounted(() => {
  getOneTopupRecord()
})
</script>
<template>
  <div class="bg-gray-100">
    <div class="bg-white shadow rounded-md mx-auto w-full p-6 h-screen md:w-3/4 lg:w-3/5">
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

      <div class="text-center flex flex-col gap-2">
        <p class="text-2xl font-semibold text-gray-700">儲值成功</p>
        <p class="text-base text-gray-600">以下為本次儲值明細✨</p>
      </div>
      <n-table :bordered="false" :single-line="false" class="my-8">
        <thead>
          <tr>
            <th>交易日期</th>
            <th>交易類別</th>
            <th>交易金額</th>
            <th>錢包餘額</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="oneRecord">
            <td>{{ formatDate(oneRecord.created_at) }}</td>
            <td>儲值金</td>
            <td>{{ oneRecord.amount }}</td>
            <td>{{ oneRecord.wallet.balance }}</td>
          </tr>
        </tbody>
      </n-table>
      <div class="flex justify-center gap-7">
        <n-button tertiary round type="primary" @click="seeRecord">儲值紀錄</n-button>
        <n-button round type="primary" @click="goSpend">花錢去💰💰💰</n-button>
      </div>
    </div>
  </div>
</template>
