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
    >
      <div
        class="gap-2 w-full overflow-hidden md:justify-start md:gap-4"
        :class="{ ['flex']: props.horizontal }"
      >
        <div
          class="w-24 h-24 rounded-md overflow-hidden flex-shrink-0"
          :class="{ 'w-full h-64': !props.horizontal }"
        >
          <img class="w-full h-full object-cover" :src="props.actImgUrl" alt="圖片不見了ＱＱ" />
        </div>
        <div
          class="flex flex-col w-3/4 justify-between md:w-4/5 lg:w-2/3"
          :class="{ 'md:w-full lg:w-full': !props.horizontal }"
        >
          <div class="flex flex-col" :class="{ 'mt-2 gap-1 w-full': !props.horizontal }">
            <div class="text-base font-semibold truncate" :class="{ 'text-lg': !props.horizontal }">
              {{ props.title }}
            </div>
            <div class="text-sm truncate">{{ props.location }}</div>
            <div class="text-sm text-gray-500 truncate">時間:{{ props.dateTime }}</div>
          </div>
          <div
            class="flex items-center justify-between text-sm"
            :class="{ 'mt-2': !props.horizontal }"
          >
            <div class="flex items-center">
              <div class="w-6 h-6 overflow-hidden rounded-full mr-1">
                <img class="w-full h-full object-cover" :src="props.hostImgUrl" alt="團主頭像" />
              </div>
              <span>{{ props.host }}</span>
            </div>
            <div v-if="!props.horizontal" class="lg:flex">上限人數: {{ props.participants }}</div>
            <div v-else class="hidden md:block lg:hidden">上限人數: {{ props.participants }}</div>
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
