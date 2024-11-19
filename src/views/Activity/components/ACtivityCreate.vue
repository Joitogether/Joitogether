<script setup>
import { Search  } from '@iconoir/vue';
import { computed,ref } from 'vue'

// data
const participants = ref(1)
const participantsError = ref(false)
const paymentMethod = ref("free")
const eventCost = ref(0)

const inputValues =ref({
  name:"",
  describe:"",
  price:"",
})
const userNotEnter=ref({
  name:false,
  describe:false,
  price:false
})


// methods

// 檢查人數是否低於 1
  const updateParticipants = (value) => {
        const newCount = participants.value + value;


        if (newCount < 1) {
          participantsError.value = true;
        } else {
          participants.value = newCount;
          participantsError.value = false;
        }
      };

// 檢查輸入
const checkInput = (field) =>{
  userNotEnter.value[field] = !inputValues.value[field].trim();
}

// 檢查費用
const showEventCost = computed(() => paymentMethod.value === "AA");

const validateCost = () => {
      if (eventCost.value < 0 || eventCost.value > 99999) {
        userNotEnter.value.price = true;
      } else {
        userNotEnter.value.price = false;
      }
    }

const checkPaymentMethod = () => {
      // 如果付款方式不是 "各付各的"，清空費用並隱藏錯誤提示
      if (paymentMethod.value !== "AA") {
        eventCost.value = 0;
        userNotEnter.value = false;
      }
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
                <button class="bg-gray-100  mt-6 rounded-md w-40 h-40 flex items-center justify-center">
                    <img src="" alt="上傳圖片圖示" class="w-10 h-10">
                </button>
            </div>
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
            <label class="block  font-medium mb-2 p-2">地點
              <span class="text-red-600">*</span>
            </label>
            <div class="flex items-center border rounded-md">
              <input type="text"  placeholder="搜尋聚會地點" class="flex-grow p-3 border-none focus:outline-none" />
              <button class="p-3  border-l-2">
                <Search />
              </button>
            </div>
        </div>
      </div>

      <!-- 日期與時間 -->
      <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block font-medium mb-2 p-2">活動時間
              <span class="text-red-600">*</span>
            </label>
            <input type="date"  class="w-full p-3 border rounded-md focus:outline-none" />
            <input type="time"  class="w-full p-3 border rounded-md mt-2 focus:outline-none" />
          </div>
          <div>
            <label class="block font-medium mb-2 p-2">最晚審核時間 <span class="text-red-600">*</span></label>
            <input type="date"  class="w-full p-3 border rounded-md" />
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
              <input  type="number" min="1" class=" w-32 text-center p-3 mx-3 border rounded-md focus:outline-none "
              v-model="participants"
              readonly
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
          <button class=" bg-yellow-200 rounded-md  w-full mx-3 py-2 px-3">預覽</button>
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
