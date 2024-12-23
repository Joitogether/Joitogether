<script setup>
import ActivityCard from '@/views/components/ActivityCard.vue'
import { activityGetAllAPI, activityGetUsersAPI, activitySearchAPI } from '@/apis/activityApi.js'
import { ref, onMounted, computed, onUnmounted, nextTick, watch } from 'vue'
import { formatToISOWithTimezone } from '@/stores/useDateTime'
import { useRoute } from 'vue-router'
import { formatDate } from '@/stores/useDateTime'



const allActivities = ref([]) // 存放所有活動資料（未篩選）
const userMap = ref({})
const route = useRoute()
// 計算今天日期的字串
const today = new Date()
const yyyy = today.getFullYear()
const mm = String(today.getMonth() + 1).padStart(2, '0')
const dd = String(today.getDate()).padStart(2, '0')
const todayString = `${yyyy}-${mm}-${dd}`

// 篩選條件
const selectedCategory = ref('') // 預設顯示全部
const selectedStartDate = ref('') // 使用者選擇的開始篩選日期

// 定義篩選函式
const selectCategory = (category) => {
  selectedCategory.value = category
}

const setStartDate = (dateStr) => {
  selectedStartDate.value = dateStr
}

// 使用 computed 來動態取得符合條件的 items
const filteredItems = computed(() => {
  const today = new Date()
  const startFilterDate = selectedStartDate.value ? new Date(selectedStartDate.value) : today

  return allActivities.value
    .filter((activity) => {
      const eventDate = new Date(activity.event_time)
      if (eventDate < today) return false
      if (eventDate < startFilterDate) return false
      if (selectedCategory.value && activity.category !== selectedCategory.value) return false
      return true
    })
    .sort((a, b) => new Date(a.event_time) - new Date(b.event_time))
    .map((activity) => ({
      id: activity.id,
      name: activity.name,
      img_url: activity.img_url || '/src/assets/UserUpdata1.jpg',
      location: activity.location || '未知地點',
      dateTime: formatDate(activity.event_time),
      user: userMap.value[activity.host_id] || '未知用戶',
      participants: activity.max_participants || 0,
    }))
})

const currentPage = ref(1) // 當前頁碼
const isLoading = ref(false) // 正在加載中
const hasMore = ref(true) // 是否還有更多資料
const observer = ref(null) // IntersectionObserver 實例

const fetchActivitiesAndUsers = async () => {
  if (isLoading.value || !hasMore.value) return

  isLoading.value = true
  try {
    const [activities, users] = await Promise.all([
      activityGetAllAPI({ page: currentPage.value, limit: 10 }), // 分頁參數
      activityGetUsersAPI(),
    ])

    // 處理使用者資料
    if (users.status === 200 && Array.isArray(users.data)) {
      userMap.value = Object.fromEntries(users.data.map((user) => [user.uid, user.display_name]))
    }

    // 處理活動資料
    if (activities.status === 200 && Array.isArray(activities.data)) {
      activities.data.forEach((activity) => {
        const exists = allActivities.value.some((item) => item.id === activity.id)
        if (!exists) {
          allActivities.value.push(activity)
        }
      })

      if (activities.data.length < 10) hasMore.value = false // 最後一頁
      currentPage.value++ // 下一頁
    } else {
      hasMore.value = false
    }
  } catch (err) {
    console.error('取得活動資料失敗:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (route.query.q) {
    return
  }
  await fetchActivitiesAndUsers()

  nextTick(() => {
    const loadMoreTrigger = document.querySelector('#load-more')
    if (loadMoreTrigger) {
      observer.value = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading.value && hasMore.value) {
          setTimeout(() => {
            fetchActivitiesAndUsers()
          }, 300) // 加入 300ms 延遲，避免過於頻繁觸發
        }
      })
      observer.value.observe(loadMoreTrigger)
    }
  })
})

onUnmounted(() => {
  if (observer.value) observer.value.disconnect()
})

watch(
  () => route.query.q,
  async (keyword) => {
    isLoading.value = true
    const acitvities = await activitySearchAPI(keyword)
    allActivities.value = acitvities
    isLoading.value = false
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <main class="block max-w-7xl m-auto">
    <div class="text-3xl pt-40 font-bold leading-10">啾團活動</div>
    <div class="inline-flex w-full pb-7 pt-7">
      <div class="flex flex-wrap gap-3 justify-start">
        <!-- 預設顯示全部 -->
        <div class="mr-7 py-3 pl-3 text-sm">
          <button
            class="p-1 md:p-2 w-full md:w-auto text-center"
            @click="selectCategory('')"
            :class="{ 'bg-gray-300 rounded-md': selectedCategory === '' }"
          >
            全部
          </button>
        </div>
        <div class="mr-7 py-3 pl-3 text-sm">
          <button
            class="p-1 md:p-2 w-full md:w-auto text-center"
            @click="selectCategory('food')"
            :class="{ 'bg-gray-300 rounded-md': selectedCategory === 'food' }"
          >
            美食
          </button>
        </div>
        <div class="mr-7 py-3 pl-3 text-sm">
          <button
            class="p-1 md:p-2 w-full md:w-auto text-center"
            @click="selectCategory('shopping')"
            :class="{ 'bg-gray-300 rounded-md': selectedCategory === 'shopping' }"
          >
            購物
          </button>
        </div>
        <div class="mr-7 py-3 pl-3 text-sm">
          <button
            class="p-1 md:p-2 w-full md:w-auto text-center"
            @click="selectCategory('travel')"
            :class="{ 'bg-gray-300 rounded-md': selectedCategory === 'travel' }"
          >
            旅遊
          </button>
        </div>
        <div class="mr-7 py-3 pl-3 text-sm">
          <button
            class="p-1 md:p-2 w-full md:w-auto text-center"
            @click="selectCategory('sports')"
            :class="{ 'bg-gray-300 rounded-md': selectedCategory === 'sports' }"
          >
            運動
          </button>
        </div>
        <div class="mr-7 py-3 pl-3 text-sm">
          <button
            class="p-1 md:p-2 w-full md:w-auto text-center"
            @click="selectCategory('education')"
            :class="{ 'bg-gray-300 rounded-md': selectedCategory === 'education' }"
          >
            教育
          </button>
        </div>
        <div class="mr-7 py-3 pl-3 text-sm">
          <button
            class="p-1 md:p-2 w-full md:w-auto text-center"
            @click="selectCategory('others')"
            :class="{ 'bg-gray-300 rounded-md': selectedCategory === 'others' }"
          >
            其他
          </button>
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
        篩選日期
        <span class="ml-1">
          <input type="date" :min="todayString" @change="setStartDate($event.target.value)"
        /></span>
      </div>
    </div>

    <!-- 卡片區域 -->
    <div class="mt-7 mb-7">
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <ActivityCard
          v-for="item in filteredItems"
          :key="item.id"
          :title="item.name"
          :actImgUrl="item.img_url"
          :location="item.location"
          :date-time="item.dateTime"
          :participants="item.participants"
          :host="item.user"
          :id="item.id"
        ></ActivityCard>
      </div>
      <div v-if="allActivities.length === 0" class="text-center text-xl">查無活動</div>
      <div v-if="isLoading" class="text-center my-5">加載中...</div>
      <div id="load-more" style="height: 20px"></div>
      <!-- 底部觸發點 -->
      <div v-if="!hasMore" class="text-center my-5 text-gray-500"></div>
    </div>
  </main>
</template>

<style scoped></style>
