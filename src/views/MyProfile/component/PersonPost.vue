<script setup>
import { ref, onMounted } from 'vue'
import { NEllipsis, NDivider } from 'naive-ui'
import { getPostsApi } from '@/apis/userAPIs'
import { useUserStore } from '@/stores/userStore'
import { getPostsCommentAPI } from '@/apis/postsApi'
import { getPostsLikeAPI } from '@/apis/postsApi'
import dayjs from 'dayjs'

const userStore = useUserStore()
const loading = ref(true)
const errorMessage = ref(null)
const userPostList = ref([])
const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm')
}

const fetchUserPosts = async () => {
  try {
    if (!userStore.user?.uid) {
      console.warn('用戶uid不存在')
      return
    }

    const result = await getPostsApi(userStore.user.uid)

    if (!result?.data?.length) {
      console.log('該用戶還沒有文章')
      userPostList.value = []
      return
    }

    // 使用並發處理
    const enrichedPosts = await Promise.all(
      result.data.map(async (post) => {
        try {
          // 同時獲取留言和按讚數
          const [commentsResult, likesResult] = await Promise.all([
            getPostsCommentAPI(post.post_id).catch(() => ({ data: [] })),
            getPostsLikeAPI(post.post_id).catch(() => ({ data: [] })),
          ])

          return {
            ...post,
            commentCount: commentsResult.data.length,
            likeCount: likesResult.data.length,
          }
        } catch (postError) {
          console.error(`處理貼文 ${post.post_id} 時出錯:`, postError)
          return {
            ...post,
            commentCount: 0,
            likeCount: 0,
          }
        }
      }),
    )

    // 更新貼文列表
    userPostList.value = enrichedPosts

    console.log('貼文數據:', enrichedPosts)
  } catch (err) {
    console.error('獲取用戶貼文出錯:', err)
    errorMessage.value = err.message || '數據加載錯誤'
    userPostList.value = []
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
    v-if="userPostList.length > 0"
    v-for="post in userPostList"
    :key="post.post_id"
    class="one-post-bottom px-6 bg-white pb-4 cursor-pointer border-b-4 border-solid border-[rgba(61,57,44,0.1)]"
  >
    <div class="post-bottom-top grid grid-cols-6 my-6">
      <div
        class="post-bottom-left leading-normal lg:col-span-5 sm:col-span-4 col-span-3 overflow-hidden mb-5"
      >
        <p class="text-slate-300 text-sm h-8 mt-6">{{ formatDate(post.created_at) }}</p>
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
  <div v-else>用戶還沒有任何貼文</div>
</template>
<style scoped>
.blockArea {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
