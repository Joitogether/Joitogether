<script setup>
import { ref, computed } from 'vue'
import {
  NavArrowLeft,
  ThumbsUp,
  CheckCircle,
  CheckCircleSolid,
  FireFlame,
  Leaf,
  ArrowUpLeftSquareSolid,
  Search,
  XmarkCircle,
} from '@iconoir/vue'

const attendee = ref([
  {
    id: 1,
    name: '財哥',
    avatar: '@/assets/avatar.png',
    number: '@2af60e4cc341a435',
    message: '好期待這次的遊戲類型會是什麼！',
    date: '周一,11月18日 2024',
    approved: false,
    rejected: false,
    replies: '',
  },
  {
    id: 2,
    name: '天橋下說書人',
    avatar: '@/assets/avatar.png',
    number: '@1ih499f304ja8v77',
    message: '第一次參加，團主帶帶我！',
    date: '周日,11月17日 2024',
    approved: false,
    rejected: false,
    replies: '',
  },
  {
    id: 3,
    name: '泡泡勇士',
    avatar: '@/assets/avatar.png',
    number: '@a937vvyr49s7882p',
    message: '已經參加第二次了，團主很活潑！',
    date: '周日,11月19日 2024',
    approved: false,
    rejected: false,
    replies: '',
  },
])

//切換報名,截止報名功能
const registrationStatus = ref('open')
const toggleRegistration = (status) => {
  if (status === 'closed') {
    const checkClose = confirm('您是否確認截止報名？')
    if (!checkClose) return
    registrationStatus.value = 'closed'
  } else if (status === 'open') {
    const checkOpen = confirm('您是否確認開放報名？')
    if (!checkOpen) return
    registrationStatus.value = 'open'
  }
}

const searchQuery = ref('') // 搜尋輸入框的內容

