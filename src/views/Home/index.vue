<script setup>
import BannerComponent from './components/BannerComponent.vue'
import FooterComponent from './components/FooterComponent.vue'
import PostComponent from './components/PostComponent.vue'
import ActivityComponent from './components/ActivityComponent.vue'
import { useUserStore } from '/src/stores/userStore.js'
import { useMessage } from 'naive-ui'
import { watch, ref, onMounted } from 'vue'

// 初始化區域
const userStore = useUserStore()
const message = useMessage()
// 活動創建是否顯示

// 判斷當前登入狀態彈窗顯示不同信息
// 初始化完成標誌
const hasInitialized = ref(false)
// 用於屏蔽初始化後的 watch 執行
const skipNextWatch = ref(false)

onMounted(() => {
    if (userStore.user.isLogin) {
      message.success(`歡迎回來 ${userStore.user.display_name}，很高興見到您！🎉`)
    } else {
      message.warning('😵 您尚未登入，部分功能可能無法使用喔！💔')
    }
  }
)

// 監聽登入狀態的變化（避免在初始化時重複執行）
watch(
  () => userStore.user.isLogin,
  (isLogin, prevLogin) => {
    if (skipNextWatch.value) {
      skipNextWatch.value = false // 重置標誌，允許後續監聽
      return // 跳過本次 watch 執行
    }

    // 僅在初始化完成且狀態真正變化時觸發
    if (hasInitialized.value && isLogin !== prevLogin) {
      if (isLogin) {
        // 登入提示
        // message.success('🎉 歡迎回來～開心見到您！✨')
        message.success(`歡迎回來 ${userStore.user.display_name} 🎉`)
          // 活動創建顯示
      } else {
        // 未登入提示
        message.warning('😵 您尚未登入，部分功能可能無法使用喔！💔')
        // 活動創建顯示
      }
    }
  },
)
</script>
<template>
  <BannerComponent></BannerComponent>
  <PostComponent />
  <ActivityComponent />
  <FooterComponent></FooterComponent>
</template>
<style scoped></style>
