<script setup>
import { NConfigProvider, NDialogProvider, NMessageProvider } from 'naive-ui'
import { getCurrentUser } from './utils/firebaseConfig'
import { onMounted } from 'vue'

onMounted(async () => {
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
