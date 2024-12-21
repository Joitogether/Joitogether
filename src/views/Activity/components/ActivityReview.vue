<script setup>
import { ref, computed, onMounted } from 'vue'
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

import { useDialog, useMessage } from 'naive-ui'
import {
  ActivityGetApplicationsAPI,
  ActivityReviewApplicationsAPI,
  ActivityGetActivitiesAPI,
} from '@/apis/activityAPI'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()
const activity_id = route.params.activity_id

const userStore = useUserStore()
const activity = ref([null]) // 活動詳細資料

onMounted(async () => {
  try {
    const response = await ActivityGetActivitiesAPI(activity_id)
    if (response.status === 200 && response.data) {
      activity.value = response.data.data
      console.log('成功', response.data.data)
    }
  } catch (error) {
    console.error('無法獲取活動資料:', error)
  }
})

const refreshAttendees = async () => {
  attendee.value = await ActivityGetApplicationsAPI(activity_id, defaultAvatar)
}

onMounted(async () => {
  attendee.value = await ActivityGetApplicationsAPI(activity_id, defaultAvatar)
})

const dialog = useDialog()
const message = useMessage()
const attendee = ref([])

//切換報名,截止報名功能
const registrationStatus = ref('open')

// 切換開放、截止報名的UI
const openRegistration = () => {
  dialog.warning({
    title: '確認操作',
    content: '您是否確認開放報名？',
    positiveText: '確認',
    negativeText: '取消',
    onPositiveClick: () => {
      registrationStatus.value = 'open'
    },
    onNegativeClick: () => {
      message.info('您已取消開放報名的操作')
    },
  })
}
const closeRegistration = () => {
  dialog.warning({
    title: '確認操作',
    content: '您是否確認截止報名？',
    positiveText: '確認',
    negativeText: '取消',
    onPositiveClick: () => {
      registrationStatus.value = 'closed'
    },
    onNegativeClick: () => {
      message.info('您已取消截止報名的操作')
    },
  })
}

