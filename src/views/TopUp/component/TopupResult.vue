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
  console.log('result page id', id)

  const response = await getTopupRecordAPI(userStore.user.uid)
  console.log('result page', response)

  if (response) {
    oneRecord.value = response.find((record) => record.id == id)
    if (oneRecord.value.payment_status == 'SUCCESS') {
      router.push(`/topup/success/${id}`)
    } else {
      router.push(`/topup/fail/${id}`)
    }
  }
}

onMounted(() => {
  getOneTopupStatus()
})
</script>
