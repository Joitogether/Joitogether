<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
// import NaveBar from '@/views/Home/components/NavbarComponent.vue'
import { NavArrowLeft, MoreVert } from '@iconoir/vue'
import { useRoute, useRouter } from 'vue-router'
import { getPostById, updatePost, deletePost } from '@/apis/postAPIs'
import { getPostLikes, addLike, deleteLike } from '@/apis/postLikeAPIs'
import { getPostComments, createPostComment, deletePostComment } from '@/apis/postCommentAPIs'
import { useUserStore } from '@/stores/userStore'
import { useMessage } from 'naive-ui'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw.js'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('zh-tw')
dayjs.extend(relativeTime)
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const commentList = ref([])
const commentCount = ref(0)
// const likesCount = ref(0)
// const hasLiked = ref(false)
const isMenuVisible = ref(false)
const likesList = ref([])

// 留言打進後端的資料
const newComment = ref('')
const message = useMessage()

const likesCount = computed(() => {
  return likesList.value.length || 0
})

const likeId = computed(() => {
  return likesList.value.find((like) => like.uid === userStore.user.uid)?.like_id
})

const hasLiked = computed(() => {
  return likesList.value.some((like) => like.uid === userStore.user.uid)
})
const postId = Number(route.params.post_id) // 轉換為數字
console.log('postId:', postId)

const postDetails = reactive({
  category: '',
  title: '',
  content: '',
  time: '',
  img: '',
  name: '',
  avatar: '',
})

const categoryMap = {
  food: '美食',
  shopping: '購物',
  travel: '旅遊',
  sports: '運動',
  education: '教育',
  others: '其他',
}

// 取得文章內容
const fetchPostDetails = async () => {
  try {
    const post = await getPostById(postId)
    console.log(`API回傳的文章：`, post)

    // const userRes = await getPostById(postId)
    const user = post.data

    postDetails.category = categoryMap[post.data.post_category] || '未分類'
    postDetails.title = post.data.post_title
    postDetails.content = post.data.post_content
    postDetails.time = post.data.updated_at
    postDetails.img = post.data.post_img
    postDetails.name = user.users.display_name // 文章發佈者的名稱
    postDetails.avatar = user.users.photo_url // 文章發佈者的頭像 URL
  } catch (error) {
    console.error(`獲取 ${postId}文章資料失敗`, error.response?.data || error.message)
  }
}

// 取得文章留言
const fetchComments = async () => {
  try {
    const res = await getPostComments(postId)
    const comments = res.data

    // // 檢查是否有留言，如果沒有，顯示提示訊息
    // if (comments.length === 0) {
    //   commentList.value = [] // 清空留言列表
    //   commentCount.value = 0 // 留言數量為 0
    //   return
    // }
    console.log(`API回傳的留言：`, comments)

    commentCount.value = comments.length || 0

    const formattedComments = comments.map((comment) => ({
      id: comment.comment_id,
      content: comment.comment_content,
      time: comment.created_at,
      name: comment.users.display_name,
      avatar: comment.users.photo_url,
      status: comment.status,
    }))

    commentList.value = formattedComments

    console.log(`文章 ${postId} 的留言已更新：`, commentList.value)
    console.log(`文章 ${postId} 的留言數量：`, commentCount.value)
  } catch (error) {
    console.error(`取得使用者資料失敗`, error)
  }
}

// 新增留言
const addComment = async () => {
  if (!userStore.user.isLogin) {
    message.error('請先登入後再發文！')
    return
  }
  if (!newComment.value) {
    message.error('留言不可為空')
    return
  }

  const commentData = {
    post_id: postId,
    uid: userStore.user.uid,
    comment_content: newComment.value,
    // created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    status: 'active',
  }

  try {
    await createPostComment(postId, commentData)
    message.success('留言新增成功')
    console.log('傳送', commentData)
    newComment.value = ''
    fetchComments()
    return commentData
  } catch (error) {
    console.log(error)
  }
}
// 刪除留言
const deleteComment = async (commentId) => {
  try {
    const confirmDelete = window.confirm('確定要刪除此留言嗎？')
    if (confirmDelete) {
      await deletePostComment(commentId)
      message.success('留言刪除成功')
      // 將刪除的最後一則留言從留言列表中移除
      commentList.value = commentList.value.filter((comment) => comment.id !== commentId)
      // 留言數歸零
      if (commentList.value.length === 0) {
        commentCount.value = 0
      }
    }
  } catch (error) {
    console.log(error)
  }
}

// 編輯文章

// 刪除文章
const toggleDelete = async () => {
  try {
    await deletePost(postId)
    message.success('文章刪除成功')
    router.push('/post')
  } catch (error) {
    console.log(error)
    if (error.message) {
      message.error(error.message)
    } else {
      message.error('刪除失敗，請稍後再試！😞')
    }
  }
}
// 取得按讚數
const fetchPostLikes = async () => {
  try {
    const res = await getPostLikes(postId)
    if (res === null) {
      likesList.value = []
    }
    likesList.value = res.data
    console.log(likesList.value)
    console.log(`取得文章 ${postId} 的按讚數成功`, likesList.value)
  } catch (error) {
    console.error(`${postId}沒有任何按讚紀錄`)
  }
}

// 新增 / 取消按讚
const toggleLike = async () => {
  if (!userStore.user.isLogin) {
    message.error('請先登入後再按讚！')
    return
  }
  const likeData = {
    post_id: postId,
    uid: userStore.user.uid,
    status: hasLiked.value ? 'unlike' : 'liked',
  }
  try {
    if (hasLiked.value) {
      await deleteLike(likeId.value, 'unlike')
    } else {
      await addLike(postId, userStore.user.uid, 'liked')
    }
    fetchPostLikes()
    return likeData
  } catch (error) {
    console.log('按讚失敗', error)
    message.error('按讚失敗')
  }
}

