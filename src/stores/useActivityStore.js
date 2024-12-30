import { defineStore } from 'pinia'
import { ref } from 'vue'
import { handleError } from '@/utils/handleError.js'
import { useMessage } from 'naive-ui'
import { activityGetAllAPI, activityCategoryAPI, activitySearchAPI } from '@/apis/activityAPIs'

const message = useMessage()

export const useActivityStore = defineStore('activity', () => {
  const activities = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentCategory = ref('')
  const triggerAction = ref(null)
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
    activities.value = []
    try {
      const response = await activityGetAllAPI()
      if (!response || response.length === 0) {
        activities.value = []
        handleError(message, '目前無相關活動資料', error)
      }
      activities.value = response.data
    } catch {
      handleError(message, undefined, error)
    } finally {
      loading.value = false
    }
  }

  const fetchActivitiesByCategory = async (category) => {
    loading.value = true
    try {
      const data = {
        page: 1,
        pageSize: 12,
        category: category,
      }
      const response = await activityCategoryAPI('category', data)

      if (!response || response.length === 0) {
        activities.value = []
        return
      }

      activities.value = response.data
    } catch (error) {
      handleError(message, '未搜尋到活動喔', error)
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

      if (!response || response.length === 0) {
        activities.value = []
        message.error('尚未有相關活動資料')
        return
      }

      activities.value = response.data
    } catch (error) {
      handleError(message, '未搜尋到活動喔', error)
    } finally {
      loading.value = false
    }
  }

  // 根據搜尋詞獲取活動
  const searchActivities = async (keyword) => {
    loading.value = true
    try {
      const response = await activitySearchAPI(keyword)
      if (response) {
        activities.value = response
      } else {
        message.error('尚無搜尋結果，請嘗試其他搜索')
        activities.value = []
      }
    } catch (error) {
      handleError(message, undefined, error)
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
