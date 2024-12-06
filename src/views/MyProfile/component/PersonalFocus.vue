<script setup>
import { onMounted, ref } from 'vue'
import { NTabs, NTabPane, NDivider } from 'naive-ui'
import { UserGetFollowerApi } from '../../../apis/UserApi'
import { useUserStore } from '@/stores/userStore';

const follower = ref(null);
const loading = ref(true);
const errorMessage = ref(null);
const userStore = useUserStore()

const fetchFollowerData = async () => {
  try {
    const result = await UserGetFollowerApi(userStore.user.uid);
    console.log('follower回傳資料:', result);

    if (result) {
      follower.value = result;
      loading.value = false;
      return follower.value
    }
  } catch (err) {
    errorMessage.value = err.message || '資料加載錯誤';
    loading.value = false;
  }
    }

const fetchFollowingData = async () => {
  try {
    const result = await UserGetFollowerApi(userStore.user.uid);
    console.log('following回傳資料:', result);

    if (result) {
      follower.value = result;
      loading.value = false;
      return follower.value
    }
  } catch (err) {
  errorMessage.value = err.message || '資料加載錯誤';
  loading.value = false;
  }
}


onMounted(() => {
  fetchFollowerData();
  fetchFollowingData()

})


</script>

<template>
  <n-divider />
  <div class="mx-6">
    <n-tabs type="segment" animated>
      <n-tab-pane name="chap1" tab="關注中">
        <div>
          <div
            class="my-5"
          >
            <div>
              <a class="flex" href="">
                <div class="me-5 max-w-[44px] max-h-[44px]">
                  <img class="rounded-full self-center" />
                </div>
                <div>
                  {{ follower }}
                  <!-- <div>{{ userFollowingList.userName }}</div> -->
                  <!-- <div>{{ userFollowingList.think }}</div> -->
                </div>
              </a>
            </div>
          </div>
        </div>
      </n-tab-pane>
      <n-tab-pane name="chap2" tab="粉絲">
        <div>
          <div class="my-5" >
            <div class="flex">
              <div class="me-5 max-w-[44px] max-h-[44px]">
                <img class="rounded-full" />
              </div>
              <div>
                <!-- <div>{{ userFollowerList.userName }}</div> -->
                <!-- <div>{{ userFollowerList.think }}</div> -->
              </div>
            </div>
          </div>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style scoped>
.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px;
}
</style>
