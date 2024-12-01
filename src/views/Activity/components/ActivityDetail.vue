<script setup>
import { computed, onMounted, ref } from 'vue'
import { Clock, CreditCard, MoneySquare, Group, MapPin, NavArrowLeft } from '@iconoir/vue'
import dayjs from 'dayjs';
import 'dayjs/locale/zh'
import { NInput, NButton, NModal, NCard } from 'naive-ui';
dayjs.locale('zh')
import ActivityCard from '@/views/components/ActivityCard.vue';
import router from '@/router';
import { useRoute } from 'vue-router';
import axios from 'axios';

import { useGoogleMaps } from "@/stores/useGoogleMaps";
const apiKey = import.meta.env.VITE_GOOGLE_KEY;
const { previewMap } = useGoogleMaps(apiKey);
const searchQuery= ref("");


const activity = ref({
  id: 'unique-activity-id',
  name: '一起去玩水', // 活動名稱
  img_url: 'https://www.welcometw.com/wp-content/uploads/2022/06/%E7%B6%B2%E7%BE%8E%E8%80%81%E6%9C%A8@sshihhan-850x638.jpg', // 活動照片網址
  location: '261宜蘭縣頭城鎮濱海路二段6號',
  host_id: 'uid', // 團主 ID
  description: "一場帶你品嘗台北美味夜市小吃的活動。",
  max_participants: 5, // 最大人數
  min_participants: 2, // 最小人數
  category: 'travel',
  status: 'ongoing', // 活動狀態    registrationOpen|onGoing|completed|cancelled
  price: 100, // 活動費用，0 表示免費
  pay_type: 'free', // 付款方式 free|AA|host
  require_approval: true, // 是否需要審核
  approval_deadline: "2024-12-08T23:59:59.000Z", // 最後審核日期
  event_time: "2024-12-08T23:59:59.000Z",
  participants: [],
})

const host = ref({})

const user = ref({
  uid: 'zm5skjX4z7WTal4x6m7f6Ae0zzE2',
  email: 'mbg@dghuifr.voh',
  email_verified: false,
  full_name: '張曉明',
  display_name: '小明123',
  phone_number: 1232312312,
  photo_url: 'https://via.placeholder.com/150',
})

const payment = computed(() => {
  switch (activity.value.pay_type) {
    case 'free':
      return '免費'
    case 'AA':
      return '各付各的'
    case 'host':
      return '團主請客'
    default:
      return 'null'
  }
})

const registerCount = computed(() => {
  return activity.value.participants.length
})

const clearComment = () => {
  userComment.value = ''
}

const showRegisterModal = ref(false)
const toggleModal = () => {
  showRegisterModal.value = !showRegisterModal.value
}

const registerActivity = () => {
  const data = {
    activity_id: activity.value.id,
    participant_id: '12313',
    status: 'registered',
    comment: userComment.value
  }
  console.log(data);
}

const isHost = computed(() => {
  return activity.value.host_id === user.value.uid
})

const userComment = ref('')


const route = useRoute()
onMounted(async() => {
  searchQuery.value = activity.value.location;
  await previewMap(searchQuery.value);
  const id = route.params.id
  const response = await axios.get(`http://localhost:3030/activities/${id}`)
  if(response.status === 200) {
    const { data } = response.data
    activity.value = data
    host.value = data.host_info
  }

  // 如果回傳錯誤??
})

