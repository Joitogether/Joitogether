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
                v-if="userStore.user.photo_url"
                :src="userStore.user.photo_url"
                alt="Avatar Preview"
                class="w-full h-full object-cover"
              />
              <img
                v-else
                src="https://firebasestorage.googleapis.com/v0/b/login-demo1-9d3cb.firebasestorage.app/o/avatars%2Fcatavatar.png?alt=media&token=ccd02591-0c4f-435c-9a4a-34f219774558"
              />
            </div>
          </div>
        </div>
        <p class="text-center leading-loose text-gray-600">
          尋找感興趣的活動並與大家一起揪團<br />快來加入吧！
        </p>
        <div class="flex justify-center flex-col gap-3 items-center">
          <n-button class="w-full mt-3 font-bold text-lg py-5" round type="primary" @click="goHome"
            >{{ countdown }}s後回到首頁</n-button
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
import { userUpdateEmailVerifiedAPI } from '@/apis/userAPIs'
import { useUserStore } from '@/stores/userStore'
import { useMessage } from 'naive-ui'
import { handleError } from '@/utils/handleError.js'

const message = useMessage()
const router = useRouter()
const countdown = ref(10)

// 更新用戶的 emailVerified 狀態到後端
const updateEmailVerified = async (uid) => {
  const updateData = {
    email_verified: true,
  }

  try {
    await userUpdateEmailVerifiedAPI(uid, updateData)
  } catch (error) {
    handleError(message, undefined, error)
  }
}
const userStore = useUserStore()

onMounted(async () => {
  // 檢查是否已驗證
  if (userStore.user.email_verified) {
    await updateEmailVerified(userStore.user.uid)
  }

  // 開始倒數計時
  const interval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value -= 1
    } else {
      // 倒數結束後清除定時器
      clearInterval(interval)
      // 跳轉到登入頁
      goHome()
    }
  }, 1000)
})

// 回到首頁
const goHome = () => {
  router.push('/')
}

// 前往個人頁面
const goProfile = () => {
  router.push({ name: 'personInfo', params: { uid: userStore.user.uid } })
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
