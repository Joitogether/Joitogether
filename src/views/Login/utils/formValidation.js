// 表單驗證邏輯

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
    errors.push('請輸入姓名')
  }

  if (!formValue.user.username) {
    errors.push('請輸入使用者名稱')
  }

  if (!validateEmail(formValue.email)) {
    errors.push('請輸入有效的電子郵件地址')
  }

  if (!validatePhoneNumber(formValue.phone)) {
    errors.push('請輸入有效的電話號碼')
  }

  if (!validatePassword(password)) {
    errors.push('密碼必須至少包含6個字符，並包含字母與數字')
  }

  return errors
}
