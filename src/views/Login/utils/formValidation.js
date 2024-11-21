// 表單驗證邏輯

// email驗證
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const validateEmail = (email) => {
  return emailRegex.test(email)
}
// 密碼驗證 -> 至少六位且包含字母和數字各一
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
export const validatePassword = (password) => {
  return passwordRegex.test(password)
}
// 全表單驗證
export const validateFormFields = (formValue, password) => {
  const errors = []

  if (!validateEmail(formValue.email)) {
    errors.push('請輸入有效的電子郵件地址')
  }

  if (!validatePassword(password)) {
    errors.push('密碼必須至少包含6個字符，並包含字母與數字')
  }

  if (!formValue.user.username) {
    errors.push('請輸入使用者名稱')
  }

  if (!formValue.user.fullname) {
    errors.push('請輸入姓名')
  }

  if (!formValue.phone) {
    errors.push('請輸入電話號碼')
  }

  return errors
}
