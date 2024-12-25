<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useMessage, useDialog, NRate, NSpace, NInput, NModal } from 'naive-ui'
import { CheckCircle, CheckCircleSolid, HeartSolid } from '@iconoir/vue'
import { useRoute, useRouter } from 'vue-router'
import { ratingGetDetailAPI, ratingSubmitAPI } from '@/apis/ratingAPIs'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores/userStore'

dayjs.locale('zh-tw')
const userStore = useUserStore()
const dialog = useDialog()
const message = useMessage()
const clickBtn = ref(false)
const route = useRoute()
const router = useRouter()
const activityDetail = ref({})
const hostInfo = ref({})
const hostRatingAverage = ref({})
const latestHostRating = ref()
const FollowSuccess = () => {
  clickBtn.value = true
  message.success('您已成功追蹤團主啦~')
}

const clickTheFollowBtn = () => {
  dialog.info({
    title: '確認追蹤',
    content: '您確定要追蹤團主嗎',
    negativeText: '取消',
    positiveText: '確定',
    onPositiveClick: () => {
      FollowSuccess()
    },
    onNegativeClick: () => {
      message.info('已取消操作')
    },
  })
}

const step = ref(0)

const goStep1 = () => {
  console.log(ratingForm)
  step.value = 1
}

const backStep0 = () => {
  step.value = 0
}

const getDetailForRating = async () => {
  const { activity_id } = route.params
  const res = await ratingGetDetailAPI(activity_id)
  activityDetail.value = res.activity
  hostInfo.value = res.activity.users
  hostRatingAverage.value = res.hostRatingAverage['_avg']
  latestHostRating.value = res.latestHostRating
}

onMounted(async () => {
  await getDetailForRating()
})

const ratingForm = reactive({
  comment: '',
  overall: 0,
  kindness: 0,
  ability: 0,
  credit: 0,
})

const submitRating = async () => {
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

  if (res.message === '資料唯一性衝突') {
    return message.error('你已評價過，無法重複評價')
  }

  if (res.status != 201) {
    showSubmitModal.value = false
    return message.error('評價失敗')
  }
  showSubmitModal.value = false
  message.success('評價成功！')
  step.value = 2
}
const showSubmitModal = ref(false)
</script>

