<script setup>
import { NResult, NButton, NTable } from 'naive-ui'
import { useRouter } from 'vue-router'
import { getNewebpayStatusAPI, saveTopupAPI } from '@/apis/topupAPI.js'
import { useUserStore } from '@/stores/userStore'
import { onMounted, ref } from 'vue'

const router = useRouter()
const userStore = useUserStore()
const newebpayStatus = ref([])

const getStatus = async () => {
  try {
    const result = await getNewebpayStatusAPI()
    console.log('取得藍新狀態：', result)
    newebpayStatus.value = result
    if (newebpayStatus.value.success) {
      console.log('(前端)藍新交易成功')
      try {
        const saveResponse = await saveTopupAPI(userStore.user.uid, {
          status: 'SUCCESS',
        })
        if (saveResponse) {
          console.log('資料庫狀態更新成功')
          return saveResponse
        }
      } catch (error) {
        console.error('更新資料庫狀態失敗：', error)
        throw error
      }
    } else {
      console.log('藍新交易失敗')
    }
  } catch (error) {
    console.error('處理藍新狀態時發生錯誤：', error)
  }
}
onMounted(async () => {
  await getStatus()
})
const goSpend = () => {
  router.push({ path: '/activity' })
}

const seeRecord = () => {
  router.push({ path: '/walletRecord' })
}
</script>
<template>
  <n-result status="success" title="儲值成功" description="以下為本次交易明細" class="mt-10 mx-14">
    <n-table :bordered="false" :single-line="false" class="my-14">
      <thead>
        <tr>
          <th>交易日期</th>
          <th>交易類別</th>
          <th>交易金額</th>
          <th>交易序號</th>
          <th>錢包餘額</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>2024-12-12 11:12:30</td>
          <td>儲值</td>
          <td>$999</td>
          <td>Joimoney20241212111230</td>
          <td>$99999999</td>
        </tr>
      </tbody>
    </n-table>
    <div class="flex justify-center gap-7">
      <n-button ghost round @click="seeRecord">儲值紀錄</n-button>
      <n-button ghost round type="warning" @click="goSpend">花錢去💰💰💰</n-button>
    </div>
  </n-result>
</template>
