<template>
  <div class="login-wrapper">
    <div class="block">
      <div class="event-image"></div>
      <div v-if="isLogin" class="login-box">
        <h2 class="text-blue-500">登入</h2>
        <form action="">
          <input
            type="email"
            id="username"
            name="username"
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
              <input
                type="checkbox"
                id="remember"
                name="remember"
                class="remember"
              />
              <label for="remember" class="checkbox-label">記住我</label>
            </div>
            <button
              class="bg-white text-gray-400 hover:text-blue-400 font-bold rounded text-base"
            >
              忘記密碼
            </button>
          </div>
          <button
            class="shadow bg-blue-400 hover:bg-blue-500 focus:shadow-outline focus:outline-none text-white font-bold h-10 rounded"
            type="button"
            style="width: 90%"
          >
            登入
          </button>
        </form>
        <div class="flex items-center mb-7 mt-8">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="mx-4 text-gray-600">第三方平台登入</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>
        <div class="flex justify-center flex-col gap-3 items-center">
          <button
            class="shadow bg-red-400 hover:bg-red-500 focus:shadow-outline focus:outline-none text-white font-bold h-10 rounded"
            type="button"
            style="width: 90%"
          >
            Google
          </button>
          <button
            class="shadow bg-blue-400 hover:bg-blue-500 focus:shadow-outline focus:outline-none text-white font-bold h-10 rounded"
            type="button"
            style="width: 90%"
          >
            Facebook
          </button>
        </div>
        <div class="flex items-center mb-7 mt-8">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="mx-4 text-gray-600">或是</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>
        <div class="flex justify-center flex-col gap-3 items-center">
          <button
            @click="toggleLoginSignup"
            class="shadow bg-blue-400 hover:bg-blue-500 focus:shadow-outline focus:outline-none text-white font-bold h-10 rounded"
            type="button"
            style="width: 90%"
          >
            註冊一個帳號吧
          </button>
        </div>
      </div>
      <div v-else class="signup-box">
        <h2 class="text-blue-500">註冊</h2>
        <form action="">
          <input
            type="email"
            id="username"
            name="username"
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
              <input
                type="checkbox"
                id="remember"
                name="remember"
                class="remember"
              />
              <label for="remember" class="checkbox-label">記住我</label>
            </div>
            <button
              class="bg-white text-gray-400 hover:text-blue-400 font-bold rounded text-base"
            >
              忘記密碼
            </button>
          </div>
          <button
            class="shadow bg-blue-400 hover:bg-blue-500 focus:shadow-outline focus:outline-none text-white font-bold h-10 rounded"
            type="button"
            style="width: 90%"
          >
            登入
          </button>
        </form>
        <div class="flex items-center mb-7 mt-8">
          <div class="flex-grow border-t border-gray-300"></div>

          <span class="mx-4 text-gray-600">第三方平台登入</span>

          <div class="flex-grow border-t border-gray-300"></div>
        </div>
        <div class="flex justify-center flex-col gap-3 items-center">
          <button
            class="shadow bg-red-400 hover:bg-red-500 focus:shadow-outline focus:outline-none text-white font-bold h-10 rounded"
            type="button"
            style="width: 90%"
          >
            Google
          </button>
          <button
            class="shadow bg-blue-400 hover:bg-blue-500 focus:shadow-outline focus:outline-none text-white font-bold h-10 rounded"
            type="button"
            style="width: 90%"
          >
            Facebook
          </button>
        </div>
        <div class="flex items-center mb-7 mt-8">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="mx-4 text-gray-600">或是</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>
        <div class="flex justify-center flex-col gap-3 items-center">
          <button
            @click="toggleLoginSignup"
            class="shadow bg-blue-400 hover:bg-blue-500 focus:shadow-outline focus:outline-none text-white font-bold h-10 rounded"
            type="button"
            style="width: 90%"
          >
            回到登入頁
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isLogin = ref(true);
const toggleLoginSignup = () => {
  isLogin.value = !isLogin.value;
};
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
  width: 90%;
  height: 40px;
  /* border: 1px solid gray; */
  padding: 5px;
  text-align: center;
  border-radius: 5px;
}
.login-wrapper {
  height: 800px;
  width: 100%;
  background-color: #ebebeb;
  display: flex;
  justify-content: center;
  align-items: center;
}
.block {
  height: 600px;
  width: 80%;
  border-radius: 30px;
  overflow: hidden;
}

.login-box,
.signup-box {
  width: 100%;
  height: 100%;
  padding: 30px 20px;
  background-color: rgb(255, 255, 255);
  box-sizing: border-box;
}
.forgot-block {
  width: 90%;
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
  }
  .event-image {
    width: 50%;
    height: 100%;
    background-color: rgb(205, 231, 255);
  }
  .login-box,
  .signup-box {
    width: 50%;
  }
}

@media screen and (1024px <= width) {
  .block {
    height: 90%;
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
    padding: 8% 5%;
  }
}
</style>
