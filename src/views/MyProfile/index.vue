<script setup>
import { ref } from 'vue'
import { NButton } from 'naive-ui';

const userInfo = ref({
  name: 'Jun',
  city: '新北市',
  age: 26,
  job: '工程師',
  shortDescription: '當上帝給你檸檬時，把他們榨成汁',
  tags: ['愛運動', '遊山玩水', '聽音樂', '玩遊戲', '睡覺', '寫程式']
})
</script>

<template>
  <div class="container mx-auto ">
    <div class=" card-container border rounded-lg overflow-hidden bg-white">
      <div class="img-container w-fill">
        <img class="card-img w-full h-full object-cover" src="@/assets/jun.jpg" alt="">
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
          <span v-for="item in userInfo.tags" class=" border-2 px-3 py-1 rounded"># {{ item }}</span>
        </div>
      </div>
    </div>
    <div>
      <ul class="flex justify-between px-10 py-5 bg-transparent">
        <li class="hover:cursor-pointer">
          <img src="https://www.eatgether.com/static/media/profile.cf89a7f6.svg" alt="">
        </li>
        <li class="hover:cursor-pointer">
          <img src="https://www.eatgether.com/static/media/profile.cf89a7f6.svg" alt="">
        </li>
        <li class="hover:cursor-pointer">
          <img src="https://www.eatgether.com/static/media/profile.cf89a7f6.svg" alt="">
        </li>
        <li class="hover:cursor-pointer">
          <img src="https://www.eatgether.com/static/media/profile.cf89a7f6.svg" alt="">
        </li>
        <li class="hover:cursor-pointer">
          <img src="https://www.eatgether.com/static/media/profile.cf89a7f6.svg" alt="">
        </li>
      </ul>
    </div>
    <div class=" border">

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