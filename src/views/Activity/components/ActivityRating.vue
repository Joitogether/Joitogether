<script setup></script>

<template>
  <!-- 活動評價 -->
  <div class="flex flex-col">
    <div class="">
      <div class="">活動評價</div>
      <div class="">本次活動評價</div>
    </div>

    <!-- 評分進度 -->
    <div class="flex flex-row">
      <div class="flex">
        <div class="">disabled</div>
        <div class="">current</div>
        <div class="">本次揪團評價</div>
      </div>
      <div class="flex">
        <div class="">disabled</div>
        <div class="">current</div>
        <div class="">本次活動評價</div>
      </div>
      <div class="flex">
        <div class="">disabled</div>
        <div class="">current</div>
        <div class="">用戶信用評價</div>
      </div>
      <div class="flex">
        <div class="">disabled</div>
        <div class="">current</div>
        <div class="">平台建議</div>
      </div>
      <div class="flex">
        <div class="">disabled</div>
        <div class="">current</div>
        <div class="">完成</div>
      </div>
    </div>
    <!-- 活動區域 -->
    <div class="flex">
      <!-- 照片 -->
      <div class="">
        <img src="https://fakeimg.pl/640x360/cccccc" />
      </div>
      <!-- 活動資訊 -->
      <div class="">
        <div class="">
          <div class="">
            <div class="">活動名稱</div>
            <div class="">一起去旅遊</div>
          </div>
          <div class="">
            <div class="">活動日期</div>
            <div class="">2024/12/12</div>
          </div>
          <div class="">
            <div class="">團主</div>
            <div class="">阿里山獵犬</div>
          </div>
        </div>
        <!-- 團主評價 -->
        <div class="">
          <div class="">團主評價</div>
          <div class="flex">
            <div class="">親切度</div>
            <div class="">口口口口口</div>
          </div>
          <div class="flex">
            <div class="">主辦能力</div>
            <div class="">口口口口口</div>
          </div>
          <div class="flex">
            <div class="">信用度</div>
            <div class="">口口口口口</div>
          </div>
        </div>
        <div class="">
          <div class="">團主近期評價內容</div>
          <div class="">
            <img src="https://fakeimg.pl/60x60/aaaaaa" />
            <div class="">東方快遞</div>
          </div>
          <div class="">
            <div class="">口口口口口</div>
            <div class="">2024/12/14</div>
          </div>
          <div class="">
            團主真的超用心的，上次跟他去吃鷄肉飯還不用花錢，而且都介紹很强的小吃，真的很推啦!!
          </div>
        </div>
      </div>
    </div>
    <div class="">
      <div class="flex">
        <img src="https://fakeimg.pl/60x60/aaaaaa" />
        <div class="">南港燒臘王</div>
      </div>
      <div class="flex">
        <div class="">您對於本次揪團的評價為</div>
        <div class="">口口口口口</div>
      </div>
      <div class="flex flex-col">
        <label for="ThingsYouWantToSay">留下您想對團主說的話</label>
        <textarea
          class="bg-slate-400"
          name="ThingsYouWantToSay"
          id="ThingsYouWantToSay"
          row="5"
          clos="5"
        ></textarea>
      </div>
      <div class="flex">
        <!-- 正常輸入會顯示的 -->
        <div class="flex">
          <div class="">159</div>
          <div class="">/</div>
          <div class="">200</div>
        </div>
        <!-- 超過字數上限顯示 -->
        <div class="flex">
          <div class="">200</div>
          <div class="">/</div>
          <div class="">200</div>
          <div class="">話太多字數已達上線啦！</div>
        </div>
        <button class="bg-gray-300">跳過該頁</button>
        <button class="bg-gray-300">下一步</button>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
