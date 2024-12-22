import { ref, nextTick } from 'vue';

export function usePreviewMode(previewMap) {
  const isPreviewMode = ref(false);

  const enterPreviewMode = (searchQuery) => {
    if (!searchQuery) {
      return;
    }
    isPreviewMode.value = true; // 設置預覽模式為開啟
    previewMap(searchQuery); // 傳遞 searchQuery 給 previewMap
  };

  const exitPreviewMode = () => {
    nextTick(() => {
      isPreviewMode.value = false;
    });
  };

  return { isPreviewMode, enterPreviewMode, exitPreviewMode };
}
