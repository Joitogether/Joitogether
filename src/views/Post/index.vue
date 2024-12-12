<script setup>
import PostList from './component/PostList.vue'
</script>
<template>
  <div class="postsArea">
    <div class="post-label-area flex py-7 border-b-[1px] border-solid border-[rgba(61,57,44,0.1)]">
      <div class="rounded-full cursor-pointer bg-yellow-300 text-base py-1 px-4 mr-4">最新</div>
      <div class="rounded-full cursor-pointer bg-yellow-300 text-base py-1 px-4">熱門</div>
    </div>
    <div v-for="post in PostList" :key="post.id" class="post-posts-area grid grid-cols-1 gap-4">
      <div class="post-onepost">
        <div class="post-onepost-top flex pt-5 pl-10 items-center	cursor-pointer">
          <div class="one-post-img w-10 h-10 rounded-full overflow-hidden">
            <img src="https://image1.gamme.com.tw/news2/2017/49/24/q6CVnZ2YlKOesA.jpg" alt="發文者大頭照"  class="object-cover w-full h-full">
          </div>
            <p class="ml-5 text-sm">{{ PostList.name }}</p>
        </div>
        <div class="one-post-bottom mt-2.5 px-6 bg-white rounded-2xl pb-4 cursor-pointer">
          <div class="post-bottom-top flex h-[180px] border-b-[1px] border-solid border-[rgba(61,57,44,0.1)]">
            <div class="post-bottom-left w-52 leading-loose">
              <p class="text-slate-300 text-sm h-8 mt-6">{{ PostList.time }}</p>
              <h3 class="text-xl font-bold">{{ PostList.title }}</h3>
              <p class="text-[16px]">{{ PostList.components }}</p>
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
  </div>
</template>
