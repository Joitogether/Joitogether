<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDialog, useMessage } from 'naive-ui'
import {
  NavArrowLeft,
  ThumbsUp,
  CheckCircleSolid,
  FireFlame,
  Leaf,
  ArrowUpLeftSquareSolid,
  XmarkCircle,
} from '@iconoir/vue'
import defaultAvatar from '@/assets/avatar.png'
import {
  ActivityGetApplicationsAPI,
  ActivityReviewApplicationsAPI,
  ActivityGetActivitiesAPI,
} from '@/apis/activityAPIs'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useSocketStore } from '@/stores/socketStore'
import { handleError } from '@/utils/handleError'

const route = useRoute()
const activity_id = route.params.activity_id

const userStore = useUserStore()
const activity = ref([]) // 活動詳細資料

const dialog = useDialog()
const message = useMessage()
const attendee = ref([])

// 計時器
const isLoading = ref(true)
const showContent = ref(false)
const eventTime = ref(null)

const socketStore = useSocketStore()

const canAccessActivity = computed(() => {
  const isHost = userStore.user.uid === activity.value?.host_info?.uid
  const nowTimestamp = new Date().getTime()
  const eventTimestamp = eventTime.value ? new Date(eventTime.value).getTime() : 0
  const isReviewExpired = nowTimestamp > eventTimestamp

  const requireApproval = activity.value?.require_approval === 1
  const requirePayment = activity.value?.require_payment === 1

  let displayTemplate = ''

  if (!isHost) {
    displayTemplate = 'error' // 非團主顯示錯誤頁面
  } else if (requireApproval) {
    displayTemplate = '審核列表' // 需要審核時顯示審核列表
  } else if (requirePayment) {
    displayTemplate = '檢視報名者列表' // 需要付款但不需要審核，顯示報名者列表
  } else {
    displayTemplate = '檢視報名者列表' // 不需要審核和付款，顯示報名者列表
  }

  return {
    isHost,
    isReviewExpired,
    requireApproval,
    requirePayment,
    displayTemplate,
  }
})

const isReviewTimeExpired = () => {
  const nowTimestamp = new Date().getTime() // 當前時間戳
  const deadline = activity.value?.approval_deadline
    ? new Date(activity.value.approval_deadline).getTime()
    : 0 // 取得審核截止時間

  return nowTimestamp > deadline
}

// 用於計算團主審核人數計算
const approvedCount = computed(() => {
  return attendee.value.filter((item) => item.approved).length
})

const rejectCount = computed(() => {
  return attendee.value.filter((item) => item.host_declined).length
})

const userCancellation = computed(() => {
  return attendee.value.filter((item) => item.participant_cancelled).length
})

const refreshAttendees = async () => {
  try {
    const rawData = await ActivityGetApplicationsAPI(activity_id)
    if (rawData && Array.isArray(rawData)) {
      attendee.value = rawData.map((item) => ({
        id: item.application_id,
        name: item.participant_info.full_name,
        activity_id: item.activity_id,
        avatar: item.participant_info.photo_url || defaultAvatar,
        number: `@${item.participant_id}`,
        message: item.comment || '這位參加者尚無留言',
        date: new Date().toLocaleDateString(),
        approved: item.status === 'approved',
        host_declined: item.status === 'host_declined',
        registered: item.status === 'registered',
        participant_cancelled: item.status === 'participant_cancelled',
        replies: '',
      }))
    } else {
      attendee.value = []
    }
  } catch (error) {
    handleError(message, undefined, error)
    attendee.value = []
  }
}

