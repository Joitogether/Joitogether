<script setup>
import BannerComponent from './components/BannerComponent.vue'
import FooterComponent from './components/FooterComponent.vue'
import PostComponent from './components/PostComponent.vue'
import ActivityComponent from './components/ActivityComponent.vue'
import NavbarComponent from './components/NavbarComponent.vue'
import { useUserStore } from '/src/stores/userStore.js'
import { useMessage } from 'naive-ui'
import { watch, ref, onMounted } from 'vue'

// 初始化區域
const userStore = useUserStore()
const message = useMessage()

// 判斷當前登入狀態彈窗顯示不同信息
// 初始化完成標誌
const hasInitialized = ref(false)
// 用於屏蔽初始化後的 watch 執行
const skipNextWatch = ref(false)

onMounted(() => {
  // 使用 onAuthStateChanged 確保狀態同步後進行初始化
  userStore.initAuthState(() => {
    if (!hasInitialized.value) {
      // 標記初始化完成
      hasInitialized.value = true
      // 屏蔽下一次 watch 執行
      skipNextWatch.value = true
      if (userStore.isLogin) {
        // 初始化時登入提示
        // message.success('🎉 歡迎回來～很高興見到您！✨')
        message.success(`歡迎回來 ${userStore.userName}，很高興見到您！🎉`)
      } else {
        // 初始化時未登入提示
        message.warning('😵 您尚未登入，部分功能可能無法使用喔！💔')
      }
    }
  })
})

// 監聽登入狀態的變化（避免在初始化時重複執行）
watch(
  () => userStore.isLogin,
  (isLogin, prevLogin) => {
    if (skipNextWatch.value) {
      skipNextWatch.value = false // 重置標誌，允許後續監聽
      return // 跳過本次 watch 執行
    }

    // 僅在初始化完成且狀態真正變化時觸發
    if (hasInitialized.value && isLogin !== prevLogin) {
      if (isLogin) {
        // 登入提示
        message.success('🎉 歡迎回來～開心見到您！✨')
        // message.success(`歡迎回來 ${userStore.userName} 🎉`)
      } else {
        // 未登入提示
        message.warning('😵 您尚未登入，部分功能可能無法使用喔！💔')
      }
    }
  },
)
</script>
<template>
  <NavbarComponent />
  <BannerComponent></BannerComponent>
  <PostComponent />
  <ActivityComponent />
  <FooterComponent></FooterComponent>
</template>
<style scoped></style>
