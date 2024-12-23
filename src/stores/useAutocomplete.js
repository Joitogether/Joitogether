import { ref } from 'vue'
import debounce from 'lodash/debounce'
import { useMessage } from 'naive-ui'
import { activityAutocompleteAPI } from '@/apis/activityAPIs'

export function useAutocomplete() {
  const searchQuery = ref('')
  const suggestions = ref([])
  const isLoading = ref(false)
  const isLoadOK = ref(false)
  const message = useMessage()

  const onInputChange = debounce(async () => {
    if (!searchQuery.value) {
      suggestions.value = []
      isLoading.value = false
      return
    }

    isLoading.value = true
    try {
      const response = await activityAutocompleteAPI(searchQuery.value)
      suggestions.value = response.data.predictions || []
      isLoadOK.value = true
    } catch (error) {
      console.error('Autocomplete 錯誤:', error)
      message.warning('未搜尋到地址，請重新輸入')
      isLoadOK.value = false
    } finally {
      isLoading.value = false
    }
  }, 500)

  const triggerInputChange = () => {
    isLoadOK.value = false
    onInputChange()
  }

  return {
    searchQuery,
    suggestions,
    onInputChange,
    triggerInputChange,
    isLoading,
    isLoadOK,
  }
}