</script>
<template>
  <div class="container ">
    <div class="detail-container">
      <div class="flex items-center mb-4 w-full">
        <router-link :to="{ name: 'home' }">
          <NavArrowLeft  stroke-width="2" class="w-8 h-8 "></NavArrowLeft>
        </router-link>
        <div class="flex h-full  justify-start ml-[5%] w-full">
          <img class="w-14 aspect-square rounded-full" :src="host.photo_url" alt="">
          <div class="ml-3 relative w-full h-14">
            <p class="font-bold text-lg absolute top-0">{{ host.display_name }}</p>
            <p class="absolute bottom-0">新北市 • 45 • 員工</p>
          </div>
        </div>

      </div>
      <div class=" aspect-square overflow-hidden rounded-md">
        <img class="w-full h-full object-cover" :src="activity.img_url" alt="">
      </div>
      <div class="py-3">
        <h3 class="font-bold text-2xl truncate">{{ activity.name }}</h3>
        <div class="flex items-center text-gray-500">
          <Clock/>
          <span class="pl-3">{{ `${dayjs(activity.event_time).format('YYYY年MM月DD日dddd HH:mm')}` }}</span>
        </div>
        <span class="text-sm text-red-500">{{ `最後審核時間 ${dayjs(activity.approval_deadline).format('YYYY年MM月DD日dddd HH:mm')}` }}</span>
        <p class="font-bold text-lg text-end">{{ `${registerCount}人報名` }}</p>
        <NButton v-if="isHost" class="w-full mt-3 font-bold text-lg py-5" round type="primary" @click="router.push({ name: 'activityReview'})">審核</NButton>
        <NButton v-else class="w-full mt-3 font-bold text-lg py-5" round type="primary" @click="toggleModal">報名</NButton>
        <p class="py-8 leading-6">{{ activity.description }}</p>
        <ul class="flex justify-around text-md border border-gray-200/100 rounded-lg p-2">
          <li class="flex flex-col items-center">
            <CreditCard height="35" width="35"></CreditCard>
            <p class="mt-2">{{ payment }}</p>
          </li>
          <li class="flex flex-col items-center">
            <MoneySquare height="35" width="35"></MoneySquare>
            <p class="mt-2">{{`$${parseInt(activity.price).toFixed()}`  }}</p>
          </li>
          <li class="flex flex-col items-center">
            <Group height="35" width="35"></Group>
            <p class="mt-2">{{ `${activity.max_participants}人` }}</p>
          </li>
        </ul>
        <div class="flex items-center my-5">
          <MapPin height="32" width="32"></MapPin>
          <span class="text-lg ml-5">{{ activity.location }}</span>
        </div>
        <div id="map" class="border w-full h-52 text-5xl font-bold">這裡放地圖</div>

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
    <div class="cards-container  px-[2%] ">
      <h2 class="text-2xl font-bold mb-10">近期活動</h2>
      <ActivityCard
        v-for="(items, index) in 5"
        :key="index"

        horizontal="true"
        :title="activity.name"
        :actImgUrl="activity.img_url"
        :location="activity.location"
        :dateTime="dayjs(activity.event_time).format('YYYY年MM月DD日')"
        :participants="registerCount"
        :host="activity.hostId"
        class="mb-[3%]"
      ></ActivityCard>
    </div>
    <NModal
      class="rounded-lg"
      v-model:show="showRegisterModal"
      :auto-focus="false"
    >
      <n-card
        style="width: 500px"
        title="報名活動"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          這裡還可以放東西
        </template>
        <NInput :show-count="true" :maxlength="50" :clearable="true" type="textarea" placeholder="告訴團主你為什麼想參加吧！"></NInput>
        <template #footer>
          <NButton @click="registerActivity" type="primary" round class="font-bold w-full">報名</NButton>
          <NButton type="secondary" round class="font-bold mt-2 w-full" @click="toggleModal">取消</NButton>
        </template>
      </n-card>
    </NModal>

  </div>

</template>
<style scoped>
.container {
  margin: 0 auto;
  width: 85%;
}


@media screen and (width > 768px) {
  .container {
    display: flex;
    max-width: 990px;
    flex-wrap: wrap;
  }
}

@media screen and (width >= 1024px) {
  .container {
    max-width: 70%;
  }

  .detail-container {
    flex: 1;
  }

  .cards-container {
    flex: 1;
    max-width: 50%;
    padding-left: 5%;
    padding-right: 2%;
  }
}

</style>
