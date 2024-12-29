// import { useMessage } from 'naive-ui'

// const message = useMessage()
// // 統一錯誤處理
// export const handleError = (customizeMessage) => {
//   const errorMessage = customizeMessage || '❌ 發生了一些小問題，請稍後再試試 🙏'
//   message.error(`🚨 錯誤：${errorMessage}`)
// }

export const handleError = (
  message,
  customizeMessage = '❌ 發生了一些小問題，請稍後再試試 🙏',
  errorContext = null,
) => {
  const errorMessage =
    typeof customizeMessage === 'string' ? customizeMessage : '❌ 發生了一些小問題，請稍後再試試 🙏'

  // 顯示錯誤提示
  message.error(`🚨 錯誤：${errorMessage}`)

  // 日誌輸出以便調試
  if (errorContext) {
    console.error('Error context:', errorContext)
  }
}