const goPostPage = () => {
  router.push('/post')
}
// 切換編輯文章彈窗顯示與隱藏
const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value
}

onMounted(() => {
  console.log('正在加載文章', postId)

  fetchPostDetails()
  fetchComments()
  fetchPostLikes()
})
</script>

<template>
  <!-- <NaveBar /> -->
  <div class="bg-gray-100 h-12 flex items-center p-4 relative">
    <NavArrowLeft
      stroke-width="2"
      class="w-6 h-6 cursor-pointer"
      @click="goPostPage"
    ></NavArrowLeft>
    <p class="text-lg absolute left-1/2 transform -translate-x-1/2">{{ postDetails.category }}</p>
    <MoreVert class="w-7 h-7 cursor-pointer absolute right-4" @click="toggleMenu" />

    <!-- 彈窗內容 -->
    <div
      v-if="isMenuVisible"
      class="absolute right-4 top-12 bg-white shadow-md rounded-md p-2 z-10 w-40"
    >
      <ul>
        <li @click="editArticle" class="cursor-pointer hover:bg-gray-200 p-2 rounded-md">
          編輯文章
        </li>
        <li @click="toggleDelete" class="cursor-pointer hover:bg-gray-200 p-2 rounded-md">
          刪除文章
        </li>
      </ul>
    </div>
  </div>
  <div class="p-6">
    <div class="">
      <p class="text-xl font-bold">{{ postDetails.title }}</p>
    </div>
    <div class="">
      <!-- 發文者的資訊區 -->
      <div class="flex flex-row items-center mt-4 mb-4">
        <div class="w-16 h-16 rounded-full overflow-hidden mr-4">
          <img
            class="w-full h-full object-cover"
            alt=""
            :src="
              postDetails.avatar ||
              'https://i.pinimg.com/736x/20/3e/d7/203ed7d8550c2c1c145a2fb24b6fbca3.jpg'
            "
          />
        </div>
        <div>
          <div class="text-lg">{{ postDetails.name }}</div>
          <div class="text-sm text-gray-400">
            {{ dayjs(postDetails.time).format('YYYY-MM-DD HH:mm') }}
          </div>
        </div>
      </div>
      <!-- 文章資訊區 -->
      <div class="items-center">
        <div class="mb-6 text-base">{{ postDetails.content }}</div>
        <div v-if="postDetails.img" class="w-full h-full rounded-lg overflow-hidden">
          <img class="w-full h-full object-cover" :src="postDetails.img" alt="發文者圖片" />
        </div>
        <div class="flex justify-between my-6">
          <div class="flex">
            <div class="px-2 text-sm">👍🏻 {{ likesCount }} 讚</div>
            <div class="px-2 text-sm">💬 {{ commentCount }} 留言</div>
          </div>
        </div>

        <!-- 功能操作區 -->
        <div class="flex justify-between gap-4 items-center h-12 mb-4">
          <button
            class="w-1/2 h-full flex justify-center items-center bg-yellow-300 rounded-full hover:bg-yellow-400"
            @click="toggleLike"
            :disabled="false"
          >
            {{ hasLiked ? '取消按讚' : '按讚' }}
          </button>
          <button
            class="w-1/2 h-full flex justify-center items-center bg-yellow-300 rounded-full hover:bg-yellow-400"
          >
            留言
          </button>
        </div>

        <!-- 留言區 -->
        <div class="p-6 bg-gray-100 rounded-lg shadow-md">
          <!-- 新增留言 -->
          <div class="flex justify-between space-x-3 border-b border-gray-200">
            <div class="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
              <img
                alt="User Avatar"
                :src="
                  userStore.user.photoURL ||
                  'https://i.pinimg.com/736x/20/3e/d7/203ed7d8550c2c1c145a2fb24b6fbca3.jpg'
                "
                class="w-full h-full bg-yellow-200 object-cover"
              />
            </div>
            <div class="w-full">
              <!-- <p>{{ userStore.user.displayName }}</p> -->

              <textarea
                rows="3"
                v-model="newComment"
                class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="原本想說點什麼 但想想還是算了"
                style="resize: none"
              ></textarea>
              <div class="">
                <button
                  @click="addComment"
                  class="mt-2 px-6 py-2 bg-yellow-300 text-black rounded-full hover:bg-yellow-400 focus:outline-none mb-3"
                >
                  送出
                </button>
              </div>
            </div>
          </div>

          <!-- 留言列表 -->
          <div v-if="commentList.length" class="space-y-6">
            <div
              v-for="comment in commentList"
              :key="comment.id"
              class="flex items-start space-x-3 border-b pb-4 mt-6 relative"
            >
              <div class="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center">
                <img
                  alt="User Avatar"
                  :src="
                    comment.avatar ||
                    'https://i.pinimg.com/736x/20/3e/d7/203ed7d8550c2c1c145a2fb24b6fbca3.jpg'
                  "
                  class="w-full h-full bg-yellow-200 object-cover"
                />
              </div>
              <div>
                <p class="font-semibold text-gray-800 text-sm">{{ comment.name }}</p>
                <p class="text-gray-600 text-base">{{ comment.content }}</p>
                <p class="text-gray-400 text-sm">{{ dayjs(comment.time).fromNow() }}</p>
              </div>
              <n-button
                size="tiny"
                secondary
                strong
                class="absolute top-0 right-0"
                @click="deleteComment(comment.id, comment.uid)"
              >
                刪除
              </n-button>
            </div>
          </div>
          <p v-else class="text-gray-500">目前沒有留言，快來留下第一則吧！</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
