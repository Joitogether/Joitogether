<script setup>
import { NResult, NButton, NTable } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getTopupRecordAPI } from '@/apis/topupAPI'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const oneRecord = ref(null)

const getOneTopupRecord = async () => {
  const id = route.params.id
  const { recordData, walletBalance } = await getTopupRecordAPI(userStore.user.uid)
  if (recordData && walletBalance) {
    oneRecord.value = recordData.find((record) => record.id == id)
    console.log('成功頁面取得的資料', oneRecord.value)

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
  <n-result status="success" title="儲值成功" description="以下為本次交易明細" class="mt-10 mx-14">
    <n-table :bordered="false" :single-line="false" class="my-14">
      <thead>
        <tr>
          <th>交易日期</th>
          <th>交易類別</th>
          <th>交易金額</th>
          <th>錢包餘額</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ oneRecord.created_at }}</td>
          <td>儲值金</td>
          <td>{{ oneRecord.amount }}</td>
          <td>{{ walletBalance.balance }}</td>
        </tr>
      </tbody>
    </n-table>
    <div class="flex justify-center gap-7">
      <n-button ghost round @click="seeRecord">儲值紀錄</n-button>
      <n-button ghost round type="warning" @click="goSpend">花錢去💰💰💰</n-button>
    </div>
  </n-result>
</template>
