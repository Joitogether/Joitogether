<script setup>
import { onMounted, ref } from 'vue'
import { NEllipsis } from 'naive-ui'
import { UserGetActivityApi } from '@/apis/UserApi'
import { useUserStore } from '@/stores/userStore'
import dayjs from 'dayjs'

const userStore = useUserStore()
const loading = ref(true)
const errorMessage = ref(null)
const activity = ref([])
const afterToday = ref([])
const beforeToday = ref([])
const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm')
}

const fetchActivityData = async () => {
  try {
    const result = await UserGetActivityApi(userStore.user.uid)
    console.log('活動資料：', result)

    if (result) {
      activity.value = result
      console.log(activity.value)
      let allActivities = []

      activity.value.forEach((item) => {
        if (item.activities) {
          const activityData = item.activities
          console.log('活動:', activityData)

          allActivities.push(activityData)
        }
      })
      afterToday.value = allActivities.filter((item) => {
        const itemDate = new Date(item.event_time)
        return itemDate > new Date()
      })

      console.log('afterToday資料', afterToday.value)
      loading.value = false

      beforeToday.value = allActivities.filter((item) => {
        const itemDate = new Date(item.event_time)
        return itemDate < new Date()
      })
      console.log('beforeToday資料', beforeToday.value)
      loading.value = false
    } else {
      console.log('該用戶還沒有活動')
    }
  } catch (err) {
    errorMessage.value = err.message || '資料加載錯誤'
    loading.value = false
    console.error('Error:', err)
  }
}

onMounted(() => {
  fetchActivityData()
})

// const beforeToday = activity.value.filter(item => {
//   const itemDate = new Date(item.event_time);
//   console.log(itemDate);

//   return itemDate < today;
// });
// console.log(beforeToday);

onMounted(() => {
  fetchActivityData()
})
</script>

<template>
  <<<<<<< HEAD
  <div class="partyArea pb-10">
    <div class="h-20 content-center text-center bg-slate-100 text-lg">即將參加</div>
    <div
      v-for="(future_activity, id) in afterToday"
      :key="id"
      class="future-party grid grid-cols-3 gap-10 mt-10 sm:px-14 px-9"
    >
      <div class="future-party-photo overflow-hidden flex max-h-40">
        <img :src="future_activity.img_url" alt="future-party-photo" class="object-contain" />
      </div>
      <div class="future-party-detail col-span-2">
        <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
          <h3 class="text-3xl font-bold">{{ future_activity.name }}</h3>
        </n-ellipsis>
        <br />
        <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
          <div class="text-xl">{{ future_activity.location }}</div>
        </n-ellipsis>
        <br />
        <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
          <div class="text-xl">{{ future_activity.event_time }}</div>
        </n-ellipsis>
      </div>
    </div>

    <div class="h-20 content-center text-center bg-slate-100 text-lg mt-10">聚會紀錄</div>
    <div
      v-for="(pre_activity, id) in beforeToday"
      :key="id"
      class="past-party grid grid-cols-3 gap-10 mt-10 sm:px-14 px-9 overflow-hidden"
    >
      <div class="past-party-photo overflow-hidden flex max-h-40">
        <img :src="pre_activity.img_url" alt="past-party-photo" class="object-contain" />
      </div>
      <div class="past-party-detail col-span-2">
        <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
          <h3 class="text-3xl font-bold">{{ pre_activity.name }}</h3>
        </n-ellipsis>
        <br />
        <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
          <div class="text-xl">{{ pre_activity.location }}</div>
        </n-ellipsis>
        <br />
        <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
          <div class="text-xl">{{ pre_activity.event_time }}</div>
        </n-ellipsis>
      </div>
    </div>
  </div>
  =======
  <div class="partyArea pb-10">
    <div class="h-20 content-center text-center bg-slate-100 text-lg">即將參加</div>
    <div
      v-if="beforeToday.length > 0"
      v-for="(future_activity, id) in afterToday"
      :key="id"
      class="future-party grid grid-cols-3 gap-10 mt-10 sm:px-14 px-9"
    >
      <div class="future-party-photo overflow-hidden flex max-h-40">
        <img :src="future_activity.img_url" alt="future-party-photo" class="object-contain" />
      </div>
      <div class="future-party-detail col-span-2">
        <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
          <h3 class="text-3xl font-bold">{{ future_activity.name }}</h3>
        </n-ellipsis>
        <br />
        <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
          <div class="text-xl">{{ future_activity.location }}</div>
        </n-ellipsis>
        <br />
        <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
          <div class="text-xl">{{ formatDate(future_activity.event_time) }}</div>
        </n-ellipsis>
      </div>
    </div>
    <div v-else>用戶沒有即將參加的活動</div>

    <div class="h-20 content-center text-center bg-slate-100 text-lg mt-10">聚會紀錄</div>
    <div
      v-if="beforeToday.length > 0"
      v-for="(pre_activity, id) in beforeToday"
      :key="id"
      class="past-party grid grid-cols-3 gap-10 mt-10 sm:px-14 px-9 overflow-hidden"
    >
      <div class="past-party-photo overflow-hidden flex max-h-40">
        <img :src="pre_activity.img_url" alt="past-party-photo" class="object-contain" />
      </div>
      <div class="past-party-detail col-span-2">
        <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
          <h3 class="text-3xl font-bold">{{ pre_activity.name }}</h3>
        </n-ellipsis>
        <br />
        <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
          <div class="text-xl">{{ pre_activity.location }}</div>
        </n-ellipsis>
        <br />
        <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
          <div class="text-xl">{{ formatDate(pre_activity.event_time) }}</div>
        </n-ellipsis>
      </div>
    </div>
    <div v-else>用戶沒有過去的活動</div>
  </div>

  >>>>>>> 7a1f5646d40bf330176391f2d523caae48f47669
</template>