// 輸入文字篩選報名者
const searchQuery = ref('')
const filteredAttendees = computed(() => {
  if (!searchQuery.value) {
    return attendee.value
  }
  return attendee.value.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

onMounted(async () => {
  try {
    // 獲取活動資料
    const response = await ActivityGetActivitiesAPI(activity_id)
    if (response.status === 200 && response.data) {
      activity.value = response.data.data
      eventTime.value = response.data.data.event_time
    } else {
      handleError(message, undefined, response)
    }

    // 獲取報名者資料
    await refreshAttendees()

    // 載入本地存儲的回覆資料
    const storedReplies = JSON.parse(localStorage.getItem('attendeeReplies')) || {}
    attendee.value.forEach((item) => {
      if (storedReplies[item.id]) {
        item.replies = storedReplies[item.id]
      } else {
        item.replies = []
      }
    })
  } catch (error) {
    handleError(message, undefined, error)
  } finally {
    isLoading.value = false
    setTimeout(() => {
      showContent.value = true
    }, 500) // 加入延遲，避免畫面閃爍
  }
})

const handleApproveClick = async (id, activity_id) => {
  if (isReviewTimeExpired()) {
    message.error('審核時間已過，無法進行操作！')
    return
  }
  const attendeeToUpdate = attendee.value.find((item) => item.id === id)
  if (!attendeeToUpdate) {
    message.error('找不到該參加者！')
    return
  }

  if (attendeeToUpdate.approved) {
    message.error(`${attendeeToUpdate.name} 已經被允許參加，無需再次操作！`)
    return
  }
  if (approvedCount.value >= activity.value.max_participants) {
    message.error('該活動人數已滿，無法再允許更多用戶參加')
    return
  }

  dialog.success({
    title: '確認允許參加',
    content: `您確定要允許 ${attendeeToUpdate.name} 參加嗎？`,
    positiveText: '確認',
    negativeText: '取消',
    async onPositiveClick() {
      try {
        const data = {
          status: 'approved',
          register_validated: 1,
          activity_id,
        }
        const response = await ActivityReviewApplicationsAPI(id, data)

        if (response && response.data.status === 200) {
          // 準備data
          const notiData = {
            actor_id: userStore.user.uid, // 誰觸發了這個行為
            user_id: response.data.data.participant_id, // 這個行為對誰觸發
            target_id: activity_id, // 被行為的受詞id
            action: 'review', // 行為 (目前僅有'create','register','like','comment','review', 'rate')
            target_type: 'activity', // 行為類型 (目前僅有'activity','post','rating')
            message: '審核了你的報名', // 要顯示在提醒欄位的敘述
            link: `/activity/detail/${activity_id}`, // 這個提醒要導向哪個頁面
          }

          // 送出提醒
          socketStore.sendNotification(notiData)

          message.success(`${attendeeToUpdate.name} 已被允許參加`)
          await refreshAttendees()
        } else {
          message.error('操作失敗，請稍後再試！')
        }
      } catch (error) {
        handleError(message, undefined, error)
      }
    },
    onNegativeClick: () => {
      message.info('您已取消操作！')
    },
  })
}

const handleDeclinedClick = async (id, activity_id) => {
  if (isReviewTimeExpired()) {
    message.error('審核時間已過，無法進行操作！')
    return
  }
  const attendeeToDeclined = attendee.value.find((item) => item.id === id)
  if (!attendeeToDeclined) {
    message.error('找不到該參加者！')
    return
  }

  if (attendeeToDeclined.host_declined) {
    message.error(`${attendeeToDeclined.name} 已經被拒絕參加，無需再次操作！`)
    return
  }

  dialog.success({
    title: '確認拒絕',
    content: `您確定要拒絕 ${attendeeToDeclined.name} 的參加申請嗎？`,
    positiveText: '確認',
    negativeText: '取消',
    async onPositiveClick() {
      try {
        const data = {
          status: 'host_declined',
          register_validated: 1,
          activity_id,
        }
        const response = await ActivityReviewApplicationsAPI(id, data)
        if (response && response.data.status === 200) {
          // 準備data
          const notiData = {
            actor_id: userStore.user.uid, // 誰觸發了這個行為
            user_id: response.data.data.participant_id, // 這個行為對誰觸發
            target_id: activity_id, // 被行為的受詞id
            action: 'review', // 行為 (目前僅有'create','register','like','comment','review', 'rate')
            target_type: 'activity', // 行為類型 (目前僅有'activity','post','rating')
            message: '拒絕了你的報名', // 要顯示在提醒欄位的敘述
            link: `/activity/detail/${activity_id}`, // 這個提醒要導向哪個頁面
          }

          // 送出提醒
          socketStore.sendNotification(notiData)
          message.success(`${attendeeToDeclined.name} 的參加申請已被拒絕！`)
          await refreshAttendees()
        } else {
          message.error('操作失敗，請稍後再試！')
        }
      } catch (error) {
        handleError(message, undefined, error)
      }
    },
    onNegativeClick: () => {
      message.info('您已取消操作！')
    },
  })
}

const handleCancelClick = async (id, activity_id) => {
  if (isReviewTimeExpired()) {
    message.error('審核時間已過，無法進行操作！')
    return
  }
  const attendeeToCancel = attendee.value.find((item) => item.id === id)

  if (!attendeeToCancel) {
    message.error('找不到該參加者！')
    return
  }

  if (attendeeToCancel.rejected) {
    message.success(`${attendeeToCancel.name} 的參加資格已被取消，無需再次操作！`)
    return
  }

  if (!attendeeToCancel.approved) {
    message.success(`${attendeeToCancel.name} 尚未被允許參加，無法取消參加資格！`)
    return
  }

  dialog.success({
    title: '確認取消參加',
    content: `您確定要取消 ${attendeeToCancel.name} 的參加資格嗎？`,
    positiveText: '確認',
    negativeText: '取消',
    async onPositiveClick() {
      try {
        const data = {
          status: 'host_declined',
          register_validated: 1,
          activity_id,
        }
        const response = await ActivityReviewApplicationsAPI(id, data)
        if (response && response.data.status === 200) {
          // 準備data
          const notiData = {
            actor_id: userStore.user.uid, // 誰觸發了這個行為
            user_id: response.data.data.participant_id, // 這個行為對誰觸發
            target_id: activity_id, // 被行為的受詞id
            action: 'review', // 行為 (目前僅有'create','register','like','comment','review', 'rate')
            target_type: 'activity', // 行為類型 (目前僅有'activity','post','rating')
            message: '取消了你的報名', // 要顯示在提醒欄位的敘述
            link: `/activity/detail/${activity_id}`, // 這個提醒要導向哪個頁面
          }

          // 送出提醒
          socketStore.sendNotification(notiData)
          attendeeToCancel.approved = false
          attendeeToCancel.rejected = true
          message.success(`${attendeeToCancel.name} 的參加資格已被取消！`)
          await refreshAttendees()
        } else {
          message.error('操作失敗，請稍後再試！')
        }
      } catch (error) {
        handleError(message, undefined, error)
      }
    },
    onNegativeClick: () => {
      message.info('您已取消操作！')
    },
  })
}

const quickReplyVisible = ref(false)
const selectedReplies = ref([])
const currentAttendeeId = ref(null)
const replyOptions = [
  '審核時間未到，請耐心等候',
  '抱歉目前額滿，候補將優先審核您',
  '抱歉已經額滿，歡迎下次再來',
  '若您能邀請一位女性朋友報名，將優先審核',
  '若您能邀請一位男性朋友報名，將優先審核',
  '若您能邀請一位朋友報名，將優先審核',
  '歡迎報名我的其他揪團',
]

const showQuickReply = (id) => {
  currentAttendeeId.value = id
  quickReplyVisible.value = true
}
const hideQuickReply = () => {
  quickReplyVisible.value = false
  message.info('已取消操作')
}

const deleteReply = (attendeeId, replyIndex) => {
  const attendeeToModify = attendee.value.find((item) => item.id === attendeeId)
  if (!attendeeToModify) {
    message.error('找不到該參加者！')
    return
  }

  // 刪除指定回覆
  attendeeToModify.replies.splice(replyIndex, 1)

  // 更新 localStorage
  const storedReplies = JSON.parse(localStorage.getItem('attendeeReplies')) || {}
  storedReplies[attendeeId] = attendeeToModify.replies
  localStorage.setItem('attendeeReplies', JSON.stringify(storedReplies))

  message.success('回覆已成功刪除')
}

const sendReplies = async () => {
  const attendeeToReply = attendee.value.find((item) => item.id === currentAttendeeId.value)
  if (attendeeToReply) {
    attendeeToReply.replies = [...selectedReplies.value]
    const notiData = {
      actor_id: userStore.user.uid, // 誰觸發了這個行為
      user_id: attendeeToReply.number, // 這個行為對誰觸發
      target_id: attendeeToReply.id, // 被行為的受詞id
      action: 'review', // 行為 (目前僅有'create','register','like','comment','review', 'rate')
      target_type: 'activity', // 行為類型 (目前僅有'activity','post','rating')
      message: '回覆了你的報名', // 要顯示在提醒欄位的敘述
      link: `/activity/detail/${activity_id}`, // 這個提醒要導向哪個頁面
    }

    // 送出提醒
    socketStore.sendNotification(notiData)
    // 保存到 localStorage，key 為參加者 ID
    const storedReplies = JSON.parse(localStorage.getItem('attendeeReplies')) || {}
    storedReplies[currentAttendeeId.value] = attendeeToReply.replies
    localStorage.setItem('attendeeReplies', JSON.stringify(storedReplies))

    message.success('已成功發送回覆內容')
  }

  selectedReplies.value = []
  quickReplyVisible.value = false
}
</script>
<template>
  <template v-if="canAccessActivity.isHost">
    <template v-if="canAccessActivity.displayTemplate === '檢視報名者列表'">
      <div
        class="flex justify-center min-w-[400px] items-center min-h-screen bg-gray-200 shadow-2xl"
      >
        <div
          class="m-auto p-2 rounded-xl bg-gray-50 border-gray-300 border-solid border-2 w-full max-w-[768px] sm:w-full"
        >
          <div id="review" class="m-5 max-w-[768px]">
            <div class="flex my-2">
              <div
                @click="
                  $router.push({
                    name: 'activityDetail',
                    params: { id: $route.params.activity_id },
                  })
                "
                class="hover:bg-yellow-300 rounded-full mr-2 transition-all"
              >
                <NavArrowLeft width="32px" height="32" />
              </div>
              <div class="text-2xl font-bold text-gray-700">檢視報名者列表</div>
            </div>
            <div
              class="flex items-center bg-gray-100 border-[1px] border-gray-200 rounded-xl p-3 my-4 text-sm font-semibold"
            >
              <img src="../../../assets/Screening.png" alt="" class="w-8 mr-1" />
              共有 {{ attendee.length }} 位用戶報名 ({{ approvedCount }} 位用戶已經報名，{{
                userCancellation
              }}
              位用戶已經取消)
            </div>

            <div
              class="mx-2 flex items-center bg-gray-100 text-gray-400 my-3 rounded-full transition-all duration-200"
            >
              <input
                v-model="searchQuery"
                type="text"
                placeholder="🔍請輸入會員名稱進行搜尋"
                class="bg-gray-100 h-10 w-full outline-none outline-[3px] focus:outline-yellow-400 p-2 rounded-full transition-all"
              />
            </div>

            <!-- 🔹 報名者列表細節 -->
            <div
              v-for="item in filteredAttendees"
              :key="item.id"
              class="flex flex-col text-gray-500 bg-gray-100 border-[1px] border-gray-200 rounded-xl p-2 my-2 w-full"
            >
              <!-- 報名 -->
              <div
                v-if="item.registered"
                class="flex py-3 px-1 rounded-2xl bg-green-50 border-4 border-green-600 transition-all duration-500"
              >
                <div class="mx-2 w-10 h-10 min-h-[40px] min-w-[40px]">
                  <img
                    :src="item.avatar || '/images/default-avatar.png'"
                    class="object-cover w-full h-full rounded-full"
                    alt="Avatar"
                    @error="(e) => (e.target.src = defaultAvatar)"
                  />
                </div>
                <div class="flex flex-col w-11/12 mx-2">
                  <div class="text-sm">{{ item.name }}</div>
                  <div class="my-1 text-xs max-sm:hidden">{{ item.number }}</div>
                </div>
                <div class="flex flex-col justify-center items-center w-52 px-4">
                  <p class="text-xs text-green-600 font-semibold">用戶已報名</p>
                </div>
              </div>
              <!-- 取消 -->
              <div
                v-if="item.participant_cancelled"
                class="flex py-3 px-1 rounded-2xl bg-gray-100 border-4 border-gray-400 transition-all duration-500"
              >
                <div class="mx-2 w-10 h-10 min-h-[40px] min-w-[40px]">
                  <img
                    :src="item.avatar || '/images/default-avatar.png'"
                    class="object-cover w-full h-full rounded-full"
                    alt="Avatar"
                    @error="(e) => (e.target.src = defaultAvatar)"
                  />
                </div>
                <div class="flex flex-col w-11/12 mx-2">
                  <div class="text-sm">{{ item.name }}</div>
                  <div class="my-1 text-xs max-sm:hidden">{{ item.number }}</div>
                </div>
                <div class="flex flex-col justify-center items-center w-52 px-4">
                  <p class="text-xs text-gray-600 font-semibold">用戶已取消參加</p>
                </div>
              </div>
              <div class="text-gray-700 text-[12px] mt-2 px-3">{{ item.message }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="canAccessActivity.displayTemplate === '審核列表'">
      <!--  審核列表 -->
      <div
        class="flex justify-center min-w-[400px] items-center min-h-screen bg-gray-200 shadow-2xl"
      >
        <div
          class="m-auto p-2 rounded-xl bg-gray-50 border-gray-300 border-solid border-2 w-full max-w-[768px] sm:w-full"
        >
          <div id="review" class="m-5 max-w-[768px]">
            <div class="group flex my-2">
              <div
                @click="
                  $router.push({
                    name: 'activityDetail',
                    params: { id: $route.params.activity_id },
                  })
                "
                class="hover:bg-green-600 rounded-full mr-2 transition-all duration-200"
              >
                <NavArrowLeft
                  width="32px"
                  height="32"
                  class="hover:text-white transition-all duration-[50mm]"
                />
              </div>
              <div class="text-2xl font-bold text-gray-800">審核列表</div>
            </div>
            <div
              class="flex items-center bg-gray-100 border-[1px] border-gray-200 rounded-xl p-3 my-4 text-sm font-semibold"
            >
              <img src="../../../assets/Screening.png" alt="" class="w-8 mr-1" />
              共有 {{ attendee.length }} 位報名 ({{ approvedCount }} 位審核通過，{{ rejectCount }}
              位審核已拒絕)
            </div>

            <div
              class="mx-2 flex items-center bg-gray-100 text-gray-400 my-3 rounded-full transition-all duration-200"
            >
              <input
                v-model="searchQuery"
                type="text"
                placeholder="🔍請輸入會員名稱進行搜尋"
                class="bg-gray-100 h-10 w-full outline-none outline-[3px] focus:outline-green-400 p-2 rounded-full transition-all"
              />
            </div>

            <!-- 🔹 審核報名者列表 -->
            <div
              v-for="item in filteredAttendees"
              :key="item.id"
              class="flex flex-col text-gray-500 bg-gray-100 border-[1px] border-gray-200 rounded-xl p-2 my-2 w-full"
            >
              <div
                class="flex py-3 px-1 rounded-2xl bg-gray-100 border-4 border-gray-400 transition-all duration-500"
                :class="[
                  item.registered ? 'border-gray-500 bg-gray-100 transition-all duration-500' : '',
                  item.approved
                    ? 'border-yellow-400 bg-yellow-100 transition-all duration-500'
                    : '',
                  item.participant_cancelled
                    ? 'border-gray-600 bg-gray-200 transition-all duration-500'
                    : '',
                  item.host_declined ? 'border-red-700 bg-red-100 transition-all duration-500' : '',
                  ,
                ]"
              >
                <div class="mx-2 w-1/12">
                  <img
                    :src="item.avatar || '/images/default-avatar.png'"
                    class="w-full min-w-10 min-h-10 rounded-full object-cover"
                    alt="Avatar"
                    @error="(e) => (e.target.src = defaultAvatar)"
                  />
                </div>
                <div class="flex flex-col w-11/12 mx-2">
                  <div class="text-sm">{{ item.name }}</div>
                  <div class="my-1 text-xs max-sm:hidden">{{ item.number }}</div>
                  <div class="flex">
                    <div
                      class="flex flex-row justify-center items-center text-[10px] text-red-500 border-solid border-2 border-red-500 bg-red-100 px-1 rounded-md"
                    >
                      <FireFlame width="13" height="13" />10
                    </div>
                    <div
                      class="flex flex-row justify-center items-center bg-green-100 text-[10px] text-green-500 border-solid border-2 border-green-500 px-1 ml-1 rounded-md"
                    >
                      <leaf width="13" height="13" />新手
                    </div>
                  </div>
                  <div class="flex items-center mt-2 max-sm:hidden">
                    <div class="w-1 h-4 rounded-full bg-blue-600"></div>
                    <div class="ml-2 mr-1 text-xs font-semibold">審核不受限</div>
                    <ThumbsUp width="16" height="16" />
                  </div>
                </div>

                <div class="flex flex-col justify-center items-center w-52 px-4">
                  <p
                    v-if="item.registered"
                    class="flex justify-center text-xs text-gray-400 my-1 w-32 font-semibold"
                  >
                    尚未審核
                  </p>
                  <p
                    v-else-if="item.approved"
                    class="flex justify-center items-center w-32 text-xs text-green-600 my-1 font-semibold"
                  >
                    審核已通過<CheckCircleSolid width="14" height="14" />
                  </p>
                  <p
                    v-else-if="item.participant_cancelled"
                    class="flex justify-center items-center w-32 text-xs text-gray-600 my-1 font-semibold"
                  >
                    用戶已取消參加
                  </p>

                  <p
                    v-else-if="item.host_declined"
                    class="flex justify-center text-xs text-red-400 my-1 w-32 font-semibold"
                  >
                    團主已拒絕用戶參加<XmarkCircle width="12" height="12" />
                  </p>

                  <button
                    @click="handleApproveClick(item.id, item.activity_id)"
                    v-if="!item.approved && !item.participant_cancelled && !item.host_declined"
                    :class="[
                      'flex justify-center items-center w-32 h-8 py-2 mt-2 border-2 rounded-md text-sm transition-all duration-300 bg-green-500 hover:bg-green-600 text-white',
                    ]"
                  >
                    <span>{{ item.approved ? '已允許參加' : '允許參加' }}</span>
                  </button>

                  <button
                    @click="handleCancelClick(item.id, item.activity_id)"
                    v-if="item.approved && !item.participant_cancelled && !item.host_declined"
                    :class="[
                      'flex justify-center items-center w-32 h-8 py-2 mt-2 border-2 rounded-md text-sm transition-all duration-300 bg-red-500 text-white border-red-600 hover:bg-red-600 hover:border-red-700',
                    ]"
                  >
                    <span>{{ item.cancelled ? '已取消參加' : '取消用戶參加' }}</span>
                  </button>

                  <button
                    @click="handleDeclinedClick(item.id, item.activity_id)"
                    v-if="!item.participant_cancelled && !item.approved && !item.host_declined"
                    :class="[
                      'flex justify-center items-center w-32 h-8 py-2 mt-2 border-2 rounded-md text-sm transition-all duration-300 bg-red-500 text-white border-red-600 hover:bg-red-600 hover:border-red-700',
                    ]"
                  >
                    <span>{{ item.host_declined ? '已拒絕參加' : '拒絕用戶參加' }}</span>
                  </button>
                </div>
              </div>
              <div
                class="flex flex-col text-gray-500 my-1 mx-1 px-3 py-2 bg-gray-200 border-[1px] border-gray-200 rounded-xl"
              >
                <div class="text-gray-700 text-[12px]">{{ item.message }}</div>
                <div class="flex items-center text-sm">
                  <div class="text-[10px]">{{ item.date }}</div>
                  <button
                    @click="showQuickReply(item.id)"
                    class="flex items-center ml-3 text-xs text-black hover:text-green-600 duration-0"
                  >
                    快速回覆
                    <ArrowUpLeftSquareSolid
                      width="14"
                      height="14"
                      class="mx-1"
                      style="transition-duration: 0s"
                    />
                  </button>
                </div>
              </div>
              <div
                v-if="item.replies.length"
                class="flex flex-col bg-green-50 p-4 m-1 mt-1 rounded-xl border-[1.5px] border-green-600"
              >
                <div
                  class="flex justify-between items-center text-xs font-semibold text-green-700 mb-1"
                >
                  團主回覆：
                  <n-button type="error" size="tiny" @click="deleteReply(item.id, idx)">
                    刪除
                  </n-button>
                </div>
                <div v-for="(reply, idx) in item.replies" :key="idx" class="text-xs text-green-800">
                  {{ reply }}
                </div>
              </div>
            </div>

            <!-- 快速回覆視窗 -->
            <div
              v-if="quickReplyVisible"
              class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
            >
              <div class="bg-white p-10 rounded-lg w-[460px] shadow-lg">
                <div class="text-lg font-semibold">快速回覆內容</div>
                <div>
                  <label
                    v-for="(option, index) in replyOptions"
                    :key="index"
                    class="flex items-center mb-2 px-3 py-1 rounded-md cursor-pointer hover:bg-green-100 hover:scale-105 transition-all"
                  >
                    <input
                      type="checkbox"
                      v-model="selectedReplies"
                      :value="option"
                      class="mr-2 accent-green-400"
                    />
                    {{ option }}
                  </label>
                </div>
                <div class="flex justify-between mt-4">
                  <button
                    @click="hideQuickReply"
                    class="bg-gray-200 py-2 px-4 rounded hover:bg-gray-300 hover:scale-105 transition-all"
                  >
                    取消
                  </button>
                  <button
                    @click="sendReplies"
                    class="bg-green-500 py-2 px-4 rounded hover:bg-green-700 hover:scale-105 transition-all"
                  >
                    送出
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <h1 class="text-8xl font-extrabold text-red-500 animate-bounce">哎呀！真糟糕！</h1>
        <p class="mt-4 text-2xl font-semibold">很抱歉</p>
        <p class="mt-2 text-lg text-gray-600">很抱歉，您不是該活動的團主，無法查看此頁面</p>
        <router-link
          to="/"
          class="mt-6 px-6 py-3 bg-blue-500 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-blue-600 transition"
        >
          返回首頁
        </router-link>
      </div>
    </template>
  </template>
</template>

<style scoped></style>
