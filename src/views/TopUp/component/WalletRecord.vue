<script setup>
import { NTable, NButton } from 'naive-ui'
import { getWalletTransactionAPI } from '@/apis/topupAPI.js'
import { useUserStore } from '@/stores/userStore'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/dayjsDate'
import { Plus, Minus } from '@iconoir/vue'
import { handleError } from '@/utils/handleError.js'
import { useMessage } from 'naive-ui'

const message = useMessage()
const router = useRouter()
const userStore = useUserStore()
const wallet = ref([])

const fetchWalletBalance = async () => {
  try {
    const result = await getWalletTransactionAPI(userStore.user.uid)

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
  } catch (error) {
    handleError(message, undefined, error)
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
    <n-button type="info" dashed @click="goback" class="hidden sm:block">回上頁</n-button>
  </div>
  <div class="text-3xl flex justify-center">花錢買快樂的紀錄💸</div>
  <n-table :bordered="false" :single-line="false" class="my-14 w-fit m-auto">
    <thead>
      <tr class="text-center text-base">
        <th>交易日期</th>
        <th>交易類別</th>
        <th>交易金額</th>
        <th class="hidden sm:block">交易序號</th>
        <th>錢包餘額</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="record in wallet" :key="record.id" class="text-base">
        <td>{{ formatDate(record.created_at) }}</td>
        <td v-if="record.action == 'deposit'">儲值金</td>
        <td v-if="record.action == 'spend'">揪團活動</td>
        <td v-if="record.action == 'refund'">退款</td>
        <td v-if="record.action == 'deposit'">
          <div class="flex justify-between">
            <plus class="text-green-500" />
            {{ record.amount }}
          </div>
        </td>
        <td v-if="record.action == 'spend'">
          <div class="flex justify-between">
            <minus class="text-red-500" />
            {{ record.amount }}
          </div>
        </td>
        <td v-if="record.action == 'refund'">
          <div class="flex justify-between">
            <plus class="text-green-500" />
            {{ record.amount }}
          </div>
        </td>
        <td class="hidden sm:block">Joimoney{{ record.action }}{{ record.tradeTime }}</td>
        <td>
          <div class="flex justify-between">
            <span>$</span>
            {{ record.updated_balance }}
          </div>
        </td>
      </tr>
    </tbody>
  </n-table>
</template>
