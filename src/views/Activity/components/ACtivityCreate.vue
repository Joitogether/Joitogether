<script setup>
import { Search,XmarkCircle } from "@iconoir/vue"
import { computed, ref, onMounted,watch } from "vue"
import { loadGoogleMapsAPI } from "@/views/Activity/components/googleMapsLoader"
import  debounce from "lodash/debounce"
import { useMessage } from "naive-ui"

const message = useMessage()


const inputValues = ref({
  name: "",
  describe: "",
  price: "",
  eventTime: "",
  deadline: "",
  category:"",
  requireApproval:false,
});

const userNotEnter = ref({
  name: false,
  describe: false,
  price: false,
  eventTime: false,
  deadline: false,
  requireApproval:false,
  category:false,
});



const timeRange = ref({
  minTime: '',
  maxTime: '',
});





//  監視人數
const participants = ref(1)
const participantsError = ref("")

const updateParticipants = (value) => {
  const newCount = participants.value + value;
  if (newCount < 1) {
    participantsError.value = "人數不得低於 1 人";
    participants.value = 1;
  }  else {
    participantsError.value = "";
    participants.value = newCount;
  }
}
//  監視人數輸入
watch(participants, (newValue) => {
  if (isNaN(newValue) || newValue === "" || newValue <= 0 ) {
    message.warning("請輸入有效數字");
    participantsError.value = "請輸入有效數字";
    participants.value = '';
  }  else {
    participantsError.value = "";
  }
});

//  限制人數輸入
const validateInput = (event) => {
  let value = event.target.value;

  value = value.replace(/[^0-9]/g, "");
  value = value.replace(/^0+/, "");

  event.target.value = value;
};


//  監視費用輸入
const eventCost = ref(0)
const eventCostError = ref("")

watch(eventCost,(newValue) => {
  if (isNaN(newValue) || newValue === "" || newValue <= 0 ) {
    eventCostError.value = "請輸入有效數字";
    eventCost.value ="";
  } else if (newValue  > 99999) {
    eventCostError.value = "活動費用不得超過 99999 元";
    eventCost.value = 99999;
  } else {
    eventCostError.value = "";
  }
})

//  限制費用輸入
const eventCostInput = (event) => {
  let value = event.target.value;

  value = value.replace(/[^0-9]/g, "");
  value = value.replace(/^0+/, "");
  if (value > 99999) {
    value = 99999;
  }
  event.target.value = value;
};


const checkTimeInput = (field) => {
  const now = new Date();

  if (field === "eventTime") {
    const eventTime = new Date(inputValues.value.eventTime);
    userNotEnter.value.eventTime = !inputValues.value.eventTime || eventTime < now;
  }

     if (field === "deadline" && inputValues.value.requireApproval) {
    const eventTime = new Date(inputValues.value.eventTime);
    const deadline = new Date(inputValues.value.deadline);

    if (!inputValues.value.deadline && inputValues.value.requireApproval) {
      userNotEnter.value.deadline = true;
    } else if (deadline > eventTime) {
      userNotEnter.value.deadline = true;
      message.warning("審核截止時間不可晚於活動時間！")
    } else {
      userNotEnter.value.deadline = false;
    }
  }
};





const paymentMethod = ref("free")
const showEventCost = computed(() => paymentMethod.value === "AA");

const validateCost = () => {
  userNotEnter.value.price = eventCost.value < 0 || eventCost.value > 99999;
};

const checkPaymentMethod = () => {
  if (paymentMethod.value !== "AA") {
    eventCost.value = 0;
    userNotEnter.value.price = false;
  }

  if (paymentMethod.value === "AA") {
    validateCost();
  }
};

const uploadedImage = ref(null)
const uploadError = ref("")
const maxFileSize = 1 * 1024 * 1024

const handleFileUpload = (event) => {
  const file = event.target.files[0];

  if (file.size > maxFileSize) {
    uploadError.value = "檔案大小不可超過 1 MB";
    return;
  }

  uploadError.value = "";
  const reader = new FileReader();
  reader.onload = () => {
    uploadedImage.value = reader.result;
  };
  reader.readAsDataURL(file);

  event.target.value = "";
};

