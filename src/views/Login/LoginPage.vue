<template>
  <div class="login-wrapper">
    <div class="block shadow-md">
      <div class="event-image bg-green-100"></div>
      <div></div>
      <div v-if="isLogin" class="login-box">
        <h2 class="font-black text-6xl" style="color: #18a058">登入</h2>

        <n-form ref="loginFormRef" :label-width="80" :model="loginForm" :rules="loginRules">
          <n-form-item path="email">
            <n-input v-model:value="loginForm.email" placeholder="輸入信箱" />
          </n-form-item>
          <n-form-item path="password" style="--n-label-height: 15px">
            <n-input type="password" v-model:value="loginForm.password" placeholder="輸入密碼" />
          </n-form-item>
        </n-form>
        <div class="flex justify-between items-center mt-3">
          <n-checkbox size="large" label="記住我" />
          <n-button text style="--n-font-size: 15px"> 忘記密碼 </n-button>
        </div>

        <div class="flex items-center mb-6 mt-6">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="mx-4 text-gray-600">第三方平台登入</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>
        <div class="flex justify-center flex-col gap-3 items-center">
          <n-button class="w-full mt-3 font-bold text-lg py-5" round type="primary"
            >Google</n-button
          >
          <n-button class="w-full mt-3 font-bold text-lg py-5" round type="primary"
            >Facebook</n-button
          >
        </div>
        <div class="flex items-center mb-7 mt-8">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="mx-4 text-gray-600">或是</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>
        <div class="flex justify-center flex-col gap-3 items-center">
          <n-button
            @click="toggleLoginSignup"
            class="w-full mt-3 font-bold text-lg py-5"
            round
            type="primary"
          >
            註冊一個帳號吧
          </n-button>
        </div>
      </div>
      <div v-else class="signup-box">
        <div v-if="step === 1">
          <h2 class="font-black text-6xl" style="color: #18a058">註冊</h2>
          <!-- 大頭貼 -->
          <div class="flex flex-col items-center space-y-4 mb-5">
            <div class="relative w-36 h-36">
              <div
                class="w-full h-full rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center"
              >
                <img
                  v-if="formValue.avatar"
                  :src="formValue.avatar"
                  alt="Avatar Preview"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-gray-500">無圖片</span>
              </div>
              <div class="absolute -bottom-1 -right-0">
                <n-upload
                  accept="image/*"
                  :max="1"
                  :file-list="[]"
                  :on-update:file-list="handleFileChange"
                  :show-file-list="false"
                >
                  <n-button type="primary" round circle>+</n-button>
                </n-upload>
              </div>
            </div>
          </div>
          <!--一般註冊表單-->
          <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules">
            <n-form-item label="姓名" path="user.fullname">
              <n-input v-model:value="formValue.user.fullname" placeholder="輸入姓名" />
            </n-form-item>
            <n-form-item label="使用者名稱" path="user.username">
              <n-input v-model:value="formValue.user.username" placeholder="輸入使用者名稱" />
            </n-form-item>
            <n-form-item label="信箱" path="email">
              <n-input v-model:value="formValue.email" placeholder="輸入信箱" />
            </n-form-item>
            <n-form-item label="電話號碼" path="phone">
              <n-input v-model:value="formValue.phone" placeholder="輸入電話號碼" />
            </n-form-item>
          </n-form>
          <n-form-item label="生日" path="birthday">
            <n-date-picker
              v-model:value="formValue.birthday"
              type="date"
              placeholder="選擇生日"
              class="w-full"
            />
          </n-form-item>
          <div class="flex items-center mb-7 mt-8">
            <div class="flex-grow border-t border-gray-300"></div>
          </div>
          <!--密碼表單-->
          <n-form :model="model">
            <n-form-item label="密碼">
              <n-input
                v-model:value="model.password"
                type="password"
                @input="handlePasswordInput"
                @keydown.enter.prevent
                placeholder="密碼長度需為 6 個字元以上"
              />
            </n-form-item>
            <n-form-item label="再次輸入密碼">
              <n-input
                v-model:value="model.reenteredPassword"
                :disabled="!canEnterReenteredPassword"
                type="password"
                @keydown.enter.prevent
                placeholder="再次輸入密碼"
              />
            </n-form-item>
          </n-form>
          <div class="flex items-center mb-7 mt-8">
            <div class="flex-grow border-t border-gray-300"></div>
          </div>
          <!-- 隱私權政策勾選框 -->
          <div class="flex w-auto flex-col gap-3">
            <n-checkbox
              v-model:checked="isCheckedPrivacy"
              @update:checked="onCheckboxChangePrivacy"
            >
              我已閱讀並同意隱私權政策
            </n-checkbox>
            <n-modal
              v-model:show="showModalPrivacy"
              preset="dialog"
              title="隱私權政策"
              :closable="false"
              content="這裡是隱私權政策的詳細內容"
              positive-text="同意"
              negative-text="不同意"
              @positive-click="onAgreePrivacy"
              @negative-click="onDisagreePrivacy"
            />
            <n-checkbox v-model:checked="isCheckedTerms" @update:checked="onCheckboxChangeTerms">
              我已閱讀並同意服務條款
            </n-checkbox>
            <n-modal
              v-model:show="showModalTerms"
              preset="dialog"
              title="服務條款"
              :closable="false"
              content="這裡是服務條款的詳細內容"
              positive-text="同意"
              negative-text="不同意"
              @positive-click="onAgreeTerms"
              @negative-click="onDisagreeTerms"
            />
          </div>
          <!-- <n-checkbox-group class="flex flex-col gap-3">
            <n-checkbox value="PrivacyPolicy" label="隱私權政策" />
            <n-checkbox value="TermsService" label="服務條款" />
          </n-checkbox-group> -->
          <div class="flex items-center mb-7 mt-8">
            <div class="flex-grow border-t border-gray-300"></div>
          </div>
          <div class="flex justify-center gap-3 items-center">
            <n-button
              @click="toggleLoginSignup"
              class="w-1/2 mt-3 font-bold text-lg py-5"
              round
              type="primary"
            >
              回到登入頁
            </n-button>
            <n-button
              @click="goToStep2"
              class="w-1/2 mt-3 font-bold text-lg py-5"
              round
              type="primary"
            >
              下一步
            </n-button>
          </div>
        </div>
        <div v-else-if="step === 2">
          <h2 class="font-black text-6xl" style="color: #18a058">確認您的電子郵件地址</h2>
          <div class="flex flex-col items-center space-y-4 mb-5">
            <div class="relative w-36 h-36">
              <div
                class="w-full h-full rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center"
              >
                <img
                  v-if="formValue.avatar"
                  :src="formValue.avatar"
                  alt="Avatar Preview"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-gray-500">無圖片</span>
              </div>
            </div>
          </div>
          <p class="text-center leading-loose text-gray-600">
            為了確保您的帳戶安全<br />我們已向 example@mail.com 發送了一封驗證信<br />請打開您的信箱<br />並點擊信中的驗證連結以完成註冊流程
          </p>
          <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules">
            <n-form-item path="verificationCode">
              <n-input v-model:value="formValue.verificationCode" placeholder="請輸入驗證碼" />
            </n-form-item>
          </n-form>
          <div class="flex justify-center gap-3 items-center">
            <n-button
              @click="goToStep1"
              class="w-1/2 mt-3 font-bold text-lg py-5"
              round
              type="primary"
            >
              回上一步
            </n-button>
            <n-button
              @click="goToStep3"
              class="w-1/2 mt-3 font-bold text-lg py-5"
              round
              type="primary"
            >
              下一步
            </n-button>
          </div>
        </div>
        <div v-else-if="step === 3">
          <h2 class="font-black text-6xl" style="color: #18a058">完成註冊</h2>
          <div class="flex flex-col items-center space-y-4 mb-5">
            <div class="relative w-36 h-36">
              <div
                class="w-full h-full rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center"
              >
                <img
                  v-if="formValue.avatar"
                  :src="formValue.avatar"
                  alt="Avatar Preview"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-gray-500">無圖片</span>
              </div>
            </div>
          </div>
          <p class="text-center leading-loose text-gray-600">
            尋找感興趣的活動並與大家一起揪團，快來加入吧！
          </p>
          <div class="flex justify-center flex-col gap-3 items-center">
            <n-button class="w-full mt-3 font-bold text-lg py-5" round type="primary"
              >(5s)後回到首頁</n-button
            >
          </div>
          <div class="flex items-center mb-7 mt-8">
            <div class="flex-grow border-t border-gray-300"></div>
            <span class="mx-4 text-gray-600">或是</span>
            <div class="flex-grow border-t border-gray-300"></div>
          </div>
          <p class="text-center leading-loose text-gray-600">
            填寫資料，讓您的個人頁面更完整！<br />輕鬆找到志同道合的人！
          </p>
          <div class="flex justify-center flex-col gap-3 items-center">
            <n-button class="w-full mt-3 font-bold text-lg py-5" round type="primary"
              >前往個人頁面</n-button
            >
            <!--測試用按鈕之後會撤掉-->
            <n-button
              @click="goToStep2"
              class="w-full mt-3 font-bold text-lg py-5"
              round
              type="primary"
            >
              (測試用)上一步
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  NButton,
  NDatePicker,
  NFormItem,
  NInput,
  NForm,
  NCheckbox,
  NUpload,
  useMessage,
  NModal,
} from 'naive-ui'
import { ref, computed } from 'vue'
import { storage } from './services/firebaseConfig.js'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

