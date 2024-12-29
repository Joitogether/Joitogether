<script setup>
import { onMounted, ref } from 'vue'
import { userGetActivityAPI } from '@/apis/userAPIs'
import { useUserStore } from '@/stores/userStore'
import dayjs from 'dayjs'
import { handleError } from '@/utils/handleError.js'

const userStore = useUserStore()
const loading = ref(true)
const activity = ref([])
const afterToday = ref([])
const beforeToday = ref([])
const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm')
}

const fetchActivityData = async () => {
  try {
    const result = await userGetActivityAPI(userStore.user.uid)

    // 確保返回的資料是陣列
    if (result && result.length > 0) {
      activity.value = result

      const allActivities = result.filter((item) => item.activities).map((item) => item.activities)

      afterToday.value = allActivities.filter((item) => new Date(item.event_time) > new Date())
      beforeToday.value = allActivities.filter((item) => new Date(item.event_time) < new Date())
    } else {
      activity.value = []
      afterToday.value = []
      beforeToday.value = []
    }
  } catch {
    handleError()
  } finally {
    loading.value = false
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
        <div
          v-for="(future_activity, id) in afterToday"
          :key="id"
          class="flex bg-white p-3 h-auto rounded-md"
        >
          <div class="w-full flex flex-col gap-1 md:justify-between">
            <div class="flex flex-col gap-1">
              <p class="text-xl font-bold tracking-wide">{{ future_activity.name }}</p>
              <div class="text-lg tracking-wide">{{ future_activity.location }}</div>
            </div>
            <div class="text-sm text-gray-400">
              {{ formatDate(future_activity.event_time) }}
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
      <div v-if="beforeToday.length > 0" class="pt-5 flex flex-col gap-5">
        <div
          v-for="(pre_activity, id) in beforeToday"
          :key="id"
          class="flex bg-white p-3 h-auto rounded-md"
        >
          <div class="w-full flex flex-col gap-1 md:justify-between">
            <div class="flex flex-col gap-1">
              <p class="text-xl font-bold tracking-wide">{{ pre_activity.name }}</p>
              <div class="text-lg tracking-wide">{{ pre_activity.location }}</div>
            </div>
            <div class="text-sm text-gray-400">{{ formatDate(pre_activity.event_time) }}</div>
          </div>
          <div
            class="hidden md:block w-1/3 aspect-square overflow-hidden rounded-md bg-gray-200 items-center justify-center"
          >
            <img
              :src="pre_activity.img_url"
              alt="past-party-photo"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <div v-else class="mt-5 text-center text-gray-600">用戶沒有過去的活動</div>
    </div>
  </div>
</template>
