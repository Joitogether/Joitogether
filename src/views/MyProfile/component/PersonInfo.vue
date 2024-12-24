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
  <div v-if="props" class="personInfo bg-gray-50 px-5 pt-5 pb-5 rounded-md">
    <div class="flex flex-col gap-4 mb-5 md:flex-row md:justify-between md:gap-4 md:max-h-48">
      <div class="rounded-md overflow-hidden md:w-1/2">
        <img
          :src="
            props.life_photo_1 ||
            'https://firebasestorage.googleapis.com/v0/b/login-demo1-9d3cb.firebasestorage.app/o/lifephoto%2F1733574359943_defaultimg.jpg?alt=media&token=c5486472-dadd-4276-8666-97a538e46e5f'
          "
          alt="lifePhoto-1"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="rounded-md overflow-hidden md:w-1/2">
        <img
          :src="
            props.life_photo_2 ||
            'https://firebasestorage.googleapis.com/v0/b/login-demo1-9d3cb.firebasestorage.app/o/lifephoto%2F1733574359943_defaultimg.jpg?alt=media&token=c5486472-dadd-4276-8666-97a538e46e5f'
          "
          alt="lifePhoto1-2"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <p class="bg-white h-10 text-sm p-2 flex items-center rounded-md tracking-wide">
        🗣️ 自我介紹：{{ props.self_introduction || '還沒有自我介紹呦' }}
      </p>
      <p class="bg-white h-10 text-sm p-2 flex items-center rounded-md tracking-wide">
        🌟 星座：{{ props.zodiac || '咦是什麼星座呢' }}
      </p>
      <p class="bg-white h-10 text-sm p-2 flex items-center rounded-md tracking-wide">
        🥎 興趣：{{ props.hobby || '有什麼興趣呢' }}
      </p>
      <p class="bg-white h-10 text-sm p-2 flex items-center rounded-md tracking-wide">
        💼 專長：{{ props.expertise || '專長還沒填寫餒 ' }}
      </p>
      <p class="bg-white h-10 text-sm p-2 flex items-center rounded-md tracking-wide">
        🎡 興趣的活動：{{ props.interested_in || '興趣的活動還沒填寫耶 ' }}
      </p>
    </div>
  </div>
  <div v-else>趕快去填寫更多資料吧！</div>
</template>

<style scoped>
/* @media screen and (width < 768px) {
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
} */
</style>
