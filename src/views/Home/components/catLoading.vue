<script setup>
import { ref } from 'vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

// 控制是否顯示 Loading
const isVisible = ref(false)

// 對外提供顯示/隱藏的方法
function show() {
  isVisible.value = true
}

function hide() {
  isVisible.value = false
}

// 匯出顯示與隱藏方法
defineExpose({ show, hide })
</script>
<template>
  <div v-if="isVisible" class="loading-overlay">
    <dotLottieVue
      style="height: 300px; width: 300px; opacity: 0.8"
      autoplay
      loop
      speed="1"
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
  z-index: 9999;
}
</style>
