export const handleError = (
  message,
  customizeMessage = '❌ 發生了一些小問題，請稍後再試試 🙏',
  errorContext = null,
) => {
  const errorMessage =
    typeof customizeMessage === 'string' ? customizeMessage : '❌ 發生了一些小問題，請稍後再試試 🙏'
  message.error(`🚨 錯誤：${errorMessage}`)
  if (errorContext) {
    console.error('Error context:', errorContext)
  }
}
