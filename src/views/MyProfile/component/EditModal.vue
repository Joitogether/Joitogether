<script setup>
import {
  NButton,
  NModal,
  NCard,
  NUpload,
  NInput,
  NSpace,
  NInputNumber,
  NDynamicTags,
  NSelect,
  useDialog,
  useMessage,
} from 'naive-ui'
import { ArrowLeftCircleSolid, ArrowRightCircleSolid } from '@iconoir/vue'
import { ref, watch, onMounted } from 'vue'
import { userPutAPI, userGetAPI } from '@/apis/userAPIs'
import { useUserStore } from '@/stores/userStore'
import { storage } from '@/utils/firebaseConfig'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const showModal = ref(false)
const user = ref({
  photo_url: '',
  life_photo_1: '',
  life_photo_2: '',
  display_name: '',
  zodiac: '',
  age: '',
  career: '',
  city: '',
  self_introduction: '',
  hobby: '',
  expertise: '',
  interested_in: '',
  tags: '',
  favorite_sentence: '',
})
const userStore = useUserStore()
const errorMessage = ref(null)
const loading = ref(true)
const tagsArray = ref([])
const fileListSec = ref([])
const fileListAva = ref([])
const currentRef = ref(1)
const message = useMessage()
const dialog = useDialog()

const cityOptions = [
  { label: '基隆市', value: '基隆市' },
  { label: '台北市', value: '台北市' },
  { label: '新北市', value: '新北市' },
  { label: '桃園市', value: '桃園市' },
  { label: '新竹縣', value: '新竹縣' },
  { label: '新竹市', value: '新竹市' },
  { label: '苗栗縣', value: '苗栗縣' },
  { label: '台中市', value: '台中市' },
  { label: '彰化縣', value: '彰化縣' },
  { label: '南投縣', value: '南投縣' },
  { label: '雲林縣', value: '雲林縣' },
  { label: '嘉義縣', value: '嘉義縣' },
  { label: '嘉義市', value: '嘉義市' },
  { label: '台南市', value: '台南市' },
  { label: '高雄市', value: '高雄市' },
  { label: '屏東縣', value: '屏東縣' },
  { label: '宜蘭縣', value: '宜蘭縣' },
  { label: '花蓮縣', value: '花蓮縣' },
  { label: '台東縣', value: '台東縣' },
  { label: '澎湖縣', value: '澎湖縣' },
  { label: '金門縣', value: '金門縣' },
  { label: '連江縣', value: '連江縣' },
  { label: '國外', value: '國外' },
]
const zodiacOptions = [
  { label: '摩羯座', value: '摩羯座' },
  { label: '水瓶座', value: '水瓶座' },
  { label: '雙魚座', value: '雙魚座' },
  { label: '牡羊座', value: '牡羊座' },
  { label: '金牛座', value: '金牛座' },
  { label: '雙子座', value: '雙子座' },
  { label: '巨蟹座', value: '巨蟹座' },
  { label: '獅子座', value: '獅子座' },
  { label: '處女座', value: '處女座' },
  { label: '天秤座', value: '天秤座' },
  { label: '天蠍座', value: '天蠍座' },
  { label: '射手座', value: '射手座' },
]

const fetchUserData = async () => {
  try {
    const result = await userGetAPI(userStore.user.uid)

    if (!result.display_name) {
      return
    }

    user.value = result
    if (user.value.tags) {
      tagsArray.value = user.value.tags.split(',')
      loading.value = false
    } else {
      user.value.tags = '未填寫'
      loading.value = false
    }
  } catch (err) {
    errorMessage.value = err.message || '資料加載錯誤'
    loading.value = false
  }
}

const handleAvatarChange = async (fileListAva) => {
  if (fileListAva.length === 0) {
    message.error('沒有大頭照檔案被選中')
    return
  }

  const avatarFile = fileListAva[0]?.file
  if (!avatarFile) {
    message.error('大頭照檔案對象不存在')
    return
  }

  if (avatarFile.size > 2 * 1024 * 1024) {
    message.error('上傳失敗！圖片大小不能超過 2MB 😭')
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    user.value.photo_url = event.target.result
  }
  reader.readAsDataURL(avatarFile)

  try {
    const filePath = `avatars/${Date.now()}_${avatarFile.name}`
    const fileRef = storageRef(storage, filePath)

    const snapshot = await uploadBytes(fileRef, avatarFile)
    const downloadURL = await getDownloadURL(snapshot.ref)

    user.value.photo_url = downloadURL
    message.success('🎉 圖片上傳成功！')
  } catch (error) {
    message.error('大頭照上傳失敗:', error.message)
  }
}

