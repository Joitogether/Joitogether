<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTopupRecordAPI } from '@/apis/topupAPI'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const oneRecord = ref(null)

const getOneTopupStatus = async () => {
  const id = route.params.id

  const response = await getTopupRecordAPI(userStore.user.uid)
  oneRecord.value = response.find((record) => record.id == id)

  if (!oneRecord.value) {
    router.push(`/topup/fail/${id}`)
  } else if (
    oneRecord.value.payment_status == 'PENDING' ||
    oneRecord.value.payment_status == 'FAIL'
  ) {
    router.push(`/topup/fail/${id}`)
  } else {
    router.push(`/topup/success/${id}`)
  }
}

onMounted(() => {
  getOneTopupStatus()
})
</script>
