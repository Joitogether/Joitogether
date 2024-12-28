<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const getTopupStatus = async () => {
  const status = route.query.Status
  // newebpay_transactions的id
  const id = route.params.id
  if (status == 'SUCCESS') {
    router.push(`/topup/success/${id}`)
  } else {
    router.push(`/topup/fail/`)
  }
}
onMounted(() => {
  getTopupStatus()
})
</script>
