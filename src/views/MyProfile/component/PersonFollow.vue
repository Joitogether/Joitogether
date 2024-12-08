<script setup>
import { onMounted, ref } from 'vue'
import { NTabs, NTabPane, NSpin } from 'naive-ui'
import { UserGetFollowerApi, UserGetFollowingApi } from '../../../apis/UserApi'
import { useUserStore } from '@/stores/userStore';

const follower = ref(null);
const following = ref(null)
const loading = ref(true);
const errorMessage = ref(null);
const userStore = useUserStore()
const followerList = ref([])
const followingList = ref([])


const fetchFollowerData = async () => {
  try {
    const result = await UserGetFollowerApi(userStore.user.uid)
    if (result) {
      follower.value = result.data

      follower.value.map((item) => {
      if (item.users_followers_follower_idTousers){
        const followerData = JSON.parse(JSON.stringify(item.users_followers_follower_idTousers));
        followerList.value.push(followerData)
      } else {
        return errorMessage.value
      }
    })
    }
  } catch (err) {
    errorMessage.value = err.message || '資料加載錯誤';
    loading.value = false;
  }
    }

const fetchFollowingData = async () => {
  try {
    const result = await UserGetFollowingApi(userStore.user.uid);

    if (result) {
      following.value = result.data
      following.value.map((item) => {
        if(item.users_followers_user_idTousers) {
          const followingData = JSON.parse(JSON.stringify(item.users_followers_user_idTousers));
          followingList.value.push(followingData)
          loading.value = false
        } else {
          return errorMessage.value
        }
      })

    }
  } catch (err) {
  errorMessage.value = err.message || '資料加載錯誤';
  loading.value = false;
  }
}


onMounted(() => {
  fetchFollowingData()
  fetchFollowerData();

})


</script>

<template>
  <div v-if="loading">
    <n-spin size="medium" />
    資料正在跑來的路上...
  </div>
  <div v-else-if="errorMessage">{{ errorMessage }}</div>
  <div v-else class="mx-6 py-6">
    <n-tabs type="segment" animated>
      <n-tab-pane name="chap1" tab="關注中">
        <div v-for="(following, index) in followingList" :key="index" class="followingArea my-5 flex">
            <div class="me-5 max-w-[44px] max-h-[44px]">
              <img :src="following.photo_url" class="rounded-full self-center" />
            </div>
            <div>
              <div>{{ following.display_name }}</div>
              <div>{{ following.favorite_sentence }}</div>
            </div>
        </div>
      </n-tab-pane>
      <n-tab-pane name="chap2" tab="粉絲">
        <div v-for="follower in followerList" :key="follower.follower_id" class="followerArea my-5 flex">
          <div class="me-5 max-w-[44px] max-h-[44px]">
            <img :src="follower.photo_url" class="rounded-full" />
          </div>
          <div>
            <div>{{ follower.display_name }}</div>
            <div>{{ follower.favorite_sentence }}</div>
          </div>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style scoped>

</style>
