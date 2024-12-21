<script setup>
const props = defineProps({
  life_photo_1: {
    type: String,
  },
  life_photo_2: {
    type: String,
  },
  self_introduction: {
    type: String,
  },
  zodiac: {
    type: String,
  },
  hobby: {
    type: String,
  },
  expertise: {
    type: String,
  },
  interested_in: {
    type: String,
  },
})
</script>
<template>
  <div v-if="props" class="personInfo mx-8 my-5">
    <div class="photoArea grid grid-cols-2 gap-4 overflow-hidden">
      <div class="firstPhoto justify-self-center self-center">
        <img
          :src="
            props.life_photo_1 ||
            'https://firebasestorage.googleapis.com/v0/b/login-demo1-9d3cb.firebasestorage.app/o/lifephoto%2F1733574359943_defaultimg.jpg?alt=media&token=c5486472-dadd-4276-8666-97a538e46e5f'
          "
          alt="lifePhoto-1"
          class="rounded-3xl"
        />
      </div>
      <div class="secondPhoto justify-self-center self-center">
        <img
          :src="
            props.life_photo_2 ||
            'https://firebasestorage.googleapis.com/v0/b/login-demo1-9d3cb.firebasestorage.app/o/lifephoto%2F1733574359943_defaultimg.jpg?alt=media&token=c5486472-dadd-4276-8666-97a538e46e5f'
          "
          alt="lifePhoto1-2"
          class="rounded-3xl"
        />
      </div>
    </div>
    <div class="contentArea sm:leading-loose sm:text-xl text-sm mt-5">
      <p class="bg-orange-200">自我介紹：{{ props.self_introduction || '自我介紹還未填寫唷👀' }}</p>
      <p class="bg-red-200">星座：{{ props.zodiac || '星座還未填寫唷👀' }}</p>
      <p class="bg-yellow-200">嗜好：{{ props.hobby || '嗜好還未填寫唷👀' }}</p>
      <p class="bg-lime-200">專長：{{ props.expertise || '專長還未填寫唷👀' }}</p>
      <p class="bg-violet-200">興趣的活動：{{ props.interested_in || '興趣的活動還未填寫唷👀' }}</p>
    </div>
  </div>
  <div v-else>趕快去填寫更多資料吧！</div>
</template>

<style scoped>
@media screen and (width < 768px) {
  .photoArea {
    display: block;
  }

  .photoArea img {
    margin-bottom: 20px;
  }
}

.contentArea p {
  margin-bottom: 20px;
  padding: 0 15px;
  line-height: 2.5;
  text-align: center;
  border-radius: 9999px;
}
</style>