// 登入表單
const loginForm = ref({
  email: '',
  password: '',
})

// 登入表單的驗證規則
const loginRules = {
  email: {
    required: true,
    message: '請輸入信箱',
    trigger: ['input', 'blur'],
  },
  password: {
    required: true,
    message: '請輸入密碼',
    trigger: ['input', 'blur'],
  },
}

// 隱私權政策-控制 checkbox 是否被選中
const showModalPrivacy = ref(false)
const isCheckedPrivacy = ref(false)
const showModalTerms = ref(false)
const isCheckedTerms = ref(false)

function onCheckboxChangePrivacy() {
  showModalPrivacy.value = true
}

// 同意
const onAgreePrivacy = () => {
  isCheckedPrivacy.value = true
  showModalPrivacy.value = false
}

// 不同意
const onDisagreePrivacy = () => {
  isCheckedPrivacy.value = false
  showModalPrivacy.value = false
}
function onCheckboxChangeTerms() {
  showModalTerms.value = true
}

// 同意
const onAgreeTerms = () => {
  isCheckedTerms.value = true
  showModalTerms.value = false
}

// 不同意
const onDisagreeTerms = () => {
  isCheckedTerms.value = false
  showModalTerms.value = false
}

// 同意條款才能進到下一步
const canProceedToNextStep = computed(() => {
  return isCheckedPrivacy.value && isCheckedTerms.value
})

