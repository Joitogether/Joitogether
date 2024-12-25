<script setup>
const props = defineProps({
  title: String,
  actImgUrl: {
    default:
      'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg',
  },
  location: String,
  dateTime: String,
  host: String,
  participants: Number,
  hostImgUrl: {
    default: '/src/assets/UserUpdata1.jpg',
  },
  horizontal: {
    default: false,
  },
  imageHeight: {
    type: String,
    default: '200px', // 預設高度
  },
  id: {
    type: Number,
  },
})
</script>
<template>
  <div class="rounded-2xl bg-transparent overflow-hidden">
    <router-link
      :to="{
        name: 'activityDetail',
        params: {
          id: props.id,
        },
      }"
      :class="{ ['flex']: props.horizontal }"
      class="w-full h-full"
    >
      <div
        :class="{ 'flex-1': props.horizontal }"
        class="w-full h-28 md:h-72 overflow-hidden relative"
        :style="{ height: imageHeight }"
      >
        <img
          :class="{ 'horizontal-layout-img': true }"
          class="w-full h-full absolute top-0 left-0 object-cover"
          :src="props.actImgUrl"
          alt="死圖"
        />
      </div>
      <div
        :class="{ 'horizontal-layout-container': props.horizontal }"
        class="flex flex-col py-[3%] truncate"
      >
        <div class="text-lg font-semibold mb-2 truncate">活動名稱:{{ props.title }}</div>
        <div class="text-sm mb-2 truncate">地點:{{ props.location }}</div>
        <div class="text-sm text-gray-500 mb-2 truncate">時間:{{ props.dateTime }}</div>
        <div class="flex items-center justify-between text-sm mt-auto">
          <div class="flex items-center">
            <img class="w-6 h-6 rounded-full mr-2" :src="props.hostImgUrl" alt="團主頭像" />
            <span>{{ props.host }}</span>
          </div>
          <div class="flex items-center">可報名人數:{{ props.participants }}</div>
        </div>
      </div>
    </router-link>
  </div>
</template>
<style scoped>
.horizontal-layout-img {
  width: 100%;
  height: 100%;
}

.horizontal-layout-container {
  padding: 2%;
  flex: 2;
}
</style>
