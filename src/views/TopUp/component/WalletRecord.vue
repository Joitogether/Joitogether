<script setup>
import { NTable, useMessage, NPagination } from 'naive-ui'
import { getWalletTransactionAPI } from '@/apis/topupAPI.js'
import { useUserStore } from '@/stores/userStore'
import { onMounted, ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/dayjsDate'
import { Plus, Minus, NavArrowLeft } from '@iconoir/vue'
import { handleError } from '@/utils/handleError.js'

const message = useMessage()
const router = useRouter()
const userStore = useUserStore()
const wallet = ref([])
const currentPage = ref(1)
const limit = ref(13)
const screenWidth = ref(window.innerWidth)

const fetchWalletBalance = async () => {
  try {
    const result = await getWalletTransactionAPI(userStore.user.uid)
    if (result.length === 0) {
      wallet.value = 0
      message.info('💰 看來你的荷包還在節食，儲值一下讓它吃飽吧！')
    } else {
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

const totalPages = computed(() => Math.ceil(wallet.value.length / limit.value))
const paginatedItems = computed(() => {
  if (!wallet.value) {
    return
  } else {
    const start = (currentPage.value - 1) * limit.value
    const end = start + limit.value
    return wallet.value.slice(start, end)
  }
})

const checkScreenSize = () => {
  screenWidth.value = window.innerWidth

  if (screenWidth.value < 768) {
    limit.value = 6
  } else if (screenWidth.value >= 768 && screenWidth.value < 1024) {
    limit.value = 10
  } else {
    limit.value = 13
  }
}

onMounted(() => {
  fetchWalletBalance()
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
const goback = () => {
  router.back()
}
</script>
<template>
  <div class="bg-gray-100">
    <div class="bg-white rounded-md mx-auto w-full min-h-screen md:w-3/4 lg:w-3/5">
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
      <div>
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
            <tr v-for="record in paginatedItems" :key="record.id" class="text-base">
              <td>{{ formatDate(record.created_at) }}</td>
              <td v-if="record.action == 'deposit'">儲值金</td>
              <td v-if="record.action == 'spend'">揪團活動</td>
              <td v-if="record.action == 'refund'">活動退款</td>
              <td v-if="record.action == 'income'">活動收款</td>
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
              <td v-if="record.action == 'income'">
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
        <div class="mt-5 flex justify-center" v-if="wallet.length > 0">
          <n-pagination
            v-model:page="currentPage"
            :page-count="totalPages"
            :page-size="itemsPerPage"
            @update:page-size="updateItemsPerPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>
