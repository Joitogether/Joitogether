<script setup>
import { Search } from "@iconoir/vue";
import { computed, watch, ref, onMounted } from "vue";
import { loadGoogleMapsAPI } from "@/views/Activity/components/googleMapsLoader";

// data
const participants = ref(1);
const participantsError = ref(false);

watch(participants,(e)=> {
  if(e > 30 ){
    alert("人數不可以超過30!!")
    participants.value = 30
  } else if (e < 0) {
  alert("人數不可以小於0!!")
    participants.value =1}
})

const paymentMethod = ref("free");
const eventCost = ref(0);
const previewImage = ref(null);
const uploadError = ref("");
const maxFileSize = 5 * 1024 * 1024;
const searchQuery = ref("");
const suggestions = ref([]);


const inputValues = ref({
  name: "",
  describe: "",
  price: "",
  eventTime: "",
  deadline: "",
});
const userNotEnter = ref({
  name: false,
  describe: false,
  price: false,
  eventTime: false,
  deadline: false,
});

// methods
const updateParticipants = (value) => {
  const newCount = participants.value + value;

  if (newCount < 1) {
    participantsError.value = true;
  } else {
    participants.value = newCount;
    participantsError.value = false;
  }
};

const checkInput = (field) => {
  userNotEnter.value[field] = !inputValues.value[field].trim();
};

const checkTimeInput = (field) => {
  const now = new Date();

  if (field === "eventTime") {
    const eventTime = new Date(inputValues.value.eventTime);
    userNotEnter.value.eventTime = !inputValues.value.eventTime || eventTime < now;
  } else if (field === "deadline") {
    const eventTime = new Date(inputValues.value.eventTime);
    const deadline = new Date(inputValues.value.deadline);
    userNotEnter.value.deadline =
      !inputValues.value.deadline || deadline > eventTime;
  }
};

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

const handleFileUpload = (event) => {
  const file = event.target.files[0];

  if (!file) {
    uploadError.value = "請選擇一個圖片檔案";
    return;
  }

  if (file.size > maxFileSize) {
    uploadError.value = "檔案大小不可超過 5 MB";
    return;
  }

  uploadError.value = "";
  const reader = new FileReader();
  reader.onload = () => {
    previewImage.value = reader.result;
  };
  reader.readAsDataURL(file);
};

const apiKey = "Google API Key"; // 替換為您的 Google API Key
const autocompleteInstance = ref(null);

onMounted(async () => {
  try {
    const googleMaps = await loadGoogleMapsAPI(apiKey);
    const inputElement = document.getElementById("autocomplete-input");
    autocompleteInstance.value = new googleMaps.places.Autocomplete(
      inputElement,
      {
        types: ["geocode"],
        language: "zh-TW",
      }
    );

    autocompleteInstance.value.addListener("place_changed", () => {
      const place = autocompleteInstance.value.getPlace();
      searchQuery.value = place.formatted_address || place.name;
    });
  } catch (error) {
    console.error("Error loading Google Maps API:", error);
  }
});

const clearSearch = () => {
  const inputElement = document.getElementById("autocomplete-input");
  if (!searchQuery.value) {
    inputElement.focus();
  } else {
    searchQuery.value = "";
    suggestions.value = [];
  }
};

const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion.description;
  suggestions.value = [];
};

const validateAllFields = () => {
  const requiredFields = ["name", "describe", "eventTime", "deadline"];
  let isValid = true;

  requiredFields.forEach((field) => {
    checkInput(field);
    if (userNotEnter.value[field]) {
      isValid = false;
    }
  });

  checkTimeInput("eventTime");
  checkTimeInput("deadline");

  if (participants.value < 1) {
    participantsError.value = true;
    isValid = false;
  }

  if (paymentMethod.value === "AA") {
    validateCost();
    if (userNotEnter.value.price) {
      isValid = false;
    }
  }

  return isValid;
};

const previewActivity = () => {
  if (!previewImage.value) {
    uploadError.value = "請至少上傳一張圖片！";
    return;
  }

  Object.keys(inputValues.value).forEach((key) => {
    checkInput(key);
  });
  checkTimeInput("eventTime");
  checkTimeInput("deadline");
  validateCost();

  if (
    Object.values(userNotEnter.value).some((value) => value) ||
    uploadError.value
  ) {
    alert("請填寫完整資料！");
    return;
  }

  console.log("活動資料：", {
    ...inputValues.value,
    participants: participants.value,
    paymentMethod: paymentMethod.value,
    eventCost: eventCost.value,
    image: previewImage.value,
    location: searchQuery.value,
  });

  alert("活動已預覽，請檢查開發者工具中的資料");
};




</script>