<template>
  <body class="bg-gray-50 p-10 min-w-[400px]">
    <!-- 活動評價 -->
    <div
      class="flex flex-col w-full min-w-[650px] max-w-[1440px] m-auto p-5 bg-gray-100 rounded-2xl border-2 border-gray-200"
    >
      <div
        v-if="step == 0"
        class="relative px-5 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-2 before: before:bg-blue-500"
      >
        <div class="text-sm xl:text-2xl md:text-xl">活動評價</div>
        <div class="text-gray-600 text-sm font-bold xl:text-3xl md:text-xl">團主評價</div>
      </div>
      <div
        v-else-if="step == 1"
        class="relative px-5 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-2 before: before:bg-blue-500"
      >
        <div class="text-sm xl:text-2xl md:text-xl">活動評價</div>
        <div class="text-gray-600 text-sm font-bold xl:text-3xl md:text-xl">追蹤活動</div>
      </div>
      <div
        v-else-if="step == 2"
        class="relative px-5 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-2 before: before:bg-blue-500"
      >
        <div class="text-sm xl:text-2xl md:text-xl">活動評價</div>
        <div class="text-gray-600 text-sm font-bold xl:text-3xl md:text-xl">完成評價</div>
      </div>

      <!-- 評分進度 -->
      <div
        class="flex flex-row w-full max-w-[400px] justify-around m-auto bg-white border-2 p-1 my-3 rounded-full xl:text-base xl:py-1 md:text-md sm:text-sm"
      >
        <div>
          <!-- 團主評價到此頁面的進度顯示-->
          <div
            :class="{ 'text-blue-600': step == 0, 'text-gray-300': step != 0 }"
            class="flex justify-center items-center font-bold tracking-widest"
          >
            <CheckCircleSolid v-if="step == 0" class="mr-1" />團主評價
            <CheckCircle v-if="step != 0" class="mr-1" />
          </div>
        </div>
        <div>
          <!-- 還沒到追蹤評價頁面的進度顯示-->
          <div
            :class="{ 'text-blue-600': step == 1, 'text-gray-300': step != 1 }"
            class="flex justify-center items-center font-bold tracking-widest"
          >
            <CheckCircleSolid v-if="step == 1" class="mr-1" />
            <CheckCircle v-if="step != 1" class="mr-1" />追蹤活動
          </div>
          <!-- 到追蹤評價頁面的進度顯示-->

          <!-- <div class="flex justify-center items-center text-blue-600 font-bold tracking-widest">
            <CheckCircleSolid class="mr-1" />追蹤活動
          </div> -->
        </div>
        <div>
          <!-- 還沒到最後完成頁面的進度顯示 -->
          <div class="flex justify-center items-center text-gray-300 font-bold tracking-widest">
            <CheckCircleSolid v-if="step == 2" class="mr-1" />
            <CheckCircle v-if="step != 2" class="mr-1" />完成
          </div>
          <!-- 到完成介面的進度顯示 -->
          <!-- <div class="flex justify-center items-center text-blue-600 font-bold tracking-widest"><CheckCircleSolid class="mr-1" />完成</div> -->
        </div>
      </div>
      <!-- 活動區域 -->
      <div class="flex w-full min-w-[600px]">
        <!-- 照片 -->
        <div class="flex w-full aspect-video xs:hidden sm:w-full md:w-full lg:flex">
          <img
            :src="activityDetail.img_url"
            class="w-full h-full xs:w-full sm:w-full md:w-full object-cover"
          />
        </div>
        <!-- 活動資訊 -->
        <div
          class="hidden max-w-[500px] ml-2 flex-col xs:hidden sm:hidden md:hidden lg:flex lg:w-1/2"
        >
          <div class="text-xs">
            <div class="xl:text-base xl:p-1">
              <div class="">活動名稱：</div>
              <div class="">{{ activityDetail.name }}</div>
            </div>
            <div class="mt-2 xl:text-base xl:p-1">
              <div class="">活動日期：</div>
              <div class="">{{ dayjs(activityDetail.event_time).format('YYYY-MM-DD ') }}</div>
            </div>
            <div class="mt-2 xl:text-base xl:p-1">
              <div class="">團主：</div>
              <div class="">{{ hostInfo.display_name }}</div>
            </div>
          </div>
          <!-- 團主評價 -->
          <div
            class="w-full min-w-[270px] mt-2 p-3 text-xs bg-white rounded-xl border-2 border-gray-200"
          >
            <div>團主評價</div>
            <div class="flex justify-between bg-gray-200 px-3 py-1 my-2 rounded-full">
              <div class="min-w-[60px] flex items-center xl:text-base xl:p-1">親切度</div>
              <div class="flex items-center">
                <n-rate
                  readonly
                  :value="hostRatingAverage.rating_kindness"
                  :default-value="5"
                  color="#B91C1C"
                  ><HeartSolid class="w-4"
                /></n-rate>
                <div class="mx-2 text-xs xl:text-base xl:p-1">
                  {{ hostRatingAverage.rating_kindness?.toFixed(1) || '0.0' }} / 5.0
                </div>
              </div>
            </div>
            <div class="flex justify-between bg-gray-200 px-3 py-1 mb-2 rounded-full">
              <div class="min-w-[60px] flex items-center xl:text-base xl:p-1">主辦能力</div>
              <div class="flex items-center">
                <n-rate
                  readonly
                  :value="hostRatingAverage.rating_ability"
                  :default-value="5"
                  color="#B91C1C"
                  ><HeartSolid class="w-4"
                /></n-rate>
                <div class="min-w-[45px] mx-2 text-xs xl:text-base xl:p-1">
                  {{ hostRatingAverage.rating_ability?.toFixed(1) || '0.0' }} / 5.0
                </div>
              </div>
            </div>
            <div class="flex justify-between bg-gray-200 px-3 py-1 mb-2 rounded-full">
              <div class="min-w-[60px] flex items-center xl:text-base xl:p-1">信用度</div>
              <div class="flex items-center">
                <n-rate
                  readonly
                  :value="hostRatingAverage.rating_credit"
                  :default-value="5"
                  color="#B91C1C"
                  ><HeartSolid class="w-4"
                /></n-rate>
                <div class="mx-2 text-xs xl:text-base xl:p-1">
                  {{ hostRatingAverage.rating_credit?.toFixed(1) || '0.0' }} / 5.0
                </div>
              </div>
            </div>

            <div class="mt-3 text-xs font-bold text-gray-600 xl:text-base xl:p-1">
              其他用戶對團主評價
            </div>
            <div v-if="latestHostRating" class="mt-1 p-2 bg-gray-200 rounded-xl item">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <img
                    :src="latestHostRating.users_ratings_user_idTousers.photo_url"
                    class="w-6 h-6 object-cover rounded-full"
                  />
                  <div class="mx-2 text-xs">
                    {{ latestHostRating.users_ratings_user_idTousers.display_name }}
                  </div>
                </div>
                <div class="flex flex-col items-center">
                  <div class="flex items-center">
                    <n-rate
                      readonly
                      v-model:value="latestHostRating.rating_heart"
                      :default-value="5"
                      color="#B91C1C"
                      ><HeartSolid class="w-2"
                    /></n-rate>
                  </div>
                  <div class="mx-1 text-[10px]">2024/12/14</div>
                </div>
              </div>
              <div class="text-xs tracking-wider truncate mt-2 xl:text-base xl:p-1">
                {{ latestHostRating.user_comment }}
              </div>
            </div>
            <p v-else class="mt-2 xl:text-base xl:p-1">暫無用戶評價</p>
          </div>
        </div>
      </div>
      <!-- 用戶在填寫團主評價的資訊 -->
      <div v-if="step == 0" class="mt-5">
        <div class="xl:text-base xl:p-1">用戶：</div>
        <div class="flex items-center mt-2">
          <img
            :src="userStore.user.photo_url"
            class="w-10 aspect-square object-cover rounded-full border-2 border-white"
          />
          <div class="mx-2">{{ userStore.user.display_name }}</div>
        </div>
        <div class="flex mt-3 px-14">
          <div class="text-base w-full">您對於本次揪團的評價為</div>
          <n-rate clearable v-model:value="ratingForm.overall" color="#B91C1C">
            <HeartSolid class="w-5 h-5" />
          </n-rate>
        </div>
        <div class="flex mt-3 px-14">
          <div class="text-base w-full">團主的親切度，您願意給到幾分呢？</div>
          <n-rate clearable v-model:value="ratingForm.kindness" color="#B91C1C">
            <HeartSolid class="w-5 h-5" />
          </n-rate>
        </div>
        <div class="flex mt-3 px-14">
          <div class="text-base w-full">團主的主辦能力，您願意給到幾分呢？</div>
          <n-rate clearable v-model:value="ratingForm.ability" color="#B91C1C">
            <HeartSolid class="w-5 h-5" />
          </n-rate>
        </div>
        <div class="flex mt-3 px-14">
          <div class="text-base w-full">團主的信用度，您願意給到幾分呢？</div>
          <n-rate clearable v-model:value="ratingForm.credit" color="#B91C1C">
            <HeartSolid class="w-5 h-5" />
          </n-rate>
        </div>

        <div class="flex flex-col mt-5 xl:text-base">
          <p>留下您想對團主說的話：</p>
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
        <div class="flex justify-end items-center mt-3">
          <n-button type="info" @click="goStep1" class="px-5 tracking-widest">下一步</n-button>
        </div>
      </div>
      <!-- 追蹤團主介面 -->
      <div v-else-if="step == 1" class="mt-5">
        <div class="xl:text-base xl:p-1">團主：</div>
        <div class="flex items-center mt-2">
          <img
            :src="hostInfo.photo_url"
            class="w-10 object-cover aspect-square rounded-full border-2 border-white"
          />
          <div class="mx-2">{{ hostInfo.display_name }}</div>
        </div>

        <!-- <div class="flex items-center mt-3">
          <div class="text-base w-full">您對於本次揪團的評價為</div>
          <n-rate color="#B91C1C">
            <HeartSolid class="w-5 h-5" />
          </n-rate>
        </div> -->
        <div class="flex items-center mt-3">
          <div class="text-base w-full">如果這次活動滿意，您想追蹤此團主嗎？</div>
          <!-- 還沒追蹤時的顯示 -->
          <n-button @click="clickTheFollowBtn" strong secondary type="tertiary">追蹤</n-button>
          <!-- 已經追蹤的顯示 -->
          <n-button type="info">已追蹤</n-button>
        </div>
        <div class="flex items-center mt-3">
          <div class="text-base w-full">您想要追蹤類似的活動嗎？</div>
          <!-- 還沒追蹤時的顯示 -->
          <n-button @click="clickTheFollowBtn" strong secondary type="tertiary">追蹤</n-button>
          <!-- 已經追蹤的顯示 -->
          <n-button type="info">已追蹤</n-button>
        </div>

        <div class="flex justify-end items-center mt-10">
          <n-button type="info" @click="backStep0" class="px-5 mx-6 tracking-widest"
            >上一步</n-button
          >
          <n-button type="info" @click="showSubmitModal = true" class="px-5 tracking-widest"
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
      <div v-else-if="step == 2" class="flex flex-col justify-center items-center">
        <div class="flex flex-col items-center">
          <n-result
            status="success"
            title="您已經完成評價啦！！"
            description="積分將匯入您的帳戶中！"
            class="font-bold text-gray-400"
          >
          </n-result>
        </div>
        <div class="flex items-center w-2/3 h-20 justify-evenly">
          <n-button @click="router.push({ name: 'home' })" type="info">返回首頁</n-button>
          <n-button @click="router.push({ name: 'profile' })" type="info">前往個人頁</n-button>
          <n-button type="info">前往任務中心</n-button>
        </div>
      </div>
    </div>
  </body>
</template>
<style scoped></style>
