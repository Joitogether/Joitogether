<script setup>
import { useUserStore } from './stores/userStore'

const userStore = useUserStore()

// 「記住我」功能--初始化 Firebase 狀態
userStore.initAuthState(() => {
  // console.log('Firebase 狀態初始化完成')
})
</script>

<template>
  <n-message-provider>
    <RouterView />
  </n-message-provider>
</template>

<style scoped></style>