const filteredAttendees = computed(() => {
  if (!searchQuery.value) {
    return attendee.value
  }
  return attendee.value.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const handleAttendeeClick = (callback, id) => {
  const approvalAttendee = attendee.value.find((item) => item.id === id)

  // 如果用户已被拒绝，直接提示
  if (approvalAttendee && approvalAttendee.rejected) {
    alert(`${approvalAttendee.name} 已經被拒絕參加本次揪團！`)
    return
  }
  if (registrationStatus.value === 'closed') {
    alert('目前報名已截止，如果需要調整請返回開放報名繼續操作')
    return
  }

  callback()
}

// 切換審核狀態
const toggleApproval = (id) => {
  if (registrationStatus.value === 'closed') {
    alert('需要開放報名才能執行審核操作！')
    return
  }

  const approvalAttendee = attendee.value.find((item) => item.id === id)
  const message = approvalAttendee.approved
    ? `您確定要解除 ${approvalAttendee.name} 的參加資格嗎？`
    : `您確定要允許 ${approvalAttendee.name} 參加嗎？`

  if (!confirm(message)) {
    return
  }

  if (approvalAttendee.approved) {
    approvalAttendee.rejected = true
    approvalAttendee.approved = false
  } else {
    approvalAttendee.approved = true
    approvalAttendee.rejected = false
  }
}

// 審核的人數計算
const approvedCount = computed(() => {
  return attendee.value.filter((item) => item.approved).length
})

const rejectCount = computed(() => {
  return attendee.value.filter((item) => item.rejected).length
})

// 快速回覆的視窗狀態和選擇
const quickReplyVisible = ref(false) // 快速回覆視窗
const selectedReplies = ref([]) // 預設回復選項
const sentReplies = ref([]) // 送出回覆

const currentAttendeeId = ref(null) // 當前快速回覆的 ID

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
}

const sendReplies = () => {
  const attendeeToReply = attendee.value.find((item) => item.id === currentAttendeeId.value)
  if (attendeeToReply) {
    attendeeToReply.replies = [...selectedReplies.value]
  }

  selectedReplies.value = []
  quickReplyVisible.value = false
}
</script>

<template>
  <div class="flex justify-center min-w-[400px] items-center min-h-screen bg-gray-200 shadow-2xl">
    <div
      class="m-auto p-2 rounded-xl bg-gray-50 border-gray-300 border-solid border-2 w-full max-w-[768px] sm:w-full"
    >
      <div id="review" class="m-5 max-w-[768px]">
        <div class="flex my-2">
          <div class="hover:bg-yellow-300 rounded-full mr-2 transition-all">
            <a href="https://www.google.com/" class="hover:text-yellow-600"
              ><NavArrowLeft width="32px" height="32"
            /></a>
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
            @click="toggleRegistration('open')"
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
            @click="toggleRegistration('closed')"
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
          v-for="(item, index) in filteredAttendees"
          :key="item.id"
          class="flex flex-col text-gray-500 bg-gray-100 border-[1px] border-gray-200 rounded-xl p-2 my-2 w-full"
        >
          <div
            class="flex py-3 px-1 rounded-2xl bg-gray-200 transition-all duration-75"
            :class="[
              item.approved
                ? 'border-yellow-400 border-4 rounded-2xl  transition-all duration-75'
                : 'border-4 border-solid border-gray-100  transition-all duration-200',
            ]"
          >
            <div class="mx-2 w-1/12">
              <img src="@/assets/avatar.png" class="w-12 min-w-8 rounded-full" alt="Avatar" />
            </div>
            <div class="flex flex-col w-11/12 mx-2">
              <div class="text-sm">{{ item.name }}</div>
              <div class="my-1 text-xs max-sm:hidden">{{ item.number }}</div>
              <div class="flex">
                <div
                  class="flex flex-row justify-center items-center text-[10px] text-red-500 border-solid border-2 border-red-500 px-1 rounded-md"
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
                v-if="item.rejected"
                class="flex items-center justify-center text-xs text-red-400 my-1 w-32"
              >
                團主已拒絕用戶參加<XmarkCircle width="12" height="12" />
              </p>
              <p
                v-else-if="item.approved"
                class="flex justify-center items-center w-24 text-xs text-green-600 my-1"
              >
                審核已通過<CheckCircleSolid width="14" height="14" />
              </p>
              <p v-else class="flex justify-center text-xs text-gray-400 my-1 w-16">尚未審核</p>
              <button
                @click="handleAttendeeClick(() => toggleApproval(item.id), item.id)"
                :class="[
                  'flex justify-center items-center w-24 h-14 py-2 border-2 rounded-md text-sm transition-all duration-300',
                  registrationStatus === 'closed'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : item.rejected
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : item.approved
                        ? 'bg-red-500 text-gray-100 border-red-600 font-semibold'
                        : 'hover:bg-yellow-400 hover:text-yellow-700 border-gray-300 hover:border-yellow-500',
                ]"
                class="flex justify-center items-center max-sm:hidden w-full sm:w-30 h-8 py-2 border-2 rounded-md text-xs sm:text-sm transition-all"
              >
                <span v-if="item.rejected">已拒絕參加</span>
                <span v-else>{{ item.approved ? '解除參加資格' : '允許參加' }}</span>
              </button>
              <button class="flex justify-center items-center w-32 h-8 mt-2 py-2 border-2 rounded-md text-sm transition-all duration-300 bg-red-500 text-gray-100 border-red-600">拒絕用戶參加</button>
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
            class="flex flex-col bg-yellow-100 p-2 m-1 mt-1 rounded-xl"
          >
            <div class="text-xs font-semibold text-yellow-700 mb-1">團主回覆：</div>
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

        <!-- 顯示送出的內容 -->
        <div
          v-if="sentReplies.length"
          class="w-full my-2 p-3 border-[1px] bg-gray-50 border-solid rounded-xl"
        >
          <h3 class="font-semibold text-sm mb-1 text-gray-600">團主回覆：</h3>
          <div v-for="(reply, index) in sentReplies" :key="index" class="">
            <div class="rounded-full w-96 text-sm text-gray-600">
              {{ reply }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
