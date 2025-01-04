<script setup>
import { ref, onMounted } from 'vue'
import { NConfigProvider, NDialogProvider, NMessageProvider } from 'naive-ui'
import { getCurrentUser } from './utils/firebaseConfig'
import catLoading from './views/Home/components/catLoading.vue'
import { useRouter } from 'vue-router'

const loadingRef = ref(null)
const router = useRouter()

// 監聽路由變化
router.beforeEach((to, from, next) => {
  loadingRef.value?.show()
  next()
})

router.afterEach(() => {
  setTimeout(() => {
    loadingRef.value?.hide()
  }, 500) // 適當延遲確保頁面已加載完成
})

onMounted(async () => {
  await getCurrentUser()
})
</script>

<template>
  <n-config-provider>
    <n-dialog-provider>
      <n-message-provider>
        <div id="loading-overlay"></div>
        <catLoading ref="loadingRef" />
        <router-view />
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style scoped>
#loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 5999;
  display: none;
}

#loading-overlay.active {
  display: block;
}
</style>
