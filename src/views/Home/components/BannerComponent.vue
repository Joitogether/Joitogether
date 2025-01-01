<script setup>
import { NCarousel } from 'naive-ui'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import joixmas from '@/assets/JoiXmas.jpg'
import joixmasmobile from '@/assets/JoiXmasMobile.jpg'
import joigif from '@/assets/joitogether.gif'
import { useActivityStore } from '@/stores/useActivityStore'
import { storeToRefs } from 'pinia'

const activityStore = useActivityStore()
const { triggerAction } = storeToRefs(activityStore)
const { triggerActivityAction } = activityStore

const triggerCategory = (category) => {
  triggerActivityAction(category)
}

const carouselData = ref([
  {
    src: joigif,
  },
  {
    src: joixmas,
  },
])

const areaData = [
  {
    title: '美食',
    src: 'https://i.pinimg.com/originals/c3/61/70/c3617019ad42a99b25365c51060fec2f.gif',
    targetId: 'food',
  },
  {
    title: '購物',
    src: 'https://i.pinimg.com/originals/ff/fc/5a/fffc5a92c68455f331036891970b1fb9.gif',
    targetId: 'shopping',
  },
  {
    title: '旅遊',
    src: 'https://i.pinimg.com/originals/49/77/3b/49773b089b09c93a7885699500633691.gif',
    targetId: 'travel',
  },
  {
    title: '運動',
    src: 'https://i.pinimg.com/originals/bf/3e/73/bf3e73c60355c69103555b2083d1822d.gif',
    targetId: 'sports',
  },
  {
    title: '教育',
    src: 'https://i.pinimg.com/originals/f0/4f/4e/f04f4e57612f6d0426e725dadb334e42.gif',
    targetId: 'education',
  },
  {
    title: '其他',
    src: 'https://i.pinimg.com/originals/5a/b5/9a/5ab59a91d9c8d3cc19be0cff707a1f60.gif',
    targetId: 'others',
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
    carouselData.value[1].src = joixmasmobile
  } else {
    carouselData.value[1].src = joixmas
  }
})
</script>
<template>
  <div class="w-screen">
    <!-- 輪播圖 -->
    <div class="flex flex-col h-full">
      <n-carousel autoplay>
        <img
          v-for="carouselImg in carouselData"
          :key="carouselImg.src"
          class="w-full h-[400px] object-cover aspect-video"
          :src="carouselImg.src"
        />
      </n-carousel>

      <div class="w-full h-full min-w-[300px]">
        <div class="flex flex-col h-full justify-center items-center">
          <p class="text-3xl font-bold my-12 md:text-4xl">熱門揪團類型</p>
          <div class="flex justify-center mb-10 lg:justify-between lg:max-w-[1150px]">
            <div
              class="grid w-3/5 gap-12 grid-cols-2 cursor-pointer md:w-1/2 md:grid-cols-3 md:gap-14 lg:w-11/12 lg:grid-cols-6 lg:w-full"
            >
              <div v-for="area in areaData" :key="area.title" class="">
                <div
                  @click.prevent="triggerCategory(area.targetId)"
                  class="w-full"
                  :class="{ active: triggerAction === category }"
                >
                  <img
                    :src="area.src"
                    alt=""
                    class="w-full h-full aspect-square object-cover rounded-full border-[4px] border-gray-100 hover:border-[8px] hover:border-green-300 transition-all duration-300"
                  />
                  <p
                    class="text-center text-xl font-bold mt-2 border-gray-100 hover:scale-[1.35] hover:text-green-600 transition-all duration-300"
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
  </div>
</template>

<style scoped>
* {
  color: #444;
  font-family: '微軟正黑體';
}
</style>
