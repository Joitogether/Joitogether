<script setup>
import NavbarComponent from './component/NavbarComponent.vue'
import FooterComponent from './component/FooterComponent.vue'
</script>

<template>
  <NavbarComponent isUserLoggedIn="activityCreate" />
  <router-view></router-view>
  <FooterComponent></FooterComponent>
</template>
