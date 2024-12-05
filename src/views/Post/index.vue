<script setup>
import NaveBar from '@/views/Home/components/NavbarComponent.vue'
import NewPostArea from './component/NewPostArea.vue'
import { reactive, ref } from 'vue'
import { NSpace, NSelect } from 'naive-ui'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw.js'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('zh-tw')
dayjs.extend(relativeTime)
const options = [
  {
    label: '最新',
    value: 'newest',
  },
  {
    label: '最熱門',
    value: 'hotest',
  },
  {
    label: '最多留言',
    value: 'mostComment',
  },
  {
    label: '最舊',
    value: 'oldest',
  },
]

//預設是美食
const selectedTag = ref('美食')
const handleTagSelect = (tag) => {
  // 這裡可以針對點擊事件做後續處理
  selectedTag.value = tag
}

const handleFilterSelect = (value) => {
  // 這裡可以針對點擊事件做後續處理
  console.log(value)
}

const postList = reactive([
  {
    id: '01',
    name: 'user-1',
    title: '台北第一高峰@七星山👍還是半天的輕旅行最可愛',
    content:
      '天氣很可以的早上👌滿滿的芬多精，吸好吸滿😄好山友👌旅伴🏔攝影咖📷美天氣很可以的早上👌滿滿的芬多精，吸好吸滿😄好山友👌旅伴🏔攝影咖📷美天氣很可以的早上👌滿滿的芬多精，吸好吸滿😄好山友👌旅伴🏔攝影咖📷美天氣很可以的早上👌滿滿的芬多精，吸好吸滿😄好山友👌旅伴🏔攝影咖📷美天氣很可以的早上👌滿滿的芬多精，吸好吸滿😄好山友👌旅伴🏔攝影咖📷美天氣很可以的早上👌滿滿的芬多精，吸好吸滿😄好山友👌旅伴🏔攝影咖📷美食獵人🥗人生好隊友在哪呢？😆完美360度的完美展望👍看山望海）',
    time: '2024-11-18 10:00',
    img: 'https://i0.wp.com/www.tripresso.com/blog/wp-content/uploads/2021/02/7.jpeg?resize=616%2C347',
  },
  {
    id: '02',
    name: 'user-2',
    title: '2024/11/16-17秘境泡湯',
    content:
      '快半年前就安排好的泰崗溫泉，討厭的颱風又害我不能去😭為了不讓大家失望，這星期腦細胞不知道死了多少😮‍💨最後決定倒團後又敗部復活往北部走，意外的吃了兩頓大餐🤭又泡了期待超級久的溫泉🥰🤭每當天氣預報不好，出團於否的每一個小細節都必須更嚴謹思考幸好還是出遊了🥰雖然天氣因素無法很完美，在我心裡最美的不是風景，而是每一次的相',
    time: '2024-11-11 10:00',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT11qEDxU4X_MVKYQVU5qiAVFidA58f8GG0bQ&s',
  },
])
const selectValue = ref()
</script>
<template>
  <NaveBar />
  <div class="postsArea max-w-[1140px] mx-auto px-4">
    <NewPostArea />
    <div class="md:flex justify-between w-full md:py-7">
      <div class="flex w-full md:flex md:w-[35%] md:min-w-[550px] md:justify-between">
        <p
          @click="handleTagSelect('美食')"
          :class="{ 'activated-tag': selectedTag === '美食' }"
          class="text-gray-400 border-transparent text-center pb-1 md:pb-0 border-b-[2px] md: md:rounded-full flex-1 cursor-pointer md:leading-0 leading-9 md:bg-yellow-300 text-base py-1 md:py-0 md:px-4 md:mr-3"
        >
          美食
        </p>
        <p
          @click="handleTagSelect('逛街')"
          :class="{ 'activated-tag': selectedTag === '逛街' }"
          class="text-gray-400 border-transparent text-center pb-1 md:pb-0 border-b-[2px] md: md:rounded-full flex-1 cursor-pointer md:leading-0 leading-9 md:bg-yellow-300 text-base py-1 md:py-0 md:px-4 md:mr-3"
        >
          逛街
        </p>
        <p
          @click="handleTagSelect('旅行')"
          :class="{ 'activated-tag': selectedTag === '旅行' }"
          class="text-gray-400 border-transparent text-center pb-1 md:pb-0 border-b-[2px] md: md:rounded-full flex-1 cursor-pointer md:leading-0 leading-9 md:bg-yellow-300 text-base py-1 md:py-0 md:px-4 md:mr-3"
        >
          旅行
        </p>
        <p
          @click="handleTagSelect('運動')"
          :class="{ 'activated-tag': selectedTag === '運動' }"
          class="text-gray-400 border-transparent text-center pb-1 md:pb-0 border-b-[2px] md: md:rounded-full flex-1 cursor-pointer md:leading-0 leading-9 md:bg-yellow-300 text-base py-1 md:py-0 md:px-4 md:mr-3"
        >
          運動
        </p>
        <p
          @click="handleTagSelect('教育')"
          :class="{ 'activated-tag': selectedTag === '教育' }"
          class="text-gray-400 border-transparent text-center pb-1 md:pb-0 border-b-[2px] md: md:rounded-full flex-1 cursor-pointer md:leading-0 leading-9 md:bg-yellow-300 text-base py-1 md:py-0 md:px-4 md:mr-3"
        >
          教育
        </p>
        <p
          @click="handleTagSelect('其他')"
          :class="{ 'activated-tag': selectedTag === '其他' }"
          class="text-gray-400 border-transparent text-center pb-1 md:pb-0 border-b-[2px] md: md:rounded-full flex-1 cursor-pointer md:leading-0 leading-9 md:bg-yellow-300 text-base py-1 md:py-0 md:px-4 md:mr-3"
        >
          其他
        </p>
      </div>
      <n-space
        class="w-[20%] border-none text-center ml-auto mt-2 md:mt-0 md:w-[20%] md:max-w-[160px]"
        vertical
      >
        <n-select
          @update:value="handleFilterSelect"
          placeholder="排序"
          v-model:value="selectValue"
          :options="options"
        >
        </n-select>
      </n-space>
    </div>

    <div class="post-posts-area">
      <div v-for="post in postList" :key="post.id" class="post-onepost">
        <div class="hidden post-onepost-top md:flex pt-5 items-center cursor-pointer">
          <img class="w-14 aspect-square rounded-full" :src="post.img" alt="" />
          <div class="ml-3 relative w-full h-14">
            <p class="font-bold text-lg absolute top-0">{{ post.name }}</p>
            <p class="absolute bottom-0 text-md">{{ `${post.name} • 25 • 工程師` }}</p>
          </div>
        </div>
        <div class="one-post-bottom mt-2.5 bg-white rounded-2xl pb-4 cursor-pointer">
          <div
            class="post-bottom-top px-2 pb-3 flex justify-between items-center border-b-[1px] border-solid border-[rgba(61,57,44,0.1)]"
          >
            <div
              class="post-bottom-left w-8/12 h-[120px] md:h-[180px] leading-loose overflow-hidden"
            >
              <div
                class="flex justify-between post-onepost-top md:hidden items-center cursor-pointer"
              >
                <div class="flex">
                  <div class="w-6 h-6 aspect-square rounded-full overflow-hidden">
                    <img class="w-full h-full" :src="post.img" alt="" />
                  </div>
                  <p class="font-bold ml-3">{{ `${post.name} • 25 • 工程師` }}</p>
                </div>
                <p>{{ dayjs(post.time).fromNow() }}</p>
              </div>
              <p class="text-slate-300 text-sm hidden md:block">{{ dayjs(post.time).fromNow() }}</p>
              <h3 class="text-lg md:text-xl md:mt-2 font-bold truncate">{{ post.title }}</h3>
              <p class="text-sm pt-1 md:pt-2 md:text-[16px] max-h-20 line-clamp-2">
                {{ post.content }}
              </p>
              <div class="post-bottom-bottom flex leading-loose md:mt-6">
                <div class="mr-8">👍🏻 20 讚</div>
                <div>💬 9 留言</div>
              </div>
            </div>
            <div
              class="post-bottom-right max-w-[120px] md:max-w-[180px] aspect-square rounded-3xl overflow-hidden"
            >
              <img
                class="w-full h-full"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTloBdf4Wa_JxRmW-03mPB_wfP-lBvTGh8-CQ&s"
                alt="文章照片"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
:deep(.n-base-selection) {
  border-radius: 50px !important;
}

.activated-tag {
  color: black;
  font-weight: bold;
  border-color: #fde047;
  transition: border-color 0.15s ease-in-out;
}
</style>
