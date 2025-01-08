<script setup>
import { NResult, NButton } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()
const goTopup = () => {
  router.push('/topup')
}
</script>
<template>
  <n-result
    status="warning"
    title="儲值失敗"
    description="本次儲值未成功，請再試一次"
    class="mt-10 mx-14"
  />
  <div class="flex justify-center my-14">
    <n-button ghost round @click="goTopup">再儲值一次</n-button>
  </div>
</template>
