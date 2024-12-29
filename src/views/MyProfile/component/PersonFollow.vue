<script setup>
import { onMounted, ref } from 'vue'
import { NTabs, NTabPane } from 'naive-ui'
import { userGetFollowerAPI, userGetFollowingAPI } from '../../../apis/userAPIs'
import { useUserStore } from '@/stores/userStore'
import { handleError } from '@/utils/handleError.js'

const follower = ref(null)
const following = ref(null)
const loading = ref(true)
const userStore = useUserStore()
const followerList = ref([])
const followingList = ref([])

const fetchFollowerData = async () => {
  try {
    const result = await userGetFollowerAPI(userStore.user.uid)

    if (result || result.length > 0) {
      follower.value = result.data

      follower.value.forEach((item) => {
        if (item.users_followers_follower_idTousers) {
          const followerData = { ...item.users_followers_follower_idTousers }
          followerList.value.push(followerData)
        }
      })
    } else {
      follower.value = []
    }
  } catch {
    handleError()
  } finally {
    loading.value = false
  }
}

const fetchFollowingData = async () => {
  try {
    const result = await userGetFollowingAPI(userStore.user.uid)

    if (result || result.data.length > 0) {
      following.value = result.data

      following.value.forEach((item) => {
        if (item.users_followers_user_idTousers) {
          const followingData = { ...item.users_followers_user_idTousers }
          followingList.value.push(followingData)
        }
      })
    } else {
      following.value = []
      followingList.value = []
    }
  } catch {
    handleError()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFollowingData()
  fetchFollowerData()
})
</script>

<template>
  <div v-if="errorMessage">{{ errorMessage }}</div>
  <div v-else class="min-h-screen">
    <n-tabs type="segment" animated>
      <n-tab-pane name="chap1" tab="關注中">
        <div v-if="following">
          <div
            v-for="(following, index) in followingList"
            :key="index"
            class="followingArea my-5 flex"
          >
            <div class="me-5 max-w-[44px] max-h-[44px]">
              <img :src="following.photo_url" class="rounded-full self-center" />
            </div>
            <div>
              <div>{{ following.display_name }}</div>
              <div>{{ following.favorite_sentence }}</div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">還沒有關注中的人喔！</div>
      </n-tab-pane>
      <n-tab-pane name="chap2" tab="粉絲">
        <div v-if="follower.length > 0">
          <div
            v-for="follower in followerList"
            :key="follower.follower_id"
            class="followerArea my-5 flex"
          >
            <div class="me-5 max-w-[44px] max-h-[44px]">
              <img :src="follower.photo_url" class="rounded-full" />
            </div>
            <div>
              <div>{{ follower.display_name }}</div>
              <div>{{ follower.favorite_sentence }}</div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">還沒有粉絲喔😢</div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style scoped></style>
