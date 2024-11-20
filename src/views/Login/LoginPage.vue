<template>
  <div class="login-wrapper">
    <div class="block shadow-md">
      <div class="event-image"></div>
      <div v-if="isLogin" class="login-box">
        <h2 class="text-blue-500">登入</h2>
        <form action="">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="請輸入信箱"
            class="bg-gray-100 appearance-none border-2 border-gray-100 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="請輸入密碼"
            class="bg-gray-100 appearance-none border-2 border-gray-100 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          />
          <div class="forgot-block">
            <div>
              <input type="checkbox" id="remember" name="remember" class="remember" />
              <label for="remember" class="checkbox-label">記住我</label>
            </div>
            <button class="bg-white text-gray-400 hover:text-blue-400 font-bold rounded text-base">
              忘記密碼
            </button>
          </div>
          <n-button class="w-full mt-3 font-bold text-lg py-5" round type="primary">
            登入
          </n-button>
        </form>
        <div class="flex items-center mb-7 mt-8">
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
        <h2 class="text-blue-500">註冊</h2>

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
        <form action="">
          <label for="password" class="text-gray-500 font-bold text-left text-sm self-start">
            設定密碼
          </label>
          <input
            v-model="password"
            type="password"
            id="password"
            name="password"
            placeholder="請輸入密碼"
            class="bg-gray-100 appearance-none border-2 border-gray-100 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          />
        </form>
        <div class="flex items-center mb-7 mt-8">
          <div class="flex-grow border-t border-gray-300"></div>
        </div>
        <div class="flex justify-center flex-col gap-3 items-center">
          <n-button
            @click="registerRequired"
            class="w-full mt-3 font-bold text-lg py-5"
            round
            type="primary"
          >
            註冊
          </n-button>
          <n-button
            @click="toggleLoginSignup"
            class="w-full mt-3 font-bold text-lg py-5"
            round
            type="primary"
          >
            回到登入頁
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { NButton, NDatePicker, NFormItem, NInput, NForm, useMessage } from 'naive-ui'
import { ref } from 'vue'
// feature-register
import registerUser from './services/registerService.js'
import { validateFormFields } from './utils/formValidation.js'

const message = useMessage()

const registerRequired = async () => {
  const errors = validateFormFields(formValue.value, formValue.value.password)

  if (errors.length > 0) {
    message.error(errors[0])
    return
  }

  try {
    const userResponse = await registerUser(formValue.value.email, formValue.value.password)
    console.log('用戶註冊成功:', userResponse)
    message.success('註冊成功！歡迎您，' + formValue.value.user.username)
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
}

// feature-login

const isLogin = ref(true)
const formRef = ref(null)
const formValue = ref({
  user: {
    username: '',
    fullname: '',
  },
  email: '',
  phone: '',
  birthday: null,
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
  // password: {
  //   required: true,
  //   message: '請輸入密碼',
  //   trigger: ['input', 'blur'],
  //   validator: (value) => validatePassword(value),
  // },
  phone: {
    required: true,
    message: '請輸入電話號碼',
    trigger: ['input', 'blur'],
  },
  birthday: [{ required: true, message: '請選擇生日', trigger: 'change' }],
}

const toggleLoginSignup = () => {
  isLogin.value = !isLogin.value
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
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
input {
  width: 100%;
  height: 40px;
  /* border: 1px solid gray; */
  padding: 5px;
  text-align: center;
  border-radius: 5px;
}

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
    background-color: rgb(205, 231, 255);
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
    background-color: rgb(205, 231, 255);
  }
  .login-box,
  .signup-box {
    width: 50%;
    padding: 6% 6%;
  }
}
</style>
