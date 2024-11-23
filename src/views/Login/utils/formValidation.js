// 表單驗證邏輯

// 註冊表單驗證
// email格式限制
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const validateEmail = (email) => {
  return emailRegex.test(email)
}
// 密碼格式限制 -> 至少六位且包含字母和數字各一
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
export const validatePassword = (password) => {
  return passwordRegex.test(password)
}
// 電話格式限制 -> 09 + 8位數字
export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^09\d{8}$/
  return phoneRegex.test(phone)
}

// 全表單驗證
export const validateFormFields = (formValue, password) => {
  const errors = []

  if (!formValue.user.fullname) {
    errors.push('👤 請輸入姓名！名字是很重要的呢～ 📝')
  }

  if (!formValue.user.username) {
    errors.push('🏷️ 請輸入使用者名稱～這可是你的專屬代號呢！✨')
  }

  if (!validateEmail(formValue.email)) {
    errors.push('📧 信箱格式不對哦～請再確認一下！🔍')
  }

  if (!validatePhoneNumber(formValue.phone)) {
    errors.push('📱 電話號碼格式好像怪怪的～再檢查一下吧！💡')
  }

  if (!validatePassword(password)) {
    errors.push('🔑 密碼太簡單了啦！至少6字符，還要有數字和字母喔～ 💪')
  }

  return errors
}
