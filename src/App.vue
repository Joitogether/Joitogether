<script setup>
import {NConfigProvider,NDialogProvider,NMessageProvider} from 'naive-ui'
</script>

<template>
  <n-config-provider>
    <n-dialog-provider>
      <n-message-provider>
      <RouterView />
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style scoped></style>
