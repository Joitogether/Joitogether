<script setup>
import { ref, onMounted } from 'vue'
import { NEllipsis, NDivider } from 'naive-ui'
import { getPosts } from '@/apis/postsApi'
import { useUserStore } from '@/stores/userStore'
import { getPostsComment } from '@/apis/postsApi'
import { getPostsLike } from '@/apis/postsApi'

const userStore = useUserStore()
const loading = ref(true)
const errorMessage = ref(null)
const userPostList = ref([])
// const userPostComment = ref('')
// const userPostLike = ref('')

const fetchUserPosts = async () => {
  try {
    const result = await getPosts(userStore.user.uid)
    console.log('貼文資料：', result)

    userPostList.value = result.data
    await Promise.all(
      userPostList.value.map(async (post) => {
        // 獲取留言數據
        const commentsResult = await getPostsComment(post.post_id)
        post.commentCount = commentsResult.data.length // 儲存留言數量

        // 獲取按讚數據
        const likesResult = await getPostsLike(post.post_id)
        post.likeCount = likesResult.data.length // 儲存按讚數量
      }),
    )
    console.log(post.likeCount)
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
      <div class="mr-8">👍🏻 {{ post.likeCount || 0 }} 讚</div>
      <div>💬 {{ post.commentCount || 0 }} 留言</div>
    </div>
  </div>
</template>
<style scoped>
.blockArea {
  display: block;
}
</style>
