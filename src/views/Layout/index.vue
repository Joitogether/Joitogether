<script setup>
import NavbarComponent from './component/NavbarComponent.vue'
import FooterComponent from './component/FooterComponent.vue'
</script>

<template>
  <NavbarComponent :isUserLoggedIn="activityCreate" class="" />
  <div class="mt-16">
    <router-view></router-view>
  </div>
  <FooterComponent />
</template>
