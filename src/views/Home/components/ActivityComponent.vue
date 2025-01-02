<script setup>
import ActivityCard from '@/views/components/ActivityCard.vue'
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { formatDate } from '@/utils/useDateTime'
import { useActivityStore } from '@/stores/useActivityStore'
import { useRoute } from 'vue-router'
import { NSelect } from 'naive-ui'

const activityStore = useActivityStore()
const { activities, loading, error, triggerAction, selectedRegions, regionOptions } =
  storeToRefs(activityStore)

const {
  fetchAllActivities,
  fetchActivitiesByCategory,
  searchActivities,
  triggerActivityAction,
  fetchActivitiesByRegion,
} = activityStore

const route = useRoute()

onMounted(() => {
  if (route.query.q) {
    return
  }
  fetchAllActivities()
})

// 計算今天日期的字串
const todayString = new Date().toISOString().split('T')[0]
const selectedStartDate = ref('')

const setStartDate = (date) => {
  selectedStartDate.value = date
}

// 篩選條件
const selectedCategory = ref('')

const categoryMap = {
  '': '',
  美食: 'food',
  購物: 'shopping',
  旅遊: 'travel',
  運動: 'sports',
  教育: 'education',
  其他: 'others',
}

const selectCategory = (category) => {
  selectedCategory.value = category
  const mappedCategory = categoryMap[category]

  if (mappedCategory === '') {
    fetchAllActivities()
  } else {
    fetchActivitiesByCategory(mappedCategory)
  }
}

const filteredActivities = computed(() =>
  activities.value
    .filter((activity) => {
      if (!selectedStartDate.value) return true
      const eventDate = new Date(activity.event_time)
      const filterDate = new Date(selectedStartDate.value)
      return eventDate >= filterDate
    })
    .map((activity) => {
      return {
        id: activity.id,
        name: activity.name,
        img_url: activity.img_url || '/src/assets/UserUpdata1.jpg',
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
  () => route.query.q,
  (keyword) => {
    if (keyword) {
      searchActivities(keyword)
    } else {
      fetchAllActivities()
    }
  },
  { immediate: true },
)

// 監聽 triggerAction，執行相應邏輯
watch(
  () => triggerAction.value,
  (category) => {
    if (category) {
      selectCategory(category)
      scrollToActivityBlock()
      triggerActivityAction(null)
    }
  },
)

watch(
  selectedRegions,
  (regions) => {
    console.log('選中的地區：', regions) // 調試用
    if (regions.length > 0) {
      fetchActivitiesByRegion(regions)
    } else {
      fetchAllActivities()
    }
  },
  { immediate: true },
)

const horizontal = ref(false)
const isMobile = ref(false)

const updateScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  updateScreenSize()
  window.addEventListener('resize', updateScreenSize)
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
</script>

<template>
  <main id="activity-section" class="mx-auto py-5">
    <div class="text-center text-[28px] text-gray-800 font-bold min-w-[120px] lg:text-[34px]">
      啾團活動
    </div>
    <div class="flex justify-center mt-3 w-full">
      <div class="flex flex-wrap gap-2 justify-start w-4/5 md:justify-center md:w-3/4 lg:w-4/5">
        <div
          v-for="category in ['', '美食', '購物', '旅遊', '運動', '教育', '其他']"
          :key="category"
        >
          <!-- 預設顯示全部 -->
          <div class="text-sm text-center bg-green-600 text-white rounded-full hover:bg-green-700">
            <button
              class="mx-5 my-2 lg:mx-8"
              @click="selectCategory(category)"
              :class="{ 'rounded-md': selectedCategory === category }"
            >
              {{ category || '全部' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 篩選器 -->
    <div
      class="mt-5 flex justify-between w-4/5 mx-auto md:w-3/4 lg:justify-center lg:gap-5 lg:w-4/5"
    >
      <n-select
        v-model:value="selectedRegions"
        :options="regionOptions"
        clearable
        placeholder="選擇地區"
        style="width: 150px"
      />
      <input
        type="date"
        class="text-sm p-1 lg:bg-gray-100"
        :min="todayString"
        @change="setStartDate($event.target.value)"
      />
    </div>

    <!-- 卡片區域 -->
    <div class="mt-5 mb-7 w-4/5 mx-auto md:w-3/4 lg:w-4/5">
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
            class="border-b-2 pb-3 overflow-hidden md:border-none md:bg-gray-100 md:mb-3 md:rounded-md md:px-5 md:hover:bg-gray-200 lg:mb-0"
          ></ActivityCard>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
