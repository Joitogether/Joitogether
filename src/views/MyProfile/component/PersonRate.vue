<script setup>
import { UserGetApi } from '../../../../apis/UserApi'
import { reactive, ref } from 'vue'
import { ArrowLeft, Heart, Search, HeartSolid } from '@iconoir/vue'
import { NProgress, NDropdown, NButton, NRate } from 'naive-ui'

const user = ref(null)
const loading = ref(true)
const errorMessage = ref(null)
const userUid = '3465767889ddgijjljk'

const fetchUserData = async () => {
  try {
    const result = await UserGetApi(userUid)
    console.log('API回傳資料:', result)

    if (result) {
      user.value = result
      loading.value = false
      return user.value
    }
  } catch (err) {
    errorMessage.value = err.message || '資料加載錯誤'
    loading.value = false
  }
}

onMounted(() => {
  fetchUserData()
})

const comment = reactive([
  {
    id: 1,
    userId: 1,
    imgUrl:
      'https://img.lovepik.com/png/20231015/cute-japanese-cartoon-lucky-cat-tradition-white-isolated_216931_wh300.png',
    userName: '王大錘',
    location: '台北',
    content: '今天在這裡玩很開心謝謝大家。',
    updatedAt: '2024年11月21日',
    likesCount: 5,
  },
  {
    id: 2,
    userId: 2,
    imgUrl:
      'https://img.lovepik.com/original_origin_pic/18/05/27/4d8b100fc94de5d7840560f6f7da77f4.png_wh300.png',
    userName: '李小明',
    location: '台中',
    content: '環境很好，主辦方很專業。',
    updatedAt: '2024年11月20日',
    likesCount: 5,
  },
])
</script>

<template>
  <div class="mx-6 mt-6">
    <section class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <div>
          <div class="text-center">
            <section>
              <h2 class="flex justify-center m-2">
                <div><Heart width="50" height="50" /></div>
                <div class="text-5xl">0.00</div>
              </h2>
              <p></p>
            </section>
          </div>
          <div class="mb-3">
            <ol>
              <li class="flex">
                5
                <n-progress
                  type="line"
                  color="green"
                  :percentage="60"
                  indicator-placement="inside"
                  processing
                />
              </li>
              <li class="flex">
                4
                <n-progress
                  type="line"
                  color="green"
                  :percentage="60"
                  indicator-placement="inside"
                  processing
                />
              </li>
              <li class="flex">
                3
                <n-progress
                  type="line"
                  color="green"
                  :percentage="60"
                  indicator-placement="inside"
                  processing
                />
              </li>
              <li class="flex">
                2
                <n-progress
                  type="line"
                  color="green"
                  :percentage="60"
                  indicator-placement="inside"
                  processing
                />
              </li>
              <li class="flex">
                1
                <n-progress
                  type="line"
                  color="green"
                  :percentage="60"
                  indicator-placement="inside"
                  processing
                />
              </li>
            </ol>
          </div>
          <div class="mb-2">
            <h3 class="text-lg">評價細項</h3>
          </div>
          <div class="">
            <div class="flex border-b-4">
              <div><Heart /></div>
              <div class="flex justify-between w-full">
                <div>親切度</div>
                <div>5</div>
              </div>
            </div>

            <div class="flex border-b-4">
              <div><Heart /></div>
              <div class="flex justify-between w-full">
                <div>主辦能力</div>
                <div class="">5</div>
              </div>
            </div>
            <div class="flex border-b-4">
              <div><Heart /></div>
              <div class="flex justify-between w-full">
                <div>信用度</div>
                <div class="justify-self-end">5</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="border-b-4 mb-5">
          <div class="flex justify-between mb-4">
            <div class="m-auto text-xl">？？則評價</div>
            <div>
              <n-dropdown trigger="click" :options="options" @select="handleSelect">
                <n-button>最新</n-button>
              </n-dropdown>
            </div>
          </div>
          <div class="flex flex-wrap mb-4">
            <div><Search /></div>
            <label for="reviews-search-input">
              <input type="text" id="reviews-search-input" placeholder="搜尋評價"
            /></label>
          </div>
        </div>
        <div class="mt-2">
          <div class="mb-4">
            <div v-for="userPost in comment" :key="userPost.id" class="mb-6">
              <section class="flex gap-2">
                <div class="max-w-[44px] max-h-[44px]">
                  <a href=""><img :src="userPost.imgUrl" class="rounded-full" /></a>
                </div>
                <div>
                  <h2>{{ userPost.userName }}</h2>
                  <div>{{ userPost.location }}</div>
                </div>
              </section>
              <div class="flex">
                <div class="flex items-center mb-2">
                  <n-rate color="red" readonly :default-value="3">
                    <n-icon size="2x">
                      <HeartSolid />
                    </n-icon>
                  </n-rate>
                </div>
                <div>・</div>
                {{ userPost.updatedAt }}
              </div>
              <div>
                <span>{{ userPost.content }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
