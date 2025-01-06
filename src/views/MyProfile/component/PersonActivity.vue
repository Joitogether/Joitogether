<script setup>
import { onMounted, reactive, ref, watch, computed } from 'vue'
import { userGetActivityAPI, userGetActivityHostAPI } from '@/apis/userAPIs'
import { handleError } from '@/utils/handleError.js'
import { useMessage, NSelect } from 'naive-ui'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/useDateTime'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const message = useMessage()
const router = useRouter()
const route = useRoute()
const loading = ref(true)
const afterToday = ref([])
const beforeToday = ref([])
const selectedValue = ref('activitiesRecords')
const hostList = ref([])
const allValidatedActivities = ref([])
const validatedActivity = ref([])
const allUnconfirmedActivities = ref([])
const beforeTodayCurrentPage = ref(1)
const hostCurrentPage = ref(1)
const limit = ref(5)

const options = reactive([
  { label: '即將參加、聚會紀錄', value: 'activitiesRecords' },
  { label: '主辦紀錄', value: 'hostExperience' },
  { label: '本人限定', value: 'owenerOnly', disabled: true },
  { label: '審核中', value: 'notYetComfirm' },
])

const fetchAllUserHostActivities = async () => {
  const result = await userGetActivityHostAPI(route.params.uid)
  hostList.value = result.filter((item) => item.status !== 'cancelled')
}

const fetchActivityRecordsData = async () => {
  try {
    const id = route.params.uid

    const result = await userGetActivityAPI(id)
    if (result && result.length > 0) {
      //已有參加資格的活動
      validatedActivity.value = result.filter(
        (item) => item.register_validated == 1 && item.activities.status !== 'cancelled',
      )
      // 審核中的活動
      allUnconfirmedActivities.value = result.filter(
        (item) =>
          item.status === 'registered' &&
          item.register_validated === 0 &&
          new Date(item.activities.event_time) > new Date(),
      )

      if (validatedActivity.value.length > 0) {
        allValidatedActivities.value = validatedActivity.value
          .filter((item) => !!item.activities)
          .map((item) => item.activities)
        afterToday.value = allValidatedActivities.value.filter(
          (item) => new Date(item.event_time) > new Date(),
        )
        beforeToday.value = allValidatedActivities.value.filter(
          (item) => new Date(item.event_time) < new Date(),
        )
      }
    } else {
      afterToday.value = []
      beforeToday.value = []
    }
  } catch (error) {
    handleError(message, undefined, error)
  } finally {
    loading.value = false
  }
}
const beforeTodayTotalPages = computed(() => Math.ceil(beforeToday.value.length / limit.value))
const beforeTodayPaginatedItems = computed(() => {
  if (!beforeToday.value) {
    return
  } else {
    const start = (beforeTodayCurrentPage.value - 1) * limit.value
    const end = start + limit.value
    return beforeToday.value.slice(start, end)
  }
})

const hostTotalPages = computed(() => Math.ceil(hostList.value.length / limit.value))
const hostPaginatedItems = computed(() => {
  if (!hostList.value) {
    return
  } else {
    const start = (hostCurrentPage.value - 1) * limit.value
    const end = start + limit.value
    return hostList.value.slice(start, end)
  }
})
const handleActivityClick = (activityId) => {
  router.push(`/activity/detail/${activityId}`)
}

