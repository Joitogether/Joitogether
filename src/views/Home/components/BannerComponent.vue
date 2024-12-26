<script setup>
import { NCarousel } from 'naive-ui'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import joixmas from '@/assets/JoiXmas.jpg'
import joixmasmobile from '@/assets/JoiXmasMobile.jpg'
import joigif from '@/assets/joitogether.gif'

const carouselData = ref([
  {
    src: joigif,
  },
  // {
  //   src: 'https://i.pinimg.com/originals/aa/06/9f/aa069f2356b0397342892fd712f604c2.gif',
  // },
  {
    src: joixmas,
  },
])

const areaData = [
  {
    title: '美食',
    src: 'https://i.pinimg.com/originals/c3/61/70/c3617019ad42a99b25365c51060fec2f.gif',
    targetId: 'food-category',
  },
  {
    title: '購物',
    src: 'https://i.pinimg.com/originals/ff/fc/5a/fffc5a92c68455f331036891970b1fb9.gif',
    targetId: 'shopping-category',
  },
  {
    title: '旅遊',
    src: 'https://i.pinimg.com/originals/49/77/3b/49773b089b09c93a7885699500633691.gif',
    targetId: 'travel-category',
  },
  {
    title: '運動',
    src: 'https://i.pinimg.com/originals/bf/3e/73/bf3e73c60355c69103555b2083d1822d.gif',
    targetId: 'sports-category',
  },
  {
    title: '教育',
    src: 'https://i.pinimg.com/originals/f0/4f/4e/f04f4e57612f6d0426e725dadb334e42.gif',
    targetId: 'education-category',
  },
  {
    title: '其他',
    src: 'https://i.pinimg.com/originals/5a/b5/9a/5ab59a91d9c8d3cc19be0cff707a1f60.gif',
    targetId: 'others-category',
  },
]

const isMobile = ref(false)

const updateScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  updateScreenSize()
  window.addEventListener('resize', updateScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
})

watch(isMobile, (newVal) => {
  if (newVal) {
    carouselData.value[1].src = joixmasmobile // 替換成手機版圖片
  } else {
    carouselData.value[1].src = joixmas // 替換回桌面版圖片
  }
})

const scrollToCategory = (id) => {
  const targetElement = document.getElementById(id)
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // 傳送訊息給 ActivityComponent
    window.postMessage({ action: 'selectCategory', category: id.replace('-category', '') }, '*')
  }
}
</script>
<template>
  <div class="w-screen">
    <!-- 輪播圖 -->
    <div class="flex flex-col h-full">
      <n-carousel autoplay>
        <img
          v-for="carouselImg in carouselData"
          :key="carouselImg.src"
          class="w-full max-h-[600px] object-cover aspect-video"
          :src="carouselImg.src"
        />
      </n-carousel>

      <div class="w-full h-full min-w-[300px]">
        <div class="flex flex-col h-full justify-center items-center">
          <h1 class="text-[30px] font-bold my-[60px] sm:text-[38px] md:text-[40px] lg:text-[42px]">
            熱門揪團類型
          </h1>
          <div
            class="flex flex-wrap w-full justify-around px-[60px] md:px-[120px] lg:px-[32px] cursor-pointer"
          >
            <div v-for="area in areaData" :key="area.title" class="m-6">
              <div
                @click.prevent="scrollToCategory(area.targetId)"
                class="min-w-[40px] max-w-[80px] sm:max-w-[80px] md:m-[40px] md:max-w-[120px] lg:min-w-[120px] lg:max-w-[160px] hover:scale-[1.15] transition-all duration-200"
              >
                <img
                  :src="area.src"
                  alt=""
                  class="w-full h-full aspect-square object-cover rounded-full border-[4px] border-gray-100 hover:border-[8px] hover:border-green-300 transition-all duration-300"
                />
                <p
                  class="text-center text-xl font-bold mt-8 border-gray-100 hover:scale-[1.35] hover:text-green-600 transition-all duration-300"
                >
                  {{ area.title }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  color: #444;
  font-family: '微軟正黑體';
}
</style>
