<script setup>
import { NConfigProvider, NDialogProvider, NMessageProvider } from 'naive-ui'
import { getCurrentUser } from './utils/firebaseConfig'
import { onMounted } from 'vue'

// 「記住我」功能--初始化 Firebase 狀態
// userStore.initAuthState(() => {
// console.log('Firebase 狀態初始化完成')
// })

onMounted(async () => {
  console.log('app在看使用者登入狀態')
  await getCurrentUser()
})
</script>

<template>
  <n-config-provider>
    <n-dialog-provider>
      <n-message-provider>
        <div id="loading-overlay"></div>
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
