<script setup>
import { reactive } from 'vue';
import { NEllipsis, NDivider } from 'naive-ui';

const postList = reactive([
  {
    id: '01',
  title: '台北第一高峰@七星山👍還是半天的輕旅行最可愛',
  content: '天氣很可以的早上👌滿滿的芬多精，吸好吸滿😄好山友👌旅伴🏔攝影咖📷美食獵人🥗人生好隊友在哪呢？😆完美360度的完美展望👍看山望海）',
  time: '2024-11-18 10:00',
  img: 'https://i0.wp.com/www.tripresso.com/blog/wp-content/uploads/2021/02/7.jpeg?resize=616%2C347'
  },
  {
  id: '02',
  title: '2024/11/16-17秘境泡湯',
  content: '快半年前就安排好的泰崗溫泉，討厭的颱風又害我不能去😭為了不讓大家失望，這星期腦細胞不知道死了多少😮‍💨最後決定倒團後又敗部復活往北部走，意外的吃了兩頓大餐🤭又泡了期待超級久的溫泉🥰🤭每當天氣預報不好，出團於否的每一個小細節都必須更嚴謹思考幸好還是出遊了🥰雖然天氣因素無法很完美，在我心裡最美的不是風景，而是每一次的相',
  time: '2024-11-11 10:00',
  img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT11qEDxU4X_MVKYQVU5qiAVFidA58f8GG0bQ&s'
  }
])
postList.sort((a, b) => new Date(b.time) - new Date(a.time));


</script>

<template>
  <div v-for="post in postList" :key="post.id" class="one-post-bottom px-6 bg-white pb-4 cursor-pointer border-b-4 border-solid border-[rgba(61,57,44,0.1)]">
    <div class="post-bottom-top grid grid-cols-6  my-6 ">
      <div class="post-bottom-left leading-normal lg:col-span-5 sm:col-span-4 col-span-3 overflow-hidden mb-5">
        <p class="text-slate-300 text-sm h-8 mt-6">{{ post.time }}</p>
        <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
          <h3 class="text-xl font-bold leading-loose">{{ post.title }}</h3>
        </n-ellipsis>
        <n-ellipsis expand-trigger="click" line-clamp="2" :tooltip="false">
          <p class="post-content text-[16px] text-slate-600">{{ post.content }}</p>
        </n-ellipsis>
      </div>
      <div class="post-bottom-right rounded-3xl overflow-hidden ml-2.5 my-5 lg:col-span-1 sm:col-span-2 col-span-3">
        <img :src="post.img" alt="Post Image" class="object-cover w-full h-full" />
      </div>
    </div>
    <NDivider/>
    <div class="post-bottom-bottom flex leading-loose mt-6 mx-6">
      <div class="mr-8">👍🏻 20 讚</div>
      <div>💬  9 留言</div>
    </div>
  </div>

</template>

