<script setup>
import { reactive } from 'vue';
const postList = reactive([
  {
    id: '01',
    name: 'user-1',
    title: '台北第一高峰@七星山👍還是半天的輕旅行最可愛',
    content: '天氣很可以的早上👌滿滿的芬多精，吸好吸滿😄好山友👌旅伴🏔攝影咖📷美食獵人🥗人生好隊友在哪呢？😆完美360度的完美展望👍看山望海）',
    time: '2024-11-18 10:00',
    img: 'https://i0.wp.com/www.tripresso.com/blog/wp-content/uploads/2021/02/7.jpeg?resize=616%2C347'
  },
])
</script>

<template>
<div class=" bg-white">
  <!-- 發文者的資訊區 -->
  <div class="m-6 flex items-center p-4 border border-gray-300 rounded-md">
    <div class="w-40 mx-6 justify-center">
      <img class="w-full rounded-full" :src=postList[0].img alt="">
    </div>
    <div>
      <div class="p-2 text-xl">{{ postList[0].name}}</div>
      <div class="p-2  text-sm">{{ postList[0].time}}</div>
    </div>
  </div>
  <!-- 文章資訊區 -->
  <div class="m-6 items-center p-4 border border-gray-300 rounded-md">
    <div class="m-1 items-center p-4 border border-gray-300 rounded-md">
        <div class="flex">
          <div>
            <img class="mx-1 w-32" :src=postList[0].img alt="">
          </div>
          <div>
            <img class="mx-1 w-32" :src=postList[0].img alt="">
          </div>
          <div>
            <img class="mx-1 w-32" :src=postList[0].img alt="">
          </div>
        </div>
    </div>
    <div class="mb-6 p-2">
      文章內容{{ postList[0].content }}
    </div>
    <div class="flex justify-between mb-6">
      <div class="flex">
        <div class="px-2">👍🏻 20 </div>
        <div class="px-2">💰 10 </div>
      </div>
      <div class="px-2">💬 5 </div>
    </div>
    <hr>
    <!-- 功能操作區 -->
    <div class="flex justify-around ">
      <div class="mx-4 items-center p-4 overflow-hidden">
        <button>讚👍🏻</button>
      </div>
      <div class="mx-4 items-center p-4 ">
        <button>留言💬</button>
      </div>
      <div class="mx-4 items-center p-4 ">
        <button>分享↪️</button>
      </div>
      <div class="mx-4 items-center p-4 ">
        <button>打賞💰</button>
      </div>
    </div>
    <hr>
    <!-- 留言區 -->
    <div class="my-3">
      <!-- 目前使用者 -->
      <div class="flex">
        <div class="w-20 rounded-full">
          <img class="w-full rounded-full" :src=postList[0].img alt="">
        </div>
        <div>
          <input type="text" placeholder="說說你的看法" class="flex-grow p-3 border-none focus:outline-none  text-base">
          <button>留言</button>
        </div>
      </div>
      <!-- 其他使用者留言 -->
      <div class="flex my-3">
        <div class="w-20 rounded-full">
          <img class="w-full rounded-full"  :src=postList[0].img  alt="">
        </div>
        <div class="items-center p-2 border border-gray-300 rounded-md w-56">
          <div class="text-sm">留言者名稱</div>
          <div class="text-sm">留言內容</div>
        </div>
      </div>
      <div>
        <button>查看更多留言.....</button>
      </div>
    </div>
  </div>
</div>
</template>
<style scoped>

</style>
