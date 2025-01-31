<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Clock, CreditCard, MoneySquare, Group, MapPin, NavArrowLeft, MoreVert } from '@iconoir/vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw.js'
import relativeTime from 'dayjs/plugin/relativeTime'
import { NInput, NButton, NModal, NCard, useMessage, NDropdown, NIcon } from 'naive-ui'
dayjs.locale('zh')
import ActivityCard from '@/views/components/ActivityCard.vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import {
  activityCancelRegisterAPI,
  activityGetDetailAPI,
  activityRegisterAPI,
  activityCancelAPI,
  activityNewCommentAPI,
  activityDeleteCommentAPI,
  activityAddToCartAPI,
} from '@/apis/activityAPIs.js'
import { useSocketStore } from '@/stores/socketStore'
import { handleError } from '@/utils/handleError.js'

dayjs.locale('zh-tw')
dayjs.extend(relativeTime)
const route = useRoute()
const message = useMessage()
const userComment = ref('')
const registerComment = ref('')
const activityId = route.params.id
const recentActivities = ref([])
const ratings = ref({})
const currentTime = ref(new Date().toISOString())

const getCurrentTime = () => {
  currentTime.value = new Date().toISOString()
}

async function getActivityDetail() {
  try {
    const activityDetail = await activityGetDetailAPI(route.params.id)

    if (!activityDetail || activityDetail.length === 0) {
      message.error('目前無相關活動資料')
      return
    }
    getCurrentTime()
    activity.value = activityDetail
    host.value = activityDetail.host_info
    comments.value = activityDetail.comments
    recentActivities.value = activityDetail.recent_activities
    ratings.value = activityDetail.ratings
  } catch (error) {
    handleError(message, undefined, error)
  }
}

const userStore = useUserStore()

const socketStore = useSocketStore()

import { useGoogleMaps } from '@/utils/useGoogleMaps'
const apiKey = import.meta.env.VITE_GOOGLE_KEY
const { previewMap } = useGoogleMaps(apiKey)
const searchQuery = ref('')

const activity = ref({})

const host = ref({})

const payment = computed(() => {
  switch (activity.value.pay_type) {
    case 'free':
      return '免費'
    case 'AA':
      return '各付各的'
    case 'host':
      return '團主請客'
    case 'paymentRequired':
      return '先付款'
    default:
      return 'null'
  }
})

const participantsCount = computed(() => {
  return activity.value.applications.reduce((count, application) => {
    if (application.register_validated) {
      return ++count
    }
    return count
  }, 0)
})

const clearComment = () => {
  userComment.value = ''
}

const comments = ref()

const showRegisterModal = ref(false)
const toggleRegisterModal = () => {
  showRegisterModal.value = !showRegisterModal.value
}

const validateRegister = async () => {
  getCurrentTime()

  // 需審核並且超過最後審核時間
  if (activity.value.require_approval && currentTime.value >= activity.value.approval_deadline) {
    await getActivityDetail()
    message.error('已超過報名時間')
    return
  }

  // 不需審核但報名的時候已超過最後報名時間（活動時間）
  if (activity.value.require_approval && currentTime.value >= activity.value.event_time) {
    await getActivityDetail()
    message.error('已超過報名時間')
    return
  }

  // 參加人數滿了，禁止報名
  if (participantsCount.value >= activity.value.register_limit) {
    message.error('該活動已達報名上限')
    return
  }
  return true
}
const registerActivity = async () => {
  try {
    if (!userStore.user.uid) {
      toggleRegisterModal()
      return message.error('您尚未登入，請先登入才能繼續此操作')
    }
    const status = await validateRegister()
    if (!status) {
      return toggleRegisterModal()
    }
    const data = {
      participant_id: userStore.user.uid,
      comment: registerComment.value,
      register_validated: !activity.value.require_approval ? 1 : 0,
    }
    // const messageReactive = message.info('報名中...', { duration: 0 })
    await activityRegisterAPI(activityId, data)

    await getActivityDetail()

    //報名成功
    message.success('報名成功！')
    const notiData = {
      actor_id: userStore.user.uid,
      user_id: activity.value.host_id,
      target_id: activity.value.id,
      action: 'register',
      target_type: 'activity',
      message: '報名了你的活動',
      link: `/activity/detail/${activity.value.id}`,
    }
    // 送通知
    socketStore.sendNotification(notiData)
    toggleRegisterModal()
  } catch (error) {
    if (error.response?.data?.message == '報名上限已達') {
      message.error('報名已達上限')
    } else {
      message.error('報名發生錯誤，請稍後再試')
    }
    toggleRegisterModal()
  }
}

