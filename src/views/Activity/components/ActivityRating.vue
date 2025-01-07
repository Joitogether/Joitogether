<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useMessage, useDialog, NRate, NSpace, NInput, NModal } from 'naive-ui'
import { CheckCircle, CheckCircleSolid, HeartSolid, PeopleTag, Group, HandCard } from '@iconoir/vue'
import { useRoute, useRouter } from 'vue-router'
import { ratingGetDetailAPI, ratingSubmitAPI } from '@/apis/ratingAPIs'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores/userStore'
import { handleError } from '@/utils/handleError.js'
import { formatDate } from '@/utils/useDateTime'
import { userFollowersAddAPI, userGetFollowingAPI } from '@/apis/userAPIs'
import { useSocketStore } from '@/stores/socketStore'

dayjs.locale('zh-tw')

const socketStore = useSocketStore()
const userStore = useUserStore()
const dialog = useDialog()
const message = useMessage()
const route = useRoute()
const router = useRouter()
const activityDetail = ref({})
const hostInfo = ref({})
const hostRatingAverage = ref({})
const latestHostRating = ref()
const checkFollowing = ref([])
const applications = ref([])
const isParticipant = computed(() => {
  return applications.value.some((application) => {
    return application.participant_id == userStore.user.uid && application.register_validated
  })
})

const clickTheFollowBtn = () => {
  dialog.success({
    title: '確認追蹤',
    content: '您確定要追蹤團主嗎',
    negativeText: '取消',
    positiveText: '確定',
    onPositiveClick: () => {
      FollowSuccess()
    },
    onNegativeClick: () => {
      message.success('已取消操作')
    },
  })
}
const FollowSuccess = async () => {
  await userFollowersAddAPI({
    user_id: hostInfo.value.uid,
    follower_id: userStore.user.uid,
  })
  checkFollowing.value = { isFollowing: true }
  message.success('您已成功追蹤團主啦~')
}
const fetchFollowingData = async () => {
  const response = await userGetFollowingAPI(userStore.user.uid)
  if (response.length > 0) {
    const matchingItem = response.find((item) => item.user_id == hostInfo.value.uid)
    checkFollowing.value = matchingItem
      ? { isFollowing: true, ...matchingItem }
      : { isFollowing: false }
  } else {
    checkFollowing.value = { isFollowing: false }
  }
}

const step = ref(0)

const goStep1 = () => {
  step.value = 1
}

const backStep0 = () => {
  step.value = 0
}

const getDetailForRating = async () => {
  try {
    const { activity_id } = route.params
    const res = await ratingGetDetailAPI(activity_id)

    if (!res || !res.activity) {
      activityDetail.value = {}
      hostInfo.value = {}
      hostRatingAverage.value = {}
      latestHostRating.value = null
      return
    }

    activityDetail.value = res.activity
    hostInfo.value = res.activity.users || {}
    hostRatingAverage.value = res.hostRatingAverage['_avg'] || {}
    latestHostRating.value = res.latestHostRating || null
    applications.value = res.applications || []

    if (!isParticipant.value) {
      message.warning('您並未參與此活動，故無法進行評輪')
      setTimeout(() => {
        router.push(`/`)
      }, 1500)
    } else {
      if (applications.value) {
        const found = latestHostRating.value.find((rate) => rate.user_id == userStore.user.uid)

        if (found) {
          message.warning('您已經評價過囉！')
          setTimeout(() => {
            router.push(`/`)
          }, 1500)
        }
      }
    }
  } catch (error) {
    activityDetail.value = {}
    hostInfo.value = {}
    hostRatingAverage.value = {}
    latestHostRating.value = null
    applications.value = []
    handleError(message, '無法加載活動資料，請稍後再試 🙏', error)
  }
}

onMounted(async () => {
  await getDetailForRating()
  await fetchFollowingData()
})

const ratingForm = reactive({
  comment: '',
  overall: 0,
  kindness: 0,
  ability: 0,
  credit: 0,
})

// 滑鼠懸停狀態
const hoverStates = reactive({
  overall: 0,
  kindness: 0,
  ability: 0,
  credit: 0,
})

