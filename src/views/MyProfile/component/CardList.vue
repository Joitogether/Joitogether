<script setup>
import { NButton } from 'naive-ui';

defineProps({
  items: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    required: true,
    // validator: value => ['hero', 'monster'].includes(value)
  }
})

const emit = defineEmits(['edit'])
</script>
<template>
<div v-if="items" class="card-container border rounded-lg overflow-hidden bg-white">
  <div class="img-container w-full">
    <img
      class="card-img w-full h-full object-cover"
      :src="items.photo_url"
      alt="personImg"
    />
  </div>

  <div class="card-content-container p-5">
    <h3 class="user-name text-2xl text-center font-bold">{{ items.display_name  }}</h3>
    <div class="text-md font-bold">
      <span>{{ items.city }}</span>
      <span> • {{ items.age }}</span>
      <span> • {{ items.career }}</span>
    </div>
    <p class="user-description text-2xl font-bold mt-1 md:mb-5">
      : {{ items.favorite_sentence }}
    </p>
    <n-button @click="emit('edit', items, 'users')" type="primary" ghost class="flex-[2_2_0%]" round >編輯檔案</n-button>
    <div class="tag-container flex gap-3 flex-wrap">
      <span v-for="(item, index) in tags" :key="index"  class="border-2 px-3 py-1 rounded"
        ># {{ item }}</span
      >
    </div>
  </div>
</div>
<div v-else>
  <p>正在加載資料...</p>
</div>
</template>
<style scope>
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
