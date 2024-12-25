<script setup>
import { onMounted, ref } from 'vue'
import { userGetActivityAPI } from '@/apis/userAPIs'
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
    const result = await userGetActivityAPI(userStore.user.uid)
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
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="bg-gray-50 px-5 py-5 rounded-md">
      <div class="content-center text-center text-xl font-bold border-b-2 pb-3">即將參加</div>
      <div v-if="afterToday.length > 0" class="pt-5 flex flex-col gap-5">
        <div v-for="(future_activity, id) in afterToday" :key="id" class="flex bg-white p-3 h-auto">
          <div class="w-full flex flex-col gap-1 md:justify-between">
            <div class="flex flex-col gap-1">
              <div expand-trigger="click" line-clamp="1" :tooltip="false">
                <h3 class="text-xl font-bold tracking-wide">{{ future_activity.name }}</h3>
              </div>
              <div expand-trigger="click" line-clamp="1" :tooltip="false">
                <div class="text-lg tracking-wide">{{ future_activity.location }}</div>
              </div>
            </div>
            <div expand-trigger="click" line-clamp="1" :tooltip="false">
              <div class="text-sm text-gray-400">{{ formatDate(future_activity.event_time) }}</div>
            </div>
          </div>
          <div
            class="hidden md:block w-1/3 aspect-square overflow-hidden rounded-md bg-gray-200 items-center justify-center"
          >
            <img
              v-if="future_activity.img_url"
              :src="future_activity.img_url"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <div v-else>用戶沒有即將參加的活動</div>
    </div>

    <div class="bg-gray-50 px-5 py-5 rounded-md">
      <div class="content-center text-center text-xl font-bold border-b-2 pb-3">聚會紀錄</div>
      <div v-if="beforeToday.length > 0">
        <div
          v-for="(pre_activity, id) in beforeToday"
          :key="id"
          class="past-party gap-10 mt-10 sm:px-14 px-9 overflow-hidden"
        >
          <div class="past-party-photo overflow-hidden flex max-h-40">
            <img :src="pre_activity.img_url" alt="past-party-photo" class="object-contain" />
          </div>
          <div class="past-party-detail col-span-2">
            <div expand-trigger="click" line-clamp="1" :tooltip="false">
              <h3 class="text-3xl font-bold">{{ pre_activity.name }}</h3>
            </div>
            <br />
            <div expand-trigger="click" line-clamp="1" :tooltip="false">
              <div class="text-xl">{{ pre_activity.location }}</div>
            </div>
            <br />
            <div expand-trigger="click" line-clamp="1" :tooltip="false">
              <div class="text-xl">{{ formatDate(pre_activity.event_time) }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="mt-5 text-center text-gray-600">用戶沒有過去的活動</div>
    </div>
  </div>
</template>
