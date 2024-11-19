<script setup>
import { computed, ref } from 'vue'
import { Clock, CreditCard, MoneySquare, Group, MapPin } from '@iconoir/vue'
import dayjs from 'dayjs';
import 'dayjs/locale/zh'
import { NInput, NButton } from 'naive-ui';
dayjs.locale('zh') 
import ActivityCard from '@/views/components/ActivityCard.vue';

const activity = ref({
  id: 'unique-activity-id',
  name: '一起去玩水', // 活動名稱
  imageUrl: 'https://www.welcometw.com/wp-content/uploads/2022/06/%E7%B6%B2%E7%BE%8E%E8%80%81%E6%9C%A8@sshihhan-850x638.jpg', // 活動照片網址
  location: '261宜蘭縣頭城鎮濱海路二段6號', 
  startDate: '2024-12-20', // 開始日期 
  endDate: '2024-12-25', // 結束日期
  startTime: '14:00', // 開始時間
  endTime: '18:00', // 結束時間
  hostId: 'uid', // 團主 ID
  description: '新竹尖石鄉最美的「尖石薰衣草森林」介紹分享，新竹薰衣草森林是台灣首家以香草植物為主題的景觀餐廳，園區內有薰衣草希望之丘、鄉村祕密花園、四月繡球花季，與五月的薰衣草、鼠尾草小徑是來薰衣草森林必拍場景，尖石薰衣草森林美麗的仙境景色，怎麼看都不會膩，精選尖石薰衣草森林順遊景點、交通方式、園區介紹等等，一起出發到薰衣草森林走走 ...🌲🌳🌲🏕⛰️', // 活動描述
  maxParticipants: 5, // 最大人數
  minParticipants: 2, // 最小人數
  participants: {
    registered: ['uid1', 'uid2'], // 報名
    approved: ['uid1', 'uid2'], // 審核通過
    declined: [], // 拒絕
  },
  category: 'travel',
  requiresApproval: true, // 是否需要審核
  approvalDeadline: '2024-12-15', // 最後審核日期
  status: 'ongoing', // 活動狀態    registrationOpen|onGoing|completed|cancelled
  price: 100, // 活動費用，0 表示免費
  payType: 'free', // 付款方式 free|AA|host
})

const payment = computed(() => {
  switch (activity.value.payType) {
    case 'free':
      return '免費'
    case 'AA':
      return '各付各的'
    case 'host':
      return '團主請客'
  }
})

const registerCount = computed(() => {
  return activity.value.participants.registered.length
})

const clearComment = () => {
  userComment.value = ''
}
const userComment = ref('')
</script>
<template>
  <div class="max-w-3xl ">
    <div class=" aspect-square overflow-hidden rounded-md">
      <img class="w-full h-full object-cover" :src="activity.imageUrl" alt="">
    </div>
    <div class="px-5 py-3">
      <h3 class="font-bold text-2xl">{{ activity.name }}</h3>
      <div class="flex items-center text-gray-500">
        <Clock/>
        <span class="pl-3">{{ `${dayjs(activity.startDate).format('YYYY, MM月DD日 dddd')} ${activity.startTime}` }}</span>
      </div>
      <span class="text-sm text-red-500">{{ `最後審核時間 ${activity.approvalDeadline}` }}</span>
      <p class="font-bold text-lg text-end">{{ `${registerCount}人報名` }}</p>
      <NButton class="w-full mt-3 font-bold text-lg py-5" round type="primary">報名</NButton> 
      <p class="py-8 leading-6">{{ activity.description }}</p>
      <ul class="flex justify-around text-md border border-gray-200/100 rounded-lg p-2">
        <li class="flex flex-col items-center">
          <CreditCard height="35" width="35"></CreditCard>
          <p class="mt-2">{{ payment }}</p>
        </li>
        <li class="flex flex-col items-center">
          <MoneySquare height="35" width="35"></MoneySquare>
          <p class="mt-2">{{`$${activity.price}`  }}</p>
        </li>
        <li class="flex flex-col items-center">
          <Group height="35" width="35"></Group> 
          <p class="mt-2">{{ `${activity.maxParticipants}人` }}</p>
        </li>
      </ul>
      <div class="flex items-center mt-5">
        <MapPin height="32" width="32"></MapPin>
        <span class="text-lg ml-5">{{ activity.location }}</span>
      </div>
      <div class="border h-52 text-5xl font-bold">這裡放地圖</div>

      <div class="mt-3">
        <span class="block text-2xl font-bold mb-2">阿勳的評價與評分</span>
        <div class="border h-52 text-5xl font-bold">這裡放星星評分</div>
        <span class="block mt-10 mb-2">留言</span>
        <NInput v-model:value="userComment" type="textarea" placeholder="留下你想說的話吧!"></NInput>
        <div class="text-end mt-2">
          <NButton secondary @click="clearComment">取消</NButton>
          <NButton :disabled="userComment.length == 0" type="primary" class="ml-2">留言</NButton> 
        </div>
      </div>
    </div>
  </div>
  <ActivityCard 
    horizontal="true"
    :title="activity.name"
    :actImgUrl="activity.imageUrl"
    :location="activity.location"
    :date-time="activity.startDate"
    :participants="activity.participants.registered.length"
    :host="activity.hostId"
  ></ActivityCard>
</template>
<style scoped>
</style>  