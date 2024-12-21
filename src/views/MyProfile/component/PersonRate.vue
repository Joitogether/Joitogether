<script setup>
import { ref, onMounted } from 'vue'
import { Heart, Search, HeartSolid } from '@iconoir/vue'
import { NProgress, NDropdown, NButton, NRate } from 'naive-ui'
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
  <div class="mx-6 mt-6">
    <section class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <div>
          <div class="text-center">
            <section>
              <h2 class="flex justify-center m-2">
                <div><Heart width="50" height="50" /></div>
                <div class="text-5xl">{{ averageRating }}</div>
              </h2>
              <p></p>
            </section>
          </div>
          <div class="mb-3">
            <ol>
              <li class="flex">
                5
                <n-progress
                  type="line"
                  color="#625B57"
                  :percentage="ratingDistribution[4]"
                  indicator-placement="inside"
                  processing
                />
              </li>
              <li class="flex">
                4
                <n-progress
                  type="line"
                  color="#625B57"
                  :percentage="ratingDistribution[3]"
                  indicator-placement="inside"
                  processing
                />
              </li>
              <li class="flex">
                3
                <n-progress
                  type="line"
                  color="#625B57"
                  :percentage="ratingDistribution[2]"
                  indicator-placement="inside"
                  processing
                />
              </li>
              <li class="flex">
                2
                <n-progress
                  type="line"
                  color="#625B57"
                  :percentage="ratingDistribution[1]"
                  indicator-placement="inside"
                  processing
                />
              </li>
              <li class="flex">
                1
                <n-progress
                  type="line"
                  color="#625B57"
                  :percentage="ratingDistribution[0]"
                  indicator-placement="inside"
                  processing
                />
              </li>
            </ol>
          </div>
          <div class="mb-2">
            <h3 class="text-lg">評價細項</h3>
          </div>
          <div class="">
            <div class="flex border-b-4 my-4">
              <div class="mx-3 my-0.2"><Heart /></div>
              <div class="flex justify-between w-full">
                <div>親切度</div>
                <div>{{ kindnessAverageRating }}</div>
                <div>{{ kindnessAverageRating1 }}</div>
              </div>
            </div>
            <div class="flex border-b-4 my-4">
              <div class="mx-3 my-0.2"><Heart /></div>
              <div class="flex justify-between w-full">
                <div>主辦能力</div>
                <div class="">{{ abilityAverageRating }}</div>
              </div>
            </div>
            <div class="flex border-b-4 my-4">
              <div class="mx-3 my-0.2"><Heart /></div>
              <div class="flex justify-between w-full">
                <div>信用度</div>
                <div class="justify-self-end">{{ creditAverageRating }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="border-b-4 mb-5">
          <div class="flex justify-between mb-4">
            <div class="m-auto text-xl">{{ userRatings.length }} 則評價</div>
            <div>
              <n-dropdown trigger="click" :options="options" @select="handleSelect">
                <n-button>最新</n-button>
              </n-dropdown>
            </div>
          </div>
          <div class="flex flex-wrap mb-4">
            <div><Search /></div>
            <label for="reviews-search-input">
              <input type="text" id="reviews-search-input" placeholder="搜尋評價"
            /></label>
          </div>
        </div>
        <div class="mt-2">
          <div class="mb-4">
            <div v-for="ratings in userRatings" :key="ratings.rating_id" class="my-5">
              <section class="flex gap-2">
                <div class="max-w-[44px] max-h-[44px]">
                  <a href=""
                    ><img
                      :src="ratings.users_ratings_host_idTousers.photo_url"
                      class="rounded-full"
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
    </section>
  </div>
</template>
