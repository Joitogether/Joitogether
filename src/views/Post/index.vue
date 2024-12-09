<script setup>
// import NaveBar from '@/views/Home/components/NavbarComponent.vue'
import NewPostArea from './component/NewPostArea.vue'
import { onMounted, reactive, ref } from 'vue'
import { NSpace, NSelect } from 'naive-ui'
import { getPostById, getPostsByCategory } from '@/apis/postAPIs'
import { getPostComments } from '@/apis/postCommentAPIs'
import { getPostLikes } from '@/apis/postLikeAPIs'
import { useRouter } from 'vue-router'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw.js'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('zh-tw')
dayjs.extend(relativeTime)

const options = [
  {
    label: '最新',
    value: 'newest',
  },
  {
    label: '最熱門',
    value: 'hotest',
  },
  {
    label: '最多留言',
    value: 'mostComment',
  },
  {
    label: '最舊',
    value: 'oldest',
  },
]

const selectValue = ref('newest')

const handleFilterSelect = (value) => {
  // 這裡可以針對點擊事件做後續處理
  console.log(value)
  selectValue.value = value

  postList.sort((a, b) => {
    if (value === 'newest') {
      return new Date(b.time) - new Date(a.time)
    } else if (value === 'oldest') {
      return new Date(a.time) - new Date(b.time)
    } else if (value === 'mostComment') {
      return b.commentsCount - a.commentsCount
    } else if (value === 'hotest') {
      return b.likesCount - a.likesCount
    }
    return 0
  })
}

//預設是美食
const selectedTag = ref('food')
const handleTagSelect = (tag) => {
  // 這裡可以針對點擊事件做後續處理
  selectedTag.value = tag

  fetchPostsByCategory()
}

const postList = reactive([])

const fetchPostsByCategory = async () => {
  try {
    const res = await getPostsByCategory(selectedTag.value)
    const posts = res.data

    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        const userRes = await getPostById(post.post_id)
        const user = userRes.data

        return {
          id: post.post_id,
          title: post.post_title,
          content: post.post_content,
          name: user.users.display_name,
          avatar: user.users.photo_url,
          time: post.updated_at,
          img: post.post_img,
        }
      }),
    )

    // 更新postList
    postList.splice(0, postList.length, ...formattedPosts)

    handleFilterSelect(selectValue.value)
    fetchCommentsCount()
    fetchPostLikes()
    console.log(`分類 ${selectedTag.value}文章已更新：`, postList)
  } catch (error) {
    console.error(`撈取分類 ${selectedTag.value} 文章失敗：`, error)
  }
}

// 取得留言數
const fetchCommentsCount = async () => {
  for (const post of postList) {
    // console.log(`取得文章 ${post.id} 的留言`)

    try {
      const comments = await getPostComments(post.id)
      // console.log(`取得文章 ${post.id} 的留言成功`, comments)
      post.commentsCount = comments.data.length || '0' // 設定留言數
    } catch (error) {
      console.error(`${post.id} 沒有任何留言`)

      // console.error(`無法取得文章 ${post.id} 的留言數`)
      post.commentsCount = '0' // 預設為 0
    }
  }
}

// 取得按讚數
const fetchPostLikes = async () => {
  for (const post of postList) {
    // console.log(`取得文章 ${post.id} 的按讚數`)

    try {
      const likes = await getPostLikes(post.id)
      // console.log(`取得文章 ${post.id} 的按讚數成功`, likes)
      post.likesCount = likes.data.length || '0'
    } catch (error) {
      console.error(`${post.id}沒有任何按讚紀錄`)
      post.likesCount = '0'
    }
  }
}

onMounted(async () => {
  await fetchPostsByCategory() // 確保先撈取分類文章
  await fetchCommentsCount() // 再撈取留言數
  await fetchPostLikes()
})

const router = useRouter()

