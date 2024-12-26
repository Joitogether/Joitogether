<script setup>
import { NTable, NButton } from 'naive-ui'
import { getWalletBalanceAPI } from '@/apis/topupAPI.js'
import { useUserStore } from '@/stores/userStore'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/dayjsDate'
import { Plus, Minus } from '@iconoir/vue'

const router = useRouter()
const userStore = useUserStore()
const wallet = ref([])

const fetchWalletBalance = async () => {
  try {
    const result = await getWalletBalanceAPI(userStore.user.uid)

    if (result) {
      let changeTime = 0
      wallet.value = result.transactions
      wallet.value = wallet.value.map((record) => {
        changeTime = formatDate(record.created_at).replace(/[-: ]/g, '')
        return {
          ...record,
          tradeTime: changeTime,
        }
      })
    }
  } catch (err) {
    console.error(err)
  }
}

const goback = () => {
  router.push({ path: '/topup' })
}
onMounted(() => {
  fetchWalletBalance()
})
</script>
<template>
  <div class="mx-10 pt-10">
    <n-button type="info" dashed @click="goback">回上頁</n-button>
  </div>
  <div class="text-3xl flex justify-center">花錢買快樂的紀錄💸</div>
  <n-table :bordered="false" :single-line="false" class="my-14 w-fit m-auto">
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
      <tr v-for="record in wallet" :key="record.id">
        <td>{{ formatDate(record.created_at) }}</td>
        <td v-if="record.action == 'deposit'">儲值金</td>
        <td v-if="record.action == 'spend'">揪團活動</td>
        <td v-if="record.action == 'deposit'" class="flex justify-between">
          <plus class="text-green-500" />
          ${{ record.amount }}
        </td>
        <td v-if="record.action == 'spend'" class="flex justify-between">
          <minus class="text-red-500" />
          ${{ record.amount }}
        </td>
        <td>Joimoney{{ record.action }}{{ record.tradeTime }}</td>
        <td>${{ record.updated_balance }}</td>
      </tr>
    </tbody>
  </n-table>
</template>