const searchQuery = ref('')
const filteredAttendees = computed(() => {
  if (!searchQuery.value) {
    return attendee.value
  }
  return attendee.value.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const handleApproveClick = async (id) => {
  const attendeeToUpdate = attendee.value.find((item) => item.id === id)
  if (!attendeeToUpdate) {
    message.error('找不到該參加者！')
    return
  }

  if (attendeeToUpdate.approved) {
    message.warning(`${attendeeToUpdate.name} 已經被允許參加，無需再次操作！`)
    return
  }
  if (approvedCount.value >= activity.value.max_participants) {
    message.warning('該活動人數已滿，無法再允許更多用戶參加')
    return
  }

  if (registrationStatus.value === 'closed') {
    message.warning('目前報名已截止，無法操作。請返回開放報名繼續操作。')
    return
  }

  dialog.warning({
    title: '確認允許參加',
    content: `您確定要允許 ${attendeeToUpdate.name} 參加嗎？`,
    positiveText: '確認',
    negativeText: '取消',
    async onPositiveClick() {
      try {
        const response = await ActivityReviewApplicationsAPI(id, 'approved')
        if (response && response.status === 200) {
          message.success(`${attendeeToUpdate.name} 已被允許參加`)
          await refreshAttendees()
        } else {
          message.error('操作失敗，請稍後再試！')
        }
      } catch (error) {
        console.error('API 請求失敗:', error)
        message.error('操作失敗，請稍後再試！')
      }
    },
    onNegativeClick: () => {
      message.info('您已取消操作！')
    },
  })
}

const handleDeclinedClick = async (id) => {
  const attendeeToDeclined = attendee.value.find((item) => item.id === id)
  if (!attendeeToDeclined) {
    message.error('找不到該參加者！')
    return
  }

  if (registrationStatus.value === 'closed') {
    message.warning('目前報名已截止，無法操作。請返回開放報名繼續操作。')
    return
  }

  if (attendeeToDeclined.host_declined) {
    message.warning(`${attendeeToDeclined.name} 已經被拒絕參加，無需再次操作！`)
    return
  }

  dialog.warning({
    title: '確認拒絕',
    content: `您確定要拒絕 ${attendeeToDeclined.name} 的參加申請嗎？`,
    positiveText: '確認',
    negativeText: '取消',
    async onPositiveClick() {
      try {
        const response = await ActivityReviewApplicationsAPI(id, 'host_declined')
        if (response && response.status === 200) {
          message.success(`${attendeeToDeclined.name} 的參加申請已被拒絕！`)
          await refreshAttendees()
        } else {
          message.error('操作失敗，請稍後再試！')
        }
      } catch (error) {
        console.error('API 請求失敗:', error)
        message.error('操作失敗，請稍後再試！')
      }
    },
    onNegativeClick: () => {
      message.info('您已取消操作！')
    },
  })
}

const handleCancelClick = async (id) => {
  const attendeeToCancel = attendee.value.find((item) => item.id === id)

  if (!attendeeToCancel) {
    message.error('找不到該參加者！')
    return
  }

  if (registrationStatus.value === 'closed') {
    message.warning('目前報名已截止，無法操作。請返回開放報名繼續操作。')
    return
  }

  if (attendeeToCancel.rejected) {
    message.warning(`${attendeeToCancel.name} 的參加資格已被取消，無需再次操作！`)
    return
  }

  if (!attendeeToCancel.approved) {
    message.warning(`${attendeeToCancel.name} 尚未被允許參加，無法取消參加資格！`)
    return
  }

  dialog.warning({
    title: '確認取消參加',
    content: `您確定要取消 ${attendeeToCancel.name} 的參加資格嗎？`,
    positiveText: '確認',
    negativeText: '取消',
    async onPositiveClick() {
      try {
        const response = await ActivityReviewApplicationsAPI(id, 'participant_cancelled')

        if (response && response.status === 200) {
          attendeeToCancel.approved = false
          attendeeToCancel.rejected = true
          message.success(`${attendeeToCancel.name} 的參加資格已被取消！`)
          await refreshAttendees()
        } else {
          message.error('操作失敗，請稍後再試！')
        }
      } catch (error) {
        console.error('API 請求失敗:', error)
        message.error('操作失敗，請稍後再試！')
      }
    },
    onNegativeClick: () => {
      message.info('您已取消操作！')
    },
  })
}

// 切換審核狀態

const approvedCount = computed(() => {
  return attendee.value.filter((item) => item.approved).length
})

const rejectCount = computed(() => {
  return attendee.value.filter((item) => item.host_declined).length
})

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
  <div
    v-if="userStore.user.uid === activity.host_info?.uid"
    class="flex justify-center min-w-[400px] items-center min-h-screen bg-gray-200 shadow-2xl"
  >
    <div
      class="m-auto p-2 rounded-xl bg-gray-50 border-gray-300 border-solid border-2 w-full max-w-[768px] sm:w-full"
    >
      <div id="review" class="m-5 max-w-[768px]">
        <div class="flex my-2">
          <div
            @click="
              $router.push({ name: 'activityDetail', params: { id: $route.params.activity_id } })
            "
            class="hover:bg-yellow-300 rounded-full mr-2 transition-all"
          >
            <NavArrowLeft width="32px" height="32" />
          </div>

          <div class="text-2xl font-bold text-gray-700">審核列表</div>
        </div>
        <div
          class="flex items-center bg-gray-100 border-[1px] border-gray-200 rounded-xl p-3 my-4 text-sm font-semibold"
        >
          <img src="../../../assets/Screening.png" alt="" class="w-8 mr-1" />共有{{
            attendee.length
          }}
          位報名( {{ approvedCount }}位審核通過，{{ rejectCount }} 位審核已拒絕)
        </div>

        <div
          class="flex justify-center items-center border-solid border-[3px] p-0.5 h-10 border-gray-200 rounded-full my-5 text-center max-w-[768px]"
        >
          <div
            @click="openRegistration('open')"
            :class="{
              'bg-yellow-400': registrationStatus === 'open',
              'text-gray-400  hover:text-sm hover:font-semibold hover:text-gray-500':
                registrationStatus !== 'open',
            }"
            class="w-1/2 p-1 text-[13px] rounded-full cursor-pointer transition-all"
          >
            <a href="#">開放報名</a>
          </div>
          <div
            @click="closeRegistration('closed')"
            :class="{
              'bg-yellow-400': registrationStatus === 'closed',
              'text-gray-400 hover:text-sm hover:font-semibold hover:text-gray-500':
                registrationStatus !== 'closed',
            }"
            class="w-1/2 p-1 text-[13px] rounded-full cursor-pointer transition-all"
          >
            <a href="#">截止報名</a>
          </div>
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

        <div
          class="flex flex-col bg-gray-100 border-[1px] border-gray-200 rounded-xl p-4 my-4 w-full text-blue-600 font-semibold"
        >
          <div class="flex items-center mb-1 text-[14px]">
            <ThumbsUp width="18" height="18" />

            <div class="mx-2">審核不受限</div>
          </div>
          <div class="text-xs font-normal">
            你可以審核擁有此徽章的報名者，不會有人數限制。如果審核沒有此徽章的報名者，需要使用額外的酒杯來增加名額，你也可以升級VIP會員來解除限制。
          </div>
        </div>

        <!-- 未審核通過時畫面 -->
        <div
          v-for="item in filteredAttendees"
          :key="item.id"
          class="flex flex-col text-gray-500 bg-gray-100 border-[1px] border-gray-200 rounded-xl p-2 my-2 w-full"
        >
          <div
            class="flex py-3 px-1 rounded-2xl bg-gray-100 border-4 border-gray-400 transition-all duration-500"
            :class="[
              item.registered ? 'border-gray-500 bg-gray-100 transition-all duration-500' : '',
              item.approved ? 'border-yellow-400 bg-yellow-100 transition-all duration-500' : '',
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
                class="w-12 min-w-8 rounded-full"
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
                已取消用戶參加
              </p>

              <p
                v-else-if="item.host_declined"
                class="flex justify-center text-xs text-red-400 my-1 w-32 font-semibold"
              >
                團主已拒絕用戶參加<XmarkCircle width="12" height="12" />
              </p>

              <button
                @click="handleApproveClick(item.id)"
                v-if="!item.approved && !item.participant_cancelled && !item.host_declined"
                :class="[
                  'flex justify-center items-center w-32 h-8 py-2 mt-2 border-2 rounded-md text-sm transition-all duration-300',
                  registrationStatus === 'closed' || item.approved
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white',
                ]"
              >
                <span>{{ item.approved ? '已允許參加' : '允許參加' }}</span>
              </button>

              <button
                @click="handleCancelClick(item.id)"
                v-if="item.approved && !item.participant_cancelled && !item.host_declined"
                :class="[
                  'flex justify-center items-center w-32 h-8 py-2 mt-2 border-2 rounded-md text-sm transition-all duration-300',
                  registrationStatus === 'closed' || item.rejected
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-500 text-white border-red-600 hover:bg-red-600 hover:border-red-700',
                ]"
              >
                <span>{{ item.cancelled ? '已取消參加' : '取消用戶參加' }}</span>
              </button>

              <button
                @click="handleDeclinedClick(item.id)"
                v-if="!item.participant_cancelled && !item.approved && !item.host_declined"
                :class="[
                  'flex justify-center items-center w-32 h-8 py-2 mt-2 border-2 rounded-md text-sm transition-all duration-300',
                  registrationStatus === 'closed' || item.rejected
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-500 text-white border-red-600 hover:bg-red-600 hover:border-red-700',
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
                class="flex items-center ml-3 text-xs text-black hover:text-yellow-600"
              >
                快速回覆
                <ArrowUpLeftSquareSolid width="14" height="14" class="mx-1" />
              </button>
            </div>
          </div>
          <div
            v-if="item.replies.length"
            class="flex flex-col bg-yellow-50 p-4 m-1 mt-1 rounded-xl border-[1.5px] border-yellow-600"
          >
            <div
              class="flex justify-between items-center text-xs font-semibold text-yellow-700 mb-1"
            >
              團主回覆：
              <n-button type="error" size="tiny" @click="deleteReply(item.id, idx)">
                刪除
              </n-button>
            </div>
            <div v-for="(reply, idx) in item.replies" :key="idx" class="text-xs text-yellow-800">
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
                class="flex items-center mb-2 px-3 py-1 rounded-md cursor-pointer hover:bg-yellow-100 hover:scale-105 transition-all"
              >
                <input
                  type="checkbox"
                  v-model="selectedReplies"
                  :value="option"
                  class="mr-2 accent-yellow-400"
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
                class="bg-yellow-300 py-2 px-4 rounded hover:bg-yellow-400 hover:scale-105 transition-all"
              >
                送出
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
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
  </div>
</template>

<style scoped></style>
