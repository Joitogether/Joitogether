<script setup>
import { NButton, NModal, NCard, NUpload, NInput, NStep, NSpace, NSteps, NInputNumber, NDynamicTags, NSelect } from 'naive-ui';
import { ArrowLeft, ArrowRight } from '@iconoir/vue';
import { ref, watch, onMounted } from 'vue';
import { UserPutApi, UserGetApi } from '../../../apis/UserApi';
import { useUserStore } from '@/stores/userStore';
import { storage } from '@/utils/firebaseConfig';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const showModal = ref(false)
const user = ref(null)
const userStore = useUserStore()
const errorMessage = ref(null);
const loading = ref(true);
const tagsArray = ref([]);
const fileListSec = ref([]);
const fileListAva = ref([]);

const cityOptions = [
  { label:"基隆市", value:"基隆市" },
  { label:"台北市", value:"台北市" },
  { label:"新北市", value:"新北市" },
  { label:"桃園市", value:"桃園市" },
  { label:"新竹縣", value:"新竹縣" },
  { label:"新竹市", value:"新竹市" },
  { label:"苗栗縣", value:"苗栗縣" },
  { label:"台中市", value:"台中市" },
  { label:"彰化縣", value:"彰化縣" },
  { label:"南投縣", value:"南投縣" },
  { label:"雲林縣", value:"雲林縣" },
  { label:"嘉義縣", value:"嘉義縣" },
  { label:"嘉義市", value:"嘉義市" },
  { label:"台南市", value:"台南市" },
  { label:"高雄市", value:"高雄市" },
  { label:"屏東縣", value:"屏東縣" },
  { label:"宜蘭縣", value:"宜蘭縣" },
  { label:"花蓮縣", value:"花蓮縣" },
  { label:"台東縣", value:"台東縣" },
  { label:"澎湖縣", value:"澎湖縣" },
  { label:"金門縣", value:"金門縣" },
  { label:"連江縣", value:"連江縣" },
  { label:"國外", value:"國外" },
]
const zodiacOptions = [
  { label:"摩羯座", value:"摩羯座"},
  { label:"水瓶座", value:"水瓶座"},
  { label:"雙魚座", value:"雙魚座"},
  { label:"牡羊座", value:"牡羊座"},
  { label:"金牛座", value:"金牛座"},
  { label:"雙子座", value:"雙子座"},
  { label:"巨蟹座", value:"巨蟹座"},
  { label:"獅子座", value:"獅子座"},
  { label:"處女座", value:"處女座"},
  { label:"天秤座", value:"天秤座"},
  { label:"天蠍座", value:"天蠍座"},
  { label:"射手座", value:"射手座"},
]

const fetchUserData = async () => {
  try {
    const result = await UserGetApi(userStore.user.uid);
    if (result) {
      user.value = result;
      if(user.value.tags){
        tagsArray.value = user.value.tags.split(',');
        console.log('資料加載完成:', result);
        loading.value = false;
        showModal.value = true;

      } else {
        user.value.tags = '未填寫'
        loading.value = false;
        showModal.value = true;
      }

    }
  } catch (err) {
    errorMessage.value = err.message || '資料加載錯誤';
    loading.value = false;
    console.error('資料加載錯誤:', err);
  }
};
//標籤部分阻止按Enter就送出
const handleEnter = (event) => {
  const inputValue = event.target.value.trim()
  if (inputValue && !tagsArray.value.includes(inputValue)) {
    tagsArray.value.push(inputValue)
    event.target.value = ''
  }
}


//處理大頭照
const handleAvatarChange = async (fileListAva) => {
  console.log('大頭照檔案變更:', fileListAva);

  if (fileListAva.length === 0) {
    console.log('沒有大頭照檔案被選中');
    return;
  }

  const avatarFile = fileListAva[0]?.file;
  console.log('選中的大頭照檔案:', avatarFile);

  if (!avatarFile) {
    console.log('大頭照檔案對象不存在');
    return;
  }

  if (avatarFile.size > 2 * 1024 * 1024) {
    message.error('上傳失敗！圖片大小不能超過 2MB 😭');
    return;
  }
// 預覽圖片
const reader = new FileReader()
  reader.onload = (event) => {
    user.value.photo_url = event.target.result
  }
  reader.readAsDataURL(avatarFile)

  try {
    // 設定圖片文件的存儲路徑
    const filePath = `avatars/${Date.now()}_${avatarFile.name}`;
    const fileRef = storageRef(storage, filePath);

    console.log('大頭照開始上傳檔案...', avatarFile.name);

    const snapshot = await uploadBytes(fileRef, avatarFile);
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log('大頭照下載 URL:', downloadURL);

    // 更新 user 中的圖片 URL
    user.value.photo_url = downloadURL;
    console.log('更新後的 user:', user.value);
    // message.success('🎉 圖片上傳成功！');
  } catch (error) {
    console.error('大頭照上傳失敗:', error.message);
    // message.error('😭 上傳圖片失敗，請稍後再試。');
  }
};

