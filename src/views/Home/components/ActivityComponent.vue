<script setup>
import ActivityCard from '@/views/components/ActivityCard.vue'
import { ref, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { formatDate } from '@/utils/useDateTime'
import { useActivityStore } from '@/stores/useActivityStore'
import { useRoute, useRouter } from 'vue-router'
import { NSelect } from 'naive-ui'

const route = useRoute()
const router = useRouter()

const activityStore = useActivityStore()
const {
  activities,
  loading,
  error,
  triggerAction,
  selectedRegions,
  regionOptions,
  filters,
  totalActivities,
} = storeToRefs(activityStore)

const { fetchAllActivities, triggerActivityAction } = activityStore

const filterByRegion = (region) => {
  filters.value.region = region
  filters.value.page = 1
  fetchAllActivities()
  router.push({ path: 'home', query: { ...filters.value } })
}

const handlePageChange = (page) => {
  filters.value.page = page

  router.push({ path: '/home', query: { ...filters.value } })

  fetchAllActivities(filters.value)
}

onMounted(() => {
  if (!filters.value.pageSize) {
    filters.value.pageSize = 12
  }
  if (!filters.value.page) {
    filters.value.page = 1
  }
  fetchAllActivities(route.query)
})

// 計算今天日期的字串
const todayString = new Date().toISOString().split('T')[0]
const selectedStartDate = ref('')

const setStartDate = (date) => {
  selectedStartDate.value = date
  filters.value.page = 1 // 切換分類時回到第1頁
}

const categoryMap = {
  '': '',
  美食: 'food',
  購物: 'shopping',
  旅遊: 'travel',
  運動: 'sports',
  教育: 'education',
  其他: 'others',
}

const triggerCategory = (category) => {
  const mappedCategory = categoryMap[category] || ''
  filters.value.category = mappedCategory
  filters.value.page = 1 // 切換分類時回到第1頁
  triggerActivityAction(mappedCategory)
}

const isSelected = (category) => {
  const mappedCategory = categoryMap[category] || ''
  return triggerAction.value === mappedCategory
}

const filteredActivities = computed(() =>
  activities.value
    .filter((activity) => {
      const eventDate = new Date(activity.event_time)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (eventDate < today) return false

      if (selectedStartDate.value) {
        const filterDate = new Date(selectedStartDate.value)
        return eventDate >= filterDate
      }
      return true
    })
    .map((activity) => {
      return {
        id: activity.id,
        name: activity.name,
        img_url: activity.img_url || './src/assets/UserUpdata1.jpg',
        location: activity.location || '未知地點',
        dateTime: formatDate(activity.event_time),
        participants: activity.max_participants,
        host: activity.users?.display_name || '未知用戶',
        userImg: activity.users.photo_url,
      }
    })
    .sort((a, b) => new Date(b.id) - new Date(a.id)),
)

watch(
  () => route.query,
  (newQuery) => {
    fetchAllActivities(newQuery)
  },
  { immediate: true },
)

// 監聽 triggerAction，執行相應邏輯
watch(
  () => triggerAction.value,
  (category) => {
    if (category) {
      scrollToActivityBlock()
      triggerActivityAction(category)
      router.push({ path: 'home', query: { ...filters.value } })
    }
  },
)

// 滾動到活動區塊
const scrollToActivityBlock = () => {
  const activitySection = document.getElementById('activity-section')
  if (activitySection) {
    activitySection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <main id="activity-section" class="block max-w-7xl m-auto">
    <div class="text-3xl pt-40 font-bold leading-10">啾團活動</div>
    <div class="inline-flex w-full pb-7 pt-7">
      <div class="flex flex-wrap gap-3 justify-start">
        <div
          v-for="category in ['', '美食', '購物', '旅遊', '運動', '教育', '其他']"
          :key="category"
          class="mr-7 py-3 pl-3 text-sm"
        >
          <!-- 預設顯示全部 -->
          <div class="mr-7 py-3 pl-3 text-sm">
            <button
              class="p-1 md:p-2 w-full md:w-auto text-center"
              @click="triggerCategory(category)"
              :class="{ 'bg-gray-300 rounded-md': isSelected(category) }"
            >
              {{ category || '全部' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <!-- 篩選器 -->
    <div class="mt-7 flex justify-between items-center">
      <div class="text-xl flex items-center">
        <n-select
          v-model:value="selectedRegions"
          :options="regionOptions"
          clearable
          placeholder="選擇地區"
          style="width: 200px; margin-right: 16px"
          @update:value="filterByRegion"
        />
      </div>
      <div class="text-xl flex items-center">
        <span class="ml-1">
          <input type="date" :min="todayString" @change="setStartDate($event.target.value)"
        /></span>
      </div>
    </div>

    <!-- 卡片區域 -->
    <div class="mt-7 mb-7">
      <div v-if="loading" class="text-center my-5">加載中...</div>
      <div v-else-if="error" class="text-center my-5 text-red-500">{{ error }}</div>
      <div v-else>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <ActivityCard
            v-for="activity in filteredActivities"
            :key="activity.id"
            :title="activity.name"
            :actImgUrl="activity.img_url"
            :location="activity.location"
            :date-time="activity.dateTime"
            :participants="activity.participants"
            :host="activity.host"
            :hostImgUrl="activity.userImg"
            :id="activity.id"
          ></ActivityCard>
        </div>
        <div class="pagination-container mt-5 flex justify-center">
          <n-pagination
            v-model:page="filters.page"
            :page-size="filters.pageSize"
            :page-count="Math.max(1, Math.ceil(filters.pageSize))"
            @update:page="handlePageChange"
          />
        </div>
        <div>Total Activities: {{ totalActivities }}</div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
