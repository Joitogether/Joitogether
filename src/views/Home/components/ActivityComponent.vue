<script setup>
import ActivityCard from '@/views/components/ActivityCard.vue'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
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
  pageSelect,
  totalActivities,
  selectedStartDate,
} = storeToRefs(activityStore)

const { fetchAllActivities, triggerActivityAction, clearFilters } = activityStore

const filterByRegion = (region) => {
  filters.value.region = region
  filters.value.page = 1
  fetchAllActivities()
  router.push({ path: 'home', query: { ...filters.value } })
}

const handlePageChange = (page) => {
  filters.value.page = page
  pageSelect.value = page
  router.push({ path: '/home', query: { ...filters.value } })

  fetchAllActivities(filters.value)
}

// 計算今天日期的字串
const todayString = new Date().toISOString().split('T')[0]

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
        img_url:
          activity.img_url ||
          'https://firebasestorage.googleapis.com/v0/b/login-demo1-9d3cb.firebasestorage.app/o/activities%2F1736165191190_default%20eventpicture.jpg?alt=media&token=21212afe-db96-49ee-873d-a3b604ac5c0a',
        location: activity.location || '未知地點',
        dateTime: formatDate(activity.event_time),
        participants: activity.max_participants,
        host: activity.users?.display_name || '未知用戶',
        userImg: activity.users.photo_url,
      }
    })
    .sort((a, b) => a.event_time - b.event_time),
)

watch(
  () => route.query,
  (newQuery) => {
    if (Object.keys(newQuery).length > 0) {
      fetchAllActivities(newQuery)
    }
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

const pages = computed(() => {
  return (totalActivities.value || 12) / 12
})

const horizontal = ref(false)
const isMobile = ref(false)

const updateScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  updateScreenSize()
  window.addEventListener('resize', updateScreenSize)

  clearFilters()
  fetchAllActivities()
  router.push({ path: 'home' })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
})

watch(isMobile, (newVal) => {
  if (newVal) {
    horizontal.value = true
  } else {
    horizontal.value = false
  }
})

// 滾動到活動區塊
const scrollToActivityBlock = () => {
  const activitySection = document.getElementById('activity-section')
  if (activitySection) {
    activitySection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
const handleClearFilters = () => {
  clearFilters()
  fetchAllActivities() // 清除後重新加載活動列表
  router.push({ path: 'home', query: { ...filters.value } })
}
</script>

<template>
  <main id="activity-section" class="mx-auto py-5">
    <div class="text-center text-[28px] text-gray-800 font-bold min-w-[120px] lg:text-[34px]">
      揪團活動
    </div>
    <div class="flex justify-center mt-3 w-full">
      <div class="flex flex-wrap gap-4 justify-start w-4/5 md:justify-center md:w-3/4 lg:w-4/5">
        <div
          v-for="category in ['', '美食', '購物', '旅遊', '運動', '教育', '其他']"
          :key="category"
          class="cursor-pointer hover:scale-110 transition-all duration-300 hover:font-bold"
        >
          <!-- 預設顯示全部 -->
          <div class="text-sm text-center bg-green-600 text-white rounded-full hover:bg-green-500">
            <button
              class="p-1 px-7 py-2 h-10 w-full md:px-7 md:py-2 md:w-auto text-center"
              @click="triggerCategory(category)"
              :class="{ 'bg-green-700 rounded-full': isSelected(category) }"
            >
              {{ category || '全部' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 篩選器 -->

    <!-- 卡片區域 -->
    <div class="mt-5 mb-7 w-4/5 mx-auto md:w-3/4 lg:w-4/5">
      <div
        class="my-5 flex flex-col md:flex-row md:items-center md:justify-between w-full lg:justify-center lg:gap-5"
      >
        <div class="flex gap-3">
          <div class="text-xl flex items-center">
            <n-select
              v-model:value="selectedRegions"
              :options="regionOptions"
              clearable
              placeholder="選擇地區"
              style="width: 150px"
              @update:value="filterByRegion"
              @clear="handleClearFilters"
            />
          </div>
          <div class="text-xl flex items-center">
            <span class="p-1">
              <input
                class="cursor-pointer bg-white border border-gray-200 text-sm p-[5px] text-gray-400 rounded-sm hover:border-green-600"
                type="date"
                :min="todayString"
                style="outline: none"
                @change="setStartDate($event.target.value)"
                placeholder="活動日期"
                v-model="selectedStartDate"
              />
            </span>
          </div>
        </div>
        <div>
          <n-button @click="handleClearFilters">清除篩選</n-button>
        </div>
      </div>
      <div v-if="loading" class="text-center my-5">加載中...</div>
      <div v-else-if="error" class="text-center my-5 text-red-500">{{ error }}</div>
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
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
            :horizontal="horizontal"
            class="border-b-2 pb-3 overflow-hidden md:border-none md:bg-gray-100 md:mb-3 md:rounded-md md:px-5 md:hover:bg-gray-200 md:shadow-md lg:mb-0 hover:scale-[1.05] transition-all duration-300"
          ></ActivityCard>
        </div>
        <div class="pagination-container mt-5 flex justify-center">
          <n-pagination
            v-model:page="pageSelect"
            :page-size="filters.pageSize"
            :page-count="Math.max(1, Math.ceil(pages))"
            @update:page="handlePageChange"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
