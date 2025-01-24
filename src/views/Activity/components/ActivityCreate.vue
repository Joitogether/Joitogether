<script setup>
import { Search, XmarkCircle, Clock, CreditCard, MoneySquare, Group, MapPin } from '@iconoir/vue'
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import dayjs from 'dayjs'
import { taiwanTime, formatToISOWithTimezone } from '@/utils/useDateTime'
import { useUserStore } from '@/stores/userStore'
import { convertMarkdown } from '@/utils/useMarkdown'
import { userGetAPI } from '@/apis/userAPIs'
import { activityUserCreateAPI } from '@/apis/activityAPIs.js'
import { useAutocomplete } from '@/utils/useAutocomplete'
import { useGoogleMaps } from '@/utils/useGoogleMaps'
import { usePreviewMode } from '@/utils/usePreviewMode'
import { handleError } from '@/utils/handleError'
import { useSocketStore } from '@/stores/socketStore'

const socketStore = useSocketStore()
const { previewMap } = useGoogleMaps()
const { isPreviewMode, enterPreviewMode, exitPreviewMode } = usePreviewMode(previewMap)

const message = useMessage()
const { searchQuery, suggestions, triggerInputChange, isLoading, isLoadOK } = useAutocomplete()

const clearSearch = () => {
  searchQuery.value = ''
  suggestions.value = []
  isLoadOK.value = false
}

const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion.description
  suggestions.value = []
  previewMap(suggestion.description)
}

const { minTime, maxTime } = taiwanTime()
const selectedFile = ref(null)
const isSubmitting = ref(false)
const router = useRouter()
const userStore = useUserStore()
const user = ref(null)

if (userStore.user.isLogin) {
  const fetchUserData = async () => {
    try {
      const result = await userGetAPI(userStore.user.uid)

      if (result) {
        if (result.length === 0) {
          user.value = {}
          return
        }
        user.value = result
      }
      return result
    } catch {
      return
    }
  }
  fetchUserData()
}

const markdownPreview = computed(() => convertMarkdown(inputValues.value.describe))

dayjs.locale('zh-tw')

const ActivityDataPush = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true

  const hostId = userStore.user.uid

  const activityData = {
    name: inputValues.value.name,
    description: inputValues.value.describe,
    event_time: isoEventTime.value,
    approval_deadline: isoDeadLine.value || null,
    max_participants: participants.value,
    min_participants: 1,
    pay_type: paymentMethod.value,
    price: eventCost.value,
    location: searchQuery.value || null,
    category: inputValues.value.category || null,
    require_approval: inputValues.value.requireApproval ? 1 : 0,
    host_id: hostId,
    status: 'registrationOpen',
    require_payment: inputValues.value.require_payment ? 1 : 0,
  }

  if (!previewActivity()) {
    message.error('請先完成所有必填項目！')
    isSubmitting.value = false
    return
  }

  try {
    const response = await activityUserCreateAPI(selectedFile.value || null, activityData)
    message.success('活動建立成功了喔!!') // 成功訊息提示
    if (response?.data?.id) {
      const notiData = {
        actor_id: response.data.host_id, // 觸發行為的使用者 ID
        user_id: response.data.host_id, // 接收行為的使用者 ID (從 API 回傳資料取得)
        target_id: response.data.id, // 被行為影響的目標 ID (從 API 回傳資料取得)
        action: 'create', // 行為類型 (此處為 create)
        target_type: 'activity', // 行為對象類型
        message: `已成功建立活動：${response.data.name}`, // 通知訊息
        link: `/activity/detail/${response.data.id}`, // 導向活動詳情頁面的連結
      }

      // 送出提醒通知
      socketStore.sendNotification(notiData)
    }
    router.replace('/')
  } catch (error) {
    handleError(message, undefined, error)
  } finally {
    isSubmitting.value = false
  }
}

const handlePreviewClick = () => {
  const isValid = previewActivity()
  if (isValid) {
    enterPreviewMode(searchQuery.value)
  } else {
    message.error('資料未完成或有誤，請檢查填寫項目！')
  }
}

const inputValues = ref({
  name: '',
  describe: '',
  price: '',
  eventTime: '',
  deadline: '',
  category: '',
  requireApproval: false,
  require_payment: false,
})

const userNotEnter = ref({
  name: false,
  describe: false,
  price: false,
  eventTime: false,
  deadline: false,
  requireApproval: false,
  require_payment: false,
  category: false,
})

const timeRange = ref({
  minTime: '',
  maxTime: '',
})

