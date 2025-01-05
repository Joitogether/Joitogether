<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { NTabs, NTabPane, NButton, useMessage } from 'naive-ui'
import {
  userGetFollowerAPI,
  userGetFollowingAPI,
  userFollowersAddAPI,
  userUnfollowersAPI,
} from '../../../apis/userAPIs'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { handleError } from '@/utils/handleError.js'

const message = useMessage()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const owenerFollowerList = ref([])
const owenerFollowingList = ref([])
const id = route.params.uid
const guestFollowing = ref(null)
const guestFollowingList = ref([])
const activeTab = ref('chapt1')

const unFollowFans = async (user) => {
  try {
    await userUnfollowersAPI(user.id)
    user.isFollowing = false
    await fetchFollowerData()
  } catch (error) {
    handleError(message, undefined, error)
  }
}
// 當前頁面的使用者追蹤資料＋登入中的使用者追蹤資料
const fetchFollowerData = async () => {
  try {
    const [owenerFollowerResponse, owenerFollowingResponse, guestFollowingResponse] =
      await Promise.all([
        userGetFollowerAPI(id),
        userGetFollowingAPI(id),
        userGetFollowingAPI(userStore.user.uid),
      ])

    if (owenerFollowingResponse.length > 0) {
      owenerFollowingList.value = owenerFollowingResponse.map((item) => {
        const userData = item.users_followers_user_idTousers

        return {
          id: item.id,
          user_id: item.user_id,
          display_name: userData.display_name,
          favorite_sentence: userData.favorite_sentence,
          photo_url: userData.photo_url,
          isFollowing: item.isFollowing,
        }
      })
    }

    if (owenerFollowerResponse.length > 0) {
      // 此頁面的人的粉絲
      const followerSet = new Set(owenerFollowingResponse.map((item) => item.user_id))

      // 將粉絲資料轉換為所需格式並處理 isFollowing 和 guestFollowing
      owenerFollowerList.value = owenerFollowerResponse.map((item) => {
        const followerData = item.users_followers_follower_idTousers

        return {
          id: item.id,
          display_name: followerData.display_name,
          favorite_sentence: followerData.favorite_sentence,
          photo_url: followerData.photo_url,
          follower_id: item.follower_id,
          isFollowing: followerSet.has(item.follower_id),
          guestFollowing: false,
        }
      })
    }

    if (guestFollowingResponse.length > 0) {
      // 來到此頁面的使用者的追蹤名單
      guestFollowingList.value = guestFollowingResponse
      const guestFollowerSet = new Set(owenerFollowerList.value.map((item) => item.follower_id))
      const guestFollowingSet = new Set(owenerFollowingList.value.map((item) => item.user_id))

      const commonFollowerInFansPage = new Set(
        guestFollowingList.value
          .filter((item) => guestFollowerSet.has(item.user_id))
          .map((item) => item.user_id),
      )
      const commonFollowerInFollowingPage = new Set(
        guestFollowingList.value
          .filter((item) => guestFollowingSet.has(item.user_id))
          .map((item) => item.user_id),
      )

      // 若存在於 followerSet 中，則新增 guestFollowing 欄位
      owenerFollowerList.value.forEach((follower) => {
        if (commonFollowerInFansPage.has(follower.follower_id)) {
          follower.guestFollowing = true
        } else {
          follower.guestFollowing = false
        }
      })
      guestFollowing.value = guestFollowingList.value.filter((item) =>
        commonFollowerInFansPage.has(item.user_id),
      )

      owenerFollowingList.value.forEach((following) => {
        if (commonFollowerInFollowingPage.has(following.user_id)) {
          following.guestFollowing = true
        } else {
          following.guestFollowing = false
        }
      })
    }
  } catch (error) {
    handleError(message, undefined, error)
  }
}
// 本人看到自己頁面的關注中區域按鈕
const toggleFollow = async (user) => {
  try {
    if (user.isFollowing) {
      await userUnfollowersAPI(user.id)
      await fetchFollowerData()
    } else {
      await userFollowersAddAPI({
        user_id: user.follower_id,
        follower_id: id,
      })
      user.isFollowing = true
      await fetchFollowerData()
    }
  } catch (error) {
    handleError(message, undefined, error)
  }
}