// 根據活動判斷當前使用者是否為主辦者
const isHost = computed(() => {
  return activity.value.host_id === userStore.user.uid
})

onMounted(async () => {
  await getActivityDetail()
  searchQuery.value = activity.value.location
  await previewMap(searchQuery.value)
})

// 根據抓取回來的資料判斷使用者是否已註冊該活動，狀態若為isRegistered，則可以取消報名
const isRegistered = computed(() => {
  return activity.value.applications?.some(
    (participant) =>
      participant.participant_id === userStore.user.uid &&
      (participant.status === 'registered' || participant.status == 'approved'),
  )
})

const isValidated = computed(() => {
  return activity.value.applications?.some(
    (participant) =>
      participant.participant_id === userStore.user.uid && participant.register_validated,
  )
})

const showCancelRegisterModal = ref(false)
const toggleConfirmModal = () => {
  showCancelRegisterModal.value = !showCancelRegisterModal.value
}
const onNegativeCancelRegister = () => {
  toggleConfirmModal()
}

// 取消報名
const onPositiveCancelRegister = async () => {
  if (!userStore.user.uid) {
    toggleConfirmModal()
    return message.error('您尚未登入，請先登入才能繼續此操作')
  }
  if (currentTime.value >= activity.value.event_time) {
    return message.error('已超過取消報名時間')
  }
  const res = await activityCancelRegisterAPI(activity.value.id, userStore.user.uid)
  if (res.status != 200) {
    toggleConfirmModal()
    return message.error('取消報名失敗')
  }
  const notiData = {
    actor_id: userStore.user.uid,
    user_id: activity.value.host_id,
    target_id: activity.value.id,
    action: 'register',
    target_type: 'activity',
    message: '取消報名了你的活動',
    link: `/activity/detail/${activity.value.id}`,
  }
  socketStore.sendNotification(notiData)

  await getActivityDetail()
  //  取消報名成功
  toggleConfirmModal()

  message.success('取消報名成功')
}

const showReviewModal = ref(false)
const toggleReviewModal = () => {
  showReviewModal.value = !showReviewModal.value
}
const onReviewPositiveClick = () => {
  if (!userStore.user.uid) {
    return message.error('您尚未登入，請先登入才能繼續此操作')
  }
  router.push({ name: 'activityReview', params: { activity_id: activity.value.id } })
}

const onReviewNegativeClick = () => {
  toggleReviewModal
}

const showCancelActivityModal = ref(false)
const toggleCancelActivityModal = () => {
  showCancelActivityModal.value = !showCancelActivityModal.value
}
const onCancelCancelActivityClick = () => {
  toggleCancelActivityModal()
}

// 取消活動
const onConfirmCancelActivityClick = async () => {
  if (!userStore.user.uid) {
    toggleCancelActivityModal()
    return message.error('您尚未登入，請先登入才能繼續此操作')
  }
  getCurrentTime()
  if (currentTime.value >= activity.value.event_time) {
    return message.error('已超過取消活動時間')
  }
  const res = await activityCancelAPI(activity.value.id)
  if (res.status !== 200) {
    toggleCancelActivityModal()
    return message.error('取消活動失敗')
  }
  await getActivityDetail()
  toggleCancelActivityModal()
  message.success('取消活動成功')
}

