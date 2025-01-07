<script setup>
import { onMounted, reactive, ref, computed, watch } from 'vue'
import { NavArrowLeft, MoreVert } from '@iconoir/vue'
import { useRoute, useRouter } from 'vue-router'
import { getPostByIdAPI, updatePostAPI, deletePostAPI } from '@/apis/postAPIs'
import { getPostLikesAPI, addLikeAPI, deleteLikeAPI } from '@/apis/postLikeAPIs'
import {
  getPostCommentsAPI,
  createPostCommentAPI,
  deletePostCommentAPI,
} from '@/apis/postCommentAPIs'
import { useUserStore } from '@/stores/userStore'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useMessage, NButton } from 'naive-ui'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw.js'
import relativeTime from 'dayjs/plugin/relativeTime'
import { handleError } from '@/utils/handleError.js'
import { useSocketStore } from '@/stores/socketStore'

dayjs.locale('zh-tw')
dayjs.extend(relativeTime)
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const commentList = ref([])
const commentCount = ref(0)
const isMenuVisible = ref(false)
const likesList = ref([])
const isEditing = ref(false)
const editPostTitle = ref('')
const editPostContent = ref('')
const editPostImg = ref('')
const socketStore = useSocketStore()

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
let postId = Number(route.params.post_id) // 轉換為數字

const postDetails = reactive({
  category: '',
  title: '',
  content: '',
  time: '',
  img: '',
  name: '',
  avatar: '',
  authorUid: '',
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
    const post = await getPostByIdAPI(postId)

    if (!post.data || (Array.isArray(post.data) && post.data.length === 0)) {
      return router.push({
        path: '/notFound',
      })
    }

    const user = post.data

    postDetails.category = categoryMap[post.data.post_category] || '未分類'
    postDetails.title = post.data.post_title
    postDetails.content = post.data.post_content
    postDetails.time = post.data.updated_at
    postDetails.img = post.data.post_img
    postDetails.name = user.users.display_name
    postDetails.avatar = user.users.photo_url
    postDetails.isPostAuthor = user.uid === userStore.user.uid
    postDetails.authorUid = user.uid
  } catch (error) {
    handleError(message, undefined, error)
  }
}

// 取得文章留言
const fetchComments = async () => {
  try {
    const res = await getPostCommentsAPI(postId)
    const comments = res.data

    if (!comments || comments.length === 0) {
      commentList.value = []
      commentCount.value = 0
      return
    }

    commentCount.value = comments.length || 0

    const formattedComments = comments.map((comment) => ({
      uid: comment.uid,
      id: comment.comment_id,
      content: comment.comment_content,
      time: comment.created_at,
      name: comment.users.display_name,
      avatar: comment.users.photo_url,
      status: comment.comment_status,
      isCommentAuthor: comment.uid === userStore.user.uid,
    }))

    commentList.value = formattedComments
  } catch (error) {
    handleError(message, undefined, error)
  }
}

// 新增留言
const addComment = async () => {
  if (!userStore.user.isLogin) {
    message.error('請先登入後再留言！')
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
    comment_status: 'active',
  }

  try {
    await createPostCommentAPI(postId, commentData)

    const notiData = {
      actor_id: userStore.user.uid,
      user_id: postDetails.authorUid,
      target_id: postId,
      action: 'comment',
      target_type: 'post',
      message: '留言了你的文章',
      link: `/post/${postId}`,
    }
    socketStore.sendNotification(notiData)

    message.success('留言新增成功')
    newComment.value = ''
    fetchComments()
    return commentData
  } catch (error) {
    handleError(message, undefined, error)
  }
}
// 刪除留言
const deleteComment = async (commentId) => {
  try {
    const confirmDelete = window.confirm('確定要刪除此留言嗎？')
    if (confirmDelete) {
      await deletePostCommentAPI(commentId)
      message.success('留言刪除成功')
      // 將刪除的最後一則留言從留言列表中移除
      commentList.value = commentList.value.filter((comment) => comment.id !== commentId)
      // 留言數歸零
      if (commentList.value.length === 0) {
        commentCount.value = 0
      }
    }
  } catch (error) {
    handleError(message, undefined, error)
  }
}

// 刪除文章
const toggleDelete = async () => {
  try {
    await deletePostAPI(postId)
    message.success('文章刪除成功')

    setTimeout(() => {
      router.push('/posts')
    }, 1000)
  } catch (error) {
    handleError(message, undefined, error)
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
    const res = await getPostLikesAPI(postId)
    if (!res || res.data.length === 0) {
      likesList.value = []
    }
    likesList.value = res.data
  } catch (error) {
    handleError(message, undefined, error)
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
      await deleteLikeAPI(likeId.value, 'unlike')
    } else {
      await addLikeAPI(postId, userStore.user.uid, 'liked')

      const notiData = {
        actor_id: userStore.user.uid,
        user_id: postDetails.authorUid,
        target_id: postId,
        action: 'like',
        target_type: 'post',
        message: '按讚了你的文章',
        link: `/post/${postId}`,
      }
      socketStore.sendNotification(notiData)
    }
    fetchPostLikes()
    return likeData
  } catch (error) {
    handleError(message, '按讚失敗', error)
  }
}

