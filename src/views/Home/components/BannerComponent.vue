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
      <div class="container mx-auto aria">
        <div class="flex flex-col items-center mt-10">
          <h1>熱門聚會地點</h1>
          <div class="flex items-center w-full justify-evenly">
            <div v-for="aria in ariaData" :key="aria.title">
              <a href="#" @click.prevent="scrollToCategory(aria.targetId)">
                <img :src="aria.src" alt="" />
                <p class="text-center">{{ aria.title }}</p>
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

const carouselData = [
  {
    src: 'https://cdn.eatgether.com/images/website/banner/01.jpeg',
  },
  {
    src: 'https://cdn.eatgether.com/images/website/banner/02.jpeg',
  },
  {
    src: 'https://cdn.eatgether.com/images/website/banner/03.jpeg',
  },
]

const ariaData = [
  { title: '美食', src: 'https://www.eatgether.com/static/media/TPE.91790170.png', targetId: 'food-category' },
  { title: '購物', src: 'https://www.eatgether.com/static/media/TAO.68ddb6e3.png', targetId: 'shopping-category' },
  { title: '旅遊', src: 'https://www.eatgether.com/static/media/HSZ.417cf6b8.png', targetId: 'travel-category' },
  { title: '運動', src: 'https://www.eatgether.com/static/media/TXG.c136bf99.png', targetId: 'sports-category' },
  { title: '教育', src: 'https://www.eatgether.com/static/media/TNN.1ab27f99.png', targetId: 'education-category' },
  { title: '其他', src: 'https://www.eatgether.com/static/media/KHH.da56765a.png', targetId: 'others-category' },
]
const scrollToCategory = (id) => {
  const targetElement = document.getElementById(id)
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
.carousel-img {
  width: 100%;
  height: 450px;
  object-fit: cover;
}
a img {
  border-radius: 50%;
  max-width: 100px;
  height: auto;
  margin: 0 auto;
}
a img:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease-in-out;
}
h1 {
  padding: 10px;
  margin-bottom: 15px;
  font-size: 32px;
  line-height: 46px;
  font-weight: bold;
  color: rgb(59, 59, 58);
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
    gap: 50px;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .flex.items-center.w-full.justify-evenly {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 60px;
  }
}
</style>