watch(
  () => route.params.uid,
  () => {
    Promise.all([fetchActivityRecordsData(), fetchAllUserHostActivities()])
  },
)
onMounted(() => {
  Promise.all([fetchActivityRecordsData(), fetchAllUserHostActivities()])
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="text-xl flex items-center justify-end">
      <n-select
        v-model:value="selectedValue"
        :options="options"
        placeholder="選擇分類"
        style="width: 200px; margin-right: 16px"
      />
    </div>
    <div v-if="selectedValue == 'activitiesRecords'" class="bg-gray-50 px-5 py-5 rounded-md">
      <div class="content-center text-center text-xl font-bold border-b-2 pb-3">即將參加</div>
      <div v-if="afterToday.length > 0" class="pt-5 flex flex-col gap-5">
        <div
          v-for="future_activity in afterToday"
          :key="future_activity.id"
          @click="handleActivityClick(future_activity.id)"
          class="flex bg-white p-3 h-auto rounded-md cursor-pointer"
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
      <div v-else class="mt-5 text-center text-gray-600">用戶沒有即將參加的活動</div>
    </div>

    <div v-if="selectedValue == 'activitiesRecords'" class="bg-gray-50 px-5 py-5 rounded-md">
      <div class="content-center text-center text-xl font-bold border-b-2 pb-3">聚會紀錄</div>
      <div v-if="beforeToday.length > 0" class="pt-5 flex flex-col gap-5">
        <div
          v-for="pre_activity in beforeTodayPaginatedItems"
          :key="pre_activity.id"
          @click="handleActivityClick(pre_activity.id)"
          class="flex bg-white p-3 h-auto rounded-md cursor-pointer"
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
        <div class="flex justify-center">
          <n-pagination
            v-model:page="beforeTodayCurrentPage"
            :page-count="beforeTodayTotalPages"
            :page-size="itemsPerPage"
            @update:page-size="updateItemsPerPage"
          />
        </div>
      </div>
      <div v-else class="mt-5 text-center text-gray-600">用戶沒有過去的活動</div>
    </div>
    <div v-if="selectedValue == 'hostExperience'" class="bg-gray-50 px-5 py-5 rounded-md">
      <div class="content-center text-center text-xl font-bold border-b-2 pb-3">主辦紀錄</div>
      <div v-if="hostList" class="pt-5 flex flex-col gap-5">
        <div
          v-for="list in hostPaginatedItems"
          :key="list.id"
          @click="handleActivityClick(list.id)"
          class="flex bg-white p-3 h-auto rounded-md cursor-pointer"
        >
          <div class="w-full flex flex-col gap-1 md:justify-between">
            <div class="flex flex-col gap-1">
              <p class="text-xl font-bold tracking-wide">{{ list.name }}</p>
              <div class="text-lg tracking-wide">{{ list.location }}</div>
            </div>
            <div class="text-sm text-gray-400">{{ formatDate(list.event_time) }}</div>
          </div>
          <div
            class="hidden md:block w-1/3 aspect-square overflow-hidden rounded-md bg-gray-200 items-center justify-center"
          >
            <img :src="list.img_url" alt="past-party-photo" class="w-full h-full object-cover" />
          </div>
        </div>
        <div class="flex justify-center">
          <n-pagination
            v-model:page="hostCurrentPage"
            :page-count="hostTotalPages"
            :page-size="itemsPerPage"
            @update:page-size="updateItemsPerPage"
          />
        </div>
      </div>
      <div v-else class="mt-5 text-center text-gray-600">用戶還沒有主辦紀錄</div>
    </div>
    <div v-if="selectedValue == 'notYetComfirm'" class="bg-gray-50 px-5 py-5 rounded-md">
      <div class="content-center text-center text-xl font-bold border-b-2 pb-3">審核中的活動</div>
      <div v-if="userStore.user.uid == route.params.uid">
        <div v-if="allUnconfirmedActivities.lenth > 0" class="pt-5 flex flex-col gap-5">
          <div
            v-for="unconfirmedActivity in allUnconfirmedActivities"
            :key="unconfirmedActivity.activities.id"
            @click="handleActivityClick(unconfirmedActivity.activities.id)"
            class="flex bg-white p-3 h-auto rounded-md cursor-pointer"
          >
            <div class="w-full flex flex-col gap-1 md:justify-between">
              <div class="flex flex-col gap-1">
                <p class="text-xl font-bold tracking-wide">
                  {{ unconfirmedActivity.activities.name }}
                </p>
                <div class="text-lg tracking-wide">
                  {{ unconfirmedActivity.activities.location }}
                </div>
              </div>
              <div class="text-sm text-gray-400">
                {{ formatDate(unconfirmedActivity.activities.event_time) }}
              </div>
            </div>
            <div
              class="hidden md:block w-1/3 aspect-square overflow-hidden rounded-md bg-gray-200 items-center justify-center"
            >
              <img
                :src="unconfirmedActivity.activities.img_url"
                alt="past-party-photo"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <div v-else class="mt-5 text-center text-gray-600">您沒有審核中的活動</div>
      </div>
      <div v-else class="mt-5 text-center text-gray-600">私人頁面，已上鎖🔐</div>
    </div>
  </div>
</template>