// 大頭貼的邏輯
const handleFileChange = async (fileList) => {
  // 無選擇文件時直接返回
  if (fileList.length === 0) return
  const file = fileList[0]?.file
  if (!file) return

  // 預覽圖片
  const reader = new FileReader()
  reader.onload = (event) => {
    // 本地圖片預覽
    formValue.value.avatar = event.target.result
  }
  reader.readAsDataURL(file)

  try {
    // 設定圖片文件的存儲路徑
    const filePath = `avatars/${Date.now()}_${file.name}`
    const fileRef = storageRef(storage, filePath)

    // 上傳文件至 Firebase Storage
    const snapshot = await uploadBytes(fileRef, file)

    // 獲取下載 URL
    const downloadURL = await getDownloadURL(snapshot.ref)

    // 更新圖片 URL 到用戶的表單數據
    formValue.value.avatar = downloadURL

    console.log('圖片上傳成功，URL:', downloadURL)
    message.success('圖片上傳成功！')
  } catch (error) {
    console.error('圖片上傳失敗:', error)
    message.error('圖片上傳失敗，請稍後再試：' + (error.message || '未知錯誤'))
  }
}

import registerUser from './services/registerService.js'
import { validateFormFields } from './utils/formValidation.js'

const message = useMessage()

const isLogin = ref(true)
const step = ref(1)
const formRef = ref(null)
const formValue = ref({
  avatar: '',
  user: {
    username: '',
    fullname: '',
  },
  email: '',
  phone: '',
  verificationCode: '',
})
const rules = {
  user: {
    fullname: {
      required: true,
      message: '請輸入姓名',
      trigger: 'blur',
    },
    username: {
      required: true,
      message: '請輸入使用者名稱',
      trigger: 'blur',
    },
  },
  email: {
    required: true,
    message: '請輸入信箱',
    trigger: ['input', 'blur'],
  },
  password: {
    required: true,
    message: '請輸入密碼',
    trigger: ['input', 'blur'],
  },
  phone: {
    required: true,
    message: '請輸入電話號碼',
    trigger: ['input', 'blur'],
  },
  verificationCode: {
    required: true,
    message: '請輸入驗證碼',
    trigger: ['input', 'blur'],
  },
  birthday: [{ required: true, message: '請選擇生日', trigger: 'change' }],
}