const payment = computed(() => {
  switch (paymentMethod.value) {
    case 'free':
      return '免費'
    case 'AA':
      return '各付各的'
    case 'host':
      return '團主請客'
    case 'paymentRequired':
      return '需要付款'
    default:
      return 'null'
  }
})

//  監視人數
const participants = ref(1)
const participantsError = ref('')

const updateParticipants = (value) => {
  const newCount = participants.value + value
  if (newCount < 1) {
    participantsError.value = '人數不得低於 1 人'
    participants.value = 1
  } else if (newCount > 99999) {
    participantsError.value = '人數太多了'
    participants.value = 99999
  } else {
    participantsError.value = ''
    participants.value = newCount
  }
}
//  監視人數輸入
watch(participants, (newValue) => {
  if (isNaN(newValue) || newValue === '' || newValue <= 0) {
    message.warning('請輸入有效數字')
    participantsError.value = '請輸入有效數字'
    participants.value = ''
  } else {
    participantsError.value = ''
  }
})

//  限制人數輸入
const validateInput = (event) => {
  let value = event.target.value

  value = value.replace(/[^0-9]/g, '')
  value = value.replace(/^0+/, '')

  if (value > 99999) {
    value = 99999
  }
  event.target.value = value
}

//  監視費用輸入
const eventCost = ref(0)
const eventCostError = ref('')

watch(eventCost, (newValue) => {
  if (isNaN(newValue) || newValue === '' || newValue <= 0) {
    eventCostError.value = '請輸入有效數字'
    eventCost.value = ''
  } else if (newValue > 99999) {
    eventCostError.value = '活動費用不得超過 99999 元'
    eventCost.value = 99999
  } else {
    eventCostError.value = ''
  }
})

//  限制費用輸入
const eventCostInput = (event) => {
  let value = event.target.value

  value = value.replace(/[^0-9]/g, '')
  value = value.replace(/^0+/, '')
  if (value > 99999) {
    value = 99999
  }
  event.target.value = value
}

const checkTimeInput = (field) => {
  const now = new Date()

  if (field === 'eventTime') {
    const eventTime = new Date(inputValues.value.eventTime)
    userNotEnter.value.eventTime = !inputValues.value.eventTime || eventTime < now
  }

  if (field === 'deadline' && inputValues.value.requireApproval) {
    const eventTime = new Date(inputValues.value.eventTime)
    const deadline = new Date(inputValues.value.deadline)

    if (!inputValues.value.deadline && inputValues.value.requireApproval) {
      userNotEnter.value.deadline = true
    } else if (deadline > eventTime) {
      userNotEnter.value.deadline = true
      message.warning('審核截止時間不可晚於活動時間！')
    } else {
      userNotEnter.value.deadline = false
    }
  }
}

const paymentMethod = ref('free')
const showEventCost = computed(
  () => paymentMethod.value === 'AA' || paymentMethod.value === 'paymentRequired',
)

const validateCost = () => {
  userNotEnter.value.price = eventCost.value < 0 || eventCost.value > 99999
}

const checkPaymentMethod = () => {
  if (paymentMethod.value !== 'AA' || paymentMethod.value !== 'paymentRequired') {
    eventCost.value = 0
    userNotEnter.value.price = false
  }

  if (paymentMethod.value === 'AA') {
    validateCost()
  }

  if (paymentMethod.value === 'paymentRequired') {
    inputValues.value.require_payment = true
    validateCost()
  } else {
    inputValues.value.require_payment = false
  }
}

const uploadedImage = ref(null)
const uploadError = ref('')
const maxFileSize = 2 * 1024 * 1024

const handleFileUpload = (event) => {
  const file = event.target.files[0]

  if (file) {
    if (file.size > maxFileSize) {
      uploadError.value = '檔案大小不可超過 2 MB'
      return
    }
  }
  uploadError.value = ''

  const reader = new FileReader()
  reader.onload = () => {
    uploadedImage.value = reader.result
  }
  reader.readAsDataURL(file)
  selectedFile.value = file

  event.target.value = '' // 重置文件輸入
}

const removeImage = () => {
  uploadedImage.value = null
}

// 聚焦輸入框
const inputElement = ref(null)
const focusInput = () => {
  if (inputElement.value) {
    inputElement.value.focus()
  }
}

// 將輸入的值格式化為存儲所需的 ISO 格式
const isoEventTime = computed(() =>
  inputValues.value.eventTime ? formatToISOWithTimezone(inputValues.value.eventTime) : '',
)
const isoDeadLine = computed(() =>
  inputValues.value.deadline ? formatToISOWithTimezone(inputValues.value.deadline) : '',
)

