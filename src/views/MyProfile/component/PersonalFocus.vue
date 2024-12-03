<script setup>
import { UserGetApi } from '../../../../apis/UserApi'
import { reactive, ref } from 'vue'
import { NTabs, NTabPane, NDivider } from 'naive-ui'

const followingList = reactive([
  {
    userId: 1,
    imgUrl: 'https://img.lovepik.com/element/40080/7463.png_300.png',
    userName: '王大錘',
    think: '我好帥',
  },
  {
    userId: 2,
    imgUrl: 'https://img.lovepik.com/element/40116/7316.png_300.png',
    userName: '張大仙',
    think: '想交朋友',
  },
  {
    userId: 3,
    imgUrl: 'https://img.lovepik.com/element/40253/7513.png_300.png',
    userName: '劉大吉',
    think: '請多多追隨',
  },
])

const followerList = reactive([
  {
    userId: 1,
    imgUrl:
      'https://img.lovepik.com/free_png/32/25/61/59758PIC7z1fa7i86bqr58PIC_PIC2018.png_300.png',
    userName: '彭大海',
    think: '今天很想跟朋友一起出門',
  },
  {
    userId: 2,
    imgUrl: 'https://img.lovepik.com/photo/45014/5426.jpg_wh300.jpg',
    userName: '謝小夜',
    think: '大家好像都玩得很開心',
  },
  {
    userId: 3,
    imgUrl:
      'https://img.lovepik.com/png/20231023/Cute-cartoon-pink-hairball-pig-rabbit-monster-tooth-ear_322945_wh300.png',
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
                <div class="me-5 max-w-[44px] max-h-[44px]">
                  <img :src="userFollowingList.imgUrl" class="rounded-full self-center" />
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
              <div class="me-5 max-w-[44px] max-h-[44px]">
                <img :src="userFollowerList.imgUrl" class="rounded-full" />
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
