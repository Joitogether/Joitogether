<script setup>
import ActivityCard from '@/views/components/ActivityCard.vue'
import { ref, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { formatDate } from '@/utils/useDateTime'
import { useActivityStore } from '@/stores/useActivityStore'
import { useRoute } from 'vue-router'

const activityStore = useActivityStore()
const { activities, loading, error, triggerAction } = storeToRefs(activityStore)
const { fetchAllActivities, fetchActivitiesByCategory, searchActivities, triggerActivityAction } =
  activityStore

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
  '': '', // 全部
  美食: 'food',
  購物: 'shopping',
  旅遊: 'travel',
  運動: 'sports',
  教育: 'education',
  其他: 'others',
}

const selectCategory = (category) => {
  console.log(category)
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
      if (!selectedStartDate.value) return true // 如果未選擇日期，顯示所有活動
      const eventDate = new Date(activity.event_time)
      const filterDate = new Date(selectedStartDate.value)
      return eventDate >= filterDate // 篩選日期大於或等於選擇的日期
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
      triggerActivityAction(null) // 重置動作避免重複觸發
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
              @click="selectCategory(category)"
              :class="{ 'bg-gray-300 rounded-md': selectedCategory === category }"
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
        <span class="ml-1"></span>
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
      </div>
    </div>
  </main>
</template>

<style scoped></style>
