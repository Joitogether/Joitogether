<script setup>
import { ref, onMounted, computed } from 'vue'
import { HeartSolid, PeopleTag, Group, HandCard } from '@iconoir/vue'
import { NProgress, NRate } from 'naive-ui'
import { useUserStore } from '@/stores/userStore'
import { getRatingsAPI } from '@/apis/userAPIs'
import { handleError } from '@/utils/handleError.js'
import dayjs from 'dayjs'

function formatDate(date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

const userStore = useUserStore()
const loading = ref(true)
const userRatings = ref([])
const averageRating = ref(0)
const ratingDistribution = ref([0, 0, 0, 0, 0])

const fetchUserRatings = async () => {
  try {
    const result = await getRatingsAPI(userStore.user.uid)

    if (!result || result.length === 0) {
      handleError()
      userRatings.value = []
      averageRating.value = 0
      ratingDistribution.value = [0, 0, 0, 0, 0]
      return
    }

    userRatings.value = result.data

    if (userRatings.value.length > 0) {
      // 計算平均分數
      const total = userRatings.value.reduce((sum, rating) => sum + rating.rating_heart, 0)
      averageRating.value = parseFloat(total / userRatings.value.length).toFixed(1)

      // 計算評分分佈
      const counts = [0, 0, 0, 0, 0]
      userRatings.value.forEach((rating) => {
        counts[rating.rating_heart - 1] += 1
      })

      const totalRatings = userRatings.value.length
      ratingDistribution.value = counts.map((count) => Math.round((count / totalRatings) * 100))
    } else {
      // 無評價時，設置預設值
      averageRating.value = 0
      ratingDistribution.value = [0, 0, 0, 0, 0]
    }
  } catch {
    handleError()
  } finally {
    loading.value = false
  }
}

const kindnessAverageRating = computed(() => {
  if (userRatings.value.length > 0) {
    const total = userRatings.value.reduce((sum, rating) => sum + rating.rating_kindness, 0)
    return parseFloat(total / userRatings.value.length).toFixed(1)
  } else {
    return 0
  }
})

const abilityAverageRating = computed(() => {
  if (userRatings.value.length > 0) {
    const total = userRatings.value.reduce((sum, rating) => sum + rating.rating_ability, 0)
    return parseFloat(total / userRatings.value.length).toFixed(1)
  } else {
    return 0
  }
})
const creditAverageRating = computed(() => {
  if (userRatings.value.length > 0) {
    const total = userRatings.value.reduce((sum, rating) => sum + rating.rating_credit, 0)
    return parseFloat(total / userRatings.value.length).toFixed(1)
  } else {
    return 0
  }
})

onMounted(() => {
  fetchUserRatings()
})
</script>

<template>
  <div class="px-5 md:flex md:justify-between md:gap-10 md:px-2">
    <div class="md:w-1/2">
      <div class="py-2">
        <div class="flex justify-center">
          <div class="flex flex-row items-center gap-1">
            <p class="text-4xl">♡</p>
            <div class="text-5xl">{{ averageRating }}</div>
          </div>
        </div>
        <div class="my-3">
          <ol class="flex flex-col gap-2">
            <li class="flex items-center gap-4 text-xl">
              5
              <n-progress
                type="line"
                color="#625B57"
                :height="20"
                :percentage="ratingDistribution[4]"
                indicator-placement="inside"
              />
            </li>
            <li class="flex items-center gap-4 text-xl">
              4
              <n-progress
                type="line"
                color="#625B57"
                :height="20"
                :percentage="ratingDistribution[3]"
                indicator-placement="inside"
              />
            </li>
            <li class="flex items-center gap-4 text-xl">
              3
              <n-progress
                type="line"
                color="#625B57"
                :height="20"
                :percentage="ratingDistribution[2]"
                indicator-placement="inside"
              />
            </li>
            <li class="flex items-center gap-4 text-xl">
              2
              <n-progress
                type="line"
                color="#625B57"
                :height="20"
                :percentage="ratingDistribution[1]"
                indicator-placement="inside"
              />
            </li>
            <li class="flex items-center gap-4 text-xl">
              1
              <n-progress
                type="line"
                color="#625B57"
                :height="20"
                :percentage="ratingDistribution[0]"
                indicator-placement="inside"
              />
            </li>
          </ol>
        </div>
      </div>

      <div class="my-5">
        <div class="flex flex-col gap-4 mb-">
          <div class="flex items-center border-b-2 py-2 gap-1">
            <PeopleTag />
            <div class="flex justify-between w-full text-base">
              <p class="">親切度</p>
              <div class="">{{ kindnessAverageRating }}</div>
              <!-- <div>{{ kindnessAverageRating1 }}</div> -->
            </div>
          </div>
          <div class="flex border-b-2 py-2 gap-1">
            <Group />
            <div class="flex justify-between w-full text-base">
              <div class="">主辦能力</div>
              <div class="">{{ abilityAverageRating }}</div>
            </div>
          </div>
          <div class="flex border-b-2 py-2 gap-1">
            <HandCard />
            <div class="flex justify-between w-full text-base">
              <div class="">信用度</div>
              <div class="">{{ creditAverageRating }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-14 mb-10 md:w-1/2 md:mt-8">
      <div class="flex justify-between pb-2 mb-4 border-b-2 border-gray-200">
        <div class="m-auto text-2xl">{{ userRatings.length }} 則評價</div>
      </div>
      <div class="mt-2">
        <div v-if="userRatings.length === 0" class="text-center text-gray-500">
          目前還沒有評價呦
        </div>
        <div v-else class="mb-4">
          <div
            v-for="ratings in userRatings"
            :key="ratings.rating_id"
            class="my-5 bg-gray-100 py-2 px-4 rounded-md flex flex-col gap-1"
          >
            <div class="flex gap-2 justify-between items-center">
              <div class="flex items-center gap-2">
                <div class="w-12 h-12 overflow-hidden rounded-full">
                  <img
                    :src="ratings.users_ratings_host_idTousers.photo_url"
                    class="w-full h-full object-cover"
                  />
                </div>
                <p class="text-base font-bold">
                  {{ ratings.users_ratings_host_idTousers.display_name }}
                </p>
              </div>
              <n-rate color="#dd4b2f" readonly :default-value="ratings.rating_heart">
                <n-icon size="16"> <HeartSolid /></n-icon>
              </n-rate>
            </div>
            <div class="flex items-center">
              <div class="text-gray-500">
                {{ formatDate(ratings.created_at) }}
              </div>
            </div>
            <div>
              <span>{{ ratings.user_comment }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
