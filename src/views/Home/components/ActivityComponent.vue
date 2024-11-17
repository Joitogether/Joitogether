<script setup>

import { reactive } from 'vue'
const items = reactive([
    {
        id: 1,
        image: "/src/assets/UserUpdata1.jpg",
        title: "吃竹子",
        location: "110 臺北市信義區光復南路14號",
        dateTime: "星期六, 十一月 23日 15:00",
        userImage: "/src/assets/25231.png",
        user: "竹子",
        participants: 1,
    },
    {
        id: 2,
        image: "/src/assets/UserUpdata1.jpg",
        title: "吃桃子",
        location: "266 宜蘭縣三星鄉大隱十六路19號",
        dateTime: "星期六, 十一月 23日 15:00",
        userImage: "/src/assets/25231.png",
        user: "桃子",
        participants: 2,
    },
    {
        id: 3,
        image: "/src/assets/UserUpdata1.jpg",
        title: "吃李子",
        location: "981 花蓮縣玉里鎮建國四街15號",
        dateTime: "星期六, 十一月 23日 15:00",
        userImage: "/src/assets/25231.png",
        user: "李子",
        participants: 3,
    },
    {
        id: 4,
        image: "/src/assets/UserUpdata1.jpg",
        title: "吃瓜子",
        location: "台北市北投區",
        dateTime: "星期六, 十一月 23日 15:00",
        userImage: "/src/assets/25231.png",
        user: "瓜子",
        participants: 4,
    },
    {
        id: 5,
        image: "/src/assets/UserUpdata1.jpg",
        title: "看孫子",
        location: "台北市文山區",
        dateTime: "星期六, 十一月 23日 15:00",
        userImage: "/src/assets/25231.png",
        user: "孫子",
        participants: 5,
    },
    {
        id: 6,
        image: "/src/assets/UserUpdata1.jpg",
        title: "吃西瓜",
        location: "台北市中正區",
        dateTime: "星期六, 十一月 23日 15:00",
        userImage: "/src/assets/25231.png",
        user: "西瓜",
        participants: 6,
    },
    {
        id: 7,
        image: "/src/assets/UserUpdata1.jpg",
        title: "吃蘋果",
        location: "台北市大安區",
        dateTime: "星期六, 十一月 23日 15:00",
        userImage: "/src/assets/25231.png",
        user: "蘋果",
        participants: 7,
    },
    {
        id: 8,
        image: "/src/assets/UserUpdata1.jpg",
        title: "吃芒果",
        location: "台北市大安區",
        dateTime: "星期六, 十一月 23日 15:00",
        userImage: "/src/assets/25231.png",
        user: "芒果",
        participants: 8,
    },
    {
        id: 9,
        image: "/src/assets/UserUpdata1.jpg",
        title: "活動名稱2",
        location: "台北市大安區",
        dateTime: "星期六, 十一月 23日 15:00",
        userImage: "/src/assets/25231.png",
        user: "葡萄",
        participants: 9,
    },
    {
        id: 10,
        image: "/src/assets/UserUpdata1.jpg",
        title: "活動名稱2",
        location: "台北市大安區",
        dateTime: "星期六, 十一月 23日 15:00",
        userImage: "/src/assets/25231.png",
        user: "蘋果",
        participants: 10,
    },


])



</script>

<template>
    <main class="block max-w-7xl m-auto">
        <div class="text-3xl pt-40 font-bold leading-10	">啾團活動 </div>
        <div class="inline-flex	w-full pb-7 pt-7">
            <div class="inline-flex flex-wrap">
                <div class="mr-7 py-6 pl-3 text-sm " ><a href="#">美食</a></div>
                <div class="mr-7 py-6 pl-3 text-sm " ><a href="#">購物</a></div>
                <div class="mr-7 py-6 pl-3 text-sm " ><a href="#">旅遊</a></div>
                <div class="mr-7 py-6 pl-3 text-sm " ><a href="#">運動</a></div>
                <div class="mr-7 py-6 pl-3 text-sm " ><a href="#">娛樂</a></div>
                <div class="mr-7 py-6 pl-3 text-sm " ><a href="#">其他</a></div>
            </div>
        </div>
        <hr>
        <!-- 篩選器 -->
        <div class="mt-7 flex justify-between items-center">
            <div class="text-xl flex items-center  ">地區
                <span class="ml-1">▼</span>
            </div>
            <div class="text-xl flex items-center">篩選器
                <span class="ml-1">▼</span>
            </div>
       </div>

        <!-- 卡片區域 -->
        <div class="mt-7">
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                <div
                v-for="item in items"
                :key="item.id"
                class="rounded-2xl bg-transparent  overflow-hidden   mb-4">
                    <a href="#">
                        <img class="w-full h-48 object-cover" :src="item.image" alt="死圖">
                        <div class="mt-2 text-lg font-semibold mb-2 truncate ">活動名稱:{{ item.title }}</div>
                        <div class="text-sm  mb-2 truncate">地點:{{ item.location }}</div>
                        <div class="text-sm text-gray-500 mb-2 truncate">地點/時間:{{ item.dateTime }}</div>

                        <div class="flex items-center justify-between text-sm ">
                            <div class="flex items-center">
                                <img class="w-6 h-6 rounded-full mr-2" :src="item.userImage" alt="團主頭像">
                                <span>{{ item.user }}</span>
                            </div>
                            <div class="flex items-center">
                                    報名人數:{{ item.participants }}
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </main>

</template>

<style scoped>




</style>
