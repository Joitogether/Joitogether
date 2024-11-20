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
        <n-form
          ref="formRef"
          inline
          :label-width="80"
          :model="formValue"
          :rules="rules"
          style="width: 100%"
        >
          <n-form-item label="姓名" path="user.name">
            <n-input v-model:value="formValue.user.name" placeholder="輸入姓名" />
          </n-form-item>
          <n-form-item label="電話號碼" path="phone">
            <n-input v-model:value="formValue.phone" placeholder="輸入電話號碼" />
          </n-form-item>
        </n-form>
        <form action="">
          <label for="fullname" class="text-gray-500 font-bold text-left text-sm self-start">
            姓名
          </label>
          <input
            type="fullname"
            id="fullname"
            name="fullname"
            placeholder="請輸入全名"
            class="bg-gray-100 appearance-none border-2 border-gray-100 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          />
          <label for="username" class="text-gray-500 font-bold text-left text-sm self-start">
            使用者名稱
          </label>
          <input
            type="username"
            id="username"
            name="username"
            placeholder="請輸入使用者名稱"
            class="bg-gray-100 appearance-none border-2 border-gray-100 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          />
          <label for="email" class="text-gray-500 font-bold text-left text-sm self-start">
            信箱
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="請輸入信箱"
            class="bg-gray-100 appearance-none border-2 border-gray-100 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            v-model="email"
          />
          <label for="tel" class="text-gray-500 font-bold text-left text-sm self-start">
            手機號碼
          </label>
          <input
            type="tel"
            id="tel"
            name="tel"
            placeholder="請輸入手機號碼"
            class="bg-gray-100 appearance-none border-2 border-gray-100 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          />
          <label for="date" class="text-gray-500 font-bold text-left text-sm self-start">
            生日
          </label>
          <n-date-picker v-model:value="timestamp" type="date" class="w-full" />
          <!-- <pre>{{ JSON.stringify(timestamp) }}</pre> -->
        </form>
        <div class="flex items-center mb-7 mt-8">
          <div class="flex-grow border-t border-gray-300"></div>
        </div>
        <form action="">
          <label for="password" class="text-gray-500 font-bold text-left text-sm self-start">
            設定密碼
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="請輸入密碼"
            class="bg-gray-100 appearance-none border-2 border-gray-100 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            v-model="password"
          />
        </form>
        <div class="flex items-center mb-7 mt-8">
          <div class="flex-grow border-t border-gray-300"></div>
        </div>
        <div class="flex justify-center flex-col gap-3 items-center">
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
import { NButton, NDatePicker, NFormItem, NInput, NForm } from 'naive-ui'
import { ref } from 'vue'
// feature
import registerUser from './services/registerService.js'
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const registerRequired = async () => {
  if (password.value.length < 6) {
    errorMessage.value = '密碼長度至少要 6 個字元'
    return
  }
  try {
    const user = await registerUser(email.value, password.value)
    console.log('用戶註冊成功:', user)
  } catch (error) {
    errorMessage.value = error.message || '註冊失敗'
  }
}

registerRequired()

// console.log(registerUser(email.value, password.value))

const isLogin = ref(true)
const formRef = ref(null)
const formValue = ref({
  user: {
    name: '',
  },
  phone: '',
})
const rules = {
  user: {
    name: {
      required: true,
      message: '請輸入姓名',
      trigger: 'blur',
    },
  },
  phone: {
    required: true,
    message: '請輸入電話號碼',
    trigger: ['input'],
  },
}
const timestamp = ref(Date.now())

const toggleLoginSignup = () => {
  isLogin.value = !isLogin.value
}
</script>

<style scoped>
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
