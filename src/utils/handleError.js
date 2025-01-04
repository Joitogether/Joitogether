export const handleError = (
  message,
  customizeMessage = '❌ 發生了一些小問題，請稍後再試試 🙏',
  errorContext = null,
) => {
  let errorMessage

  // 特殊處理權限錯誤
  if (errorContext?.status === 403) {
    errorMessage = '🚫 抱歉，您似乎沒有訪問這個資源的權限。請確認您的帳戶狀態或重新登入。 🔒'
  } else {
    errorMessage =
      typeof customizeMessage === 'string'
        ? customizeMessage
        : '❌ 發生了一些小問題，請稍後再試試 🙏'
  }

  message.error(`🚨 錯誤：${errorMessage}`)

  if (errorContext) {
    console.error('Error context:', errorContext)
  }
}
