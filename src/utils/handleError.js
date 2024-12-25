import { useMessage } from 'naive-ui'

const message = useMessage()
// 統一錯誤處理
export const handleError = (customizeMessage) => {
  const errorMessage = customizeMessage || '❌ 發生了一些小問題，請稍後再試試 🙏'
  message.error(`🚨 錯誤：${errorMessage}`)
}
