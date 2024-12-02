<script async setup>
import { ref, onMounted } from 'vue';
import { ProfileCircle, BrightStar, Heart, Post, Group } from '@iconoir/vue';
import { RouterLink, RouterView } from 'vue-router'
import axios from 'axios';
import CardList from './component/CardList.vue'
import EditModal from './component/EditModal.vue';
import { UserGetApi } from '../../../apis/UserApi';

const showModal = ref(false)
const editingItem = ref(null)
const editingType = ref(null)
const currentUser = ref(null);
const user = ref(null);
const loading = ref(true);
const errorMessage = ref(null);
const userUid = '3465767889ddgijjljk';

const fetchUserData = async () => {
  try {
    const result = await UserGetApi(userUid);
    console.log('API回傳資料:', result);

    if (result) {
      user.value = result;
      loading.value = false;
      return user.value
    }
  } catch (err) {
    errorMessage.value = err.message || '資料加載錯誤';
    loading.value = false;
  }
    };

    onMounted(() => {
      fetchUserData();
    });



// 編輯
const handleEdit = (item, type) => {
  editingItem.value = { ...item }; // 深拷贝
  editingType.value = type; // 设置类型
  showModal.value = true;  // 显示编辑弹窗
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
