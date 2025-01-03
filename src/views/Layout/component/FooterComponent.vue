<script setup>
import { Facebook, Instagram } from '@iconoir/vue'
</script>

<template>
  <footer>
    <div class="bg-gray-300 w-full h-auto p-8 flex justify-center md:p-5">
      <div
        class="flex flex-col md:flex md:flex-row md:px-4 md:gap-10 md:justify-between lg:w-3/4 lg:gap-20"
      >
        <div class="w-14 mb-2 md:w-1/6 md:flex md:items-center lg:w-24">
          <img src="../../../assets/Joi.png" alt="" />
        </div>
        <div class="leading-8 mt-3 md:mt-0 md:w-1/2 lg:w-1/3">
          <div
            class="py-1 text-xl font-semibold border-b border-gray-400 text-gray-600 md:border-none lg:text-xl lg:tracking-wider lg:mb-2"
          >
            Joitogether
          </div>
          <div class="md:flex md:flex-row md:gap-6 lg:text-sm lg:tracking-wider">
            <div class="md:flex md:flex-col lg:gap-2">
              <div class="text-gray-600">
                <RouterLink to="/login" class="">註冊會員</RouterLink>
              </div>
              <div class="text-gray-600">
                <a href="#" class="">建立活動</a>
              </div>
            </div>
            <div class="md:flex md:flex-col lg:gap-2">
              <div class="text-gray-600">
                <a href="#" class="">加入聚會</a>
              </div>
              <div class="text-gray-600">
                <RouterLink to="/post" class="">加入討論</RouterLink>
              </div>
            </div>
            <div class="md:flex md:flex-col lg:gap-2">
              <div class="text-gray-600">
                <a href="#" class="">儲值手續</a>
              </div>
              <div class="text-gray-600">
                <a href="#" class="">購物車</a>
              </div>
            </div>
          </div>
        </div>

        <div class="leading-8 mt-3 md:mt-0 md:w-1/5">
          <div
            class="py-1 text-xl font-semibold border-b border-gray-400 text-gray-600 md:border-none lg:text-xl lg:tracking-wider lg:mb-2"
          >
            關於我們
          </div>
          <div class="text-gray-600 flex flex-col lg:text-sm lg:tracking-wider lg:gap-2">
            <RouterLink to="/" class="">了解我們</RouterLink>
            <RouterLink to="/" class="">加入我們</RouterLink>
          </div>
        </div>
        <div
          class="leading-8 mt-3 md:mt-0 md:flex md:flex-col md:justify-between md:w-1/4 lg:w-1/3"
        >
          <div>
            <div
              class="py-1 text-xl font-semibold border-b border-gray-400 text-gray-600 md:border-none lg:text-xl lg:tracking-wider"
            >
              聯繫我們
            </div>
            <a
              href="mailto:joitogether123@gmail.com"
              class="font-thin lg:font-normal lg:tracking-wider lg:text-sm"
              >joitogether123@gmail.com
            </a>
          </div>
          <div class="flex gap-3 mt-2">
            <div class="bg-gray-700 text-white flex p-1.5 rounded-full hover:bg-green-600">
              <a href="https://www.facebook.com/joitogether" class="no-hover-style">
                <Facebook />
              </a>
            </div>
            <div class="bg-gray-700 flex p-1.5 rounded-full text-white hover:bg-green-600">
              <a href="https://www.instagram.com/joitogether" class="no-hover-style">
                <Instagram />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center bg-gray-700 w-full h-auto p-3">
      <div class="text-gray-300 font-semibold text-center md:flex flex-row gap-5">
        <p class="text-base font-medium md:border-r border-gray-300 md:pr-5">
          Joitogether 揪團股份有限公司 © 2024
        </p>
        <p class="text-sm font-light">Joitogether Co., LTD. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