const removeImage = () => {
  uploadedImage.value = null;
}


const apiKey = import.meta.env.VITE_GOOGLE_KEY; // 替換為您的 Google API Key
const searchQuery = ref("")
const suggestions = ref([])
const inputElement = ref(null);
const autocompleteInstance = ref(null);
const isLoading = ref(false);
const isLoadOK =ref(false);


// 初始化 Autocomplete
const initializeAutocomplete = async () => {
  if (!autocompleteInstance.value) {
    const googleMaps = await loadGoogleMapsAPI(apiKey);
    autocompleteInstance.value = new googleMaps.places.AutocompleteService();
  }
};

// 輸入時觸發搜尋
const onInputChange = debounce(async () => {
  if (!autocompleteInstance.value || !searchQuery.value) {
    suggestions.value = [];
    isLoading.value = false;
    return;
  }

  suggestions.value = []; // 清空建議結果

  autocompleteInstance.value.getPlacePredictions(
    {
      input: searchQuery.value,
      types: ["geocode"],
      language: "zh-TW",
      componentRestrictions: { country: "TW" },
    },
    (predictions, status) => {
      isLoading.value = false;
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        suggestions.value = predictions || [];
        isLoadOK.value =true
      } else {
        suggestions.value = [];
        isLoadOK.value =true
        message.warning('未搜尋到地址，請重新輸入')
        searchQuery.value=null
      }
    }
  );
}, 2000);

const triggerInputChange = () => {
  isLoading.value = true; // 立即設置為正在搜尋中
  onInputChange();
};

// 選擇建議
const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion.description;
  suggestions.value = [];
};

// 清除輸入框
const clearSearch = () => {
  searchQuery.value = "";
  isLoadOK.value=false;
  suggestions.value = [];
  if (inputElement.value) {
    inputElement.value.focus();
  }
};

// 聚焦輸入框
const focusInput = () => {
  if (inputElement.value) {
    inputElement.value.focus();
  }
};


onMounted(()=>{
  const taiwanTimeOffset = 8 * 60 * 60 * 1000;
  const now = new Date();
  const taiwanNow = new Date(now.getTime() + taiwanTimeOffset);

  const minDate = new Date(taiwanNow);
  minDate.setHours(minDate.getHours() + 12);
  const minTime = minDate.toISOString().slice(0, 16);

  const maxDate = new Date(taiwanNow);
  maxDate.setDate(maxDate.getDate() + 90);
  const maxTime = maxDate.toISOString().slice(0, 16);

  timeRange.value.minTime = minTime;
  timeRange.value.maxTime = maxTime;
});


  // 轉資料型態
  const formatToCustom = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  watch(() => inputValues.value.requireApproval,(newVal) => {
    if (!newVal) {
      inputValues.value.deadline = "";
    }
  }
);

const checkInput = (field) => {
  if (field === "deadline" && !userNotEnter.value.requireApproval) {
    userNotEnter.value.deadline = false;
    return
  }
  userNotEnter.value[field] = !inputValues.value[field];
};

const previewActivity = () => {
  Object.keys(inputValues.value).forEach((key) => {
    if (key === "deadline" && !inputValues.value.requireApproval) {
    return
  }checkInput(key);
})

  checkTimeInput("eventTime");

  if (inputValues.value.requireApproval) {
  checkTimeInput("deadline")
  }
  validateCost()

  const fieldsToCheck = ["name", "describe", "price", "eventTime", "category"];
  if (inputValues.value.requireApproval) {
    fieldsToCheck.push("deadline");
  }

  const hasUnfilledFields = fieldsToCheck.some((field) => {
    if (field === "deadline" && !inputValues.value.requireApproval) {
      return false;
    }
    return userNotEnter.value[field];
  });

  const hasUploadError = uploadError.value;


  if (hasUnfilledFields || hasUploadError) {
    message.warning("請填寫完整資料！")
    return;
  }

  const formattedEventTime = inputValues.value.eventTime
   ?formatToCustom(new Date(inputValues.value.eventTime))
   :""

  const formattedApprovalDeadline = inputValues.value.deadline
  ? formatToCustom(new Date(inputValues.value.deadline))
  : ""

  // 之後要submit出去的資料
  console.log("活動資料：", {
  name: inputValues.value.name,
  description: inputValues.value.describe,
  event_time: formattedEventTime,
  approval_deadline: formattedApprovalDeadline,
  max_participants: participants.value,
  pay_type: paymentMethod.value,
  price: eventCost.value,
  img_url: uploadedImage.value,
  location: searchQuery.value,
  category:inputValues.value.category,
  require_approval:inputValues.value.requireApproval,
  })

}