const goPostPage = () => {
  // router.push('/posts')
  router.back()
}
// 切換編輯文章彈窗顯示與隱藏
const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value
}

// 編輯文章
const saveEdit = async () => {
  if (editPostTitle.value.length > 10) {
    message.error('文章標題不可超過10個字')
    return
  }

  try {
    const originalPost = await getPostByIdAPI(postId)

    await updatePostAPI(postId, {
      uid: userStore.user.uid,
      post_title: editPostTitle.value || originalPost.data.post_title,
      post_content: editPostContent.value || originalPost.data.post_content,
      post_category: originalPost.data.post_category || '未分類',
      post_status: 'posted',
      post_img: editPostImg.value || '' || originalPost.data.post_img,
    })

    postDetails.title = updatePostAPI.value
    message.success('文章編輯成功')
    isEditing.value = false

    setTimeout(() => {
      isMenuVisible.value = false
    }, 500)

    fetchPostDetails()
  } catch (error) {
    handleError(message, undefined, error)
  }
}

const toggleEdit = () => {
  isEditing.value = !isEditing.value

  if (isEditing.value) {
    editPostTitle.value = postDetails.title
    editPostContent.value = postDetails.content
    editPostImg.value = postDetails.img
  }

  setTimeout(() => {
    isMenuVisible.value = false
  }, 500)
}

// 圖片功能
const selectedFile = ref(null)
const uploadedImage = ref(null)
const imagePreview = ref(null)
const fileInput = ref(null)

// 觸發文件選擇
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click() // 觸發文件選擇框
  }
}

const uploadFile = async (file) => {
  try {
    const storage = getStorage()
    const fileRef = storageRef(storage, `postImages/${file.name}`)
    const result = await uploadBytes(fileRef, file)
    const downloadURL = await getDownloadURL(result.ref)

    editPostImg.value = downloadURL

    return downloadURL
  } catch (error) {
    handleError(message, '圖片上傳失敗，請檢查檔案格式或網路連線', error)
  }
}

// 處理圖片上傳與預覽
const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file

    const maxFileSize = 2 * 1024 * 1024
    if (file.size > maxFileSize) {
      message.error('檔案大小不可超過 2 MB')
      selectedFile.value = null
      imagePreview.value = null
      return
    }
    // 建立圖片預覽
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result // 設定預覽 URL
    }
    reader.readAsDataURL(file)
    // 上傳圖片
    try {
      await uploadFile(file)
    } catch (error) {
      handleError(message, '圖片上傳失敗，請檢查檔案格式或網路連線', error)
    }
  }
}
// 移除圖片
const removeImage = () => {
  imagePreview.value = null
  uploadedImage.value = null
}
onMounted(() => {
  window.scrollTo({ top: 0 })
  fetchPostDetails()
  fetchComments()
  fetchPostLikes()
})

watch(
  () => route.params.post_id,
  () => {
    postId = Number(route.params.post_id)
    fetchPostDetails()
    fetchComments()
    fetchPostLikes()
  },
)
</script>

