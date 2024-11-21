<script setup>
// import { ref } from 'vue'
import { NButton, NCard, NTabs, NTabPane } from 'naive-ui';
import { ProfileCircle, BrightStar, Heart, Post, Group} from '@iconoir/vue';
import { RouterLink, RouterView, useRoute } from 'vue-router'
import userInfo from '@/views/MyProfile/component/person'
import { ref, computed, watch } from 'vue';

const PostIcon = Post;

// const activeIndex = ref(0); // 記錄當前選中的索引
//     const route = useRoute();   // 獲取當前的路由信息

//     // 根據 activeIndex 動態設置底線的樣式
//     const lineStyle = computed(() => {
//       const xOffset = activeIndex.value * 176; // 每個 li 寬度為 100px
//       return {
//         width: '100px', // 設置底線寬度
//         transform: `translateX(${xOffset}px)`, // 根據 activeIndex 移動底線
//       };
//     });
// const setActiveIndex = (index) => {
//       activeIndex.value = index;
//     };
// watch(
//       () => route.path,
//       (newPath) => {
//         if (newPath === '/profile/personInfo') {
//           activeIndex.value = 0;
//         } else if (newPath === '/profile/personpost') {
//           activeIndex.value = 3;
//         } else if (newPath === '/profile/personActivity') {
//           activeIndex.value = 4;
//         } else {
//           activeIndex.value = -1;
//         }
//       },
//       { immediate: true } // 當組件加載時立即觸發
//     );

</script>

<template>
  <div class="container mx-auto ">
    <div class=" card-container border rounded-lg overflow-hidden bg-white">
      <div class="img-container w-full">
        <!-- <img class="card-img w-full h-full object-cover" src="@/assets/jun.jpg" alt=""> -->
        <img class="card-img w-full h-full object-cover" src="https://shoplineimg.com/5ab875018d1db9e3db00025b/5e15c900fe2d2b002db19bfb/800x.jpg?" alt="">
      </div>
      <div class="card-content-container   p-5">
        <h3 class="user-name text-2xl text-center font-bold">{{ userInfo.name }}</h3>
        <div class="text-md font-bold ">
          <span>{{ userInfo.city }}</span>
          <span> • {{ userInfo.age }}</span>
          <span> • {{ userInfo.job }}</span>
        </div>
        <p class="user-description text-2xl font-bold mt-1 md:mb-5">: {{ userInfo.shortDescription}}</p>
        <div class="btn-container flex gap-2 mt-8 mb-8">
          <n-button round type="primary" class="flex-[3_3_0%]">打招呼</n-button><n-button type="primary" ghost class="flex-[2_2_0%]" round >編輯檔案</n-button>
        </div>
        <div class="tag-container flex gap-3 flex-wrap">
          <span v-for="item in userInfo.tags" :key="item.tags" class="border-2 px-3 py-1 rounded"># {{ item }}</span>
        </div>
      </div>
    </div>
    <div>
      <ul class="flex justify-between px-10 py-5">
        <li class="hover:cursor-pointer w-24" :class="{ 'border-b-4 border-solid border-green-600': $route.path === '/profile/personInfo' }">
            <RouterLink to="/profile/personInfo"><ProfileCircle class="justify-self-center"/></RouterLink>
        </li>
        <li class="hover:cursor-pointer w-24">
          <BrightStar class="justify-self-center"/>
        </li>
        <li class="hover:cursor-pointer w-24">
          <Heart class="justify-self-center"/>
        </li>
        <li class="hover:cursor-pointer w-24" :class="{ 'border-b-4 border-solid border-green-600': $route.path === '/profile/personpost' }">
          <RouterLink to="/profile/personpost"><Post class="justify-self-center"/></RouterLink>
        </li>
        <li class="hover:cursor-pointer w-24" :class="{ 'border-b-4 border-solid border-green-600': $route.path === '/profile/personActivity' }">
          <RouterLink to="/profile/personActivity"><Group class="justify-self-center"/></RouterLink>
        </li>
    </ul>

    </div>
    <div class="border">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>

@media screen and (width < 768px) {
  .container{
    max-width: 550px;
    box-sizing: border-box;
  }
}

@media screen and (width >= 768px) {
  .container {
    max-width: 80%;
  }

  .card-container {
    display: flex;
    padding: 2rem;
  }

  .img-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card-img {
    border-radius: 50%;
    aspect-ratio: 1 / 1;
    height: auto;
  }

  .card-content-container {
    flex: 3;
    padding: 0;
    padding-left: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .btn-container {
    margin-bottom: 0.5rem;
    margin-top: 0;
    width: 70%;
  }

  .user-name {
    text-align: start;
  }

  .user-description {
    font-size: 1rem;
    margin-top: -0.1rem;

  }
}

@media screen and (width >= 1024px) {

  .container {
    max-width: 880px;
  }

  .card-content-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }



}
</style>
