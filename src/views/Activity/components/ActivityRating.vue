<script setup>
import {} from 'naive-ui'
import { CheckCircle, CheckCircleSolid, Heart, HeartSolid } from '@iconoir/vue'
</script>

<template>
  <body class="bg-gray-50 p-10">
    <!-- 活動評價 -->
    <div
      class="flex flex-col w-[1024px] m-auto p-5 bg-gray-100 rounded-2xl border-2 border-gray-200"
    >
      <div
        class="relative px-5 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-2 before: before:bg-blue-500"
      >
        <div class="text-lg"><Search />活動評價</div>
        <div class="text-gray-600 text-xl font-bold">本次活動評價</div>
      </div>

      <!-- 評分進度 -->
      <div
        class="flex flex-row w-[300px] justify-around m-auto bg-white border-2 p-1 my-3 rounded-full"
      >
        <div>
          <!-- 團主評價到此頁面的進度顯示-->
          <div class="flex justify-center items-center text-blue-600 font-bold tracking-widest">
            <CheckCircleSolid class="mr-1" />團主評價
          </div>
        </div>
        <div>
          <!-- 團主評價還沒到此頁面的進度顯示 -->
          <div class="flex justify-center items-center text-gray-300 font-bold tracking-widest">
            <CheckCircle class="mr-1" />完成
          </div>
          <!-- 完成的介面的進度顯示 -->
          <!-- <div class="flex justify-center items-center text-blue-600 font-bold tracking-widest"><CheckCircleSolid class="mr-1" />完成</div> -->
        </div>
      </div>
      <!-- 活動區域 -->
      <div class="flex w-full">
        <!-- 照片 -->
        <div class="flex w-2/3">
          <img src="https://fakeimg.pl/640x360/cccccc" class="w-full h-auto object-contain" />
        </div>
        <!-- 活動資訊 -->
        <div class="w-1/3 ml-2">
          <div class="text-xs">
            <div class="">
              <div class="">活動名稱：</div>
              <div class="">一起去旅遊</div>
            </div>
            <div class="mt-2">
              <div class="">活動日期：</div>
              <div class="">2024/12/12</div>
            </div>
            <div class="mt-2">
              <div class="">團主：</div>
              <div class="">阿里山獵犬</div>
            </div>
          </div>
          <!-- 團主評價 -->
          <div class="mt-2 p-3 text-xs bg-white rounded-xl border-2 border-gray-200">
            <div class="">團主評價</div>
            <div class="flex justify-between bg-gray-200 px-3 py-1 my-2 rounded-full">
              <div class="flex items-center">親切度</div>
              <div class="flex items-center">
                <div class="flex w-20 text-red-700">
                  <HeartSolid /><HeartSolid /><HeartSolid /><HeartSolid /><HeartSolid />
                </div>
                <div class="mx-2 text-xs">4.8 / 5.0</div>
              </div>
            </div>
            <div class="flex justify-between bg-gray-200 px-3 py-1 mb-2 rounded-full">
              <div class="flex items-center">主辦能力</div>
              <div class="flex items-center">
                <div class="flex w-20 text-red-700">
                  <HeartSolid /><HeartSolid /><HeartSolid /><HeartSolid /><HeartSolid />
                </div>
                <div class="mx-2 text-xs">4.8 / 5.0</div>
              </div>
            </div>
            <div class="flex justify-between bg-gray-200 px-3 py-1 mb-2 rounded-full">
              <div class="flex items-center">信用度</div>
              <div class="flex items-center">
                <div class="flex w-20 text-red-700">
                  <HeartSolid /><HeartSolid /><HeartSolid /><HeartSolid /><HeartSolid />
                </div>
                <div class="mx-2 text-xs">4.8 / 5.0</div>
              </div>
            </div>

            <div class="mt-3 text-xs font-bold text-gray-600">團主近期評價內容</div>
            <div class="mt-1 p-2 bg-gray-200 rounded-xl item">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <img src="https://fakeimg.pl/60x60/aaaaaa" class="w-6 rounded-full" />
                  <div class="mx-2 text-xs">東方快遞</div>
                </div>
                <div class="flex flex-col items-center">
                  <div class="flex w-full px-1 h-4 text-red-700 justify-between items-center">
                    <HeartSolid class="w-2.5" /><HeartSolid class="w-2.5" /><HeartSolid
                      class="w-2.5"
                    /><HeartSolid class="w-2.5" /><HeartSolid class="w-2.5" />
                  </div>
                  <div class="mx-1 text-[10px]">2024/12/14</div>
                </div>
              </div>
              <div class="text-xs tracking-wider truncate mt-2">
                團主真的超用心的，上次跟他去吃鷄肉飯還不用花錢，而且都介紹很强的小吃，真的很推啦!!
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 用戶在填寫團主評價的資訊 -->
      <div class="mt-5">
        <div>用戶：</div>
        <div class="flex items-center mt-2">
          <img
            src="https://fakeimg.pl/60x60/aaaaaa"
            class="w-10 rounded-full border-2 border-white"
          />
          <div class="mx-2">南港燒臘王</div>
        </div>
        <div class="flex mt-3 px-14">
          <div class="text-base w-full">您對於本次揪團的評價為</div>
          <div class="flex w-24 text-red-700">
            <HeartSolid /><HeartSolid /><HeartSolid /><HeartSolid /><HeartSolid />
          </div>
        </div>
        <div class="flex mt-3 px-14">
          <div class="text-base w-full">團主的親切度，您願意給到幾分呢？</div>
          <div class="flex w-24 text-red-700">
            <HeartSolid /><HeartSolid /><HeartSolid /><HeartSolid /><HeartSolid />
          </div>
        </div>
        <div class="flex mt-3 px-14">
          <div class="text-base w-full">團主的主辦能力，您願意給到幾分呢？</div>
          <div class="flex w-24 text-red-700">
            <HeartSolid /><HeartSolid /><HeartSolid /><HeartSolid /><HeartSolid />
          </div>
        </div>
        <div class="flex mt-3 px-14">
          <div class="text-base w-full">團主的信用度，您願意給到幾分呢？</div>
          <div class="flex w-24 text-red-700">
            <HeartSolid /><HeartSolid /><HeartSolid /><HeartSolid /><HeartSolid />
          </div>
        </div>

        <div class="flex flex-col mt-5">
          <label for="ThingsYouWantToSay">留下您想對團主說的話：</label>
          <textarea
            class="h-28 border-2 border-gray-300 rounded-md resize-none p-2"
            name="ThingsYouWantToSay"
            id="ThingsYouWantToSay"
            maxlength="200"
            placeholder="該選項為選填，如果沒有特別想留下的話~那就下一步吧"
          ></textarea>
        </div>
        <div class="flex justify-end items-center mt-3">
          <!-- /* 正常輸入會顯示的 */ -->
          <div class="flex mx-3">
            <div>159</div>
            <div>/</div>
            <div>200</div>
          </div>
          <!-- 超過字數上限顯示 -->
          <div class="flex text-red-700 mx-3">
            <div>200</div>
            <div>/</div>
            <div>200</div>
            <div>話太多字數已達上線啦！</div>
          </div>
          <n-button type="info" class="px-5 tracking-widest">送出</n-button>
        </div>
      </div>

      <!-- 完成的介面 -->
      <div class="flex flex-col justify-center items-center">
        <div class="flex flex-col items-center">
          <div class="text-3xl text-gray-800 font-bold">感謝您本次的評價！</div>
          <div class="text-3xl text-gray-800 font-bold my-3">積分將匯入您的帳戶中！</div>
        </div>
        <div class="flex items-center w-2/3 h-20 justify-evenly">
          <n-button type="info" class="w-32 tracking-widest text-base py-5">返回首頁</n-button>
          <n-button type="info" class="w-32 tracking-widest text-base py-5">前往個人頁</n-button>
          <n-button type="info" class="w-32 tracking-widest text-base py-5">前往任務中心</n-button>
        </div>
      </div>
    </div>
  </body>
</template>
<style scoped></style>
