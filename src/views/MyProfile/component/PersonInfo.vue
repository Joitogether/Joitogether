<script setup>
import userInfo from '@/views/MyProfile/component/person'


</script>
<template>
  <div class="personInfo mx-8 my-5">
    <div class="photoArea grid grid-cols-2 gap-4 overflow-hidden">
      <div class="firstPhoto justify-self-center self-center">
        <img :src="userInfo.lifePhoto1" alt="lifePhoto-1" class="rounded-3xl">
      </div>
      <div class="secondPhoto justify-self-center self-center">
        <img :src="userInfo.lifePhoto2" alt="lifePhoto1-2" class="rounded-3xl">
      </div>
    </div>
    <div class="contentArea sm:leading-loose sm:text-xl text-sm mx-5 mt-5 px-5">
      <p v-if="userInfo.selfintroduction !== ''" class="bg-orange-200">自我介紹：{{ userInfo.selfintroduction}}</p>
      <p v-if="userInfo.zodiac !== ''" class="bg-red-200">星座：{{ userInfo.zodiac}}</p>
      <p v-if="userInfo.hobby !== ''" class="bg-yellow-200">嗜好：{{ userInfo.hobby}}</p>
      <p v-if="userInfo.expertise !== ''" class="bg-lime-200">專長：{{ userInfo.expertise}}</p>
      <p v-if="userInfo.interestedin !== '' " class="bg-violet-200">興趣的活動：{{ userInfo.interestedin}}</p>
    </div>
  </div>
</template>

<style scoped>

.contentArea p{
  margin-bottom: 20px;
  padding: 0 15px;
  line-height: 2.5;
  text-align: center;
  border-radius: 9999px
}

</style>
