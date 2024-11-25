<script setup>
import { reactive, ref } from 'vue'
import { NTabs, NTabPane, NDivider } from 'naive-ui'

const followingList = reactive([
  {
    userId: 1,
    userName: '王大錘',
    think: '我好帥',
  },
  {
    userId: 2,
    userName: '張大仙',
    think: '想交朋友',
  },
  {
    userId: 3,
    userName: '劉大吉',
    think: '請多多追隨',
  },
])

const followerList = reactive([
  {
    userId: 1,
    userName: '彭大海',
    think: '今天很想跟朋友一起出門',
  },
  {
    userId: 2,
    userName: '謝小夜',
    think: '大家好像都玩得很開心',
  },
  {
    userId: 3,
    userName: '蔡大雞',
    think: '跨年要做什麼呢～？',
  },
])
</script>

<template>
  <n-divider />
  <div class="mx-6">
    <n-tabs type="segment" animated>
      <n-tab-pane name="chap1" tab="關注中">
        <div>
          <div
            class="my-5"
            v-for="userFollowingList in followingList"
            :key="userFollowingList.userId"
          >
            <div>
              <a class="flex" href="">
                <div class="me-5">
                  <img src="https://fakeimg.pl/44x44/200" class="rounded-full" />
                </div>
                <div>
                  <div>{{ userFollowingList.userName }}</div>
                  <div>{{ userFollowingList.think }}</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </n-tab-pane>
      <n-tab-pane name="chap2" tab="粉絲">
        <div>
          <div class="my-5" v-for="userFollowerList in followerList" :key="userFollowerList.userId">
            <div class="flex">
              <div class="me-5">
                <img src="https://fakeimg.pl/44x44/200" class="rounded-full" />
              </div>
              <div>
                <div>{{ userFollowerList.userName }}</div>
                <div>{{ userFollowerList.think }}</div>
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
