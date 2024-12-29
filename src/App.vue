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
        <router-view />
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style scoped></style>
