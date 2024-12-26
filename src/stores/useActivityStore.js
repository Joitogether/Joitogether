import { defineStore } from 'pinia'
import { ref } from 'vue'
import { activityGetAllAPI, activityCategoryAPI, activitySearchAPI } from '@/apis/activityAPIs'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentCategory = ref('')
  const triggerAction = ref(null) // 用於觸發 ActivityComponent 的

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
    } catch (err) {
      error.value = err.message || '未知錯誤'
      console.error('Error in fetchAllActivities:', err)
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
    } catch (err) {
      error.value = err.message || '未知錯誤'
      console.error('Error', err)
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
        activities.value = [] // 確保活動清單為
      }
    } catch (err) {
      error.value = err.message || '未知錯誤'
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