// 預覽時間格式
const formattedEventTime = computed(() =>
  inputValues.value.eventTime
    ? dayjs(inputValues.value.eventTime).format('YYYY, MM月DD日 dddd HH:mm')
    : '未設定時間',
)

// 預覽審核時間格式
const formattedDeadLine = computed(() =>
  inputValues.value.deadline
    ? dayjs(inputValues.value.deadline).format('YYYY-MM-DD')
    : '未設定時間',
)

onMounted(() => {
  window.scrollTo({ top: 0 })
  timeRange.value.minTime = minTime
  timeRange.value.maxTime = maxTime
})

watch(
  () => inputValues.value.requireApproval,
  (newVal) => {
    if (!newVal) {
      inputValues.value.deadline = ''
    }
  },
)

const checkInput = (field) => {
  if (field === 'deadline' && !userNotEnter.value.requireApproval) {
    userNotEnter.value.deadline = false
    return
  }
  userNotEnter.value[field] = !inputValues.value[field]
}

const previewActivity = () => {
  Object.keys(inputValues.value).forEach((key) => {
    if (key === 'deadline' && !inputValues.value.requireApproval) {
      return
    }
    checkInput(key)
  })

  checkTimeInput('eventTime')

  if (inputValues.value.requireApproval) {
    checkTimeInput('deadline')
  }
  validateCost()

  const fieldsToCheck = ['name', 'describe', 'price', 'eventTime', 'category']
  if (inputValues.value.requireApproval) {
    fieldsToCheck.push('deadline')
  }

  const hasUnfilledFields = fieldsToCheck.some((field) => {
    if (field === 'deadline' && !inputValues.value.requireApproval) {
      return false
    }
    return userNotEnter.value[field]
  })

  const hasUploadError = uploadError.value

  if (hasUnfilledFields || hasUploadError) {
    return
  }

  return true // 檢查通過
}
</script>

