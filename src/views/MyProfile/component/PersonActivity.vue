<script setup>
import { reactive, ref } from 'vue';
import { NEllipsis } from 'naive-ui';


const today = new Date()

const activityList = reactive([
  {
    id: 1,
    name: "電腦遊戲比賽",
    location: "臺北市大安區忠孝東路四段178號8樓",
    startDate: "2024-12-16",
    startTime: "19:40",
    imageUrl: "https://www.lifetoutiao.news/wp-content/uploads/2022/10/%E5%9C%963.jpg"
  },
  {
    id: 2,
    name: "一起玩大富翁",
    location: "臺北市大安區忠孝東路四段178號8樓",
    startDate: "2024-11-10",
    startTime: "10:00",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReUu0_Pm778GeJv1D5MmDBiY5EMY2M_9wzNw&s"
  },
  {
    id: 3,
    name: "一起去shopping",
    location: "臺北市大安區忠孝東路四段178號8樓",
    startDate: "2024-11-15",
    startTime: "08:30",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI6JPRunS3CpvVKggiR9PjqG3SS-qpqANw_g&s"
  },
  {
    id: 4,
    name: "一起去新北耶誕城",
    location: "板橋區新北市政府",
    startDate: "2024-12-25",
    startTime: "18:00",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr-DCWj5LTt1sMyo1R-m3P7T36oQoKU1a-lQ&s"
  }
])
activityList.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

const beforeToday = activityList.filter(item => {
  const itemDate = new Date(item.startDate);
  return itemDate < today;
});
const afterToday = ref(activityList.filter(item => {
  const itemDate = new Date(item.startDate);
  return itemDate > today;
}));

</script>

<template>
<div class="partyArea pb-10">
  <div class="h-20 content-center text-center bg-slate-100 text-lg">即將參加</div>
  <div v-for="item in afterToday" :key="item.id" class="future-party grid grid-cols-3 gap-10 mt-10 sm:px-14 px-9">
    <div class="future-party-photo overflow-hidden flex max-h-40">
      <img :src="item.imageUrl" alt="future-party-photo" class="object-contain">
    </div>
    <div class="future-party-detail col-span-2">
      <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
        <h3 class="text-3xl font-bold">{{ item.name }}</h3>
      </n-ellipsis>
      <br/>
      <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
        <div class="text-xl">{{ item.location }}</div>
      </n-ellipsis>
      <br/>
      <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
        <div class="text-xl">{{ item.startDate }}</div>
      </n-ellipsis>
      <div class="text-xl">{{ item.startTime }}</div>
    </div>
  </div>

  <div class="h-20 content-center text-center bg-slate-100 text-lg mt-10">聚會紀錄</div>
  <div v-for="item in beforeToday" :key="item.id" class="past-party grid grid-cols-3 gap-10 mt-10 sm:px-14 px-9 overflow-hidden">
    <div class="past-party-photo overflow-hidden flex max-h-40">
      <img :src="item.imageUrl" alt="past-party-photo" class="object-contain">
    </div>
    <div class="past-party-detail col-span-2">
      <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
        <h3 class="text-3xl font-bold">{{ item.name }}</h3>
      </n-ellipsis>
      <br/>
      <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
        <div class="text-xl">{{ item.location }}</div>
      </n-ellipsis>
      <br/>
      <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
        <div class="text-xl">{{ item.startDate }}</div>
      </n-ellipsis>
      <div class="text-xl">{{ item.startTime }}</div>
    </div>
  </div>
</div>

</template>