const submitRating = async () => {
  if (!isParticipant.value) {
    return message.warning('您並未參與此活動，故無法進行評輪')
  }
  try {
    const data = {
      host_id: activityDetail.value.host_id,
      user_id: userStore.user.uid,
      user_comment: ratingForm.comment,
      rating_heart: ratingForm.overall,
      rating_kindness: ratingForm.kindness,
      rating_credit: ratingForm.credit,
      rating_ability: ratingForm.ability,
      activity_id: parseInt(route.params.activity_id),
    }
    const res = await ratingSubmitAPI(data)
    showSubmitModal.value = false
    message.success('評價成功！')

    const notiData = {
      actor_id: userStore.user.uid,
      user_id: activityDetail.value.host_id,
      target_id: res.data.rating_id,
      action: 'rate',
      target_type: 'rating',
      message: '留下了活動的評價',
      link: `/profile/${activityDetail.value.host_id}`,
    }
    // 送出提醒
    socketStore.sendNotification(notiData)

    step.value = 2
  } catch (error) {
    if (error.response?.data.message == '資料唯一性衝突') {
      message.error('你已評價過，無法重複評價')
    } else {
      message.error('評價失敗')
    }
  }
}
const showSubmitModal = ref(false)

// 這裡是定義愛心
// 定義 Props
const props = defineProps({
  score: {
    type: Number,
    default: 0,
  },
  maxHearts: {
    type: Number,
    default: 5,
  },
})

// 當前評分的響應式狀態
const currentScore = ref(props.score)

// 方法：更新評分
const setRating = (index, category) => {
  ratingForm[category] = index
}

// 方法：設置 hover 狀態
const setHover = (index, category) => {
  hoverStates[category] = index
}

// 方法：重置 hover 狀態
const resetHover = (category) => {
  hoverStates[category] = 0
}
// 當父組件的 `score` 改變時，更新 `currentScore`
watch(
  () => props.score,
  (newScore) => {
    currentScore.value = newScore
  },
)

watch(
  () => route.params.activity_id,
  () => {
    getDetailForRating()
  },
)
</script>

