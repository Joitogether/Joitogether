<template>
  <div class="login-wrapper">
    <div class="block shadow-md">
      <div class="event-image bg-green-100"></div>
      <div class="signup-box">
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
          尋找感興趣的活動並與大家一起揪團<br />快來加入吧！
        </p>
        <div class="flex justify-center flex-col gap-3 items-center">
          <n-button class="w-full mt-3 font-bold text-lg py-5" round type="primary" @click="goHome"
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
          <n-button
            class="w-full mt-3 font-bold text-lg py-5"
            round
            type="primary"
            @click="goProfile"
            >前往個人頁面</n-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { NButton } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from './services/firebaseConfig.js'
import axios from 'axios'

const formValue = ref({
  avatar: '',
})

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goProfile = () => {
  router.push('/profile')
}

// 驗證信箱並更新資料
const verifyEmailUpdate = async () => {
  try {
    const user = auth.currentUser

    if (!user) {
      throw new Error('用戶未登入')
    }
    // 刷新用戶狀態
    await user.reload()

    if (!user.emailVerified) {
      console.log('信箱尚未驗證')
      return
    }
    console.log('信箱驗證成功 🎉')

    // 向後端更新資料
    const userId = user.uid
    const backendResponse = await axios.put(`http://localhost:3030/users/update/${userId}`, {
      email_verified: true,
    })
    console.log('驗證成功，狀態已更新', backendResponse.data)
  } catch (error) {
    console.error('無法更新用戶狀態：', error)
  }
}

onMounted(() => {
  verifyEmailUpdate()
})
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

.signup-box {
  width: 100%;
  height: 100%;
  padding: 30px 30px;
  background-color: rgb(255, 255, 255);
  box-sizing: border-box;
  overflow-y: scroll;
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
