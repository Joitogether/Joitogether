<script setup>
import { NButton, NModal, NCard, NUpload, NInput, NStep, NSpace, NSteps, NInputNumber, NDynamicTags } from 'naive-ui';
import { ArrowLeft, ArrowRight } from '@iconoir/vue';
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: false // 預設為 false
  },
  type: {
    type: String,
    default: 'defaultType', // 如果沒有傳遞，設置默認值
    required: true,
    // validator: value => ['hero', 'monster'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'save', 'cancel'])
const showModal = ref(props.show);  // 初始化 showModal 變數

const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 定義響應式的文件列表
const fileList = ref([]);

// 定義用來存儲兩張照片的變數
const fileData = ref({
  life_photo_1: null,
  life_photo_2: null,
});

// 處理文件變更的邏輯
function handleFileChange(newFileList) {
  // 更新 fileList，這會觸發 Vue 的響應式更新
  fileList.value = newFileList;

  // 根據 fileList 的長度來分配到不同的屬性
  if (fileList.value.length > 0) {
    fileData.value.life_photo_1 = fileList.value[0]; // 第一張照片
  }
  if (fileList.value.length > 1) {
    fileData.value.life_photo_2 = fileList.value[1]; // 第二張照片
  }
}

// 當 `show` 變更時，更新 `showModal`
watch(() => props.show, (newValue) => {
  showModal.value = newValue;
});

// 控制模態框顯示與隱藏
// const closeModal = () => {
//   emit('update:show', false); // 向父組件發送更新
// };


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

</script>
<template>
<div class="btn-container flex gap-2 mt-8 mb-8">
  <n-modal v-model:show="showModal">
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
        <div id="target1" class="innerPart_1" v-show="currentRef === 1">
          <div class="flex mt-5 flex-wrap">暱稱：{{ formData.display_name }}<n-input :v-model="formData.display_name" placeholder="朋友都如何稱呼你？"/></div>
          <div class="flex mt-5 flex-wrap">年齡：<n-input-number v-model="formData.age" clearable placeholder="年齡不是問題"/></div>
          <div class="flex mt-5 flex-wrap">所在地：<n-input v-model="formData.city" placeholder="你在哪裡呢？"/></div>
          <div class="flex mt-5 flex-wrap">職業：<n-input v-model="formData.career" placeholder="什麼領域的呢？" /></div>
          <div class="flex mt-5 flex-wrap">喜歡的一句話：<n-input v-model="formData.favorite_sentence" placeholder="例如：我要發大財" /></div>
          <div class="flex mt-5 flex-wrap">個性標籤：<n-dynamic-tags v-model="formData.tags" :max="6" /></div>
        </div>
        <div id="target2" class="innerPart_2" v-show="currentRef === 2">
          <div class="photosupload">
            <p>上傳兩張生活照</p>
            <n-upload
              action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
              :default-file-list="fileList"
              list-type="image-card"
              @preview="handlePreview"
              @change="handleFileChange"
              max="2"
            />
          </div>
          <div class="selfIntro">
            <n-space vertical>
            <div class="flex mt-5 flex-wrap">自我介紹：
              <n-input
              placeholder="介紹一下你自己吧"
              v-model="formData.selfintroduction"
              type="textarea"/>
            </div>
            <div class="flex mt-5 flex-wrap">星座：<n-input placeholder="沒有博愛座喔" v-model="formData.starSign"/></div>
            <div class="flex mt-5 flex-wrap">嗜好：<n-input placeholder="放假喜歡做什麼呢？" v-model="formData.hobbys" /></div>
            <div class="flex mt-5 flex-wrap">專長：<n-input placeholder="很會睡也可以是專長（？" v-model="formData.expertise"/></div>
            <div class="flex mt-5 flex-wrap">感興趣的活動：<n-input placeholder="幫助你找到志同道合的朋友喔！" v-model="formData.interesting"/></div>
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
          <n-button tertiary @click="emit('cancel')">改天再填</n-button>
          <n-button strong secondary type="primary" @click="emit('save')">填好啦！</n-button>
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
