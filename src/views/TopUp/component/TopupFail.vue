<script setup>
import { NButton } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()
const goTopup = () => {
  router.push('/topup')
}
</script>
<template>
  <div class="bg-gray-100">
    <div class="bg-white shadow rounded-md mx-auto w-full p-6 min-h-screen md:w-3/4 lg:w-3/5">
      <div class="flex justify-center my-6">
        <svg
          width="100px"
          height="100px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- 外圓 -->
          <circle cx="12" cy="12" r="10" stroke="#FF4D4F" stroke-width="1.5" />
          <!-- 叉叉 -->
          <path
            d="M9 9L15 15M15 9L9 15"
            stroke="#FF4D4F"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <div class="text-center flex flex-col gap-2">
        <p class="text-2xl font-semibold text-gray-700">儲值失敗</p>
        <p class="text-base text-gray-600">本次儲值未成功，請再試一次 😭</p>
      </div>

      <div class="flex justify-center my-14">
        <n-button strong secondary round type="tertiary" @click="goTopup">再儲值一次</n-button>
      </div>
    </div>
  </div>
</template>
