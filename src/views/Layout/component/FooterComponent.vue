<script setup>
import { useUserStore } from '@/stores/userStore'
import { useMessage } from 'naive-ui'

const userStore = useUserStore()
const message = useMessage()

const requireLogin = () => {
  if (!userStore.user.isLogin) {
    message.error('請先登入喔！(｡•́︿•̀｡)')
    return
  }
}
</script>

<template>
  <footer>
    <div class="bg-gray-300 w-full h-auto p-6 lg:pt-6 lg:pb-0 flex justify-center">
      <div class="flex flex-col lg:flex-row lg:gap-10">
        <div class="flex flex-col items-center gap-3 lg:flex-row lg:gap-5">
          <p class="text-xl font-semibold text-gray-500">Joitogether</p>
          <div class="text-gray-500 gap-3 text-center md:text-start">
            <div class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
              <RouterLink v-if="!userStore.user.isLogin" to="/login" class="">註冊會員</RouterLink>
              <RouterLink @click="requireLogin" to="/activity/create" class="">建立活動</RouterLink>
              <RouterLink to="/home" class="">加入聚會</RouterLink>
              <RouterLink to="/posts" class="">加入討論</RouterLink>
              <RouterLink @click="requireLogin" to="/topup" class="">儲值手續</RouterLink>
              <RouterLink @click="requireLogin" to="/shoppingcart" class="">購物車</RouterLink>
            </div>
          </div>
        </div>
        <div class="mt-8 flex flex-col items-center gap-2 lg:mt-0 lg:flex-row lg:gap-5">
          <p class="text-lg font-semibold border-gray-400 text-gray-500">聯繫我們</p>
          <a href="mailto:joitogether123@gmail.com" class="text-gray-500"
            >joitogether123@gmail.com
          </a>
        </div>
      </div>
    </div>

    <div class="flex justify-center bg-gray-300 w-full h-auto pt-0 p-3 lg:py-3">
      <div class="text-gray-500 font-semibold text-center lg:flex lg:gap-5">
        <p class="text-base font-medium border-gray-300">Joitogether 揪團股份有限公司 © 2024</p>
        <p class="text-sm font-light">Joitogether Co., LTD. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
