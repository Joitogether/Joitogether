<script setup>
import { useUserStore } from './stores/userStore'
import { onMounted } from 'vue'

const userStore = useUserStore()

// 「記住我」功能--初始化 Firebase 狀態
onMounted(() => {
  userStore.initAuthState()
})
</script>

<template>
  <n-message-provider>
    <RouterView />
  </n-message-provider>
</template>

<style scoped></style>