const submitComment = async () => {
  if (!userStore.user.uid) {
    return message.error('您尚未登入，請先登入才能繼續此操作')
  }
  const data = {
    comment: userComment.value,
    participant_id: userStore.user.uid,
  }
  const res = await activityNewCommentAPI(activity.value.id, data)
  if (!res) {
    return message.error('留言失敗')
  }
  await getActivityDetail()
  message.success('新增留言成功')

  socketStore.sendNotification({
    actor_id: userStore.user.uid,
    user_id: activity.value.host_id,
    target_id: activity.value.id,
    action: 'comment',
    target_type: 'activity',
    message: '在你的活動新增了留言',
    link: `/activity/detail/${activity.value.id}`,
  })
  clearComment()
}

const addToCart = async () => {
  if (!userStore.user.uid) {
    toggleRegisterModal()
    return message.error('您尚未登入，請先登入才能繼續此操作')
  }
  try {
    const status = await validateRegister()
    if (!status) {
      return toggleRegisterModal()
    }

    await activityAddToCartAPI(userStore.user.uid, activity.value.id)
    message.success('加入購物車成功')
  } catch {
    message.error('加入購物車失敗')
  }
  toggleRegisterModal()
}

const options = [
  {
    label: '刪除',
    key: 'delete',
  },
  {
    label: '取消',
    key: 'cancel',
  },
]

const handleDropSelect = async (key, comment_id) => {
  if (key === 'delete') {
    if (!userStore.user.uid) {
      return message.error('您尚未登入，請先登入才能繼續此操作')
    }
    const res = await activityDeleteCommentAPI(comment_id)
    if (!res) {
      return message.error('刪除留言失敗')
    }
    message.success('刪除留言成功')
    await getActivityDetail()
  }
}

watch(
  () => route.params.id,
  async () => {
    await getActivityDetail()
    searchQuery.value = activity.value.location
    await previewMap(searchQuery.value)
  },
)