//本人看到自己頁面的粉絲區域按鈕
const fansPageToggleFollow = async (user) => {
  if (user.isFollowing) {
    const findResult = owenerFollowingList.value.find(
      (following) => following.user_id === user.follower_id,
    )
    user.isFollowing = false
    await userUnfollowersAPI(findResult.id)
    await nextTick()
  } else {
    await userFollowersAddAPI({
      user_id: user.follower_id,
      follower_id: id,
    })
    user.isFollowing = true
  }
  await fetchFollowerData()
}

// 他人看到他人頁面的追蹤按鈕
const guestsToggleFollow = async (follower) => {
  //判斷他人在哪個頁面觸發追蹤按鈕
  if (activeTab.value === 'chap1') {
    if (follower.guestFollowing) {
      const chap1UnfollowGuestId = guestFollowingList.value.find(
        (list) => list.user_id == follower.user_id,
      )?.id
      await userUnfollowersAPI(chap1UnfollowGuestId)
      follower.guestFollowing = false
    } else {
      await userFollowersAddAPI({
        user_id: follower.user_id,
        follower_id: userStore.user.uid,
      })
      follower.guestFollowing = true
    }
  }

  if (activeTab.value === 'chap2') {
    if (follower.guestFollowing) {
      const chap2UnFollowGuestId = guestFollowingList.value.find(
        (list) => list.user_id == follower.follower_id,
      )?.id

      await userUnfollowersAPI(chap2UnFollowGuestId)
      follower.guestFollowing = false
    } else {
      await userFollowersAddAPI({
        user_id: follower.follower_id,
        follower_id: userStore.user.uid,
      })
      follower.guestFollowing = true
    }
  }
  fetchFollowerData()
}
watch(
  () => route.params.uid,
  () => {
    fetchFollowerData()
  },
)
onMounted(() => {
  fetchFollowerData()
  activeTab.value = 'chap1'
})
</script>

<template>
  <div class="min-h-screen">
    <n-tabs type="segment" animated v-model:value="activeTab">
      <n-tab-pane name="chap1" tab="關注中">
        <div v-if="owenerFollowingList.length > 0">
          <div
            v-for="following in owenerFollowingList"
            :key="following.user_id"
            class="followerArea my-5 flex justify-between"
          >
            <div class="flex ml-5 items-center">
              <div
                class="me-5 w-20 h-20 max-w-[44px] max-h-[44px] rounded-full overflow-hidden flex-shrink-0 cursor-pointer"
                @click="router.push({ name: 'personInfo', params: { uid: following.user_id } })"
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
                v-if="userStore.user.uid == id"
                :type="following.isFollowing ? 'default' : 'info'"
                @click="toggleFollow(following)"
              >
                {{ following.isFollowing ? '追蹤中' : '追蹤' }}
              </n-button>
              <n-button
                v-else-if="following.user_id !== userStore.user.uid"
                :type="following.guestFollowing ? 'default' : 'info'"
                @click="guestsToggleFollow(following)"
              >
                {{ following.guestFollowing ? '追蹤中' : '追蹤' }}
              </n-button>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">還沒有關注中的人喔！</div>
      </n-tab-pane>
      <n-tab-pane name="chap2" tab="粉絲">
        <div v-if="owenerFollowerList.length > 0">
          <div
            v-for="follower in owenerFollowerList"
            :key="follower.id"
            class="followerArea my-5 flex justify-between"
          >
            <div class="flex ml-5 items-center">
              <div class="flex mr-5 items-center">
                <n-button
                  v-if="userStore.user.uid == id"
                  :type="follower.isFollowing ? 'default' : 'info'"
                  @click="unFollowFans(follower)"
                >
                  X
                </n-button>
              </div>
              <div
                class="me-5 w-20 h-20 max-w-[44px] max-h-[44px] rounded-full overflow-hidden flex-shrink-0 cursor-pointer"
                @click="router.push({ name: 'personInfo', params: { uid: follower.follower_id } })"
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
                v-if="userStore.user.uid == id"
                :type="follower.isFollowing ? 'default' : 'info'"
                @click="fansPageToggleFollow(follower)"
              >
                {{ follower.isFollowing ? '追蹤中' : '追蹤' }}
              </n-button>
              <n-button
                v-else-if="follower.follower_id !== userStore.user.uid"
                :type="follower.guestFollowing ? 'default' : 'info'"
                @click="guestsToggleFollow(follower)"
              >
                {{ follower.guestFollowing ? '追蹤中' : '追蹤' }}
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
