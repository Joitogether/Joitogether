<script setup>
import { NTable, NButton } from 'naive-ui';
import { getTopupRecordAPI } from '@/apis/paymentAPI';
import { useUserStore } from '@/stores/userStore';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getWalletBalanceAPI } from '@/apis/paymentAPI';
import { formatDate } from '@/utils/dayjsDate';

const router = useRouter()
const userStore = useUserStore()
const topupRecords = ref([])
const wallet = ref([])

const getAllRecords = async() => {
  const response = await getTopupRecordAPI(userStore.user.uid)
  topupRecords.value = response
  return response
}

const fetchWalletBalance = async() => {
  try{
    const result = await getWalletBalanceAPI(userStore.user.uid)

    if(result) {
      wallet.value = result
      let runningBalance = 0;
      topupRecords.value = topupRecords.value.map(record => {
        record.amount = Number(record.amount);
        runningBalance += record.amount;
        return {
          ...record,
          balance: runningBalance
        };
      });
    }
  } catch (err) {
    console.error(err)
  }
}

const goback = () => {
  router.push({ path:'/topup' })
}
onMounted(async() => {
  await getAllRecords(),
  await fetchWalletBalance()

})

</script>
<template>
  <div class="mx-10 mt-10">
    <n-button type="info" dashed @click="goback">回上頁</n-button>
  </div>
  <div class="text-3xl flex justify-center">錢錢飛走的紀錄💸</div>
  <n-table :bordered="false" :single-line="false" class="my-14 mx-10">
        <thead>
          <tr>
            <th>儲值日期</th>
            <th>交易類別</th>
            <th>儲值金額</th>
            <th>交易序號</th>
            <th>錢包餘額</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in topupRecords" :key="record.id">
            <td>{{ formatDate(record.topup_date) }}</td>
            <td>{{ record.type }}</td>
            <td>${{ record.amount }}</td>
            <td>Joimoney{{ record.topup_number }}</td>
            <td>${{ record.balance }}</td>
          </tr>
        </tbody>
      </n-table>
</template>
