import { ref, nextTick } from 'vue'

export function usePreviewMode(previewMap) {
  const isPreviewMode = ref(false)

  const enterPreviewMode = (searchQuery) => {
    if (!searchQuery) {
      return
    }
    isPreviewMode.value = true
    previewMap(searchQuery)
  }

  const exitPreviewMode = () => {
    nextTick(() => {
      isPreviewMode.value = false
    })
  }

  return { isPreviewMode, enterPreviewMode, exitPreviewMode }
}
