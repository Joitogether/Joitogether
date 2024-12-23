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
      <div class="container mx-auto area">
        <div class="flex flex-col items-center mt-10">
          <h1>熱門揪團類型</h1>
          <div class="flex items-center w-full justify-evenly">
            <div v-for="area in areaData" :key="area.title">
              <a href="#" @click.prevent="scrollToCategory(area.targetId)">
                <img :src="area.src" alt="" class="" />
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

const carouselData = [
  {
    src: 'https://i.pinimg.com/736x/54/63/f8/5463f879dafecd317b771aaee0d4a0aa.jpg',
  },
  {
    src: 'https://cdn.eatgether.com/images/website/banner/02.jpeg',
  },
  {
    src: 'https://cdn.eatgether.com/images/website/banner/03.jpeg',
  },
]

const areaData = [
  {
    title: '美食',
    src: 'https://i.pinimg.com/736x/54/63/f8/5463f879dafecd317b771aaee0d4a0aa.jpg',
    targetId: 'food-category',
  },
  {
    title: '購物',
    src: 'https://i.pinimg.com/736x/80/c4/f7/80c4f7e387cc05ce50f2906a59f621d5.jpg',
    targetId: 'shopping-category',
  },
  {
    title: '旅遊',
    src: 'https://i.pinimg.com/736x/15/f0/e0/15f0e0372d1e04df5f325d00e5899069.jpg',
    targetId: 'travel-category',
  },
  {
    title: '運動',
    src: 'https://i.pinimg.com/736x/b6/74/ca/b674ca0f776433f737615236d466a02d.jpg',
    targetId: 'sports-category',
  },
  {
    title: '教育',
    src: 'https://i.pinimg.com/736x/ec/80/62/ec80622845d58a8cf0dcea9681ea353a.jpg',
    targetId: 'education-category',
  },
  {
    title: '其他',
    src: 'https://i.pinimg.com/736x/55/7c/64/557c64034ecc52a10522dd77a80c8700.jpg',
    targetId: 'others-category',
  },
]
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
a img {
  border-radius: 50%;
  max-width: 150px;
  max-height: 150px;
  width: 100px;
  height: 100px;
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
