<template>
  <div>
    <!-- <h1>{{ category }} 文章</h1> -->
    <ul>
      <li v-for="post in filteredPosts" :key="post.id">{{ post.title }}</li>
    </ul>
    <div class="tags">
      <p
        v-for="tag in tags"
        :key="tag"
        @click="handleTagSelect(tag)"
        :class="{ 'activated-tag': selectedTag === tag }"
        class="text-gray-400 border-transparent text-center pb-1 md:pb-0 border-b-[2px] md:md:rounded-full flex-1 cursor-pointer md:leading-0 leading-9 md:bg-yellow-300 text-base py-1 md:py-0 md:px-4 md:mr-3"
      >
        {{ tag }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 初始化文章數據和篩選後的文章
const posts = ref([])
const filteredPosts = ref([])

const selectedTag = ref('')
const tags = ['food', 'shopping', 'travel', 'sports', 'education', 'others']

// 假設這是從 API 獲取文章資料的函數
const getPosts = async () => {
  // 模擬從 API 獲取數據
  return [
    { id: 1, title: '美食探險', category: 'food' },
    { id: 2, title: '購物心得', category: 'shopping' },
    { id: 3, title: '旅行日記', category: 'travel' },
    { id: 4, title: '運動健康', category: 'sports' },
    { id: 5, title: '教育學習', category: 'education' },
    { id: 6, title: '其他話題', category: 'others' },
  ]
}

// 根據當前的 category 篩選文章
const filterPostsByCategory = (category) => {
  filteredPosts.value = posts.value.filter((post) => post.category === category)
}

// 當選擇標籤時，更新路由和過濾文章
const handleTagSelect = (tag) => {
  selectedTag.value = tag
  // 更新路由參數
  router.push({ name: 'CategoryPosts', params: { category: tag } })
}

// 載入所有文章
const fetchPosts = async () => {
  posts.value = await getPosts() // 獲取所有文章
  filterPostsByCategory(route.params.category) // 根據當前路由中的分類篩選文章
}

// 監聽路由變化
watch(
  () => route.params.category,
  (newCategory) => {
    filterPostsByCategory(newCategory) // 根據新的分類過濾文章
  },
)

onMounted(() => {
  fetchPosts() // 初次載入時，根據路由參數載入文章
})
</script>
