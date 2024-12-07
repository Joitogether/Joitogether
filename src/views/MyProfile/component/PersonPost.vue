<script setup>
import { ref, onMounted } from 'vue'
import { NEllipsis, NDivider } from 'naive-ui'
import { getPosts } from '@/apis/postsApi'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const loading = ref(true)
const errorMessage = ref(null)
const userPostList = ref([])

const fetchUserPosts = async () => {
  try {
    const result = await getPosts(userStore.user.uid)
    console.log('貼文資料：', result.data)

    userPostList.value = result.data

    // userPostList.forEach((post) => {
    //   console.log(`貼文標題: ${post.post_title}`)
    //   console.log(`貼文內容: ${post.post_content}`)
    // })
    // if (result) {
    //   const userPosts = result.filter((posts) => posts && posts.uid === UID)
    //   console.log(userPosts)
    // }
    // if (result.length > 0) {
    // posts.value = result
    // loading.value = false
    // console.log('貼文資料', posts.value)
    // console.log(posts.value.post_title)

    // } else {
    console.log('該用戶還沒有活動')
  } catch (err) {
    errorMessage.value = err.message || '資料加載錯誤'
    loading.value = false
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  fetchUserPosts()
})
// postList.sort((a, b) => new Date(b.time) - new Date(a.time))
</script>

<template>
  <div
    v-for="post in userPostList"
    :key="post.post_id"
    class="one-post-bottom px-6 bg-white pb-4 cursor-pointer border-b-4 border-solid border-[rgba(61,57,44,0.1)]"
  >
    <div class="post-bottom-top grid grid-cols-6 my-6">
      <div
        class="post-bottom-left leading-normal lg:col-span-5 sm:col-span-4 col-span-3 overflow-hidden mb-5"
      >
        <p class="text-slate-300 text-sm h-8 mt-6">{{ post.created_at }}</p>
        <n-ellipsis class="blockArea" expand-trigger="click" line-clamp="1" :tooltip="false">
          <h3 class="text-xl font-bold leading-loose">{{ post.post_title }}</h3>
        </n-ellipsis>
        <n-ellipsis class="blockArea" expand-trigger="click" line-clamp="2" :tooltip="false">
          <p class="post-content text-[16px] text-slate-600">{{ post.post_content }}</p>
        </n-ellipsis>
      </div>
      <div
        class="post-bottom-right rounded-3xl overflow-hidden ml-2.5 my-5 lg:col-span-1 sm:col-span-2 col-span-3"
      >
        <img :src="post.post_img" alt="Post Image" class="object-cover w-full h-full" />
      </div>
    </div>
    <NDivider />
    <div class="post-bottom-bottom flex leading-loose mt-6 mx-6">
      <div class="mr-8">👍🏻 20 讚</div>
      <div>💬 9 留言</div>
    </div>
  </div>
</template>
<style scoped>
.blockArea{
  display: block

}
</style>
