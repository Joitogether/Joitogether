<script setup>
import BannerComponent from './components/BannerComponent.vue'
import PostComponent from './components/PostComponent.vue'
import ActivityComponent from './components/ActivityComponent.vue'
import { useUserStore } from '/src/stores/userStore.js'
import { useMessage } from 'naive-ui'
import { watch, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// 初始化區域
const userStore = useUserStore()
const message = useMessage()

const hasInitialized = ref(false)
const skipNextWatch = ref(false)

onMounted(() => {
  if (userStore.user.isLogin) {
    message.success(`歡迎回來 ${userStore.user.display_name}，很高興見到您！🎉`)
  } else {
    message.warning('😵 您尚未登入，部分功能可能無法使用喔！💔')
  }
})

// 監聽登入狀態的變化（避免在初始化時重複執行）
watch(
  () => userStore.user.isLogin,
  (isLogin, prevLogin) => {
    if (skipNextWatch.value) {
      skipNextWatch.value = false
      return
    }

    // 僅在初始化完成且狀態真正變化時觸發
    if (hasInitialized.value && isLogin !== prevLogin) {
      if (isLogin) {
        message.success(`歡迎回來 ${userStore.user.display_name} 🎉`)
      } else {
        message.warning('😵 您尚未登入，部分功能可能無法使用喔！💔')
      }
    }
  },
)
const route = useRoute()
const isSearch = ref(false)

watch(
  () => {
    return route.query.q
  },
  (value) => {
    if (value) {
      isSearch.value = true
    } else {
      isSearch.value = false
    }
  },
  {
    immediate: true,
  },
)
</script>
<template>
  <div v-if="!isSearch">
    <BannerComponent></BannerComponent>
    <PostComponent />
  </div>
  <ActivityComponent />
</template>
<style scoped></style>