</script>

<template>
<section>
<div class=" bg-gray-300">
  <main class="max-w-xl mx-auto min-h-screen px-6 items-center justify-center">
      <h3 class="font-semibold text-lg mb-2 p-3">活動建立</h3>
      <!-- 圖片上傳 -->
      <div class="bg-white rounded-lg p-5 mb-3 ">
        <div class="mb-6">
          <div class="relative rounded-lg flex justify-center items-center p-6">

            <label
            class="bg-gray-100 mt-6 rounded-md w-40 h-40 flex items-center justify-center "
            :class="{ ' cursor-auto' : !!uploadedImage,'cursor-pointer': !uploadedImage }"
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
              class="absolute top-0 right-0  bg-gray-300 text-white rounded-full px-2 py-1 text-xs cursor-pointer"
              @click="removeImage">X
            </span>
          </div>
          <p v-if="uploadError" class="text-sm text-red-600 mt-2  flex items-center justify-center">{{ uploadError }}</p>
          <p class="text-sm text-gray-600 mt-2 flex items-center justify-center">請至少上傳一張圖片，若未上傳圖片將會使用預設圖片</p>
        </div>

      </div>

      <!-- 活動名稱和描述 -->
    <div class=" bg-white p-5 px-4 mb-3 rounded-lg">
      <div class="mb-6 mt-6">
          <label class="block  font-medium mb-2 p-2  text-base">活動名稱
            <span class="text-red-600">*</span>
          </label>
          <input type="text" placeholder="請填活動名稱" class="w-full p-3  border-b rounded-md  focus:outline-none  text-base"
          v-model="inputValues.name"
          @blur="checkInput('name')"
          />
          <p class="text-sm text-red-600"
          v-if="userNotEnter.name"
          >請輸入活動名稱*</p>
      </div>
      <div class="mb-6">
          <label class="block  font-medium mb-2 p-2  text-base">活動描述
            <span class="text-red-600">*</span>
          </label>
          <textarea placeholder="請填活動描述" rows="4" class="w-full p-3 border rounded-md focus:outline-none  text-base"
          v-model="inputValues.describe"
          @blur="checkInput('describe')"

          ></textarea>
          <p class="text-sm text-red-600 "
          v-if="userNotEnter.describe"
          >請輸入活動描述*</p>
      </div>

      <!-- 地點 -->
      <div class="mt-6">
        <div class="mb-6">
            <label class="block  font-medium mb-2 p-2  text-base">
              地點<span class="text-red-600">*</span>
            </label>
            <div class="flex items-center border rounded-md">
              <input
              ref="inputElement"
              type="text"
              placeholder="搜尋聚會地點"
              class="flex-grow p-3 border-none focus:outline-none  text-base"
              v-model="searchQuery"
              @input="triggerInputChange"
              @focus="initializeAutocomplete"
              />
              <button v-if="isLoadOK"
              class="p-3" @click="clearSearch">
                <XmarkCircle />
              </button>
              <button class="p-3  border-l-2" @click="focusInput">
                <Search />
              </button>
            </div>
            <div>
              <ul v-if="isLoading || suggestions.length" class="border rounded-md mt-2 bg-white">
                <li v-if="isLoading" class="p-2 text-gray-500">正在搜尋中...</li>
                <li
                  v-else
                  v-for="(suggestion, index) in suggestions"
                  :key="index"
                  class="p-2 cursor-pointer hover:bg-gray-100"
                  @click="selectSuggestion(suggestion)">
                  {{ suggestion.description }}
                </li>
              </ul>
            </div>
        </div>
      </div>

      <!-- 日期與時間 -->
      <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block font-medium mb-2 p-2 text-base">活動時間
              <span class="text-red-600">*</span>
            </label>
            <input type="datetime-local"
            :min="timeRange.minTime"
            :max="timeRange.maxTime"
            class="w-full p-3 border rounded-md focus:outline-none  text-base"
            v-model="inputValues.eventTime"
            @blur="checkTimeInput('eventTime')"
            />
            <p
            class="text-red-600 text-sm "
            v-if="userNotEnter.eventTime"
            >請選擇活動時間*</p>
          </div>


          <div class=" flex font-medium mb-2 p-2  text-base">是否需要審核
            <div>
              <input type="checkbox"
              class=" mx-3"
              v-model="inputValues.requireApproval"
              >
            </div>
          </div>
          <div v-if="inputValues.requireApproval">
            <label class="block font-medium mb-2 p-2  text-base">
              最晚審核時間 <span class="text-red-600">*</span>
            </label>
            <input
            type="datetime-local"
            :min="timeRange.minTime"
            :max="timeRange.maxTime"
            class="w-full p-3 border rounded-md  text-base"
            v-model="inputValues.deadline"
            @blur="checkTimeInput('deadline')"
            />

            <p
            class="text-red-600 text-sm"
            v-if="userNotEnter.deadline"
            >審核時間不可晚於活動時間 *</p>
          </div >
          <div  class=" bg-gray-200 mt-2 p-6 flex items-center justify-center border rounded-md  text-base">
          <span>你的聚會將會刊登在列表上，直到時間截止。記得在最晚審核時間前勾選參加者。</span>
          </div>
      </div>



        <!-- 最大最小參加人數 -->
      <div class="mt-6 mb-6 grid grid-cols-2 gap-4 ">
        <div>
          <label class="block font-medium mb-2 p-2  text-base">活動人數 <span class="text-red-600">*</span></label>
        </div>
          <div>
            <div class="flex justify-end items-center">
              <button class=" w-10 px-3 py-3 rounded-md justify-end items-center hover:bg-gray-200"  @click="updateParticipants(-1)">-</button>
              <input  type="number" min="1" max="30" class=" w-32 text-center p-3 mx-3 border rounded-md focus:outline-none "
              v-model="participants"
              @input="validateInput"
              />
              <button class=" w-10 px-3 py-3 rounded-md justify-end items-center hover:bg-gray-200" @click="updateParticipants(1)">+</button>
            </div>
          </div>
          <p class="text-sm text-red-600 mx-1"
          v-if="participantsError"
          > {{ participantsError }}*</p>
      </div>

        <!-- 類型與費用 -->
      <div class="grid grid-cols-1 gap-4">
          <div>
          <label class="block  font-medium mb-2  text-base">活動類型 <span class="text-red-600">*</span></label>
          <select  class="w-full p-3 border rounded-md  text-base"
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
          <p class="text-sm text-red-600"
          v-if="userNotEnter.category"
          >請選擇活動類型*</p>
          </div>
          <div>
          <label class="block  font-medium mb-2">付款方式 <span class="text-red-600">*</span></label>
          <select  class="w-full p-3 border rounded-md  text-base"
          v-model="paymentMethod"
          @change="checkPaymentMethod"
          >
              <option value="free">免費</option>
              <option value="AA">各付各的</option>
              <option value="host">團主請客</option>
          </select>
          </div>
            <div class="mb-6 grid grid-cols-2 "
            v-if="showEventCost"
            >
              <label class="block  font-medium mb-2 p-2">活動費用<span class="text-red-600">*</span></label>
              <input type="number"  class="w-full p-3  border-b border-solid rounded-md  focus:outline-none"
              v-model="eventCost"
              @input="eventCostInput"
              min="0"
              max="99999"
              />
              <p class="text-sm text-red-600"
              v-if="eventCostError"
              >{{ eventCostError }} *</p>
            </div>
        </div>
        <div class="my-6 flex items-center justify-center ">
          <button class=" bg-yellow-200 rounded-md  w-full mx-3 py-2 px-3"
          @click="previewActivity"
          >預覽</button>
        </div>

      </div>
  </main>
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
