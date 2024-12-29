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
      handleError(message, undefined, error)
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
    fetchAllActivities,
    fetchActivitiesByCategory,
    searchActivities,
    triggerActivityAction,
  }
})
