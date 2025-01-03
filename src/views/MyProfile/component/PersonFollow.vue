<script setup>
import { onMounted, ref } from 'vue'
import { NTabs, NTabPane } from 'naive-ui'
import {
  userGetFollowerAPI,
  userGetFollowingAPI,
  userFollowersAddAPI,
  userUnfollowersAPI,
} from '../../../apis/userAPIs'
import { useUserStore } from '@/stores/userStore'
import { handleError } from '@/utils/handleError.js'

const message = useMessage()
const follower = ref(null)
const following = ref(null)
const loading = ref(true)
const userStore = useUserStore()
const followerList = ref([])
const followingList = ref([])

const toggleFollow = async (user) => {
  try {
    if (user.isFollowing) {
      // 取消追蹤
      console.log(user)
      await userUnfollowersAPI(user.id)
      await Promise.all([fetchFollowerData(), fetchFollowingData()])
    } else {
      // 添加追蹤
      await userFollowersAddAPI({
        user_id: user.follower_id,
        follower_id: userStore.user.uid,
      })
      await Promise.all([fetchFollowerData(), fetchFollowingData()])
    }
  } catch (error) {
    console.error('操作失敗', error)
  }
}

const unFollowFans = async (user) => {
  try {
    await userUnfollowersAPI(user.id)
    user.isFollowing = false
    await Promise.all([fetchFollowerData(), fetchFollowingData()])
  } catch (error) {
    messageDark.error('取消追蹤失敗')
  }
}

const fetchFollowerData = async () => {
  try {
    const [followerResponse, followingResponse] = await Promise.all([
      userGetFollowerAPI(userStore.user.uid),
      userGetFollowingAPI(userStore.user.uid),
    ])

    const followingSet = new Set(followingResponse.data.map((item) => item.user_id))

    followerList.value = followerResponse.data.map((item) => {
      const userData = item.users_followers_follower_idTousers
      console.log(item)
      return {
        id: item.id,
        follower_id: item.follower_id,
        display_name: userData.display_name,
        favorite_sentence: userData.favorite_sentence,
        photo_url: userData.photo_url,
        isFollowing: followingSet.has(item.follower_id), // 是否在「關注中」
      }
    })
  } catch (error) {
    console.error(error)
    errorMessage.value = '獲取粉絲資料失敗'
  }
}

const fetchFollowingData = async () => {
  try {
    const [followerResponse, followingResponse] = await Promise.all([
      userGetFollowerAPI(userStore.user.uid),
      userGetFollowingAPI(userStore.user.uid),
    ])

    const followerSet = new Set(followerResponse.data.map((item) => item.follower_id))
    followingList.value = followingResponse.data.map((item) => {
      const userData = item.users_followers_user_idTousers
      console.log('aa', followerList.value)

      return {
        id: item.id,
        user_id: item.user_id,
        display_name: userData.display_name,
        favorite_sentence: userData.favorite_sentence,
        photo_url: userData.photo_url,
        isFollowing: item.isFollowing, // 是否在「粉絲」中
      }
    })
  } catch (error) {
    console.error(error)
    errorMessage.value = '獲取關注資料失敗'
  }
}

onMounted(() => {
  Promise.all([fetchFollowerData(), fetchFollowingData()]).then(() => {
    loading.value = false
  })
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
                取消追蹤
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
                <img :src="follower.photo_url" class="w-full h-full object-cover" />
              </div>
              <div>
                <div>{{ follower.display_name }}</div>
                <div>{{ follower.favorite_sentence }}</div>
              </div>
            </div>
            <div class="flex mr-5 items-center">
              <n-button
                :type="follower.isFollowing ? 'default' : 'info'"
                @click="toggleFollow(follower, true)"
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