const handleCardClick = () => {
  // 點擊後進行頁面滾動
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>
<template>
  <div v-if="activity.id" class="bg-[#E5E7EB]">
    <div class="bg-gray-100">
      <div class="w-full md:w-3/4 md:mx-auto lg:max-w-[1000px]">
        <div class="flex items-center relative w-full h-14 p-2 px-4">
          <router-link :to="{ name: 'home' }">
            <NavArrowLeft stroke-width="2" class="w-6 h-6"></NavArrowLeft>
          </router-link>
          <div
            class="flex items-center absolute left-1/2 transform -translate-x-1/2 gap-2 lg:hidden"
          >
            <div
              class="w-10 aspect-square rounded-full overflow-hidden cursor-pointer"
              @click="router.push({ name: 'personInfo', params: { uid: host.uid } })"
            >
              <img class="w-full h-full object-cover" :src="host.photo_url" alt="" />
            </div>
            <p class="font-bold text-lg">{{ host.display_name }}</p>
          </div>
        </div>
        <div class="lg:flex lg:gap-3">
          <div class="bg-white px-5 pb-5 pt-3 lg:w-3/5 lg:rounded-md">
            <div class="hidden lg:flex items-center gap-2 border-b-2 pb-2">
              <div
                class="w-10 aspect-square rounded-full overflow-hidden cursor-pointer"
                @click="router.push({ name: 'personInfo', params: { uid: host.uid } })"
              >
                <img class="w-full h-full object-cover" :src="host.photo_url" alt="" />
              </div>
              <p class="font-bold text-lg">{{ host.display_name }}</p>
            </div>
            <div class="overflow-hidden rounded-md">
              <img class="w-full h-full object-cover" :src="activity.img_url" alt="" />
            </div>
            <div class="flex flex-col gap-2 py-3">
              <div class="flex flex-col gap-2 border-b-2 pb-3">
                <h3 class="font-bold text-2xl truncate whitespace-normal">{{ activity.name }}</h3>
                <div class="flex items-center text-gray-500">
                  <Clock class="w-6 h-6" />
                  <span class="pl-1">{{
                    `${dayjs(activity.event_time).format('YYYY年MM月DD日dddd HH:mm')}`
                  }}</span>
                </div>
              </div>

              <p class="py-2 leading-6 whitespace-pre-wrap">
                {{ activity.description }}
              </p>
              <div v-if="activity.require_approval" class="text-sm text-red-500">
                <p>該活動須經審核才視同報名成功</p>
                <p>
                  {{
                    `最後審核時間 ${dayjs(activity.approval_deadline).format('YYYY年MM月DD日dddd HH:mm')}`
                  }}
                </p>
              </div>

              <p class="font-bold text-lg text-center">
                {{ `${participantsCount}名參加者` }}
              </p>
              <div v-if="activity.status != 'cancelled'">
                <div v-if="isHost">
                  <NButton
                    v-if="activity.require_approval && currentTime < activity.approval_deadline"
                    class="w-full mt-3 font-bold text-lg py-5"
                    round
                    type="primary"
                    @click="toggleReviewModal"
                    >審核報名</NButton
                  >
                  <button
                    v-else
                    class="bg-green-600 text-white rounded-full w-full h-10 mt-3 font-bold text-lg py-1 hover:bg-green-500"
                    round
                    type="primary"
                    @click="toggleReviewModal"
                  >
                    瀏覽報名
                  </button>
                  <button
                    v-if="activity.event_time > currentTime"
                    class="bg-red-400 text-white rounded-full w-full h-10 mt-3 font-bold text-lg py-1 hover:bg-red-300"
                    round
                    type="warning"
                    @click="toggleCancelActivityModal"
                  >
                    取消活動
                  </button>
                </div>
                <div v-else>
                  <div
                    v-if="
                      (!activity.require_approval && currentTime < activity.event_time) ||
                      (activity.require_approval && currentTime < activity.approval_deadline)
                    "
                  >
                    <NButton
                      v-if="!isRegistered"
                      class="w-full mt-3 font-bold text-lg py-5"
                      round
                      type="primary"
                      @click="toggleRegisterModal"
                      >報名</NButton
                    >
                  </div>

                  <div v-else>
                    <NButton
                      v-if="!isRegistered"
                      disabled
                      class="w-full mt-3 font-bold text-lg py-5"
                      round
                      type="primary"
                      >該活動已無法報名</NButton
                    >
                  </div>
                  <NButton
                    v-if="isRegistered && currentTime < activity.event_time"
                    class="w-full mt-3 font-bold text-lg py-5"
                    round
                    type="primary"
                    @click="toggleConfirmModal"
                    >取消報名{{ isValidated ? ' / 您已具備參加資格' : '' }}</NButton
                  >
                </div>
              </div>
              <div v-else>
                <NButton disabled class="w-full mt-3 font-bold text-lg py-5" round type="primary"
                  >該活動已遭團主取消</NButton
                >
              </div>
              <n-modal
                v-model:show="showCancelRegisterModal"
                preset="dialog"
                title="取消報名"
                positive-text="確定"
                negative-text="再想想"
                @positive-click="onPositiveCancelRegister"
                @negative-click="onNegativeCancelRegister"
              >
                <p>你確定要取消報名嗎？<br />一但取消報名有可能無法再次報名</p>
              </n-modal>

              <n-modal
                v-model:show="showReviewModal"
                preset="dialog"
                title="前往審核頁面"
                content="你確定要前往審核頁面嗎？"
                positive-text="確定"
                negative-text="再想想"
                @positive-click="onReviewPositiveClick"
                @negative-click="onReviewNegativeClick"
              />
              <n-modal
                v-model:show="showCancelActivityModal"
                preset="dialog"
                title="取消活動"
                content="你確定要取消該活動？"
                positive-text="確定"
                negative-text="再想想"
                @positive-click="onConfirmCancelActivityClick"
                @negative-click="onCancelCancelActivityClick"
              />
              <n-modal class="rounded-lg" v-model:show="showRegisterModal" :auto-focus="false">
                <n-card
                  v-if="!activity.require_payment"
                  style="width: 500px"
                  title="報名活動"
                  :bordered="false"
                  size="huge"
                  role="dialog"
                  aria-modal="true"
                >
                  <NInput
                    :autosize="{ minRows: 3, maxRows: 5 }"
                    :show-count="true"
                    v-model:value="registerComment"
                    :maxlength="50"
                    :clearable="true"
                    type="textarea"
                    placeholder="告訴團主你為什麼想參加吧！"
                  ></NInput>
                  <template #footer>
                    <NButton @click="registerActivity" type="primary" round class="font-bold w-full"
                      >報名</NButton
                    >
                    <NButton
                      type="secondary"
                      round
                      class="font-bold mt-2 w-full"
                      @click="toggleRegisterModal"
                      >取消</NButton
                    >
                  </template>
                </n-card>
                <n-card
                  v-else
                  style="width: 500px"
                  title="報名活動"
                  :bordered="false"
                  size="huge"
                  role="dialog"
                  aria-modal="true"
                >
                  該活動需要先付費完成才視同報名成功，是否將活動加入購物車？
                  <template #footer>
                    <NButton type="primary" round class="font-bold w-full" @click="addToCart"
                      >加到購物車</NButton
                    >
                    <NButton
                      type="secondary"
                      round
                      class="font-bold mt-2 w-full"
                      @click="toggleRegisterModal"
                      >取消</NButton
                    >
                  </template>
                </n-card>
              </n-modal>

              <ul
                class="flex justify-around text-md border border-gray-200/100 rounded-lg p-2 mt-4"
              >
                <li class="flex flex-col items-center">
                  <CreditCard height="35" width="35"></CreditCard>
                  <p class="mt-2">{{ payment }}</p>
                </li>
                <li class="flex flex-col items-center">
                  <MoneySquare height="35" width="35"></MoneySquare>
                  <p class="mt-2">{{ `$${parseInt(activity.price).toFixed()}` }}</p>
                </li>
                <li class="flex flex-col items-center">
                  <Group height="35" width="35"></Group>
                  <p class="mt-2">{{ `${activity.max_participants}人` }}</p>
                </li>
              </ul>
              <div class="flex items-center my-4">
                <MapPin height="32" width="32"></MapPin>
                <span class="text-lg ml-5">{{ activity.location }}</span>
              </div>
              <div id="map" class="border w-full h-52 text-5xl font-bold">這裡放地圖</div>

              <div class="mt-5 border-t-2 pt-5">
                <span class="block text-center text-xl font-bold mb-2 tracking-wide">{{
                  `${host.display_name}的評價與評分`
                }}</span>
                <div class="text-5xl font-bold">
                  <div class="flex justify-center">
                    <div class="flex flex-row items-center gap-1">
                      <p class="text-4xl">♡</p>
                      <div class="text-5xl">{{ ratings.averageHeart }}</div>
                    </div>
                  </div>
                  <div class="my-3">
                    <ol class="flex flex-col gap-2">
                      <li
                        v-for="(item, index) in 5"
                        :key="index"
                        class="flex items-center gap-4 text-xl"
                      >
                        {{ 5 - index }}
                        <n-progress
                          type="line"
                          color="#625B57"
                          :height="20"
                          :percentage="ratings.ratingPercentages[`heart${5 - index}`]"
                          indicator-placement="inside"
                        >
                          <span>{{ ratings.heartCounts[`heart${5 - index}`] }}</span>
                        </n-progress>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              <div class="comment-section border-b border-gray-300 pb-4">
                <span class="block text-center text-xl font-bold mb-2 tracking-wide">留言</span>
                <NInput
                  :autosize="{ minRows: 3, maxRows: 5 }"
                  size="large"
                  show-count="true"
                  maxlength="50"
                  class="bg-transparent aspect-[5/1]"
                  v-model:value="userComment"
                  type="textarea"
                  placeholder="留下你想說的話吧!"
                ></NInput>
                <div class="text-end mt-2">
                  <button secondary @click="clearComment">取消</button>
                  <NButton
                    :disabled="userComment.length == 0"
                    @click="submitComment"
                    type="primary"
                    class="ml-2"
                    >留言</NButton
                  >
                </div>
                <div
                  v-for="comment in comments"
                  :key="comment.comment_id"
                  class="bg-gray-100 rounded-md p-3 mt-3"
                >
                  <div class="flex w-full gap-3 md:gap-4">
                    <div
                      class="w-14 h-14 aspect-square flex-shrink-0 rounded-full overflow-hidden md:w-14 md:h-14 cursor-pointer"
                      @click="router.push({ name: 'personInfo', params: { uid: comment.uid } })"
                    >
                      <img class="w-full h-full object-cover" :src="comment.photo_url" alt="" />
                    </div>
                    <div class="flex flex-col w-4/5 h-full md:w-10/12">
                      <div>
                        <div class="flex justify-between items-center w-full">
                          <p class="font-semibold text-sm">{{ comment.display_name }}</p>
                          <n-dropdown
                            :disabled="comment.uid !== userStore.user.uid"
                            :on-select="(key) => handleDropSelect(key, comment.comment_id)"
                            :options="options"
                            placement="bottom"
                            trigger="hover"
                          >
                            <n-button class="" text>
                              <n-icon size="20">
                                <MoreVert></MoreVert>
                              </n-icon>
                            </n-button>
                          </n-dropdown>
                        </div>
                        <p class="text-sm whitespace-pre-wrap tracking-wide">
                          {{ comment.user_comment }}
                        </p>
                      </div>
                      <p class="text-sm text-gray-400">
                        {{ dayjs(comment.created_at).fromNow() }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="p-5 md:bg-white md:mt-5 lg:w-2/5 lg:mt-0 lg:rounded-md">
            <h2 class="text-xl text-center font-bold border-b-2 pb-3 md:mb-3 lg:text-start">
              近期活動
            </h2>
            <ActivityCard
              v-for="item in recentActivities"
              :key="item.img_url"
              :id="item.id"
              horizontal="true"
              :title="item.name"
              :actImgUrl="item.img_url"
              :location="item.location"
              :dateTime="dayjs(item.event_time).format('YYYY年MM月DD日')"
              :host="item.users.display_name"
              :hostImgUrl="item.users.photo_url"
              :participants="item.max_participants"
              @click="handleCardClick(item)"
              class="w-full border-b-2 pb-3 overflow-hidden md:border-none md:bg-gray-100 md:mb-3 md:rounded-md md:px-5 md:hover:bg-gray-200 lg:px-4 hover:scale-[1.05] transition-all duration-300"
            ></ActivityCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* .container {
  margin: 0 auto;
  width: 85%;
}

@media screen and (width > 768px) {
  .container {
    width: 70%;
    min-width: 700px;
    flex-wrap: wrap;
    display: flex;
  }

  .detail-container {
    flex: 1 1 0;
  }

  .cards-container {
    flex: 1 0 0;
    padding-left: 2%;
    padding-right: 2%;
  }
}

@media screen and (width >= 1024px) {
  .container {
    max-width: 850px;
  }
}

:deep(.slide-left-enter-active),
:deep(.slide-left-leave-active) {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

:deep(.slide-left-enter-from),
:deep(.slide-left-leave-to) {
  position: absolute;
  opacity: 0;
}

:deep(.slide-left-enter-from) {
  transform: translateX(-10px);
}

:deep(.slide-left-leave-to) {
  transform: translateX(10px);
} */
</style>
