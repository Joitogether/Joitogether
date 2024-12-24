<script setup>
import { NTable, NButton } from 'naive-ui';
import { getTopupRecordAPI } from '@/apis/paymentAPI';
import { useUserStore } from '@/stores/userStore';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';

const router = useRouter()
const userStore = useUserStore()
const topupRecords = ref([])
const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm');
};

const getAllRecords = async() => {
  const response = await getTopupRecordAPI(userStore.user.uid)
  topupRecords.value = response
  console.log('前端頁面資料', topupRecords.value);
  return response
}
const goback = () => {
  router.push({ path:'/topup' })
}
onMounted(() => {
  getAllRecords()
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
            <th>交易日期</th>
            <th>交易類別</th>
            <th>交易金額</th>
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
            <td>$99999999</td>
          </tr>
        </tbody>
      </n-table>
</template>
