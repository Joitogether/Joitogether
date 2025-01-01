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
    default: '200px',
  },
  id: {
    type: Number,
  },
})
</script>
<template>
  <div class="w-full break-words py-3">
    <router-link
      :to="{
        name: 'activityDetail',
        params: {
          id: props.id || 0,
        },
      }"
      :class="{ ['flex']: props.horizontal }"
    >
      <div class="flex gap-2 w-full md:justify-start md:gap-4">
        <div class="w-24 rounded-md aspect-square overflow-hidden">
          <img class="w-full h-full object-cover" :src="props.actImgUrl" alt="圖片不見了ＱＱ" />
        </div>
        <div
          :class="{ 'horizontal-layout-container': props.horizontal }"
          class="flex flex-col w-2/3 justify-between md:w-3/4"
        >
          <div class="flex flex-col">
            <div class="text-base font-semibold truncate">{{ props.title }}</div>
            <div class="text-sm truncate">{{ props.location }}</div>
            <div class="text-sm text-gray-500 truncate">時間:{{ props.dateTime }}</div>
          </div>
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center">
              <div class="w-6 h-6 overflow-hidden rounded-full mr-1">
                <img class="w-full h-full object-cover" :src="props.hostImgUrl" alt="團主頭像" />
              </div>
              <span class="hidden md:block">{{ props.host }}</span>
            </div>
            <div class="flex items-center">活動人數上限: {{ props.participants }}</div>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>
<style scoped>
/* .horizontal-layout-img {
  width: 100%;
  height: 100%;
}

.horizontal-layout-container {
  padding: 2%;
  flex: 2;
} */
</style>
