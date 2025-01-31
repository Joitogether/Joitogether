import { defineStore } from 'pinia'
import { ref } from 'vue'
import { handleError } from '@/utils/handleError.js'
import { useMessage } from 'naive-ui'
import { activityGetAllAndSearchAPI } from '@/apis/activityAPIs'

const message = useMessage()

export const useActivityStore = defineStore('activity', () => {
  const activities = ref([])
  const loading = ref(false)
  const error = ref(null)
  const totalActivities = ref(0)
  const selectedStartDate = ref('')
  const searchKeyword = ref('')

  const filters = ref({
    page: 1,
    pageSize: 12,
    keyword: '',
    category: '',
    region: '',
  })

  const pageSelect = ref(1)

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

  const fetchAllActivities = async (params = {}) => {
    filters.value = { ...filters.value, ...params }

    loading.value = true
    error.value = null
    activities.value = []
    try {
      const response = await activityGetAllAndSearchAPI(filters.value)
      if (!response || response.data.length === 0) {
        activities.value = {}
        totalActivities.value = 0
        handleError(message, '目前無相關活動資料', { error: '無活動資料' })
      } else {
        activities.value = response.data.activities
        totalActivities.value = response.data.total || 0
      }
    } catch (error) {
      handleError(message, undefined, error)
    } finally {
      loading.value = false
    }
  }

  const triggerActivityAction = (category) => {
    triggerAction.value = category
    filters.value = {
      ...filters.value,
      category,
      page: 1,
    }
    activities.value = []
    fetchAllActivities()
  }

  const clearFilters = () => {
    filters.value = {
      page: 1,
      pageSize: 12,
      keyword: '',
      category: '',
      region: '',
    }
    selectedStartDate.value = ''
    selectedRegions.value = ''
    triggerAction.value = null
    activities.value = []
    totalActivities.value = 0
    pageSelect.value = 1
    searchKeyword.value = ''
  }

  return {
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
    searchKeyword,
    fetchAllActivities,
    triggerActivityAction,
    clearFilters,
  }
})
