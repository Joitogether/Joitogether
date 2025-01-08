<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getPostsAPI } from '@/apis/userAPIs'
import { getPostLikesAPI } from '@/apis/postLikeAPIs'
import { getPostCommentsAPI } from '@/apis/postCommentAPIs'
import { handleError } from '@/utils/handleError.js'
import { useMessage } from 'naive-ui'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useRoute } from 'vue-router'

const route = useRoute()
const message = useMessage()
const loading = ref(true)
const userPostList = ref([])
const router = useRouter()

dayjs.extend(relativeTime)

function timeSince(date) {
  return dayjs(date).fromNow()
}

const fetchUserPosts = async () => {
  try {
    const id = route.params.uid
    const result = await getPostsAPI(id)

    if (!result?.data?.length) {
      userPostList.value = []
      return
    }

    const enrichedPosts = await Promise.all(
      result.data.map(async (post) => {
        try {
          const [commentsResult, likesResult] = await Promise.all([
            getPostCommentsAPI(post.post_id).catch(() => ({ data: [] })),
            getPostLikesAPI(post.post_id).catch(() => ({ data: [] })),
          ])

          return {
            ...post,
            commentCount: commentsResult.data.length,
            likeCount: likesResult.data.length,
          }
        } catch (error) {
          handleError(message, undefined, error)
          return {
            ...post,
            commentCount: 0,
            likeCount: 0,
          }
        }
      }),
    )

    userPostList.value = enrichedPosts
  } catch (error) {
    handleError(message, undefined, error)
    userPostList.value = []
  } finally {
    loading.value = false
  }
}

const handlePostClick = (postId) => {
  router.push(`/post/${postId}`)
}
watch(
  () => route.params.uid,
  () => {
    fetchUserPosts()
  },
)

onMounted(() => {
  fetchUserPosts()
})
</script>

<template>
  <div v-if="userPostList.length > 0">
    <div
      v-for="post in userPostList"
      :key="post.post_id"
      class="one-post-bottom cursor-pointer bg-gray-50 rounded-md mb-3 px-5 py-3 md:px-3 md:py-1"
      @click="handlePostClick(post.post_id)"
    >
      <div class="post-bottom-top">
        <div class="post-bottom-left flex flex-col gap-1 md:flex-row md:justify-between md:gap-6">
          <div class="md:w-3/4 md:p-3 md:flex md:flex-col md:justify-between">
            <div class="flex flex-col gap-2">
              <div class="flex justify-between">
                <p class="text-xl font-bold">{{ post.post_title }}</p>
                <p class="text-gray-400 text-sm">{{ timeSince(post.created_at) }}</p>
              </div>

              <div class="flex justify-between">
                <p class="post-content text-[16px] text-slate-600 line-clamp-2">
                  {{ post.post_content }}
                </p>
              </div>
              <div
                v-if="post.post_img"
                class="md:hidden post-bottom-right rounded-md overflow-hidden my-3"
              >
                <img :src="post.post_img" alt="Post Image" class="object-cover w-full h-full" />
              </div>
            </div>

            <div class="post-bottom-bottom flex leading-loose">
              <div class="mr-8">👍🏻 {{ post.likeCount || 0 }} 讚</div>
              <div>💬 {{ post.commentCount || 0 }} 留言</div>
            </div>
          </div>
          <div
            class="hidden md:block post-bottom-right w-1/4 aspect-square rounded-md overflow-hidden my-3"
          >
            <img
              v-if="post.post_img"
              :src="post.post_img"
              alt="Post Image"
              class="object-cover w-full h-full"
            />
            <div v-else class="w-full h-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else>用戶還沒有任何貼文</div>
</template>
<style scoped></style>
