<script setup>
import { NButton } from 'naive-ui'
import { ref } from 'vue'

const props = defineProps({
  display_name: {
    type: String,
  },
  age: {
    type: Number,
  },
  career: {
    type: String,
  },
  city: {
    type: String,
  },
  favorite_sentence: {
    type: String,
  },
  photo_url: {
    type: String,
  },
  tags: {
    type: Array,
  },
})

const user = ref(null)
const showModal = ref(false) // 控制 modal 顯示

// 控制 modal 開啟
const openModal = () => {
  showModal.value = true
  emit('edit', user.value)
}

const emit = defineEmits(['edit', 'close'])
</script>
<template>
  <div class="py-8 px-8 border border-gray-300 rounded-md md:flex md:justify-between md:gap-5">
    <div class="md:w-1/3 md:flex md:items-center">
      <div class="img-container w-40 h-40 rounded-full overflow-hidden mx-auto mb-3">
        <img class="card-img w-full h-full object-cover" :src="props.photo_url" alt="personImg" />
      </div>
    </div>
    <div class="card-content-container flex flex-col gap-2 md:w-2/3 md:flex md:items-start">
      <div class="md:w-full md:flex md:justify-between">
        <h3 class="user-name text-2xl text-center font-bold text-green-600">
          {{ props.display_name || '大名還沒填寫唷 👀' }}
        </h3>
        <n-button
          @click="emit('edit', 'close', user)"
          @open-modal="openModal"
          type="primary"
          ghost
          round
          class="hidden md:block"
          >編輯檔案
        </n-button>
      </div>

      <div class="user-detail text-md font-bold text-center">
        <span>{{ props.city || '所在地還沒填寫唷👀' }}</span>
        <span> • {{ props.age || '年齡還沒填寫唷👀' }}</span>
        <span> • {{ props.career || '職業還沒填寫唷👀' }}</span>
      </div>
      <div
        class="user-description w-full h-auto bg-gray-100 py-2 px-6 rounded-full mt-2 flex justify-center relative md:justify-start"
      >
        <p class="text-md tracking-wide">：{{ props.favorite_sentence || '座右銘還未填寫唷👀' }}</p>
      </div>

      <div class="tag-container flex gap-3 flex-wrap my-3">
        <span v-if="!props.tags">還沒有標籤喔</span>
        <span
          v-else
          v-for="(item, index) in (props.tags || '').split(',')"
          :key="index"
          class="border-2 px-3 py-1 rounded"
        >
          # {{ item || '未填寫' }}</span
        >
      </div>
      <n-button
        @click="emit('edit', 'close', user)"
        @open-modal="openModal"
        type="primary"
        ghost
        round
        class="md:hidden"
        >編輯檔案
      </n-button>
    </div>
  </div>
</template>
<style scope>
.user-description::after {
  content: '';
  position: absolute;
  top: -10px;
  right: 175px;
  border-style: solid;
  border-width: 0 10px 15px 10px;
  border-color: transparent transparent rgb(243 244 246) transparent;
}

@media screen and (width >= 768px) {
  .user-description::after {
    display: none;
  }
}
/* @media screen and (width >= 768px) {
  .container {
    max-width: 80%;
  }

  .card-container {
    display: flex;
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
    margin-left: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .user-name,
  .user-detail {
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
} */
</style>
