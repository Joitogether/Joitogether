<script setup>
import { onMounted } from 'vue'
import { NConfigProvider, NDialogProvider, NMessageProvider } from 'naive-ui'
import { getCurrentUser } from './utils/firebaseConfig'
import catLoading from './views/Home/components/catLoading.vue'

onMounted(async () => {
  await getCurrentUser()
})
</script>

<template>
  <n-config-provider>
    <n-dialog-provider>
      <n-message-provider>
        <div id="overlay">
          <catLoading />
        </div>
        <router-view />
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style scoped>
#overlay {
  opacity: 0;
  pointer-events: none;
}

#overlay.active {
  pointer-events: initial;
  opacity: 1;
}
</style>
