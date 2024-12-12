<script setup>
import {NConfigProvider,NDialogProvider,NMessageProvider} from 'naive-ui'
import { useUserStore } from './stores/userStore'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './utils/firebaseConfig';
const userStore = useUserStore()

// 「記住我」功能--初始化 Firebase 狀態
// userStore.initAuthState(() => {
  // console.log('Firebase 狀態初始化完成')
// })
onAuthStateChanged(auth, (user) => {
  if (user) {
    userStore.setUser(user)
  }else{
    userStore.clearUser()
  }
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
