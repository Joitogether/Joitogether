<script setup>
import { NTable } from 'naive-ui'
import { getWalletTransactionAPI } from '@/apis/topupAPI.js'
import { useUserStore } from '@/stores/userStore'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/dayjsDate'
import { Plus, Minus } from '@iconoir/vue'
import { handleError } from '@/utils/handleError.js'
import { useMessage } from 'naive-ui'
import { NavArrowLeft } from '@iconoir/vue'

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
  <div class="bg-gray-100">
    <div class="bg-white rounded-md mx-auto w-full h-screen md:w-3/4 lg:w-3/5">
      <div class="flex items-center p-4 h-14 bg-gray-100 w-full relative">
        <div
          class="absolute left-0 cursor-pointer h-full w-12 flex items-center hover:text-gray-500"
          @click="goback"
        >
          <NavArrowLeft
            stroke-width="2"
            class="w-6 h-6 text-gray-700 absolute left-4"
          ></NavArrowLeft>
        </div>

        <div
          class="text-xl font-bold text-center text-gray-700 tracking-wide absolute left-1/2 -translate-x-1/2"
        >
          花錢買快樂的紀錄💸
        </div>
      </div>
      <div class="">
        <n-table :bordered="false" :single-line="false" class="">
          <thead>
            <tr class="text-center text-base">
              <th>交易日期</th>
              <th>交易類別</th>
              <th>交易金額</th>
              <th class="hidden lg:block">交易序號</th>
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

              <td class="hidden lg:block">Joimoney{{ record.action }}{{ record.tradeTime }}</td>
              <td>
                <div class="flex justify-between">
                  <span>$</span>
                  {{ record.updated_balance }}
                </div>
              </td>
            </tr>
          </tbody>
        </n-table>
      </div>
    </div>
  </div>
</template>
