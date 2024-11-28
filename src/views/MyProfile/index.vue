<script async setup>
import { ref, onMounted } from 'vue';
// import { NButton, NModal, NCard, NUpload, NInput, NStep, NSpace, NSteps, NInputNumber, NDynamicTags } from 'naive-ui';
import { ProfileCircle, BrightStar, Heart, Post, Group } from '@iconoir/vue';
import { RouterLink, RouterView } from 'vue-router'
import axios from 'axios';
import CardList from './component/CardList.vue'
import EditModal from './component/EditModal.vue';

const showModal = ref(false)
const editingItem = ref(null)
const editingType = ref(null)
const error = ref('')
const message = ref('')
const currentUser = ref(null);


const API_URL = 'http://localhost:3030'


const fetchUserData = async (uid) => {
  try {
    const response = await axios.get(`${API_URL}/users/${uid}`);
    console.log('API Response:', response.data);  // 打印 API 返回的資料
    if (response.data.status === 200) {
      currentUser.value = response.data.data;  // 存儲當前用戶資料
      editingItem.value = response.data.data;  // 假設返回的資料結構是這樣
    } else {
      console.error('API 返回錯誤：', response.data.message);
    }
  } catch (err) {
    error.value = '獲取使用者資料失敗：' + err.message;
    console.error('Error fetching user data:', err);  // 輸出錯誤訊息
  }
};
fetchUserData('HWDIppnENgcdS3Ml9F0For7kQwv1')


// 在 onMounted 中調用 fetchUserData 函數
onMounted(() => {
  const userId = 'HWDIppnENgcdS3Ml9F0For7kQwv1';  // 這裡設置默認的 userId，可以根據需要動態修改
  fetchUserData(userId);  // 發送 API 請求來獲取資料
});

// 編輯
const handleEdit = (item, type) => {
  editingItem.value = { ...item }
  editingType.value = type
  showModal.value = true  // 顯示編輯彈窗

}

const handleSave = async () => {
  try {
    // 打印出資料，方便調試
    console.log('editingType:', editingType.value);
    console.log('editingItem:', editingItem.value);

    if (!editingItem.value || !editingItem.value.uid) {
      throw new Error('更新失敗：id 不存在');
    }

    // 確保這裡 endpoint 根據 editingType 來設置
    const endpoint = editingType.value === 'users' ? 'users' : '其他';

    // 更新請求，這裡直接傳遞 editingItem 的資料
    const response = await axios.put(`${API_URL}/${endpoint}/${editingItem.value.uid}`, editingItem.value);

    if (response.status === 200) {
      message.value = `更新成功: ${response.data.message || '操作成功'}`;
      showModal.value = false; // 關閉編輯彈窗
    } else {
      message.value = `更新錯誤，請重試！狀態碼：${response.status}`;
    }

    editingItem.value = null;
    await Promise.all([fetchUserData()]);
  } catch (err) {
    error.value = '更新失敗：' + err.message;
  }
};


// 清除訊息
// const clearMessage = () => {
//   error.value = ''
//   message.value = ''
// }


//
// onMounted(() => {
//       // 嘗試從 localStorage 讀取資料
//       const savedData = localStorage.getItem('userFormData');
//       if (savedData) {
//         const parsedData = JSON.parse(savedData);

//         // 使用 .value 來設置 ref 的值
//         starSign.value = parsedData[0] || '';
//         hobbys.value = parsedData[1] || '';
//         expertise.value = parsedData[2] || '';
//         interesting.value = parsedData[3] || '';
//         age.value = parsedData[4] || '';
//         favoriteSen.value = parsedData[5] || '';
//         nickName.value = parsedData[6] || '';
//         career.value = parsedData[7] || '';
//         tags.value = parsedData[8] || [];  // 如果 tags 是字串，將其轉回陣列
//         shortDescription.value = parsedData[9] || '';
//         city.value = parsedData[10] || '';
//         imgUrl.value = parsedData[11] || '';
//         lifeImg.value = parsedData[12] || '';
//       }
//     });
// const starSign = ref('');
// const hobbys = ref('');
// const expertise = ref('');
// const interesting = ref('');
// const age = ref('');
// const favoriteSen = ref('');
// const nickName = ref('');
// const career = ref('');
// const tags = ref(["棒球迷","環遊世界"])
// const shortDescription = ref('')
// const city = ref('');
// const imgUrl = ref('https://shoplineimg.com/5ab875018d1db9e3db00025b/5e15c900fe2d2b002db19bfb/800x.jpg?');
// const lifeImg = ref('')


