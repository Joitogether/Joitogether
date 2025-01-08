<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
</script>
<template>
  <div class="loading-overlay">
    <dotLottieVue
      style="height: 300px; width: 300px; opacity: 0.8"
      autoplay
      loop
      :speed="3"
      src="https://lottie.host/6aa57e00-66e4-44c2-b706-97398d52a474/VreoUPDW5c.json"
    />
  </div>
</template>
<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999999;
}
</style>
