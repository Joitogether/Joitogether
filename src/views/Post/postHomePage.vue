<script setup>
import NewPostArea from './component/NewPostArea.vue'
import { onMounted, reactive, ref } from 'vue'
import { NSpace, NSelect, useMessage } from 'naive-ui'
import { getPostsByCategoryAPI } from '@/apis/postAPIs'
import { useRouter } from 'vue-router'
import { handleError } from '@/utils/handleError.js'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw.js'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('zh-tw')
dayjs.extend(relativeTime)

const message = useMessage()

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

// 文章排序
const selectValue = ref('newest')
const handleFilterSelect = (value) => {
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
    const res = await getPostsByCategoryAPI(selectedTag.value)

    if (!res || res.length === 0) {
      postList.splice(0, postList.length)
    }

    const formattedPosts = res.map((post) => ({
      id: post.post_id,
      title: post.post_title,
      content: post.post_content,
      name: post.users.display_name,
      avatar: post.users.photo_url,
      time: post.updated_at,
      img: post.post_img,
      commentsCount: post.commentCount,
      likesCount: post.likeCount,
    }))

    // // 更新postList
    postList.splice(0, postList.length, ...formattedPosts)

    handleFilterSelect(selectValue.value)
  } catch (error) {
    handleError(message, error)
  }
}

onMounted(async () => {
  await fetchPostsByCategory()
})

const router = useRouter()

const handlePostClick = (postId) => {
  router.push(`/post/${postId}`)
}

const informPostUpdate = () => {
  fetchPostsByCategory()
}
</script>
<template>
  <div class="w-full h-auto bg-gray-100">
    <div class="postsArea w-full min-h-screen mx-auto px-4 pt-1 bg-white md:w-3/4 lg:w-1/2">
      <NewPostArea @update="informPostUpdate" />
      <div class="w-full mb-4 md:mb-0 md:py-5">
        <div class="flex w-full md:w-full">
          <p
            @click="handleTagSelect('food')"
            :class="{ 'activated-tag': selectedTag === 'food' }"
            class="text-black border-transparent text-center pb-1 md:pb-0 border-b-[2px] md:text-white md:rounded-full flex-1 cursor-pointer md:leading-0 leading-9 md:bg-green-500 md:hover:bg-green-600 text-base py-1 md:py-0 md:px-4 md:mr-3"
          >
            美食
          </p>
          <p
            @click="handleTagSelect('shopping')"
            :class="{ 'activated-tag': selectedTag === 'shopping' }"
            class="text-black border-transparent text-center pb-1 md:pb-0 border-b-[2px] md:text-white md:rounded-full flex-1 cursor-pointer md:leading-0 leading-9 md:bg-green-500 md:hover:bg-green-600 text-base py-1 md:py-0 md:px-4 md:mr-3"
          >
            購物
          </p>
          <p
            @click="handleTagSelect('travel')"
            :class="{ 'activated-tag': selectedTag === 'travel' }"
            class="text-black border-transparent text-center pb-1 md:pb-0 border-b-[2px] md:text-white md:rounded-full flex-1 cursor-pointer md:leading-0 leading-9 md:bg-green-500 md:hover:bg-green-600 text-base py-1 md:py-0 md:px-4 md:mr-3"
          >
            旅遊
          </p>
          <p
            @click="handleTagSelect('sports')"
            :class="{ 'activated-tag': selectedTag === 'sports' }"
            class="text-black border-transparent text-center pb-1 md:pb-0 border-b-[2px] md:text-white md:rounded-full flex-1 cursor-pointer md:leading-0 leading-9 md:bg-green-500 md:hover:bg-green-600 text-base py-1 md:py-0 md:px-4 md:mr-3"
          >
            運動
          </p>
          <p
            @click="handleTagSelect('education')"
            :class="{ 'activated-tag': selectedTag === 'education' }"
            class="text-black border-transparent text-center pb-1 md:pb-0 border-b-[2px] md:text-white md:rounded-full flex-1 cursor-pointer md:leading-0 leading-9 md:bg-green-500 md:hover:bg-green-600 text-base py-1 md:py-0 md:px-4 md:mr-3"
          >
            教育
          </p>
          <p
            @click="handleTagSelect('others')"
            :class="{ 'activated-tag': selectedTag === 'others' }"
            class="text-black border-transparent text-center pb-1 md:pb-0 border-b-[2px] md:text-white md:rounded-full flex-1 cursor-pointer md:leading-0 leading-9 md:bg-green-500 md:hover:bg-green-600 text-base py-1 md:py-0 md:px-4"
          >
            其他
          </p>
        </div>
        <n-space class="w-[40%] border-none text-center ml-auto mt-1 md:mt-5" vertical>
          <n-select
            @update:value="handleFilterSelect"
            placeholder="排序"
            v-model:value="selectValue"
            :options="options"
          >
          </n-select>
        </n-space>
      </div>
      <div class="post-posts-area">
        <div v-for="post in postList" :key="post.id" class="">
          <div
            class="flex flex-col justify-between md:flex-row p-4 cursor-pointer border-b border-gray-200 bg-gray-50 md:bg-white"
            @click="handlePostClick(post.id)"
          >
            <!-- 左邊區塊 -->
            <div class="flex flex-col md:flex-row w-full space-y-4 md:space-y-0">
              <div class="flex flex-col w-full md:w-9/12 space-y-2 md:pr-5">
                <div class="flex items-center justify-between space-x-3">
                  <div class="flex flex-row items-center gap-3">
                    <div class="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        :src="
                          post.avatar ||
                          'https://i.pinimg.com/736x/20/3e/d7/203ed7d8550c2c1c145a2fb24b6fbca3.jpg'
                        "
                        class="w-full h-full object-cover"
                        alt="使用者大頭貼"
                      />
                    </div>
                    <p class="font-bold text-sm">{{ post.name }}</p>
                  </div>
                  <p class="text-sm text-gray-500">{{ dayjs(post.time).fromNow() }}</p>
                </div>
                <h2 class="text-lg font-bold truncate">{{ post.title }}</h2>
                <p class="text-sm text-gray-700 line-clamp-2">{{ post.content }}</p>
                <div class="flex space-x-8 text-sm text-gray-600">
                  <div>👍🏻 {{ post.likesCount }} 讚</div>
                  <div>💬 {{ post.commentsCount }} 留言</div>
                </div>
              </div>

              <!-- 右邊區塊 -->
              <div
                v-if="post.img"
                class="w-full md:w-3/12 aspect-square rounded-lg overflow-hidden mt-4 md:mt-0"
              >
                <img :src="post.img" class="w-full h-full object-cover" alt="文章圖片" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center items-center py-4 text-gray-500">
        <p>你已經到底囉</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
:deep(.n-base-selection) {
  border-radius: 50px !important;
}

@media screen and (width < 768px) {
  .activated-tag {
    color: black;
    font-weight: bold;
    border-bottom: 2px solid rgb(44, 135, 77);
    transition: border-color 0.15s ease-in-out;
  }
}
@media screen and (width >= 768px) {
  .activated-tag {
    color: white;
    border-bottom: none;
    background-color: rgb(44, 135, 77);
    transition: border-color 0.15s ease-in-out;
  }
}
</style>