//處理第一張照片
const handleFileChange1 = async (fileList) => {
  console.log('檔案變更:', fileList);  // 輸出 fileList 的內容

  if (fileList.length === 0) {
    console.log('沒有檔案被選中')
    return
  }

  const file = fileList[0]?.file
  console.log('選中的檔案:', file)

  if (!file) {
    console.log('檔案對象不存在')
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    // 檢查檔案大小
    message.error('上傳失敗！圖片大小不能超過 2MB 😭')
    return
  }
// 預覽圖片
const reader = new FileReader()
  reader.onload = (event) => {
    user.value.life_photo_1 = event.target.result
  }
  reader.readAsDataURL(file)

  try {
    // 設定圖片文件的存儲路徑
    const filePath = `lifephoto/${Date.now()}_${file.name}`
    const fileRef = storageRef(storage, filePath)

    console.log('開始上傳檔案...', file.name)

    const snapshot = await uploadBytes(fileRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)

    console.log('圖片下載 URL:', downloadURL)

    // 更新 user 中的圖片 URL
    user.value.life_photo_1 = downloadURL;
    console.log('更新後的 user:', user.value);
  } catch (error) {
    console.error('圖片上傳失敗:', error.message)
  }
};

// 處理第二張照片
const handleFileChange2 = async (fileListSec) => {
  console.log('檔案變更:', fileListSec);  // 輸出 fileList 的內容

  if (fileListSec.length === 0) {
    console.log('沒有檔案被選中');
    return;
  }

  // 確保能從 fileList 中正確取得檔案
  const file2 = fileListSec[0]?.file;
  console.log('第二張選中的檔案:', file2);

  if (!file2) {
    console.log('第二張檔案對象不存在');
    return;
  }

  if (file2.size > 2 * 1024 * 1024) {  // 檢查檔案大小
    message.error('第二張上傳失敗！圖片大小不能超過 2MB 😭');
    return;
  }
// 預覽圖片
const reader = new FileReader()
  reader.onload = (event) => {
    user.value.life_photo_2 = event.target.result
  }
  reader.readAsDataURL(file2)

  try {
    // 設定圖片文件的存儲路徑
    const filePath = `lifephoto/${Date.now()}_${file2.name}`;
    const fileRef = storageRef(storage, filePath);

    console.log('第二張圖片開始上傳檔案...', file2.name);

    const snapshot = await uploadBytes(fileRef, file2);
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log('第二張圖片下載 URL:', downloadURL);

    // 更新 user 中的圖片 URL
    user.value.life_photo_2 = downloadURL;
    console.log('第二張上傳後更新後的 user:', user.value);
  } catch (error) {
    console.error('第二張圖片上傳失敗:', error.message);
  }
}


// 監聽 tagsArray，當 tagsArray 變動時更新 user.tags
watch(tagsArray, (newTags) => {
  user.value.tags = newTags.join(',')
})

onMounted(() => {
  if (userStore.user.isLogin) {
    fetchUserData()
  }
})

const currentRef = ref(1)
const currentStatus = ref('process')
// `next` 方法
const next = () => {
  if (currentRef.value === 1) {
    currentRef.value = 2
  } else if (currentRef.value === 2) {
    currentRef.value = 1
  }
}

// `prev` 方法
const prev = () => {
  if (currentRef.value === 1) {
    currentRef.value = 2
  } else if (currentRef.value === 2) {
    currentRef.value = 1
  }
}
//編輯完保存
const handleSave = () => {
  UserPutApi(userStore.user.uid, user.value)
    .then((response) => {
      console.log('保存成功:', response)
      console.log('更新後的資料:', user.value);
      emit('save');
      window.location.reload()
      showModal.value = false;

    })
    .catch((error) => {
      console.error('資料保存錯誤:', error)
    })
}
const warning = () => {
  alert('警告: 是否確認改天再填?')

  console.log('警告提示已顯示')
}
const close = () => {
  emit('close')
}

