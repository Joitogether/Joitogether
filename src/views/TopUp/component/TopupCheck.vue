<script>

</script>
<template>
  <body>
    <div>
      <div class="text-center mb-6">
        <div class="border-2 rounded-md mt-4 py-4 font-title text-2xl">儲值確認</div>
      </div>
      <div class="mx-10">
        <div class="first-area-title flex items-center mb-4">
          <div
            class="flex items-center justify-center border-2 rounded-full w-[40px] h-[40px] text-lg"
          >
            1
          </div>
          <span class="ml-4 text-lg">餘額</span>
        </div>
        <div class="first-area-bottom grid grid-cols-12 mb-6">
          <div
            class="img-container overflow-hidden col-start-2 rounded-full grid- w-16 h-16 aspect-square"
          >
            <img class="card-img w-full relative" :src="user.photo_url" alt="personImg" />
          </div>
          <div class="block col-span-2">
            <div class="text-lg mb-1">{{ user.display_name }}</div>
            <div class="text-lg mb-1">{{ user.email }}</div>
          </div>
          <div class="py-2 col-span-2">目前富有程度：💰{{ user.pocket_money }}</div>
        </div>
        <div class="second-area-title flex items-center mb-4">
          <div
            class="flex items-center justify-center border-2 rounded-full w-[40px] h-[40px] text-lg"
          >
            2
          </div>
          <span class="ml-4 text-lg">本次儲值金額</span>
          <form ref="paymentForm" :action="paymentConfig.PayGateWay" >
            <input type="hidden" name="MerchantID" :value="paymentConfig.MerchantID">
            <input type="hidden" name="TradeInfo" :value="order.aesEncrypt">
            <input type="hidden" name="TradeSha" :value="order.shaEncrypt">
            <input type="hidden" name="Version" :value="paymentConfig.Version">
          </form>
        </div>
        <div class="flex justify-center mt-10">
          <div class="amount-input flex mr-5 items-center">
            金額：
            <n-input-number :min="1" :value="amount" placeholder="也可自訂金額唷" />
          </div>
          <div class="topup-button">
            <n-button
              type="warning"
              class="text-center border-2 rounded-md py-2 px-10 text-lg"
              @click="createOrder"
            >
              立即儲值
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>
