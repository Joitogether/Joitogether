<script setup>
import { NButton } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { userFollowersAddAPI, userGetFollowingAPI, userUnfollowersAPI } from '@/apis/userAPIs'

const userStore = useUserStore()
const meFollowing = ref({ isFollowing: false })
const props = defineProps({
  id: {
    type: String,
  },
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

const fetchFollowingData = async () => {
  const response = await userGetFollowingAPI(userStore.user.uid)
  const found = response.find((list) => list.user_id == props.id)
  if (found) {
    meFollowing.value = found
    return meFollowing.value.isFollowing
  }
  return false
}
const toggleFollow = async (following) => {
  if (following.isFollowing) {
    await userUnfollowersAPI(following.id)
    following.isFollowing = false
    fetchFollowingData()
  } else {
    await userFollowersAddAPI({
      user_id: props.id,
      follower_id: userStore.user.uid,
    })
    following.isFollowing = true
    fetchFollowingData()
  }
}
onMounted(async () => {
  await fetchFollowingData()
})
const emit = defineEmits(['edit', 'close'])
</script>
<template>
  <div class="py-8 px-8 border border-gray-300 rounded-md md:flex md:justify-between md:gap-5">
    <div class="md:w-1/3 md:flex md:items-center">
      <div class="img-container w-40 h-40 rounded-full overflow-hidden mx-auto mb-3">
        <img
          v-if="props.photo_url"
          class="card-img w-full h-full object-cover"
          :src="props.photo_url"
          alt="personImg"
        />
        <img
          v-else
          src="https://firebasestorage.googleapis.com/v0/b/login-demo1-9d3cb.firebasestorage.app/o/avatars%2Fcatavatar.png?alt=media&token=ccd02591-0c4f-435c-9a4a-34f219774558"
          alt="default avatar"
        />
      </div>
    </div>
    <div class="card-content-container flex flex-col gap-2 md:w-2/3 md:flex md:items-start">
      <div class="md:w-full md:flex md:justify-between">
        <h3 class="user-name text-2xl text-center font-bold text-green-600">
          {{ props.display_name || '大名還沒填寫唷 👀' }}
        </h3>
        <n-button
          v-if="userStore.user.uid == props.id"
          @click="emit('edit')"
          type="primary"
          ghost
          round
          class="hidden md:block"
          >編輯檔案
        </n-button>
        <n-button
          v-else
          :type="meFollowing.isFollowing ? 'default' : 'info'"
          class="hidden md:block"
          @click="
            () => {
              toggleFollow(meFollowing)
            }
          "
        >
          {{ meFollowing.isFollowing ? '追蹤中' : '追蹤' }}
        </n-button>
      </div>

      <div class="user-detail text-md font-bold text-center">
        <span>{{ props.city || '所在地還沒填寫唷👀' }}</span>
        <span> • {{ props.age || '年齡還沒填寫唷👀' }}</span>
        <span> • {{ props.career || '職業還沒填寫唷👀' }}</span>
      </div>
      <div
        class="user-description w-full h-auto bg-gray-100 py-2 px-6 rounded-full flex justify-center relative md:justify-start"
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
        v-if="userStore.user.uid == props.id"
        @click="emit('edit', 'close', user)"
        @open-modal="openModal"
        type="primary"
        ghost
        round
        class="md:hidden"
        >編輯檔案
      </n-button>
      <n-button
        v-else
        :type="meFollowing.isFollowing ? 'default' : 'info'"
        class="md:hidden"
        @click="
          () => {
            toggleFollow(meFollowing)
          }
        "
      >
        {{ meFollowing.isFollowing ? '追蹤中' : '追蹤' }}
      </n-button>
    </div>
  </div>
</template>
<style scope></style>
