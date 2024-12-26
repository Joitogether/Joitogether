<template>
  <div class="w-screen">
    <div class="banner flex flex-col">
      <n-carousel autoplay>
        <img
          v-for="carouselImg in carouselData"
          :key="carouselImg.src"
          class="carousel-img"
          :src="carouselImg.src"
        />
      </n-carousel>
      <div class="w-full h-full bg-slate-300">
        <div class="flex flex-col h-full items-center">
          <h1 class="text-[36px] font-bold my-[60px]">熱門揪團類型</h1>
          <div
            class="flex items-center gap-[210px] w-full justify-evenly mb-[60px] sm:justify-evenly"
          >
            <div v-for="area in areaData" :key="area.title">
              <a href="#" @click.prevent="scrollToCategory(area.targetId)">
                <img :src="area.src" alt="" class="w-full h-full aspect-square object-cover" />
                <p class="text-center">{{ area.title }}</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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

<style scoped>
.carousel-img {
  width: 100%;
  height: 450px;
  object-fit: cover;
}

a img:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease-in-out;
}

p {
  margin-top: 16px;
  font-size: 20px;
  line-height: 29px;
  font-weight: bold;
}
@media (max-width: 768px) {
  .flex.items-center.w-full.justify-evenly {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .flex.items-center.w-full.justify-evenly {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  a img {
    border-radius: 50%;
    max-width: 150px;
    max-height: 150px;
    width: 100px;
    height: 100px;
    margin: 0 auto;
  }
}
</style>
