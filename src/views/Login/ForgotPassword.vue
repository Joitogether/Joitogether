<template>
  <div class="login-wrapper">
    <div class="block shadow-md">
      <div class="event-image overflow-hidden hidden md:block bg-green-100">
        <img
          class="w-full h-full object-cover hidden md:block"
          src="https://i.pinimg.com/736x/a9/42/a3/a942a3a2af483b2afc63c73e300f898b.jpg"
          alt=""
        />
      </div>
      <div class="login-box">
        <h2 class="font-black text-6xl" style="color: #18a058">忘記密碼</h2>
        <p class="text-center leading-loose text-gray-600">
          嘿！忘記密碼了嗎？別擔心～<br />
          輸入您的電子郵件<br />
          我們會馬上寄送重設密碼的連結給您。<br />
          快來找回你的帳號吧！🔐
        </p>
        <n-form :model="forgotPassword" ref="forgotPassword">
          <n-form-item path="email">
            <n-input
              v-model:value="forgotPassword.email"
              placeholder="輸入註冊的電子郵件"
              type="email"
            />
          </n-form-item>
        </n-form>
        <div class="flex justify-center gap-3 items-center">
          <n-button
            @click="gotoLoginPage"
            class="w-1/2 mt-3 font-bold text-lg py-5"
            round
            type="primary"
          >
            回到登入頁
          </n-button>
          <n-button
            @click="handleSubmit"
            class="w-1/2 mt-3 font-bold text-lg py-5"
            round
            type="primary"
          >
            發送重設連結
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMessage, NButton, NForm, NFormItem, NInput } from 'naive-ui'
import { useRouter } from 'vue-router'
import { passwordService } from './services/passwordService.js'
import { handleError } from '@/utils/handleError.js'

const message = useMessage()
const router = useRouter()

// 忘記密碼邏輯
const forgotPassword = ref({
  email: '',
})
const handleSubmit = async () => {
  const email = forgotPassword.value.email

  if (!email) {
    message.error('😅 哎呀！你忘了輸入信箱了！快輸入一下～')
    return
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailPattern.test(forgotPassword.value.email.trim())) {
    message.error('😅 哎呀！請輸入正確的信箱格式！')
    return
  }
  try {
    await passwordService.sendPasswordResetEmail(email)
    message.success('🎉 好棒！我們已經將重設密碼的連結發送到您的郵箱了，請查收！')

    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      message.error('😅 哎呀！信箱尚未註冊！')
    } else if (error.code === 'auth/invalid-email') {
      message.error('😅 哎呀！請輸入正確的信箱格式！')
    } else if (error.code === 'auth/too-many-requests') {
      message.error('⏳ 嘿！您請求太多次了，請稍後再試！')
    } else {
      handleError(message, '😵 發生未知錯誤，請稍後再試一次！', error)
    }
  }
}

// 換頁
const gotoLoginPage = () => {
  router.push('/login')
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