// 用來關閉視窗的函數
const closeModal = () => {
  showModal.value = false;
  emit('close');  // 向父組件發送事件，通知關閉
};
const emit = defineEmits(['close', 'save'])
</script>
<template>
<div class="btn-container flex gap-2 mt-8 mb-8">
  <n-modal v-model:show="showModal" @mask-click="closeModal">
    <n-card
      style="width: 600px"
      title="編輯檔案中..."
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >

        <input type="checkbox" id="slide1" class="hidden" checked>
        <input type="checkbox" id="slide2" class="hidden">

        <div id="target1" class="innerPart_1"  v-if="!loading" v-show="currentRef === 1">
          <p>大頭照專區</p>
          <div class="avatar-area w-3/4">
            <div class="w-full h-full overflow-hidden flex justify-center">
              <img v-if="user.photo_url" :src="user.photo_url" alt="avatar"/>
              <span v-else>大頭照還沒上傳</span>
            </div>
            <n-upload
              accept="image/*"
              :max="1"
              :file-list="fileListAva"
              :on-update:file-list="handleAvatarChange"
              :show-file-list="false"
              class="flex">
            <n-button type="primary" round circle>+</n-button>
            </n-upload>
          </div>
          <div class="flex mt-5 flex-wrap">暱稱：<n-input v-model:value="user.display_name" placeholder="朋友都如何稱呼你？"/></div>
          <div class="flex mt-5 flex-wrap">年齡：<n-input-number v-model:value="user.age" clearable placeholder="年齡不是問題"/></div>
          <div class="flex mt-5 flex-wrap">所在地：</div>
            <n-space vertical>
              <n-select v-model:value="user.city" :options="cityOptions"/>
            </n-space>
          <div class="flex mt-5 flex-wrap">職業：<n-input v-model:value="user.career" placeholder="什麼領域的呢？" /></div>
          <div class="flex mt-5 flex-wrap">座右銘：<n-input v-model:value="user.favorite_sentence" placeholder="例如：我要發大財" /></div>
          <div class="flex mt-5 flex-wrap">個性標籤：
            <n-dynamic-tags
            v-model:value="tagsArray"
            :max="6"
            @keydown.enter.prevent="handleEnter"
            />
          </div>
        </div>
        <div id="target2" class="innerPart_2" v-show="currentRef === 2">
          <div class="photosupload" >
            <p>生活照上傳區</p>
            <div class="life-photos-area grid grid-cols-10">
              <div class="col-span-4 w-full h-full overflow-hidden border flex items-center border-gray-300 bg-gray-100 ">
              <img v-if="user.life_photo_1" :src="user.life_photo_1" alt="life_photo"/>
              <span v-else>第一張照片還沒上傳</span>
            </div>
            <n-upload
              accept="image/*"
              :max="1"
              :file-list="[]"
              :on-update:file-list="handleFileChange1"
              class="row-start-2 col-start-5">
              <n-button type="primary" round circle>+</n-button>
              </n-upload>
            <div class="col-start-6 col-span-4 w-full h-full overflow-hidden border flex items-center border-gray-300 bg-gray-100">
              <img v-if="user.life_photo_2" :src="user.life_photo_2" alt="life_photo"/>
              <span v-else>第二張照片還沒上傳</span>
            </div>
            <n-upload
              accept="image/*"
              :max="1"
              :file-list="fileListSec"
              :on-update:file-list="handleFileChange2"
              class="row-start-2 col-start-10">
              <n-button class="col-span-1" type="primary" round circle>+</n-button>
            </n-upload>

          </div>
            </div>

          <div class="selfIntro">
            <n-space vertical>
            <div class="flex mt-5 flex-wrap">自我介紹：
              <n-input
              placeholder="介紹一下你自己吧"
              v-model:value="user.self_introduction"
              type="textarea"/>
            </div>
            <div class="flex mt-5 flex-wrap">星座：</div>
            <n-space vertical>
              <n-select v-model:value="user.zodiac" :options="zodiacOptions"/>
            </n-space>
            <div class="flex mt-5 flex-wrap">嗜好：<n-input placeholder="放假喜歡做什麼呢？" v-model:value="user.hobby" /></div>
            <div class="flex mt-5 flex-wrap">專長：<n-input placeholder="很會睡也可以是專長（？" v-model:value="user.expertise"/></div>
            <div class="flex mt-5 flex-wrap">感興趣的活動：<n-input placeholder="幫助你找到志同道合的朋友喔！" v-model:value="user.interested_in"/></div>
            </n-space>
          </div>
        </div>

        <div class="footer mt-10">
          <n-space vertical class="stepsArea">
            <n-steps size="small" :current="currentRef" :status="currentStatus">
              <n-step title="50%" description="完成一半囉！" />
              <n-step title="99.99%" description="就剩一點點了" />
            </n-steps>
          </n-space>
          <div class="arrowArea justify-center mt-10 custom-arrow flex gap-3">
            <div class="arrowLeft border-2 border-solid rounded-full border-slate-500">
              <label for="slide1" class="slide1 cursor-pointer">
                <ArrowLeft @click="prev()" />
              </label>
            </div>
            <div class="arrowRight border-2 border-solid rounded-full border-slate-500">
              <label for="slide2" class="slide2 cursor-pointer">
                <ArrowRight @click="next()" />
              </label>
            </div>
          </div>
          <div class="save flex gap-3 justify-end">
            <n-button tertiary @click="warning() ; close()">改天再填</n-button>
            <n-button strong secondary type="primary" @click="handleSave">填好啦！</n-button>
          </div>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>
<style scoped>

.life-photo-area{
  grid-template-rows: 100px 50px
}
.stepsArea{
  justify-content: center !important
}

/* 当前显示的内容 */
.innerPart_1[v-show='currentRef === 1'],
.innerPart_2[v-show='currentRef === 2'] {
  opacity: 1;
  transform: translateX(0); /* 滑入效果 */
  z-index: 100; /* 保证显示的部分在最前 */
}

/* 隐藏的内容 */
.innerPart_1[v-show='currentRef !== 1'],
.innerPart_2[v-show='currentRef !== 2'] {
  opacity: 0;
  transform: translateX(100%); /* 滑出效果 */
  z-index: 0;
}
</style>
