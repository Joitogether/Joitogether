<script setup>
import { computed } from 'vue'
import NavbarComponent from './component/NavbarComponent.vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const activityCreate = computed(() => {
  return userStore.user.isLogin
})
</script>

<template>
  <NavbarComponent :isUserLoggedIn="activityCreate" class="" />
  <div class="mt-16">
    <router-view></router-view>
  </div>
</template>
