<script setup>
import { NButton, NModal, NCard, NUpload, NInput, NStep, NSpace, NSteps, NInputNumber, NDynamicTags } from 'naive-ui';
import { ArrowLeft, ArrowRight } from '@iconoir/vue';
import { ref, defineEmits, computed, watch } from 'vue';
import { UserPutApi, UserGetApi } from '../../../apis/UserApi';
import { useUserStore } from '@/stores/userStore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'


const showModal = ref(false);
const user = ref(null)
const userStore = useUserStore()
const errorMessage = ref(null);
const loading = ref(true);

// 大頭貼的邏輯
const handleFileChange = async (fileList) => {
  // 無選擇文件時直接返回
  if (fileList.length === 0) return
  const file = fileList[0]?.file
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    message.error('上傳失敗！圖片大小不能超過 2MB 😭')
    return
  }
  if (file.length > 256) {
    message.error('圖片 URL 過長，請更換圖片再試 😭')
    return
  }

  try {
    // 設定圖片文件的存儲路徑
    const filePath = `avatars/${Date.now()}_${file.name}`
    const fileRef = storageRef(storage, filePath)

    // 上傳文件至 Firebase Storage
    const snapshot = await uploadBytes(fileRef, file)

    // 獲取下載 URL
    const downloadURL = await getDownloadURL(snapshot.ref)

    // 更新圖片 URL 到用戶的表單數據
    formValue.value.avatar = downloadURL

    console.log('📸 圖片上傳成功，URL:', downloadURL)
    message.success('🎉 圖片上傳成功啦！太棒了呢～ ✨')
  } catch (error) {
    console.error('⚠️ 圖片上傳失敗:', error)
    message.error(`😭 哎呀！圖片上傳失敗了～ 請稍後再試看看吧 💔`)
  }
}

const fetchUserData = async () => {
  try {
    const result = await UserGetApi(userStore.user.uid);
    if (result) {
      user.value = result;
      console.log('資料加載完成:', result);
      console.log(user.tags);

      loading.value = false;
      showModal.value = true;  // 當資料加載完成後顯示 Modal
    }
  } catch (err) {
    errorMessage.value = err.message || '資料加載錯誤';
    loading.value = false;
    console.error('資料加載錯誤:', err);
  }
};


if (userStore.user.isLogin) {
    fetchUserData();
}

const currentRef = ref(1)
const currentStatus = ref("process");
// `next` 方法
const next = () => {
  if (currentRef.value === 1) {
    currentRef.value = 2;
  } else if (currentRef.value === 2) {
    currentRef.value = 1;
  }
};

// `prev` 方法
const prev = () => {
  if (currentRef.value === 1) {
    currentRef.value = 2;
  } else if (currentRef.value === 2) {
    currentRef.value = 1;
  }
};

// 控制 modal 開啟
const openModal = () => {
  showModal.value = true;
};

const handleSave = () => {
  // 確保保存資料前的使用者資料
  console.log('保存前的資料:', user.value);

  // 假設你有一個保存 API
  UserPutApi(userStore.user.uid, user.value)
    .then(response => {
      console.log('保存成功:', response);
      // 資料保存後再打印更新過的資料
      console.log('更新後的資料:', user.value);
      emit('save');
    })
    .catch(error => {
      console.error('資料保存錯誤:', error);
    });
};
// 用來關閉視窗的函數
const closeModal = () => {
  showModal.value = false;  // 設為 false 關閉 modal
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
          <div class="flex mt-5 flex-wrap">暱稱：<n-input v-model:value="user.display_name" placeholder="朋友都如何稱呼你？"/></div>
          <div class="flex mt-5 flex-wrap">年齡：<n-input-number v-model:value="user.age" clearable placeholder="年齡不是問題"/></div>
          <div class="flex mt-5 flex-wrap">所在地：<n-input v-model:value="user.city" placeholder="你在哪裡呢？"/></div>
          <div class="flex mt-5 flex-wrap">職業：<n-input v-model:value="user.career" placeholder="什麼領域的呢？" /></div>
          <div class="flex mt-5 flex-wrap">喜歡的一句話：<n-input v-model:value="user.favorite_sentence" placeholder="例如：我要發大財" /></div>
          <div class="flex mt-5 flex-wrap">個性標籤：<n-dynamic-tags v-model="user.tags" :max="6" /></div>
        </div>
        <div id="target2" class="innerPart_2" v-show="currentRef === 2">
          <div class="photosupload">
            <p>上傳兩張生活照</p>
            <n-upload
              accept="image/*"
              :default-file-list="fileList"
              list-type="image-card"
              @preview="handlePreview"
              @change="handleFileChange"
              :max="2"
            />
          </div>
          <div class="selfIntro">
            <n-space vertical>
            <div class="flex mt-5 flex-wrap">自我介紹：
              <n-input
              placeholder="介紹一下你自己吧"
              v-model:value="user.self_introduction"
              type="textarea"/>
            </div>
            <div class="flex mt-5 flex-wrap">星座：<n-input placeholder="沒有博愛座喔" v-model:value="user.zodiac"/></div>
            <div class="flex mt-5 flex-wrap">嗜好：<n-input placeholder="放假喜歡做什麼呢？" v-model:value="user.hobby" /></div>
            <div class="flex mt-5 flex-wrap">專長：<n-input placeholder="很會睡也可以是專長（？" v-model:value="user.expertise"/></div>
            <div class="flex mt-5 flex-wrap">感興趣的活動：<n-input placeholder="幫助你找到志同道合的朋友喔！" v-model:value="user.interested_in"/></div>
            </n-space>
          </div>
        </div>


      <div class="footer mt-10">
        <n-space vertical class="stepsArea">
          <n-steps size="small" :current="currentRef" :status="currentStatus">
            <n-step
              title="50%"
              description="完成一半囉！"
            />
            <n-step
              title="99.99%"
              description="就剩一點點了"
            />
          </n-steps>
        </n-space>
        <div class="arrowArea justify-center mt-10 custom-arrow flex gap-3">
          <div class="arrowLeft border-2 border-solid rounded-full border-slate-500">
            <label for="slide1" class="slide1 cursor-pointer">
              <ArrowLeft @click="prev"/>
            </label>
          </div>
          <div class="arrowRight border-2 border-solid rounded-full border-slate-500">
            <label for="slide2" class="slide2 cursor-pointer">
              <ArrowRight @click="next"/>
            </label>
          </div>
        </div>
        <div class="save flex gap-3 justify-end">
          <n-button tertiary @click="$emit('close')">改天再填</n-button>
          <n-button strong secondary type="primary" @click="handleSave">填好啦！</n-button>
        </div>
      </div>
    </n-card>
  </n-modal>
</div>

</template>
<style scoped>
.stepsArea{
  justify-content: center !important
}

/* 当前显示的内容 */
.innerPart_1[v-show="currentRef === 1"],
.innerPart_2[v-show="currentRef === 2"] {
  opacity: 1;
  transform: translateX(0);  /* 滑入效果 */
  z-index: 100;  /* 保证显示的部分在最前 */
}

/* 隐藏的内容 */
.innerPart_1[v-show="currentRef !== 1"],
.innerPart_2[v-show="currentRef !== 2"] {
  opacity: 0;
  transform: translateX(100%); /* 滑出效果 */
  z-index: 0;
}

</style>
