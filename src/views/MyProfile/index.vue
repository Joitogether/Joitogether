<script setup>
import { ref } from 'vue';
import { NButton, NModal, NCard, NUpload, NInput, NStep, NSpace, NSteps, NInputNumber, NDynamicTags } from 'naive-ui';
import { ProfileCircle, BrightStar, Heart, Post, Group, ArrowLeft, ArrowRight } from '@iconoir/vue';
import { RouterLink, RouterView } from 'vue-router'
import userInfo from '@/views/MyProfile/component/person'

let showModal = ref(false)

const currentRef = ref(1)
const currentStatus = ref("process");

const tags = ref(["棒球迷","環遊世界"])

// `next` 方法
const next = () => {
  if (currentRef.value === 1) {
    currentRef.value = 2;
  } else if (currentRef.value === 2) {
    currentRef.value = 1;
  }
};


// `prev` 方法
const prev = () => {
  if (currentRef.value === 1) {
    currentRef.value = 2;
  } else if (currentRef.value === 2) {
    currentRef.value = 1;
  }
};

function sendPersonInfo() {

}

</script>

<template>
  <div class="container mx-auto ">
    <div class=" card-container border rounded-lg overflow-hidden bg-white">
      <div class="img-container w-full">
        <img class="card-img w-full h-full object-cover" :src="userInfo.photoURL" alt="userPhoto"/>
      </div>
      <div class="card-content-container   p-5">
        <h3 class="user-name text-2xl text-center font-bold">{{ userInfo.name }}</h3>
        <div class="text-md font-bold ">
          <span>{{ userInfo.city }}</span>
          <span> • {{ userInfo.age }}</span>
          <span> • {{ userInfo.job }}</span>
        </div>
        <p class="user-description text-2xl font-bold mt-1 md:mb-5">: {{ userInfo.shortDescription}}</p>
        <div class="btn-container flex gap-2 mt-8 mb-8">
          <n-button @click="showModal = true" type="primary" ghost class="flex-[2_2_0%]" round >編輯檔案</n-button>
          <n-modal v-model:show="showModal">
            <n-card
              style="width: 600px"
              title="編輯檔案中..."
              :bordered="false"
              size="huge"
              role="dialog"
              aria-modal="true"
            >
                <input type="checkbox" id="slide1" class="hidden" checked>
                <input type="checkbox" id="slide2" class="hidden">
                <div id="target1" class="innerPart_1" v-show="currentRef === 1">
                  <div class="flex mt-5 flex-wrap">暱稱：<n-input placeholder="朋友都如何稱呼你？" /></div>
                  <div class="flex mt-5 flex-wrap">年齡：<n-input-number v-model:value="value" clearable placeholder="年齡不是問題"/></div>
                  <div class="flex mt-5 flex-wrap">職業：<n-input placeholder="什麼領域的呢？" /></div>
                  <div class="flex mt-5 flex-wrap">喜歡的一句話：<n-input placeholder="例如：我要發大財" /></div>
                  <div class="flex mt-5 flex-wrap">個性標籤：<n-dynamic-tags v-model:value="tags" :max="6" /></div>
                </div>
                <div id="target2" class="innerPart_2" v-show="currentRef === 2">
                  <div class="photosupload">
                    <p>上傳兩張生活照</p>
                    <n-upload
                      action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
                      :default-file-list="previewFileList"
                      list-type="image-card"
                      @preview="handlePreview"
                      max="2"
                    />
                    <!-- <n-modal
                      v-model:show="showModal"
                      preset="card"
                      style="width: 600px"
                      title="一张很酷的图片"
                    >
                      <img :src="previewImageUrl" style="width: 100%">
                    </n-modal> -->
                  </div>
                  <div class="selfIntro">
                    <n-space vertical>
                    <div class="flex mt-5 flex-wrap">自我介紹：
                      <n-input
                      placeholder="介紹一下你自己吧"
                      v-model:value="value"
                      type="textarea"/>
                    </div>
                    <div class="flex mt-5 flex-wrap">星座：<n-input placeholder="沒有博愛座喔" /></div>
                    <div class="flex mt-5 flex-wrap">嗜好：<n-input placeholder="放假喜歡做什麼呢？" /></div>
                    <div class="flex mt-5 flex-wrap">專長：<n-input placeholder="很會睡也可以是專長（？" /></div>
                    <div class="flex mt-5 flex-wrap">感興趣的活動：<n-input placeholder="幫助你找到志同道合的朋友喔！" /></div>
                    </n-space>
                  </div>
                </div>


              <div class="footer mt-10">
                <n-space vertical class="stepsArea">
                  <n-steps size="small" :current="currentRef" :status="currentStatus">
                    <n-step
                      title="50%"
                      description="完成一半囉！"
                    />
                    <n-step
                      title="99.99%"
                      description="就剩一點點了"
                    />
                  </n-steps>
                </n-space>
                <div class="arrowArea justify-center mt-10 custom-arrow flex gap-3">
                  <div class="arrowLeft border-2 border-solid rounded-full border-slate-500">
                    <label for="slide1" class="slide1 cursor-pointer">
                      <ArrowLeft @click="prev"/>
                    </label>
                  </div>
                  <div class="arrowRight border-2 border-solid rounded-full border-slate-500">
                    <label for="slide2" class="slide2 cursor-pointer">
                      <ArrowRight @click="next"/>
                    </label>
                  </div>
                </div>
                <div class="save flex gap-3 justify-end">
                  <n-button tertiary>改天再填</n-button>
                  <n-button strong secondary type="primary" @click="sendPersonInfo">填好啦！</n-button>
                </div>
              </div>
            </n-card>
          </n-modal>
        </div>
        <div class="tag-container flex gap-3 flex-wrap">
          <span v-for="item in userInfo.tags" :key="item.tags" class="border-2 px-3 py-1 rounded"># {{ item }}</span>
        </div>
      </div>
    </div>
    <div>
      <ul class="flex justify-between px-10 py-5">
        <li class="hover:cursor-pointer w-24" :class="{ 'border-b-4 border-solid border-green-600': $route.path === '/profile/personInfo' }">
            <RouterLink to="/profile/personInfo"><ProfileCircle class="justify-self-center"/></RouterLink>
        </li>
        <li class="hover:cursor-pointer w-24">
          <BrightStar class="justify-self-center"/>
        </li>
        <li class="hover:cursor-pointer w-24">
          <Heart class="justify-self-center"/>
        </li>
        <li class="hover:cursor-pointer w-24" :class="{ 'border-b-4 border-solid border-green-600': $route.path === '/profile/personpost' }">
          <RouterLink to="/profile/personpost"><Post class="justify-self-center"/></RouterLink>
        </li>
        <li class="hover:cursor-pointer w-24" :class="{ 'border-b-4 border-solid border-green-600': $route.path === '/profile/personActivity' }">
          <RouterLink to="/profile/personActivity"><Group class="justify-self-center"/></RouterLink>
        </li>
    </ul>

    </div>
    <div class="border">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>

