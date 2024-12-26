<script setup>
import { computed, onMounted, ref } from 'vue'
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
} from '@/apis/activityAPIs.js'
import { useSocketStore } from '@/stores/socketStore'

dayjs.locale('zh-tw')
dayjs.extend(relativeTime)
const route = useRoute()
const userComment = ref('')
const registerComment = ref('')
const activityId = route.params.id
const recentActivities = ref([])
async function getActivityDetail() {
  const activityDetail = await activityGetDetailAPI(activityId)

  // 有資料或null
  if (!activityDetail) {
    message.error('獲取活動失敗')
    // 這裡應該要針對沒有拿到id的狀態處理
    return
  }

  activity.value = activityDetail
  host.value = activityDetail.host_info
  comments.value = activityDetail.comments
  recentActivities.value = activityDetail.recent_activities
}

const userStore = useUserStore()
const message = useMessage()
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
    default:
      return 'null'
  }
})

const registerCount = computed(() => {
  // 不用審核的用，報名人數就是validated的人數，
  if (!activity.value.require_approval) {
    return activity.value.applications.reduce((count, application) => {
      return count + application.register_validated
    }, 0)
  }
  // 要審核的話，報名人數就是在表單裡有出現且為Registered的
  return activity.value.applications.reduce((count, application) => {
    if (application.status === 'registered') {
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

// 只有不用付款的報名會跑到這個function
const registerActivity = async () => {
  const data = {
    participant_id: userStore.user.uid,
    comment: registerComment.value,
    // 不需要審核的話，報名即視為認證報名
    register_validated: !activity.value.require_approval ? 1 : 0,
  }

  const res = await activityRegisterAPI(activityId, data)
  if (res.status !== 201) {
    if (res.message === '報名上限已達') {
      message.error('報名已達上限')
    } else {
      message.error('報名失敗')
    }
    toggleRegisterModal()
    return
  }
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

  socketStore.sendNotification(notiData)

  toggleRegisterModal()
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
// 根據抓取回來的資料判斷使用者是否已註冊該活動
const isRegistered = computed(() => {
  return activity.value.applications?.some(
    (participant) =>
      participant.participant_id === userStore.user.uid && participant.status === 'registered',
  )
})

const showConfirmModal = ref(false)
const toggleConfirmModal = () => {
  showConfirmModal.value = !showConfirmModal.value
}
const onNegativeClick = () => {
  toggleConfirmModal()
}

// 取消報名
const onPositiveClick = async () => {
  const res = await activityCancelRegisterAPI(activity.value.id, userStore.user.uid)
  if (res.status != 200) {
    toggleConfirmModal()
    return message.error('取消報名失敗')
  }
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
  router.push({ name: 'activityReview', params: { activity_id: activityId } })
}

const onReviewNegativeClick = () => {
  toggleReviewModal
}

const showCancelModal = ref(false)
const toggleCancelModal = () => {
  showCancelModal.value = !showCancelModal.value
}
const onCancelNegativeClick = () => {
  toggleCancelModal()
}

const onCancelPositiveClick = async () => {
  const res = await activityCancelAPI(activity.value.id)
  if (res.status !== 200) {
    toggleCancelModal()
    return message.error('取消活動失敗')
  }
  await getActivityDetail()
  // 取消活動是不是要改一夏夜面
  toggleCancelModal()
  message.success('取消活動成功')
}

const submitComment = async () => {
  const data = {
    comment: userComment.value,
    participant_id: userStore.user.uid,
  }
  const res = await activityNewCommentAPI(activity.value.id, data)
  if (res.status !== 201) {
    console.log(res)
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

const addToCart = () => {
  const data = {
    activity_id: activity.value.id,
    uid: userStore.user.uid,
  }
  console.log('加到購物車', data)
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
    const res = await activityDeleteCommentAPI(comment_id)
    if (res.status !== 200) {
      message.error('刪除留言失敗')
    }
    message.success('刪除留言成功')
    await getActivityDetail()
  }
}
</script>
<template>
  <div v-if="activity.id" class="bg-[#E5E7EB]">
    <div class="container">
      <div class="detail-container">
        <div class="flex items-center mb-4 w-full">
          <router-link :to="{ name: 'home' }">
            <NavArrowLeft stroke-width="2" class="w-8 h-8"></NavArrowLeft>
          </router-link>
          <div class="flex h-full justify-start ml-[5%] w-full">
            <img class="w-14 aspect-square rounded-full" :src="host.photo_url" alt="" />
            <div class="ml-3 relative w-full h-14">
              <p class="font-bold text-lg absolute top-0">{{ host.display_name }}</p>
              <p class="absolute bottom-0">
                {{ `${userStore.user.city} • ${userStore.user.age} • ${userStore.user.career}` }}
              </p>
            </div>
          </div>
        </div>
        <div class="aspect-square overflow-hidden rounded-md">
          <img class="w-full h-full object-cover" :src="activity.img_url" alt="" />
        </div>
        <div class="py-3">
          <h3 class="font-bold text-2xl truncate">{{ activity.name }}</h3>
          <div class="flex items-center text-gray-500">
            <Clock />
            <span class="pl-3">{{
              `${dayjs(activity.event_time).format('YYYY年MM月DD日dddd HH:mm')}`
            }}</span>
          </div>
          <span class="text-sm text-red-500">{{
            `最後審核時間 ${dayjs(activity.approval_deadline).format('YYYY年MM月DD日dddd HH:mm')}`
          }}</span>
          <p v-if="activity.status === 'registrationOpen'" class="font-bold text-lg text-end">
            {{ `${registerCount}人報名` }}
          </p>
          <div v-if="activity.status === 'registrationOpen'">
            <div v-if="isHost">
              <NButton
                v-if="activity.require_approval"
                class="w-full mt-3 font-bold text-lg py-5"
                round
                type="primary"
                @click="toggleReviewModal"
                >審核報名</NButton
              >
              <NButton
                v-else
                class="w-full mt-3 font-bold text-lg py-5"
                round
                type="primary"
                @click="toggleReviewModal"
                >瀏覽報名</NButton
              >
              <NButton
                class="w-full mt-3 font-bold text-lg py-5"
                round
                type="warning"
                @click="toggleCancelModal"
                >取消活動</NButton
              >
            </div>
            <div v-else>
              <NButton
                v-if="isRegistered"
                class="w-full mt-3 font-bold text-lg py-5"
                round
                type="primary"
                @click="toggleConfirmModal"
                >取消報名</NButton
              >
              <NButton
                v-else
                class="w-full mt-3 font-bold text-lg py-5"
                round
                type="primary"
                @click="toggleRegisterModal"
                >報名</NButton
              >
            </div>
          </div>
          <div v-else class="text-3xl font-bold">該活動已無法報名</div>
          <n-modal
            v-model:show="showConfirmModal"
            preset="dialog"
            title="取消報名"
            content="你確定要取消報名嗎？"
            positive-text="確定"
            negative-text="再想想"
            @positive-click="onPositiveClick"
            @negative-click="onNegativeClick"
          />
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
            v-model:show="showCancelModal"
            preset="dialog"
            title="取消活動"
            content="你確定要取消該活動？"
            positive-text="確定"
            negative-text="再想想"
            @positive-click="onCancelPositiveClick"
            @negative-click="onCancelNegativeClick"
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
          <p class="py-8 leading-6">{{ activity.description }}</p>
          <ul class="flex justify-around text-md border border-gray-200/100 rounded-lg p-2">
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
          <div class="flex items-center my-5">
            <MapPin height="32" width="32"></MapPin>
            <span class="text-lg ml-5">{{ activity.location }}</span>
          </div>
          <div id="map" class="border w-full h-52 text-5xl font-bold">這裡放地圖</div>

          <div class="mt-3">
            <span class="block text-2xl font-bold mb-2">阿勳的評價與評分</span>
            <div class="border h-52 text-5xl font-bold">這裡放星星評分</div>
            <span class="block mt-10 mb-2 text-lg">留言</span>
          </div>
          <div class="comment-section border-b border-gray-300 pb-4">
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
              <NButton secondary @click="clearComment">取消</NButton>
              <NButton
                :disabled="userComment.length == 0"
                @click="submitComment"
                type="primary"
                class="ml-2"
                >留言</NButton
              >
            </div>
            <div v-for="comment in comments" :key="comment.comment_id">
              <div class="flex h-full justify-start w-full mt-10">
                <img class="w-14 aspect-square rounded-full" :src="comment.photo_url" alt="" />
                <div class="ml-3 relative w-full h-14">
                  <p class="font-bold text-lg absolute top-0">{{ comment.display_name }}</p>
                  <p class="absolute bottom-0 text-md">
                    {{ `${comment.location} • ${comment.age} • ${comment.career}` }}
                  </p>
                  <p class="absolute bottom-0 text-sm right-0">
                    {{ dayjs(comment.created_at).fromNow() }}
                  </p>
                </div>
                <n-dropdown
                  :disabled="comment.uid !== userStore.user.uid"
                  :on-select="(key) => handleDropSelect(key, comment.comment_id)"
                  :options="options"
                  placement="bottom"
                  trigger="hover"
                >
                  <n-button class="self-start" text>
                    <n-icon size="20">
                      <MoreVert></MoreVert>
                    </n-icon>
                  </n-button>
                </n-dropdown>
              </div>
              <p class="pl-[66px] pt-2 text-md">{{ comment.user_comment }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="cards-container px-[2%]">
        <h2 class="text-2xl font-bold mb-10">近期活動</h2>
        <ActivityCard
          v-for="item in recentActivities"
          :key="item.img_url"
          horizontal="true"
          :title="item.name"
          :actImgUrl="item.img_url"
          :location="item.location"
          :dateTime="dayjs(item.event_time).format('YYYY年MM月DD日')"
          :participants="registerCount"
          :host="item.users.display_name"
          :imageHeight="'100%'"
          :hostImgUrl="item.users.photo_url"
          class="mb-[3%] h-36"
        ></ActivityCard>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
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
}
</style>