<template>
  <section>
    <div class="bg-gray-100 w-screen">
      <form @submit.prevent>
        <main class="mx-auto items-center justify-center md:w-3/4 lg:w-3/5">
          <!-- 圖片上傳 -->
          <div v-if="!isPreviewMode">
            <div class="bg-white rounded-lg p-5 mb-3">
              <h3 class="font-semibold text-3xl text-center border-b-2 pb-5">活動建立</h3>
              <div class="mb-6">
                <div class="relative rounded-lg flex justify-center items-center p-6">
                  <label
                    class="bg-gray-100 mt-6 rounded-md w-40 h-40 flex items-center justify-center hover:bg-gray-200"
                    :class="{ ' cursor-auto': !!uploadedImage, 'cursor-pointer': !uploadedImage }"
                  >
                    <img
                      v-if="uploadedImage"
                      :src="uploadedImage"
                      alt="預覽圖片"
                      class="w-full h-full object-cover rounded-md"
                    />
                    <span v-else class="text-gray-500 text-base">點擊上傳圖片</span>
                    <input
                      type="file"
                      class="hidden"
                      @change="handleFileUpload"
                      accept="image/*"
                      :disabled="!!uploadedImage"
                    />
                  </label>
                  <span
                    v-if="uploadedImage"
                    class="absolute top-3 right-0 bg-gray-300 text-white rounded-full px-2 py-1 text-xs cursor-pointer"
                    @click="removeImage"
                    >X
                  </span>
                </div>
                <p
                  v-if="uploadError"
                  class="text-sm text-red-600 mt-2 flex items-center justify-center"
                >
                  {{ uploadError }}
                </p>
                <p class="text-sm text-gray-600 mt-2 flex items-center justify-center">
                  請至少上傳一張圖片，若未上傳圖片將會使用預設圖片
                </p>
              </div>
            </div>

            <!-- 活動名稱和描述 -->
            <div class="bg-white p-5 px-4 rounded-lg">
              <div class="mb-6 mt-6">
                <label class="block font-medium mb-2 p-2 text-base"
                  >活動名稱
                  <span class="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="請填活動名稱"
                  class="w-full p-3 border-b rounded-md focus:outline-none text-base"
                  v-model="inputValues.name"
                  @blur="checkInput('name')"
                />
                <p class="text-sm text-red-600" v-if="userNotEnter.name">請輸入活動名稱*</p>
              </div>
              <div class="mb-6">
                <label class="block font-medium mb-2 p-2 text-base"
                  >活動描述
                  <span class="text-red-600">*</span>
                </label>
                <textarea
                  placeholder="請填活動描述"
                  rows="4"
                  class="w-full p-3 border rounded-md focus:outline-none text-base resize-none"
                  v-model="inputValues.describe"
                  @blur="checkInput('describe')"
                ></textarea>
                <p class="text-sm text-red-600" v-if="userNotEnter.describe">請輸入活動描述*</p>
              </div>

              <!-- 地點 -->
              <div class="mt-6">
                <div class="mb-6">
                  <label class="block font-medium mb-2 p-2 text-base">
                    地點<span class="text-red-600">*</span>
                  </label>
                  <div class="flex items-center border rounded-md">
                    <input
                      ref="inputElement"
                      type="text"
                      placeholder="搜尋聚會地點"
                      class="flex-grow p-3 border-none focus:outline-none text-base"
                      v-model="searchQuery"
                      @input="triggerInputChange"
                      @focus="initializeAutocomplete"
                    />
                    <button v-if="isLoadOK" class="p-3" @click="clearSearch">
                      <XmarkCircle />
                    </button>
                    <button class="p-3 border-l-2" @click="focusInput">
                      <Search />
                    </button>
                  </div>
                  <div>
                    <ul
                      v-if="isLoading || suggestions.length"
                      class="border rounded-md mt-2 bg-white"
                    >
                      <li v-if="isLoading" class="p-2 text-gray-500 text-sm">搜尋中...</li>
                      <li
                        v-else
                        v-for="(suggestion, index) in suggestions"
                        :key="index"
                        class="p-2 cursor-pointer hover:bg-gray-100"
                        @click="selectSuggestion(suggestion)"
                      >
                        {{ suggestion.description }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- 日期與時間 -->
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block font-medium mb-2 p-2 text-base"
                    >活動時間
                    <span class="text-red-600">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    :min="minTime.slice(0, 16)"
                    :max="maxTime.slice(0, 16)"
                    class="w-full p-3 border rounded-md focus:outline-none text-base"
                    v-model="inputValues.eventTime"
                    @blur="checkTimeInput('eventTime')"
                  />
                  <p class="text-red-600 text-sm" v-if="userNotEnter.eventTime">請選擇活動時間*</p>
                </div>

                <div class="flex font-medium mb-2 p-2 text-base">
                  是否需要審核
                  <div>
                    <input type="checkbox" class="mx-3" v-model="inputValues.requireApproval" />
                  </div>
                </div>
                <div v-if="inputValues.requireApproval">
                  <label class="block font-medium mb-2 p-2 text-base">
                    最晚審核時間 <span class="text-red-600">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    :min="minTime.slice(0, 16)"
                    :max="maxTime.slice(0, 16)"
                    class="w-full p-3 border rounded-md text-base"
                    v-model="inputValues.deadline"
                    @blur="checkTimeInput('deadline')"
                  />

                  <p class="text-red-600 text-sm" v-if="userNotEnter.deadline">
                    審核時間不可晚於活動時間 *
                  </p>
                </div>
                <div
                  class="bg-gray-200 mt-2 p-6 flex items-center justify-center border rounded-md text-base"
                >
                  <span
                    >你的聚會將會刊登在列表上，直到時間截止。記得在最晚審核時間前勾選參加者。</span
                  >
                </div>
              </div>

              <!-- 最大最小參加人數 -->
              <div class="mt-6 mb-6 grid grid-cols-2 gap-4">
                <div>
                  <label class="block font-medium mb-2 p-2 text-base"
                    >活動人數 <span class="text-red-600">*</span></label
                  >
                </div>
                <div>
                  <div class="flex justify-end items-center">
                    <button
                      class="w-10 px-3 py-3 rounded-md justify-end items-center hover:bg-gray-200"
                      @click="updateParticipants(-1)"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      class="w-32 text-center p-3 mx-3 border rounded-md focus:outline-none"
                      v-model="participants"
                      @input="validateInput"
                    />
                    <button
                      class="w-10 px-3 py-3 rounded-md justify-end items-center hover:bg-gray-200"
                      @click="updateParticipants(1)"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p class="text-sm text-red-600 mx-1" v-if="participantsError">
                  {{ participantsError }}*
                </p>
              </div>

              <!-- 類型與費用 -->
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block font-medium mb-2 text-base"
                    >活動類型 <span class="text-red-600">*</span></label
                  >
                  <select
                    class="w-full p-3 border rounded-md text-base"
                    v-model="inputValues.category"
                    @blur="checkInput('category')"
                  >
                    <option value="" disabled selected>請選擇聚會類型</option>
                    <option value="food">美食</option>
                    <option value="shopping">購物</option>
                    <option value="travel">旅遊</option>
                    <option value="sports">運動</option>
                    <option value="education">教育</option>
                    <option value="others">其他</option>
                  </select>
                  <p class="text-sm text-red-600" v-if="userNotEnter.category">請選擇活動類型*</p>
                </div>
                <div>
                  <label class="block font-medium mb-2"
                    >付款方式 <span class="text-red-600">*</span></label
                  >
                  <select
                    class="w-full p-3 border rounded-md text-base"
                    v-model="paymentMethod"
                    @change="checkPaymentMethod"
                  >
                    <option value="free">免費</option>
                    <option value="AA">各付各的</option>
                    <option value="host">團主請客</option>
                    <option value="paymentRequired">需要付款</option>
                  </select>
                </div>
                <div class="mb-6 grid grid-cols-2" v-if="showEventCost">
                  <label class="block font-medium mb-2 p-2"
                    >活動費用<span class="text-red-600">*</span></label
                  >
                  <input
                    type="number"
                    class="w-full p-3 border-b border-solid rounded-md focus:outline-none"
                    v-model="eventCost"
                    @input="eventCostInput"
                    min="0"
                    max="99999"
                  />
                  <p class="text-sm text-red-600" v-if="eventCostError">{{ eventCostError }} *</p>
                </div>
              </div>
              <div class="my-6 flex items-center justify-center">
                <button
                  class="bg-green-600 rounded-full w-full mx-3 py-2 px-3 text-white hover:bg-green-700"
                  @click="handlePreviewClick"
                >
                  預覽活動
                </button>
              </div>
            </div>
          </div>
          <!-- 活動預覽區 -->
          <div v-else class="w-full">
            <div class="bg-white rounded-lg p-5">
              <h3 class="font-semibold text-3xl text-center border-b-2 pb-5 mb-5">活動預覽</h3>
              <!-- activityDetail.vue -->
              <div class="flex gap-3 items-center px-4">
                <div class="w-14 h-14 rounded-full overflow-hidden">
                  <img class="w-full h-full object-cover" :src="user.photo_url" alt="" />
                </div>
                <div class="flex flex-col">
                  <p class="font-bold text-lg">{{ user.display_name }}</p>
                </div>
              </div>

              <div class="overflow-hidden rounded-md p-4">
                <img class="w-full h-full object-cover rounded-md" :src="uploadedImage" alt="" />
              </div>
              <div class="px-5 pb-3">
                <p class="font-bold text-2xl truncate">{{ inputValues.name }}</p>
                <div class="flex items-center text-gray-500">
                  <Clock class="w-5" />
                  <span class="pl-1">{{ formattedEventTime }}</span>
                </div>
                <span v-if="inputValues.requireApproval" class="text-sm text-red-500">{{
                  `最後審核時間 ${formattedDeadLine}`
                }}</span>
                <p
                  class="py-6 whitespace-pre-wrap leading-6 markdown-content"
                  v-html="markdownPreview"
                ></p>
                <ul class="flex justify-around text-md border border-gray-200/100 rounded-lg p-2">
                  <li class="flex flex-col items-center">
                    <CreditCard height="35" width="35"></CreditCard>
                    <p class="mt-2">{{ payment }}</p>
                  </li>
                  <li class="flex flex-col items-center">
                    <MoneySquare height="35" width="35"></MoneySquare>
                    <p class="mt-2">{{ `$${eventCost}` }}</p>
                  </li>
                  <li class="flex flex-col items-center">
                    <Group height="35" width="35"></Group>
                    <p class="mt-2">{{ `${participants}人` }}</p>
                  </li>
                </ul>
                <div class="flex items-center my-5">
                  <MapPin height="24" width="24"></MapPin>
                  <span class="text-base ml-2">{{ searchQuery }}</span>
                </div>
                <div
                  id="map"
                  class="border h-56 text-5xl font-bold flex items-center justify-center"
                >
                  <div class="flex items-center justify-center">
                    <n-space>
                      <n-spin size="large" />
                    </n-space>
                  </div>
                </div>

                <div class="my-8 flex items-center justify-center">
                  <button
                    class="bg-green-600 rounded-full w-full py-2 px-3 text-white hover:bg-green-700"
                    :disabled="isSubmitting"
                    @click="ActivityDataPush"
                  >
                    {{ isSubmitting ? '送出中...' : '送出活動' }}
                  </button>
                </div>
                <div class="flex items-center justify-center">
                  <button
                    class="bg-green-600 rounded-full w-full py-2 px-3 text-white hover:bg-green-700"
                    @click="exitPreviewMode"
                  >
                    返回編輯
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </form>
    </div>
  </section>
</template>

<style scoped>
/* 移除數字輸入框的上下滾動按鈕 */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield; /* Firefox */
}
</style>