const model = ref({
  password: '',
  reenteredPassword: '',
})

// 重複密碼欄位是否可以輸入
const canEnterReenteredPassword = computed(() => {
  return model.value.password && model.value.password.length >= 6
})

function handlePasswordInput() {
  if (!canEnterReenteredPassword.value) {
    model.value.reenteredPassword = ''
  }
}
const toggleLoginSignup = () => {
  isLogin.value = !isLogin.value
  step.value = 1 // 確保進入註冊時從第一步開始
}

// 註冊流程換頁的邏輯
const goToStep3 = () => {
  step.value = 3
}
const goToStep2 = async () => {
  if (step.value === 1) {
    // 引入表單驗證的錯誤訊息
    const errors = validateFormFields(formValue.value, model.value.password)
    if (errors.length > 0) {
      message.error(errors[0])
      return
    }

    if (model.value.password !== model.value.reenteredPassword) {
      message.error('密碼不一致，請重新確認')
      return
    }

    if (!canProceedToNextStep.value) {
      message.error('請同意隱私權政策和服務條款')
      return
    }
    try {
      // 註冊功能
      const userResponse = await registerUser(formValue.value.email, model.value.password)
      console.log('用戶註冊成功！', userResponse)
      message.success('註冊成功！歡迎您，' + formValue.value.user.username)

      // 切換到 Step 2
      step.value = 2
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        message.error('此信箱已被註冊，請嘗試更換其他電子信箱')
      } else if (error.code === 'auth/invalid-email') {
        message.error('無效的電子郵件地址')
      } else if (error.code === 'auth/weak-password') {
        message.error('密碼長度至少要6個字符，並包含數字與字母')
      } else {
        message.error('註冊失敗，請稍後再嘗試：' + (error.message || '未知錯誤'))
      }
    }
  } else {
    step.value = 2
  }
}

const goToStep1 = () => {
  step.value = 1
}
</script>

<style scoped>
.n-form-item {
  width: 100%;
}

h2 {
  text-align: center;
  font-size: 25px;
  margin-bottom: 20px;
}
/* form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
input {
  width: 100%;
  height: 40px;
  padding: 5px;
  text-align: center;
  border-radius: 5px;
} */

.login-wrapper {
  height: 100vh;
  width: 100%;
  background-color: #ebebeb;
  display: flex;
  justify-content: center;
  padding: 30px 0;
}
.block {
  height: auto;
  width: 90%;
  border-radius: 30px;
  overflow: hidden;
}

.login-box,
.signup-box {
  width: 100%;
  height: 100%;
  padding: 30px 30px;
  background-color: rgb(255, 255, 255);
  box-sizing: border-box;
  overflow-y: scroll;
}

.forgot-block {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.remember {
  width: 20px;
  vertical-align: middle;
  margin-right: 5px;
}
.checkbox-label {
  font-size: 15px;
  vertical-align: middle;
}
.forgot {
  width: 100px;
  height: 30px;
}

@media screen and (768px <= width <= 1024px) {
  .block {
    display: flex;
    justify-content: space-between;
    height: 600px;
  }
  .event-image {
    width: 50%;
    height: 100%;
  }
  .login-box,
  .signup-box {
    width: 50%;
    padding-left: 6%;
    padding-right: 6%;
  }
}

@media screen and (1024px <= width) {
  .block {
    height: 90%;
    width: 65%;
    display: flex;
    justify-content: space-between;
  }
  .event-image {
    width: 50%;
    height: 100%;
  }
  .login-box,
  .signup-box {
    width: 50%;
    padding: 6% 6%;
  }
}
</style>
