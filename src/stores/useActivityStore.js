import { defineStore } from 'pinia'
import { ref } from 'vue'
import { activityGetAllAPI, activityCategoryAPI, activitySearchAPI } from '@/apis/activityAPIs'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentCategory = ref('')
  const triggerAction = ref(null) // 用於觸發 ActivityComponent 的
  const selectedRegions = ref('')
  const regionOptions = ref([
    { label: '請選擇地區', value: '' },
    { label: '台北', value: '台北' },
    { label: '新北', value: '新北' },
    { label: '基隆', value: '基隆' },
    { label: '桃園', value: '桃園' },
    { label: '宜蘭', value: '宜蘭' },
    { label: '臺中', value: '臺中' },
    { label: '苗栗', value: '苗栗' },
    { label: '彰化', value: '彰化' },
    { label: '南投', value: '南投' },
    { label: '雲林', value: '雲林' },
    { label: '高雄', value: '高雄' },
    { label: '臺南', value: '臺南' },
    { label: '嘉義', value: '嘉義' },
    { label: '屏東', value: '屏東' },
    { label: '澎湖', value: '澎湖' },
    { label: '花蓮', value: '花蓮' },
    { label: '臺東', value: '臺東' },
  ])

  const fetchAllActivities = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await activityGetAllAPI()
      if (response.status === 200) {
        activities.value = response.data //
      } else {
        throw new Error(response.message || '獲取活動失敗')
      }
    } catch {
      error.value = '未搜尋到活動喔'
    } finally {
      loading.value = false
    }
  }

  const fetchActivitiesByCategory = async (category) => {
    loading.value = true
    error.value = null
    try {
      const data = {
        page: 1,
        pageSize: 12,
        category: category,
      }
      const response = await activityCategoryAPI('category', data)
      if (response && response.status === 200) {
        activities.value = response.data
      } else {
        throw new Error(response.message || '分類活動獲取失敗')
      }
    } catch {
      error.value = '未搜尋到活動喔'
    } finally {
      loading.value = false
    }
  }

  const fetchActivitiesByRegion = async (regions) => {
    loading.value = true
    error.value = null
    try {
      const data = {
        page: 1,
        pageSize: 12,
        category: regions,
      }
      const response = await activityCategoryAPI('region', data)
      if (response && response.status === 200) {
        activities.value = response.data
      } else {
        throw new Error(response.message || '分類活動獲取失敗')
      }
    } catch {
      error.value = '未搜尋到活動喔'
    } finally {
      loading.value = false
    }
  }

  // 根據搜尋詞獲取活動
  const searchActivities = async (keyword) => {
    loading.value = true
    error.value = null
    try {
      const response = await activitySearchAPI(keyword)
      if (response) {
        activities.value = response
      } else {
        error.value = '尚無搜尋結果，請嘗試其他搜索'
        activities.value = [] // 確保活動清單為空
      }
    } catch {
      error.value = '未搜尋到活動喔'
    } finally {
      loading.value = false
    }
  }

  const triggerActivityAction = (category) => {
    triggerAction.value = category
  }
  return {
    activities,
    loading,
    error,
    triggerAction,
    currentCategory,
    selectedRegions,
    regionOptions,
    fetchAllActivities,
    fetchActivitiesByCategory,
    searchActivities,
    triggerActivityAction,
    fetchActivitiesByRegion,
  }
})