// // 提交資料的函數
// function sendPersonInfo() {
//   const submitValue = [
//     starSign.value,
//     hobbys.value,
//     expertise.value,
//     interesting.value,
//     age.value,
//     favoriteSen.value,
//     nickName.value,
//     career.value,
//     tags.value,
//     shortDescription.value,
//     city.value,
//     imgUrl.value,
//     lifeImg.value,
// ];
// showModal.value = false

//資料存在本機
// localStorage.setItem('userFormData', JSON.stringify(submitValue));

  // 將資料存到伺服器
  // axios.post('你的API網址', submitValue)
  //   .then(response => {
  //     console.log('資料提交成功', response);
  //     showModal.value = false;  // 提交成功後關閉模態框
  //   })
  //   .catch(error => {
  //     console.error('資料提交失敗', error);
  //   });
// }


</script>

<template>
  <div class="container mx-auto">
  <CardList :items="currentUser" type="users" @edit="handleEdit" />
  <!-- <EditModal v-if="editingItem" v-model="editingItem" :type="editingType" @save="handleSave"
  @cancel="editingItem = null"/> -->
  <EditModal :modelValue="editingItem" v-model:show="showModal" :type="'users'" @save="handleSave" />

  <div>
    <ul class="flex justify-between px-10 py-5">
      <li
        class="hover:cursor-pointer w-24"
        :class="{
          'border-b-4 border-solid border-green-600': $route.path === '/profile/personInfo',
        }"
      >
        <RouterLink to="/profile/personInfo"
          ><ProfileCircle class="justify-self-center"
        /></RouterLink>
      </li>
      <li class="hover:cursor-pointer w-24">
        <RouterLink to="/profile/personalrate"
          ><BrightStar class="justify-self-center"
        /></RouterLink>
      </li>
      <li class="hover:cursor-pointer w-24">
        <RouterLink to="/profile/personalfocus">
          <Heart class="justify-self-center" />
        </RouterLink>
      </li>
      <li
        class="hover:cursor-pointer w-24"
        :class="{
          'border-b-4 border-solid border-green-600': $route.path === '/profile/personpost',
        }"
      >
        <RouterLink to="/profile/personpost"><Post class="justify-self-center" /></RouterLink>
      </li>
      <li
        class="hover:cursor-pointer w-24"
        :class="{
          'border-b-4 border-solid border-green-600': $route.path === '/profile/personActivity',
        }"
      >
        <RouterLink to="/profile/personActivity"
          ><Group class="justify-self-center"
        /></RouterLink>
      </li>
    </ul>
  </div>
  <div class="border">
    <router-view></router-view>
  </div>
  </div>
</template>

<style scoped>

@media screen and (width < 768px) {
  .container {
    max-width: 550px;
    box-sizing: border-box;
  }
}

@media screen and (width >= 768px) {
  .container {
    max-width: 80%;
  }

  .card-container {
    display: flex;
    padding: 2rem;
  }

  .img-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card-img {
    border-radius: 50%;
    aspect-ratio: 1 / 1;
    height: auto;
  }

  .card-content-container {
    flex: 3;
    padding: 0;
    padding-left: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .btn-container {
    margin-bottom: 0.5rem;
    margin-top: 0;
    width: 70%;
  }

  .user-name {
    text-align: start;
  }

  .user-description {
    font-size: 1rem;
    margin-top: -0.1rem;
  }
}

@media screen and (width >= 1024px) {
  .container {
    max-width: 880px;
  }

  .card-content-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>