const handleFileChange1 = async (fileList) => {
  if (fileList.length === 0) {
    message.error('沒有檔案被選中')
    return
  }

  const file = fileList[0]?.file
  if (!file) {
    message.error('檔案對象不存在')
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    message.error('上傳失敗！圖片大小不能超過 2MB 😭')
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    user.value.life_photo_1 = event.target.result
  }
  reader.readAsDataURL(file)

  try {
    const filePath = `lifephoto/${Date.now()}_${file.name}`
    const fileRef = storageRef(storage, filePath)

    const snapshot = await uploadBytes(fileRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)

    user.value.life_photo_1 = downloadURL
  } catch (error) {
    message.error('圖片上傳失敗:', error.message)
  }
}

const handleFileChange2 = async (fileListSec) => {
  if (fileListSec.length === 0) {
    message.error('沒有檔案被選中')
    return
  }

  const file2 = fileListSec[0]?.file
  message.error('第二張選中的檔案:', file2)
  if (!file2) {
    message.error('第二張檔案對象不存在')
    return
  }
  if (file2.size > 2 * 1024 * 1024) {
    message.error('第二張上傳失敗！圖片大小不能超過 2MB 😭')
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    user.value.life_photo_2 = event.target.result
  }
  reader.readAsDataURL(file2)

  try {
    const filePath = `lifephoto/${Date.now()}_${file2.name}`
    const fileRef = storageRef(storage, filePath)

    const snapshot = await uploadBytes(fileRef, file2)
    const downloadURL = await getDownloadURL(snapshot.ref)

    user.value.life_photo_2 = downloadURL
  } catch (error) {
    message.error('第二張圖片上傳失敗:', error.message)
  }
}

const handleEnter = (event) => {
  const inputValue = event.target.value.trim()
  if (inputValue && !tagsArray.value.includes(inputValue)) {
    tagsArray.value.push(inputValue)
    event.target.value = ''
  }
}

watch(tagsArray, (newTags) => {
  user.value.tags = newTags.join(',')
})

onMounted(() => {
  if (userStore.user.isLogin) {
    fetchUserData()
  }
})

const next = () => {
  if (currentRef.value === 1) {
    currentRef.value = 2
  } else if (currentRef.value === 2) {
    currentRef.value = 1
  }
}

const prev = () => {
  if (currentRef.value === 1) {
    currentRef.value = 2
  } else if (currentRef.value === 2) {
    currentRef.value = 1
  }
}

const handleSave = () => {
  user.value.tags = tagsArray.value.join(',')
  userPutAPI(userStore.user.uid, user.value)
    .then(() => {
      showModal.value = false
      emit('save')
    })
    .catch((error) => {
      message.error('資料保存錯誤:', error)
    })
}
const handleConfirm = () => {
  dialog.success({
    title: '確定下次再填嗎？',
    content: '本次修改資料將不被保存喔！',
    positiveText: '對啦我下次再填',
    negativeText: '好啦繼續填',
    onPositiveClick: () => {
      emit('close')
      message.success('等你下次回來')
      showModal.value = false
    },
    onNegativeClick: () => {
      message.success('請繼續～～～')
      showModal.value = true
    },
  })
}

const closeModal = () => {
  showModal.value = false
  emit('close')
}
const emit = defineEmits(['close', 'save'])

const props = defineProps({
  show: {
    type: Boolean,
  },
})

watch(
  () => props.show,
  (newVal) => {
    showModal.value = newVal
  },
)