.stepsArea{
  justify-content: center !important
}

/* 当前显示的内容 */
.innerPart_1[v-show="currentRef === 1"],
.innerPart_2[v-show="currentRef === 2"] {
  opacity: 1;
  transform: translateX(0);  /* 滑入效果 */
  z-index: 100;  /* 保证显示的部分在最前 */
}

/* 隐藏的内容 */
.innerPart_1[v-show="currentRef !== 1"],
.innerPart_2[v-show="currentRef !== 2"] {
  opacity: 0;
  transform: translateX(100%); /* 滑出效果 */
  z-index: 0;
}

@media screen and (width < 768px) {
  .container{
    max-width: 550px;
    box-sizing: border-box;
  }
}

@media screen and (width >= 768px) {
  .container {
    max-width: 80%;
  }

  .card-container {
    display: flex;
    padding: 2rem;
  }

  .img-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card-img {
    border-radius: 50%;
    aspect-ratio: 1 / 1;
    height: auto;
  }

  .card-content-container {
    flex: 3;
    padding: 0;
    padding-left: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .btn-container {
    margin-bottom: 0.5rem;
    margin-top: 0;
    width: 70%;
  }

  .user-name {
    text-align: start;
  }

  .user-description {
    font-size: 1rem;
    margin-top: -0.1rem;

  }
}

@media screen and (width >= 1024px) {

  .container {
    max-width: 880px;
  }

  .card-content-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }



}
</style>
