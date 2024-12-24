<script setup>
import { ref, onMounted } from 'vue'
import { HeartSolid, PeopleTag, Group, HandCard } from '@iconoir/vue'
import { NProgress, NRate } from 'naive-ui'
import { useUserStore } from '@/stores/userStore'
import { getRatingsAPI } from '@/apis/userAPIs'
import { computed } from 'vue'
const userStore = useUserStore()
const loading = ref(true)
const errorMessage = ref(null)
const userRatings = ref([])
const averageRating = ref(0)
const ratingDistribution = ref([0, 0, 0, 0, 0])

const fetchUserRatings = async () => {
  try {
    const result = await getRatingsAPI(userStore.user.uid)
    console.log('API回傳資料:', result.data)
    userRatings.value = result.data
    // console.log(result.length)
    if (userRatings.value.length > 0) {
      const total = userRatings.value.reduce((sum, rating) => sum + rating.rating_heart, 0)
      averageRating.value = parseFloat(total / userRatings.value.length).toFixed(1)
      const counts = [0, 0, 0, 0, 0]
      userRatings.value.forEach((rating) => {
        counts[rating.rating_heart - 1] += 1
        const totalRatings = userRatings.value.length
        ratingDistribution.value = counts.map((count) => (count / totalRatings) * 100)
      })
    } else {
      averageRating.value = 0
    }
    // console.log('平均 rating_heart:', average.toFixed(2))
  } catch (err) {
    errorMessage.value = err.message || '資料加載錯誤'
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
  <div class="bg-gray-50 rounded-md px-10 py-4">
    <div class="py-2">
      <div class="flex justify-center m-2">
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
              processing
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
              processing
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
              processing
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
              processing
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
              processing
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

    <div class="my-10">
      <div class="flex justify-between mb-4">
        <div class="m-auto text-xl">{{ userRatings.length }} 則評價</div>
      </div>
      <div class="mt-2">
        <div class="mb-4">
          <div v-for="ratings in userRatings" :key="ratings.rating_id" class="my-5">
            <section class="flex gap-2">
              <div class="max-w-[44px] max-h-[44px]">
                <a href=""
                  ><img :src="ratings.users_ratings_host_idTousers.photo_url" class="rounded-full"
                /></a>
              </div>
              <div>
                <h2>{{ ratings.users_ratings_host_idTousers.display_name }}</h2>
                <div>{{ ratings.users_ratings_host_idTousers.city }}</div>
              </div>
            </section>
            <div class="flex items-center">
              <n-rate color="red" readonly :default-value="ratings.rating_heart">
                <n-icon size="13"> <HeartSolid /> </n-icon>
              </n-rate>
              <div>・</div>
              {{ ratings.created_at }}
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