<template>
  <body class="bg-gray-100">
    <!-- 活動評價 -->
    <div class="flex flex-col w-full mx-auto p-5 bg-white md:w-3/4 lg:w-3/5">
      <div
        v-if="step == 0"
        class="relative flex items-center pl-5 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-2 before:w-2 before:h-full before:bg-green-600"
      >
        <p class="text-base md:text-lg">活動評價</p>
        <p class="text-gray-600 text-base font-bold md:text-lg">團主評價</p>
      </div>
      <div
        v-else-if="step == 1"
        class="relative flex items-center pl-5 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-2 before:w-2 before:h-full before:bg-green-600"
      >
        <div class="text-base md:text-lg">活動評價</div>
        <div class="text-gray-600 text-base font-bold md:text-lg">追蹤活動</div>
      </div>
      <div
        v-else-if="step == 2"
        class="relative flex items-center pl-5 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-2 before:w-2 before:h-full before:bg-green-600"
      >
        <div class="text-base md:text-lg">活動評價</div>
        <div class="text-gray-600 text-base font-bold md:text-lg">完成評價</div>
      </div>

      <!-- 評分進度 -->
      <div
        class="flex flex-row w-full max-w-[400px] justify-around m-auto bg-white border-2 p-1 my-3 rounded-full xl:text-base xl:py-1 md:text-md sm:text-sm"
      >
        <div>
          <!-- 團主評價到此頁面的進度顯示-->
          <div
            :class="{ 'text-green-600': step == 0, 'text-gray-300': step != 0 }"
            class="flex justify-center items-center font-bold tracking-widest"
          >
            <CheckCircleSolid v-if="step == 0" class="mr-1" />團主評價
            <CheckCircle v-if="step != 0" class="mr-1" />
          </div>
        </div>
        <div>
          <!-- 還沒到追蹤評價頁面的進度顯示-->
          <div
            :class="{ 'text-green-600': step == 1, 'text-gray-300': step != 1 }"
            class="flex justify-center items-center font-bold tracking-widest"
          >
            <CheckCircleSolid v-if="step == 1" class="mr-1" />
            <CheckCircle v-if="step != 1" class="mr-1" />追蹤活動
          </div>
          <!-- 到追蹤評價頁面的進度顯示-->

          <!-- <div class="flex justify-center items-center text-green-600 font-bold tracking-widest">
            <CheckCircleSolid class="mr-1" />追蹤活動
          </div> -->
        </div>
        <div>
          <!-- 還沒到最後完成頁面的進度顯示 -->
          <div
            :class="{ 'text-green-600': step == 2, 'text-gray-300': step != 2 }"
            class="flex justify-center items-center font-bold tracking-widest"
          >
            <CheckCircleSolid v-if="step == 2" class="mr-1" />
            <CheckCircle v-if="step != 2" class="mr-1" />完成
          </div>
          <!-- 到完成介面的進度顯示 -->
          <!-- <div class="flex justify-center items-center text-green-600 font-bold tracking-widest"><CheckCircleSolid class="mr-1" />完成</div> -->
        </div>
      </div>

      <!-- 活動區域 -->
      <div class="flex flex-col w-full gap-2">
        <!-- 照片 -->
        <div class="flex w-full overflow-hidden rounded-md">
          <img
            :src="activityDetail.img_url"
            class="w-full h-full xs:w-full sm:w-full md:w-full object-cover"
          />
        </div>
        <!-- 活動資訊 -->
        <div class="flex flex-col">
          <p class="text-xl text-green-600 font-bold tracking-wide line-clamp-2 md:text-2xl">
            {{ activityDetail.name }}
          </p>
          <div class="flex text-base">
            <p class="">團主：</p>
            <p class="">{{ hostInfo.display_name }}</p>
          </div>

          <div class="flex text-base">
            <div class="flex">
              <p class="">活動日期：</p>
              <p class="">{{ dayjs(activityDetail.event_time).format('YYYY-MM-DD ') }}</p>
            </div>
          </div>
          <div
            class="flex flex-col gap-4 w-full mt-2 p-3 rounded-md border-2 border-gray-100 md:flex-col"
          >
            <div class="w-full">
              <p class="text-base font-medium mb-2">過去團主評價</p>
              <div class="flex flex-col md:flex-row md:justify-between gap-3">
                <div
                  class="flex justify-between bg-gray-100 rounded-md p-3 md:flex-col md:w-1/3 md:gap-1"
                >
                  <div class="flex items-center gap-1">
                    <PeopleTag />
                    <p>親切度</p>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="static-heart-rating readonly">
                      <span
                        v-for="index in 5"
                        :key="'kindness-' + index"
                        class="static-heart"
                        :class="{ filled: index <= hostRatingAverage.rating_kindness }"
                      >
                      </span>
                    </div>
                    <div class="mx-2 text-base">
                      {{ hostRatingAverage.rating_kindness?.toFixed(1) || '0.0' }}
                    </div>
                  </div>
                </div>

                <div
                  class="flex justify-between bg-gray-100 rounded-md p-3 md:flex-col md:w-1/3 md:gap-1"
                >
                  <div class="flex items-center gap-1">
                    <Group />
                    <p>主辦能力</p>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="static-heart-rating readonly">
                      <span
                        v-for="index in 5"
                        :key="'kindness-' + index"
                        class="static-heart"
                        :class="{ filled: index <= hostRatingAverage.rating_ability }"
                      >
                      </span>
                    </div>
                    <div class="mx-2 text-base">
                      {{ hostRatingAverage.rating_ability?.toFixed(1) || '0.0' }}
                    </div>
                  </div>
                </div>
                <div
                  class="flex justify-between bg-gray-100 rounded-md p-3 md:flex-col md:w-1/3 md:gap-1"
                >
                  <div class="flex items-center gap-1">
                    <HandCard />
                    <p>信用度</p>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="static-heart-rating readonly">
                      <span
                        v-for="index in 5"
                        :key="'kindness-' + index"
                        class="static-heart"
                        :class="{ filled: index <= hostRatingAverage.rating_credit }"
                      >
                      </span>
                    </div>
                    <div class="mx-2 text-base">
                      {{ hostRatingAverage.rating_credit?.toFixed(1) || '0.0' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="md:w-full">
              <div class="text-base font-medium mb-2">過去其他用戶對團主評價</div>
              <div
                v-if="latestHostRating && latestHostRating.length > 0"
                class="grid grid-cols-1 gap-3 md:grid-cols-2"
              >
                <div
                  v-for="(rating, index) in latestHostRating"
                  :key="index"
                  class="p-3 bg-gray-100 rounded-md"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex items-center">
                      <div class="flex items-center gap-2">
                        <div class="w-7 h-7 overflow-hidden rounded-full md:w-9 md:h-9">
                          <img
                            :src="rating.users_ratings_user_idTousers.photo_url"
                            class="w-full h-full object-cover"
                          />
                        </div>
                        <div class="flex flex-col items-start">
                          <div class="text-xs">
                            {{ rating.users_ratings_user_idTousers.display_name }}
                          </div>
                          <div class="text-[10px]">{{ formatDate(rating.created_at) }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="flex flex-col items-center">
                      <div class="flex items-center">
                        <n-rate
                          readonly
                          v-model:value="rating.rating_heart"
                          :default-value="5"
                          color="#B91C1C"
                        >
                          <HeartSolid class="w-3" />
                        </n-rate>
                      </div>
                    </div>
                  </div>
                  <div class="text-xs tracking-wider truncate mt-2">
                    {{ rating.user_comment }}
                  </div>
                </div>
              </div>
              <p v-else class="mt-2">暫無用戶評價</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 用戶在填寫團主評價的資訊 -->
      <div v-if="step == 0" class="bg-gray-100 rounded-md mt-6 px-4 py-6">
        <div class="flex flex-col items-center gap-2 border-b-2 border-white pb-3">
          <div class="w-20 h-20 mx-auto overflow-hidden flex-shrink-0 rounded-full">
            <img :src="userStore.user.photo_url" class="w-full h-full object-cover" />
          </div>
          <div class="mx-2 text-lg font-bold tracking-wide text-gray-700">
            {{ userStore.user.display_name }}
          </div>
        </div>
        <div class="flex flex-col items-center gap-4 mt-5">
          <div class="flex flex-col items-center gap-2">
            <p class="text-base text-gray-700">您對於本次揪團的評價為？</p>
            <div class="heart-rating" @mouseleave="resetHover('overall')">
              <span
                v-for="index in maxHearts"
                :key="'overall-' + index"
                class="heart"
                :class="{ filled: index <= hoverStates.overall || index <= ratingForm.overall }"
                @mouseenter="setHover(index, 'overall')"
                @click="setRating(index, 'overall')"
              ></span>
            </div>
          </div>
          <div class="flex flex-col items-center gap-2">
            <p class="text-base text-gray-700">團主的親切度，您願意給到幾分呢？</p>
            <div class="heart-rating" @mouseleave="resetHover('kindness')">
              <span
                v-for="index in maxHearts"
                :key="'kindness-' + index"
                class="heart"
                :class="{ filled: index <= hoverStates.kindness || index <= ratingForm.kindness }"
                @mouseenter="setHover(index, 'kindness')"
                @click="setRating(index, 'kindness')"
              >
              </span>
            </div>
          </div>
          <div class="flex flex-col items-center gap-2">
            <p class="text-base text-gray-700">團主的主辦能力，您願意給到幾分呢？</p>
          </div>
          <div class="heart-rating" @mouseleave="resetHover('ability')">
            <span
              v-for="index in maxHearts"
              :key="'ability-' + index"
              class="heart"
              :class="{ filled: index <= hoverStates.ability || index <= ratingForm.ability }"
              @mouseenter="setHover(index, 'ability')"
              @click="setRating(index, 'ability')"
            >
            </span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <p class="text-base text-gray-700">團主的信用度，您願意給到幾分呢？</p>
          </div>
          <div class="heart-rating" @mouseleave="resetHover('credit')">
            <span
              v-for="index in maxHearts"
              :key="'credit-' + index"
              class="heart"
              :class="{ filled: index <= hoverStates.credit || index <= ratingForm.credit }"
              @mouseenter="setHover(index, 'credit')"
              @click="setRating(index, 'credit')"
            ></span>
          </div>
        </div>
        <div class="flex flex-col mt-5 gap-2">
          <p class="text-center text-base text-gray-700">留下您想對團主說的話：</p>
          <n-space vertical>
            <n-input
              :autosize="{ minRows: 3, maxRows: 5 }"
              placeholder="該選項為選填，如果沒有特別想留下的話~那就下一步吧"
              type="textarea"
              v-model:value="ratingForm.comment"
              maxlength="200"
              show-count
            />
          </n-space>
          <!-- <textarea
            class="h-28 border-2 border-gray-300 rounded-md resize-none p-2"
            name="ThingsYouWantToSay"
            id="ThingsYouWantToSay"
            maxlength="200"
            placeholder="該選項為選填，如果沒有特別想留下的話~那就下一步吧"
          ></textarea> -->
        </div>
        <div class="m-3 flex justify-center">
          <n-button round type="success" @click="goStep1" class="px-5 tracking-widest"
            >下一步</n-button
          >
        </div>
      </div>
      <!-- 追蹤團主介面 -->
      <div v-else-if="step == 1" class="bg-gray-100 rounded-md mt-6 px-4 py-6">
        <div class="flex flex-col items-center gap-2">
          <div class="mx-2 text-lg font-bold tracking-wide text-gray-700">團主</div>
          <div class="w-20 h-20 mx-auto overflow-hidden flex-shrink-0 rounded-full">
            <img :src="hostInfo.photo_url" class="w-full h-full object-cover" />
          </div>
          <div class="mx-2 text-lg font-bold tracking-wide text-gray-700">
            {{ hostInfo.display_name }}
          </div>
        </div>
        <!-- <div class="flex items-center mt-3">
          <div class="text-base w-full">您對於本次揪團的評價為</div>
          <n-rate color="#B91C1C">
            <HeartSolid class="w-5 h-5" />
          </n-rate>
        </div> -->
        <div class="flex flex-col items-center gap-2 mt-4">
          <div class="text-base text-center">如果這次活動滿意，您想追蹤此團主嗎？</div>
          <n-button
            strong
            secondary
            :type="checkFollowing.isFollowing ? 'tertiary' : 'success'"
            @click="clickTheFollowBtn(checkFollowing)"
          >
            {{ checkFollowing.isFollowing ? '已追蹤' : '追蹤' }}
          </n-button>
        </div>

        <div class="flex justify-center items-center mt-8 gap-5">
          <n-button round type="success" @click="backStep0" class="w-1/3 tracking-widest"
            >上一步</n-button
          >
          <n-button
            round
            type="success"
            @click="showSubmitModal = true"
            class="w-1/3 tracking-widest"
            >送出評價</n-button
          >
        </div>
        <n-modal
          v-model:show="showSubmitModal"
          preset="dialog"
          title="你確認要送出評價嗎？"
          positive-text="送出"
          negative-text="再檢查一下"
          @positive-click="submitRating"
          @negative-click="showSubmitModal = false"
        >
          <p>評價一但送出便無法再次編輯</p>
        </n-modal>
      </div>
      <!-- 完成的介面 -->
      <div v-else-if="step == 2" class="bg-gray-100 rounded-md mt-6 px-4 pb-6">
        <div class="flex flex-col items-center">
          <div class="flex justify-center my-6">
            <svg
              width="100px"
              height="100px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="#18A058" stroke-width="1.5" />
              <path
                d="M8.5 12.5L10.5 14.5L15.5 9.5"
                stroke="#18A058"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="text-center">
            <p class="text-xl font-bold">您已經完成評價啦✨</p>
          </div>
        </div>
        <div class="flex justify-center items-center mt-8 gap-5">
          <n-button
            round
            @click="router.push({ name: 'home' })"
            type="primary"
            class="w-1/3 tracking-widest"
            >返回首頁</n-button
          >
          <n-button
            round
            class="w-1/3 tracking-widest px-2"
            @click="router.push({ name: 'personInfo', params: { uid: userStore.user.uid } })"
            type="primary"
            >前往個人頁
          </n-button>
        </div>
      </div>
    </div>
  </body>
</template>
<style scoped>
.static-heart-rating {
  display: flex;
  gap: 6px;
}
.static-heart {
  width: 16px;
  height: 16px;
  background-image: url('https://firebasestorage.googleapis.com/v0/b/login-demo1-9d3cb.firebasestorage.app/o/activities%2Fheartnored.png?alt=media&token=fa9751f1-99dc-4a2a-a709-f6b4c7fe6f85');
  background-repeat: no-repeat;
  background-size: contain;
  cursor: default;
}
.static-heart.filled {
  background-image: url('https://firebasestorage.googleapis.com/v0/b/login-demo1-9d3cb.firebasestorage.app/o/activities%2Fheartred.png?alt=media&token=01bb392b-208c-4aac-b8aa-728b27a3b71d');
}

.heart-rating {
  display: flex;
  gap: 8px;
}

.heart {
  width: 20px;
  height: 20px;
  background-image: url('https://firebasestorage.googleapis.com/v0/b/login-demo1-9d3cb.firebasestorage.app/o/activities%2Fheartnored.png?alt=media&token=fa9751f1-99dc-4a2a-a709-f6b4c7fe6f85');
  background-repeat: no-repeat;
  background-size: contain;
  cursor: pointer;
  transition: background-image 0.3s ease;
}

.heart.filled {
  background-image: url('https://firebasestorage.googleapis.com/v0/b/login-demo1-9d3cb.firebasestorage.app/o/activities%2Fheartred.png?alt=media&token=01bb392b-208c-4aac-b8aa-728b27a3b71d');
}
</style>