const handlePostClick = (postId) => {
  router.push(`/post/${postId}`)
}
</script>
<template>
  <!-- <NaveBar /> -->
  <div class="postsArea max-w-[1140px] mx-auto px-4">
    <NewPostArea />
    <!-- <CategoryPosts /> -->
    <div class="md:flex justify-between w-full md:py-7">
      <div class="flex w-full md:flex md:w-[35%] md:min-w-[550px] md:justify-between">
        <p
          @click="handleTagSelect('food')"
          :class="{ 'activated-tag': selectedTag === 'food' }"
          class="text-gray-400 border-transparent text-center pb-1 md:pb-0 border-b-[2px] md: md:rounded-full flex-1 cursor-pointer md:leading-0 leading-9 md:bg-yellow-300 text-base py-1 md:py-0 md:px-4 md:mr-3"
        >
          美食
        </p>
        <p
          @click="handleTagSelect('shopping')"
          :class="{ 'activated-tag': selectedTag === 'shopping' }"
          class="text-gray-400 border-transparent text-center pb-1 md:pb-0 border-b-[2px] md: md:rounded-full flex-1 cursor-pointer md:leading-0 leading-9 md:bg-yellow-300 text-base py-1 md:py-0 md:px-4 md:mr-3"
        >
          逛街
        </p>
        <p
          @click="handleTagSelect('travel')"
          :class="{ 'activated-tag': selectedTag === 'travel' }"
          class="text-gray-400 border-transparent text-center pb-1 md:pb-0 border-b-[2px] md: md:rounded-full flex-1 cursor-pointer md:leading-0 leading-9 md:bg-yellow-300 text-base py-1 md:py-0 md:px-4 md:mr-3"
        >
          旅行
        </p>
        <p
          @click="handleTagSelect('sports')"
          :class="{ 'activated-tag': selectedTag === 'sports' }"
          class="text-gray-400 border-transparent text-center pb-1 md:pb-0 border-b-[2px] md: md:rounded-full flex-1 cursor-pointer md:leading-0 leading-9 md:bg-yellow-300 text-base py-1 md:py-0 md:px-4 md:mr-3"
        >
          運動
        </p>
        <p
          @click="handleTagSelect('education')"
          :class="{ 'activated-tag': selectedTag === 'education' }"
          class="text-gray-400 border-transparent text-center pb-1 md:pb-0 border-b-[2px] md: md:rounded-full flex-1 cursor-pointer md:leading-0 leading-9 md:bg-yellow-300 text-base py-1 md:py-0 md:px-4 md:mr-3"
        >
          教育
        </p>
        <p
          @click="handleTagSelect('others')"
          :class="{ 'activated-tag': selectedTag === 'others' }"
          class="text-gray-400 border-transparent text-center pb-1 md:pb-0 border-b-[2px] md: md:rounded-full flex-1 cursor-pointer md:leading-0 leading-9 md:bg-yellow-300 text-base py-1 md:py-0 md:px-4 md:mr-3"
        >
          其他
        </p>
      </div>
      <n-space
        class="w-[20%] border-none text-center ml-auto mt-2 md:mt-0 md:w-[20%] md:max-w-[160px]"
        vertical
      >
        <n-select
          @update:value="handleFilterSelect"
          placeholder="排序"
          v-model:value="selectValue"
          :options="options"
        >
        </n-select>
      </n-space>
    </div>
    <div class="post-posts-area mt-2">
      <div v-for="post in postList" :key="post.id" class="">
        <div
          class="flex flex-col justify-between md:flex-row bg-slate-50 p-4 cursor-pointer border-b border-gray-400"
          @click="handlePostClick(post.id)"
        >
          <!-- 左邊區塊 -->
          <!-- <div :class="post.img ? 'w-full md:w-9/12' : 'w-full'" class="flex flex-col space-y-2"> -->
          <div class="flex flex-col w-full md:w-9/12 space-y-2">
            <!-- 文章圖片與使用者名稱區塊，包含時間 -->
            <div class="flex items-center justify-between space-x-3">
              <div class="flex flex-row items-center gap-3">
                <!-- 大頭貼 -->
                <div class="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    :src="
                      post.avatar ||
                      'https://i.pinimg.com/736x/20/3e/d7/203ed7d8550c2c1c145a2fb24b6fbca3.jpg'
                    "
                    class="w-full h-full object-cover"
                  />
                </div>
                <!-- 使用者名稱 -->
                <p class="font-bold text-sm">{{ post.name }}</p>
              </div>
              <!-- 發佈時間，顯示相對時間 -->
              <p class="text-sm text-gray-500">{{ dayjs(post.time).fromNow() }}</p>
            </div>
            <!-- 文章標題 -->
            <h2 class="text-lg font-bold truncate">{{ post.title }}</h2>
            <!-- 文章內容 -->
            <p class="text-sm text-gray-700 line-clamp-2">{{ post.content }}</p>
            <!-- 讚與留言 -->
            <div class="flex space-x-8 text-sm text-gray-600">
              <div>👍🏻 {{ post.likesCount }} 讚</div>
              <div>💬 {{ post.commentsCount }} 留言</div>
            </div>
          </div>
          <!-- 右邊區塊（文章圖片） -->
          <div
            v-if="post.img"
            class="w-full h-full md:w-40 aspect-square rounded-lg overflow-hidden mt-4 md:mt-0"
          >
            <img class="w-full h-full object-cover" :src="post.img" alt="文章照片" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
:deep(.n-base-selection) {
  border-radius: 50px !important;
}

.activated-tag {
  color: black;
  font-weight: bold;
  border-color: #fde047;
  transition: border-color 0.15s ease-in-out;
}
</style>
