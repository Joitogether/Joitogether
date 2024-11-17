<script setup>

</script>

<template>
<div class="home-posts-area bg-gray-100 px-28 py-10">
  <div>
    <h2 class="text-3xl">最新貼文</h2>
  </div>
  <div class="post-label-area flex py-7 border-b-[1px] border-solid border-[rgba(61,57,44,0.1)]">
    <div class="rounded-full cursor-pointer bg-yellow-300 text-base py-1 px-4 mr-4">最新</div>
    <div class="rounded-full cursor-pointer bg-yellow-300 text-base py-1 px-4">熱門</div>
  </div>
  <div class="post-posts-area grid grid-cols-1 gap-4">
    <div class="post-onepost">
      <div class="post-onepost-top flex pt-5 pl-10 items-center	cursor-pointer">
        <div class="one-post-img w-10 h-10 rounded-full overflow-hidden">
          <img src="https://image1.gamme.com.tw/news2/2017/49/24/q6CVnZ2YlKOesA.jpg" alt="發文者大頭照"  class="object-cover w-full h-full">
        </div>
        <p class="ml-5 text-sm">發文者名稱</p>
      </div>
      <div class="one-post-bottom mt-2.5 px-6 bg-white rounded-2xl pb-4 cursor-pointer">
        <div class="post-bottom-top flex h-[180px] border-b-[1px] border-solid border-[rgba(61,57,44,0.1)]">
          <div class="post-bottom-left w-52 leading-loose">
            <p class="text-slate-300 text-sm h-8 mt-6">2024-11-16 23:59</p>
            <h3 class="text-xl font-bold">文章標題</h3>
            <p class="text-[16px]">內文內文內文內文內文內文內文內文</p>
          </div>
          <div class="post-bottom-right h-24 w-24 rounded-3xl overflow-hidden ml-2.5 mt-4">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTloBdf4Wa_JxRmW-03mPB_wfP-lBvTGh8-CQ&s" alt="文章照片">
          </div>
        </div>
        <div class="post-bottom-bottom flex leading-loose mt-6 mx-6">
          <div class="mr-8">👍🏻 20 讚</div>
          <div>💬  9 留言</div>
        </div>
      </div>
    </div>
    <div class="post-onepost">
      <div class="post-onepost-top flex pt-5 pl-10 items-center	cursor-pointer">
        <div class="one-post-img w-10 h-10 rounded-full overflow-hidden">
          <img src="https://image1.gamme.com.tw/news2/2017/49/24/q6CVnZ2YlKOesA.jpg" alt="發文者大頭照"  class="object-cover w-full h-full">
        </div>
        <p class="ml-5 text-sm">發文者名稱</p>
      </div>
      <div class="one-post-bottom mt-2.5 px-6 bg-white rounded-2xl pb-4 cursor-pointer">
        <div class="post-bottom-top flex h-[180px] border-b-[1px] border-solid border-[rgba(61,57,44,0.1)]">
          <div class="post-bottom-left w-52 leading-loose">
            <p class="text-slate-300 text-sm h-8 mt-6">2024-11-16 23:59</p>
            <h3 class="text-xl font-bold">文章標題</h3>
            <p class="text-[16px]">內文內文內文內文內文內文內文內文</p>
          </div>
          <div class="post-bottom-right h-24 w-24 rounded-3xl overflow-hidden ml-2.5 mt-4">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTloBdf4Wa_JxRmW-03mPB_wfP-lBvTGh8-CQ&s" alt="文章照片">
          </div>
        </div>
        <div class="post-bottom-bottom flex leading-loose mt-6 mx-6">
          <div class="mr-8">👍🏻 20 讚</div>
          <div>💬  9 留言</div>
        </div>
      </div>
    </div>
    <div class="post-onepost">
      <div class="post-onepost-top flex pt-5 pl-10 items-center	cursor-pointer">
        <div class="one-post-img w-10 h-10 rounded-full overflow-hidden">
          <img src="https://image1.gamme.com.tw/news2/2017/49/24/q6CVnZ2YlKOesA.jpg" alt="發文者大頭照"  class="object-cover w-full h-full">
        </div>
        <p class="ml-5 text-sm">發文者名稱</p>
      </div>
      <div class="one-post-bottom mt-2.5 px-6 bg-white rounded-2xl pb-4 cursor-pointer">
        <div class="post-bottom-top flex h-[180px] border-b-[1px] border-solid border-[rgba(61,57,44,0.1)]">
          <div class="post-bottom-left w-52 leading-loose">
            <p class="text-slate-300 text-sm h-8 mt-6">2024-11-16 23:59</p>
            <h3 class="text-xl font-bold">文章標題</h3>
            <p class="text-[16px]">內文內文內文內文內文內文內文內文</p>
          </div>
          <div class="post-bottom-right h-24 w-24 rounded-3xl overflow-hidden ml-2.5 mt-4">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTloBdf4Wa_JxRmW-03mPB_wfP-lBvTGh8-CQ&s" alt="文章照片">
          </div>
        </div>
        <div class="post-bottom-bottom flex leading-loose mt-6 mx-6">
          <div class="mr-8">👍🏻 20 讚</div>
          <div>💬  9 留言</div>
        </div>
      </div>
    </div>
  </div>

  <div class="post-area-bottom mt-5 grid grid-cols-3">
    <div class="more-post-btn flex justify-center text-sm col-start-2">
      <button class="rounded-full bg-yellow-400 px-6 py-2">更多熱門貼文</button>
    </div>
    <div class="change-post-btn flex justify-end text-zinc-600 leading-loose">
      <p class="page-number content-center hidden">1 / 5</p>
      <div class="switch-btn-left hidden ml-5 text-base rounded-full bg-gray-300 w-10 h-10 text-center justify-center items-center">
        <p class="font-black">＜</p>
      </div>
      <div class="switch-btn-right hidden ml-5 text-base rounded-full bg-gray-300 w-10 h-10 text-cente justify-center items-center">
        <p class="font-black">＞</p>
      </div>
    </div>
  </div>
</div>
</template>
<style scoped>
.one-post-bottom::before{
  content: "";
    float: left;
    border-color: transparent transparent rgb(255, 255, 255);
    border-style: solid;
    border-width: 8px 0px 10px 19px;
    position: relative;
    top: -18px;
}
@media screen and ( 768px <= width < 1024px) {
  .post-posts-area{
    grid-template-columns: repeat(2, 1fr);
  }
}
@media screen and ( width >= 1024px) {
  .switch-btn-left,
  .switch-btn-right
  {
    display: flex;
  }
  .page-number{
    display: block;
  }
  .post-posts-area{
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