<template>
<section>
<div class=" bg-gray-300">
  <main class="max-w-xl mx-auto items-center justify-center min-h-screen px-6">
      <h3 class="font-semibold  mb-2 p-3 text-lg">活動建立</h3>
      <!-- 圖片上傳 -->
      <div class="bg-white p-5 mb-3 rounded-lg">
        <div class="mb-6">
          <div class="rounded-lg p-6 flex justify-center items-center">
            <label class="bg-gray-100 mt-6 rounded-md w-40 h-40 flex items-center justify-center cursor-pointer">
              <img v-if="previewImage" :src="previewImage" alt="預覽圖片" class="w-full h-full object-cover rounded-md" />
              <span v-else class="text-gray-500">點擊上傳圖片</span>
              <input
                type="file"
                class="hidden"
                @change="handleFileUpload"
                accept="image/*"
              />
            </label>
          </div>

          <p v-if="uploadError" class="text-sm text-red-600 mt-2  flex items-center justify-center">{{ uploadError }}</p>


           <!-- <p v-if="uploadError" class="text-sm text-red-600 mt-2">{{ uploadError }}</p> -->
        </div>
      </div>

      <!-- 活動名稱和描述 -->
    <div class=" bg-white p-5 px-4 mb-3 rounded-lg">
      <div class="mb-6 mt-6">
          <label class="block  font-medium mb-2 p-2">活動名稱
            <span class="text-red-600">*</span>
          </label>
          <input type="text" placeholder="請填活動名稱" class="w-full p-3  border-b rounded-md  focus:outline-none"
          v-model="inputValues.name"
          @blur="checkInput('name')"
          />
          <p class="text-sm text-red-600"
          v-if="userNotEnter.name"
          >請輸入活動名稱*</p>
      </div>
      <div class="mb-6">
          <label class="block  font-medium mb-2 p-2">活動描述
            <span class="text-red-600">*</span>
          </label>
          <textarea placeholder="請填活動描述" rows="4" class="w-full p-3 border rounded-md focus:outline-none"
          v-model="inputValues.describe"
          @blur="checkInput('describe')"

          ></textarea>
          <p class="text-sm text-red-600"
          v-if="userNotEnter.describe"
          >請輸入活動描述*</p>
      </div>

      <!-- 地點 -->
      <div class="mt-6">
        <div class="mb-6">
            <label class="block  font-medium mb-2 p-2">
              地點<span class="text-red-600">*</span>
            </label>
            <div class="flex items-center border rounded-md">
              <input
              type="text"
              placeholder="搜尋聚會地點"
              class="flex-grow p-3 border-none focus:outline-none"
              id="autocomplete-input"
              />
              <button class="p-3  border-l-2" @click="clearSearch">
                <Search />
              </button>
              <ul v-if="suggestions.length" class="border rounded-md mt-2 bg-white">
                <li
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
            <label class="block font-medium mb-2 p-2">活動時間
              <span class="text-red-600">*</span>
            </label>
            <input type="datetime-local"
            class="w-full p-3 border rounded-md focus:outline-none"
            v-model="inputValues.eventTime"
            @blur="checkTimeInput('eventTime')"
            />
            <p
            class="text-red-600 text-sm"
            v-if="userNotEnter.eventTime"
            >活動時間不可低於當前時間*</p>
          </div>
          <div>
            <label class="block font-medium mb-2 p-2">
              最晚審核時間 <span class="text-red-600">*</span>
            </label>
            <input
            type="datetime-local"
            class="w-full p-3 border rounded-md"
            v-model="inputValues.deadline"
            @blur="checkTimeInput('deadline')"
            />
            <p
            class="text-red-600 text-sm"
            v-if="userNotEnter.deadline"
            >審核時間不可小於活動時間 *</p>

          </div>
          <div class=" bg-gray-200 mt-2 p-6 flex items-center justify-center border rounded-md">
          <span>你的聚會將會刊登在列表上，直到時間截止。記得在最晚審核時間前勾選參加者。</span>
          </div>
      </div>



        <!-- 最大最小參加人數 -->
      <div class="mt-6 mb-6 grid grid-cols-2 gap-4 ">
        <div>
          <label class="block font-medium mb-2 p-2">活動人數 <span class="text-red-600">*</span></label>
        </div>
          <div>
            <div class="flex justify-end items-center">
              <button class=" w-10 px-3 py-3 rounded-md justify-end items-center hover:bg-gray-200"  @click="updateParticipants(-1)">-</button>
              <input  type="number" :min=1 :max=30 class=" w-32 text-center p-3 mx-3 border rounded-md focus:outline-none "
              v-model="participants"
              />
              <button class=" w-10 px-3 py-3 rounded-md justify-end items-center hover:bg-gray-200" @click="updateParticipants(1)">+</button>
            </div>
          </div>
          <p class="text-sm text-red-600"
          v-if="participantsError"
          >人數不得低於1人*</p>
      </div>

        <!-- 類型與費用 -->
      <div class="grid grid-cols-1 gap-4">
          <div>
          <label class="block  font-medium mb-2">活動類型 <span class="text-red-600">*</span></label>
          <select  class="w-full p-3 border rounded-md">
              <option value="" disabled selected>請選擇聚會類型</option>
              <option value="food">美食</option>
              <option value="shopping">購物</option>
              <option value="travel">旅遊</option>
              <option value="sports">運動</option>
              <option value="education">教育</option>
              <option value="others">其他</option>
          </select>
          </div>
          <div>
          <label class="block  font-medium mb-2">付款方式 <span class="text-red-600">*</span></label>
          <select  class="w-full p-3 border rounded-md"
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
              @input="validateCost"
              min="0"
              max="99999"
              />
              <p class="text-sm text-red-600"
              v-if="userNotEnter.price"
              >預算最高限制為99999元 *</p>
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
