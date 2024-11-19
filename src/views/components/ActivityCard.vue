<script setup>


const props = defineProps({
  title: String,
  actImgUrl: {
    default: 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg'
  },
  location: String,
  dateTime: String,
  host: String,
  participants: Number,
  hostImgUrl: {
    default: '/src/assets/UserUpdata1.jpg'
  }
})
</script>
<template>
  <div class="rounded-2xl bg-transparent  overflow-hidden   mb-4">
    <a href="#">
      <div>
          <img class="w-full h-48 object-cover" :src="props.actImgUrl" alt="死圖">
      </div>
      <div>
          <div class="mt-2 text-lg font-semibold mb-2 truncate ">活動名稱:{{ props.title }}</div>
          <div class="text-sm  mb-2 truncate">地點:{{ props.location }}</div>
          <div class="text-sm text-gray-500 mb-2 truncate">地點/時間:{{ props.dateTime }}</div>
          <div class="flex items-center justify-between text-sm ">
              <div class="flex items-center">
                  <img class="w-6 h-6 rounded-full mr-2" :src="props.hostImgUrl" alt="團主頭像">
                  <span>{{ props.host }}</span>
              </div>
              <div class="flex items-center">
                      報名人數:{{ props.participants }}
              </div>
          </div>                            
      </div>
    </a>
  </div>

</template>
<style scoped>
</style>