<template>
  <div class="bg-gray-100 w-full p-4">
    <div class="flex items-center relative w-full md:w-3/4 lg:w-1/2 mx-auto lg:max-w-[1000px]">
      <NavArrowLeft
        stroke-width="2"
        class="w-6 h-6 cursor-pointer"
        @click="goPostPage"
      ></NavArrowLeft>
      <p class="text-lg absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {{ postDetails.category }}
      </p>
      <MoreVert
        v-if="postDetails.isPostAuthor"
        class="w-7 h-7 cursor-pointer absolute right-1 top-1/2 transform -translate-y-1/2"
        @click="toggleMenu"
      ></MoreVert>

      <template v-if="postDetails.isPostAuthor">
        <div
          v-if="isEditing"
          class="flex space-x-2 absolute right-1 top-1/2 transform -translate-y-1/2"
        >
          <button
            @click="saveEdit"
            class="bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700"
          >
            儲存
          </button>
          <button
            @click="toggleEdit"
            class="bg-gray-500 text-white px-3 py-1 rounded-full hover:bg-gray-600"
          >
            取消
          </button>
        </div>

        <MoreVert
          v-else
          class="w-7 h-7 cursor-pointer absolute right-1 top-1/2 transform -translate-y-1/2"
          @click="toggleMenu"
        ></MoreVert>
      </template>

      <!-- 彈窗內容 -->
      <transition name="fade-slide">
        <div
          v-if="isMenuVisible"
          class="absolute right-2 top-12 bg-white shadow-md rounded-md p-2 z-10 w-40"
        >
          <ul>
            <li @click="toggleEdit" class="cursor-pointer hover:bg-gray-200 p-2 rounded-md">
              編輯文章
            </li>
            <li
              v-if="!isEditing"
              @click="toggleDelete"
              class="cursor-pointer hover:bg-gray-200 p-2 rounded-md"
            >
              刪除文章
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
  <div class="bg-gray-100">
    <div class="p-6 md:mx-auto md:w-3/4 lg:w-1/2 bg-white">
      <div class="">
        <p v-if="!isEditing" class="text-2xl font-bold text-gray-700 tracking-wide">
          {{ postDetails.title }}
        </p>
        <textarea
          v-else
          v-model="editPostTitle"
          class="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
          rows="1"
          style="resize: none"
          :placeholder="postDetails.title"
        ></textarea>
      </div>
      <div class="">
        <!-- 發文者的資訊區 -->
        <div class="flex flex-row items-center mt-4 mb-4">
          <div
            class="w-16 h-16 rounded-full overflow-hidden mr-4 cursor-pointer"
            @click="router.push({ name: 'personInfo', params: { uid: postDetails.authorUid } })"
          >
            <img
              class="w-full h-full object-cover"
              alt=""
              :src="
                postDetails.avatar ||
                'https://firebasestorage.googleapis.com/v0/b/login-demo1-9d3cb.firebasestorage.app/o/avatars%2Fcatavatar.png?alt=media&token=ccd02591-0c4f-435c-9a4a-34f219774558'
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
          <div
            v-if="!isEditing"
            class="mb-6 text-base text-gray-600 whitespace-pre-wrap tracking-wide"
          >
            {{ postDetails.content }}
          </div>
          <textarea
            v-else
            v-model="editPostContent"
            class="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            rows="5"
            style="resize: none"
            :placeholder="postDetails.content"
          ></textarea>

          <div
            v-if="!isEditing && postDetails.img"
            class="w-full h-full rounded-lg overflow-hidden"
          >
            <img class="w-full h-full object-cover" :src="postDetails.img" alt="發文者圖片" />
          </div>
          <div v-if="isEditing" class="p-4 bg-white border border-gray-300 rounded-lg mt-4 mb-4">
            <!-- 上傳圖片按鈕 -->
            <div class="flex justify-center">
              <button
                class="mt-2 bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 focus:outline-none"
                @click="triggerFileInput"
              >
                上傳圖片
              </button>
              <input
                ref="fileInput"
                type="file"
                class="hidden"
                multiple
                accept="image/*"
                @change="handleImageUpload"
              />
            </div>

            <!-- 圖片預覽 -->
            <div v-if="imagePreview" class="mt-4 flex justify-center">
              <div
                class="relative bg-gray-100 border border-gray-300 rounded-lg overflow-hidden w-32 h-32"
              >
                <img :src="imagePreview" alt="圖片預覽" class="w-full h-full object-cover" />
                <button
                  class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 focus:outline-none"
                  @click="removeImage"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
          <div class="flex justify-between my-6">
            <div class="flex">
              <div class="px-2 text-sm">👍🏻 {{ likesCount }} 讚</div>
              <div class="px-2 text-sm">💬 {{ commentCount }} 留言</div>
            </div>
          </div>

          <!-- 功能操作區 -->
          <div class="gap-4 items-center h-12 mb-4">
            <button
              class="w-full h-full flex justify-center items-center text-white bg-green-600 rounded-full hover:bg-green-500"
              @click="toggleLike"
              :disabled="false"
            >
              {{ hasLiked ? '太廢了要收回按讚' : '這篇文章太讚了' }}
            </button>
          </div>

          <!-- 留言區 -->
          <div class="p-3 min-h-screen bg-gray-100 rounded-md shadow-sm">
            <!-- 新增留言 -->
            <div class="flex justify-between space-x-3 border-b border-gray-200">
              <div class="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                <img
                  alt="User Avatar"
                  :src="
                    userStore.user.photo_url ||
                    'https://i.pinimg.com/736x/20/3e/d7/203ed7d8550c2c1c145a2fb24b6fbca3.jpg'
                  "
                  class="w-full h-full bg-yellow-200 object-cover"
                />
              </div>
              <div class="w-full">
                <textarea
                  rows="3"
                  v-model="newComment"
                  class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="原本想說點什麼 但想想還是算了"
                  style="resize: none"
                ></textarea>
                <div class="">
                  <button
                    @click="addComment"
                    class="mt-2 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-500 focus:outline-none mb-3"
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
                <div
                  class="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 cursor-pointer"
                  @click="router.push({ name: 'personInfo', params: { uid: comment.uid } })"
                >
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
                  <p class="text-gray-600 text-sm whitespace-pre-wrap tracking-wide">
                    {{ comment.content }}
                  </p>
                  <p class="text-gray-400 text-sm">{{ dayjs(comment.time).fromNow() }}</p>
                </div>
                <n-button
                  v-if="comment.isCommentAuthor"
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
            <p v-else class="text-gray-500 mt-2">目前沒有留言，快來留下第一則吧！</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* 動畫過渡的樣式 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

/* 進入動畫：從上方滑入 */
.fade-slide-enter,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 當彈窗顯示時，設置它的最終狀態 */
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
