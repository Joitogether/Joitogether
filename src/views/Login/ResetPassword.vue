<template>
  <div class="login-wrapper">
    <div class="block shadow-md">
      <div class="event-image bg-green-100"></div>
      <div class="signup-box">
        <h2 class="font-black text-6xl" style="color: #18a058">重設密碼完成</h2>
        <p class="text-center leading-loose text-gray-600">
          太棒啦！您的密碼已成功更新！ヾ(＠⌒▽⌒＠)ﾉ <br />
          新密碼已守護好您的帳戶安全 🛡️💼 <br />
          重新掌控帳戶的感覺是不是超棒的呢？<br />
          現在您可以用新密碼暢快登入啦！快來試試吧！
        </p>
        <div class="flex justify-center flex-col gap-3 items-center">
          <n-button class="w-full mt-3 font-bold text-lg py-5" round type="primary" @click="goHome"
            >{{ countdown }}s後回到登入頁</n-button
          >
        </div>
        <p class="text-center leading-loose text-gray-600 mt-1.5">
          祝您接下來使用愉快，有任何問題隨時聯繫我們哦～！
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { NButton, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const router = useRouter()
const message = useMessage()
const countdown = ref(10)

const startCountdown = () => {
  const interval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(interval)
      router.push('/login')
    }
  }, 1000)
}

onMounted(() => {
  message.success('🎉 密碼重置成功！現在您可以用新密碼登入啦！💪✨')
  startCountdown()
})
const goHome = () => {
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