watch(
  () => showModal.value,
  (newVal) => {
    if (!newVal) {
      emit('close')
    }
  },
)
</script>
<template>
  <div class="btn-container flex gap-2 mt-8 mb-8">
    <n-modal :show="showModal" @mask-click="closeModal">
      <n-card style="width: 600px" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <p class="text-2xl font-bold text-center mb-4 text-gray-600">編輯檔案</p>
        <input type="checkbox" id="slide1" class="hidden" checked />
        <input type="checkbox" id="slide2" class="hidden" />

        <div id="target1" class="innerPart_1" v-if="!loading" v-show="currentRef === 1">
          <div class="avatar-area mx-auto">
            <div class="flex flex-col items-center">
              <div class="relative w-44 h-44">
                <div class="w-full h-full aspect-square rounded-full overflow-hidden">
                  <img
                    v-if="user.photo_url"
                    :src="user.photo_url"
                    alt="avatar"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-gray-500">無圖片</span>
                </div>
                <div class="absolute bottom-2 right-2">
                  <n-upload
                    accept="image/*"
                    :max="1"
                    :file-list="fileListAva"
                    :on-update:file-list="handleAvatarChange"
                    :show-file-list="false"
                  >
                    <n-button type="primary" round circle>+</n-button>
                  </n-upload>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-5 w-full">
            暱稱：
            <n-input
              v-model:value="user.display_name"
              placeholder="朋友都如何稱呼你？"
              :width="'80%'"
            />
          </div>
          <div class="mt-5 w-full">
            年齡：<n-input-number
              v-model:value="user.age"
              clearable
              placeholder="年齡不是問題"
              :width="'80%'"
            />
          </div>
          <div class="mt-5 w-full">
            所在地：
            <n-space vertical>
              <n-select v-model:value="user.city" :options="cityOptions" :width="'80%'" />
            </n-space>
          </div>

          <div class="mt-5 w-full">
            職業：<n-input v-model:value="user.career" placeholder="什麼領域的呢？" />
          </div>
          <div class="mt-5 w-full">
            座右銘：<n-input
              v-model:value="user.favorite_sentence"
              placeholder="例如：我要發大財"
            />
          </div>
          <div class="flex mt-7 flex-wrap">
            個性標籤：
            <n-dynamic-tags
              v-model:value="tagsArray"
              :max="6"
              @keydown.enter.prevent="handleEnter"
            />
          </div>
        </div>
        <div id="target2" class="innerPart_2" v-show="currentRef === 2">
          <div
            class="flex flex-col gap-5 border-b-2 border-gray-100 pb-6 md:flex-row md:justify-between"
          >
            <div class="flex flex-col gap-3 md:w-1/2">
              <div
                class="flex justify-between items-center w-full bg-gray-100 p-2 pl-4 rounded-full"
              >
                <p class="">上傳生活照吧！ヽ(́◕◞౪◟◕‵)ﾉ</p>
                <div class="">
                  <n-upload
                    accept="image/*"
                    :max="1"
                    :file-list="[]"
                    :on-update:file-list="handleFileChange1"
                    class="flex items-center"
                  >
                    <n-button type="primary" round circle>+</n-button>
                  </n-upload>
                </div>
              </div>

              <div class="w-full h-full overflow-hidden border flex items-center rounded-md">
                <img
                  v-if="user.life_photo_1"
                  :src="user.life_photo_1"
                  alt="life_photo"
                  class="w-full h-full object-cover"
                />
                <span v-else>第一張照片還沒上傳</span>
              </div>
            </div>
            <div class="flex flex-col gap-3 md:w-1/2">
              <div
                class="flex justify-between items-center w-full bg-gray-100 p-2 pl-4 rounded-full"
              >
                <p class="">再來一張吧！( σ՞ਊ ՞)σ</p>
                <div class="">
                  <n-upload
                    accept="image/*"
                    :max="1"
                    :file-list="fileListSec"
                    :on-update:file-list="handleFileChange2"
                    class="flex items-center justify-center"
                  >
                    <n-button class="col-span-1" type="primary" round circle>+</n-button>
                  </n-upload>
                </div>
              </div>
              <div
                class="w-full h-full overflow-hidden border flex items-center rounded-md col-span-2"
              >
                <img v-if="user.life_photo_2" :src="user.life_photo_2" alt="life_photo" />
                <span v-else>第二張照片還沒上傳</span>
              </div>
            </div>
          </div>

          <div class="selfIntro">
            <n-space vertical>
              <div class="mt-4 w-full">
                自我介紹：
                <n-input placeholder="介紹一下你自己吧" v-model:value="user.self_introduction" />
              </div>
              <div class="mt-3 w-full">
                星座：
                <n-space vertical>
                  <n-select v-model:value="user.zodiac" :options="zodiacOptions" />
                </n-space>
              </div>
              <div class="mt-3 w-full">
                嗜好：
                <n-input placeholder="放假喜歡做什麼呢？" v-model:value="user.hobby" />
              </div>
              <div class="mt-3 w-full">
                專長：
                <n-input placeholder="很會睡也可以是專長（？" v-model:value="user.expertise" />
              </div>
              <div class="mt-3 w-full">
                感興趣的活動：<n-input
                  placeholder="幫助你找到志同道合的朋友喔！"
                  v-model:value="user.interested_in"
                />
              </div>
            </n-space>
          </div>
        </div>

        <div class="flex justify-center gap-3 m-5">
          <div class="">
            <label for="slide1" class="slide1 cursor-pointer">
              <ArrowLeftCircleSolid @click="prev()" class="text-green-600 hover:text-green-700" />
            </label>
          </div>
          <div class="">
            <label for="slide2" class="slide2 cursor-pointer">
              <ArrowRightCircleSolid @click="next()" class="text-green-600 hover:text-green-700" />
            </label>
          </div>
        </div>
        <div class="flex justify-center gap-5">
          <n-button tertiary @click="handleConfirm()" class="w-1/2">改天再填</n-button>
          <n-button strong secondary type="primary" @click="handleSave" class="w-1/2"
            >填好啦！</n-button
          >
        </div>
      </n-card>
    </n-modal>
  </div>
</template>
<style scoped></style>
