<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { NTabs, NTabPane } from 'naive-ui'
import {
  userGetFollowerAPI,
  userGetFollowingAPI,
  userFollowersAddAPI,
  userUnfollowersAPI,
} from '../../../apis/userAPIs'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const followerList = ref([])
const followingList = ref('')

const toggleFollow = async (user) => {
  try {
    if (user.isFollowing) {
      await userUnfollowersAPI(user.id)
      await fetchFollowerData()
    } else {
      // 添加追踪
      await userFollowersAddAPI({
        user_id: user.follower_id,
        follower_id: userStore.user.uid,
      })
      user.isFollowing = true
      await fetchFollowerData()
    }
  } catch (error) {
    console.error('操作失敗', error)
  }
}

const unFollowFans = async (user) => {
  await userUnfollowersAPI(user.id)
  user.isFollowing = false
  await fetchFollowerData()
}

const fetchFollowerData = async () => {
  const [followerResponse, followingResponse] = await Promise.all([
    userGetFollowerAPI(userStore.user.uid),
    userGetFollowingAPI(userStore.user.uid),
  ])
  followingList.value = followingResponse.data.map((item) => {
    const userData = item.users_followers_user_idTousers

    return {
      id: item.id,
      user_id: item.user_id,
      display_name: userData.display_name,
      favorite_sentence: userData.favorite_sentence,
      photo_url: userData.photo_url,
      isFollowing: item.isFollowing, // 是否在「粉絲」中
    }
  })

  if (followerResponse) {
    followerList.value = followerResponse.data
    const followerSet = new Set(followingResponse.data.map((item) => item.user_id))

    followerList.value.forEach((follower) => {
      follower.isFollowing = followerSet.has(follower.follower_id)
    })
  }
}

const fansPageToggleFollow = async (user) => {
  if (user.user_id && user.isFollowing) {
    // 取消追踪
    const findResult = followingList.value.find(
      (following) => following.user_id === user.follower_id,
    )
    user.isFollowing = false
    await userUnfollowersAPI(findResult.id)
    await nextTick()
    await fetchFollowerData()
  } else {
    // 添加追踪
    await userFollowersAddAPI({
      user_id: user.follower_id,
      follower_id: userStore.user.uid,
    })

    // 更新狀態
    user.isFollowing = true

    // 同步資料
    await fetchFollowerData()
  }
}

onMounted(() => {
  fetchFollowerData()
})
</script>

<template>
  <div v-if="errorMessage">{{ errorMessage }}</div>
  <div v-else class="min-h-screen">
    <n-tabs type="segment" animated>
      <n-tab-pane name="chap1" tab="關注中">
        <div v-if="followingList.length > 0">
          <div
            v-for="following in followingList"
            :key="following.user_id"
            class="followerArea my-5 flex justify-between"
          >
            <div class="flex ml-5 items-center">
              <div
                class="me-5 w-20 h-20 max-w-[44px] max-h-[44px] rounded-full overflow-hidden flex-shrink-0"
              >
                <img :src="following.photo_url" class="w-full h-full object-cover" />
              </div>
              <div>
                <div>{{ following.display_name }}</div>
                <div>{{ following.favorite_sentence }}</div>
              </div>
            </div>
            <div class="flex mr-5 items-center">
              <n-button
                :type="following.isFollowing ? 'default' : 'info'"
                @click="toggleFollow(following)"
              >
                {{ following.isFollowing ? '取消追蹤' : '追蹤' }}
              </n-button>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">還沒有關注中的人喔！</div>
      </n-tab-pane>
      <n-tab-pane name="chap2" tab="粉絲">
        <div v-if="followerList.length > 0">
          <div
            v-for="follower in followerList"
            :key="follower.follower_id"
            class="followerArea my-5 flex justify-between"
          >
            <div class="flex ml-5 items-center">
              <div class="flex mr-5 items-center">
                <n-button
                  :type="follower.isFollowing ? 'default' : 'info'"
                  @click="unFollowFans(follower)"
                >
                  X
                </n-button>
              </div>
              <div
                class="me-5 w-20 h-20 max-w-[44px] max-h-[44px] rounded-full overflow-hidden flex-shrink-0"
              >
                <img
                  :src="follower.users_followers_follower_idTousers.photo_url"
                  class="w-full h-full object-cover"
                />
              </div>
              <div>
                <div>{{ follower.users_followers_follower_idTousers.display_name }}</div>
                <div>{{ follower.users_followers_follower_idTousers.favorite_sentence }}</div>
              </div>
            </div>
            <div class="flex mr-5 items-center">
              <n-button
                :type="follower.isFollowing ? 'default' : 'info'"
                @click="
                  () => {
                    fansPageToggleFollow(follower)
                  }
                "
              >
                {{ follower.isFollowing ? '追蹤中' : '追蹤' }}
              </n-button>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">還沒有粉絲喔😢</div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style scoped></style>
