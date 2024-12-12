<script setup>

</script>
<template>
  <div class="w-[375px] bg-white rounded-lg shadow-md p-4">
    <header class="flex justify-center items-center mb-6">
      <h1 class="font-title text-lg text-neutral-950">儲值設定</h1>
    </header>
    <section class="mb-6">
      <div class="flex justify-between items-center">
        <span class="text-neutral-950 font-medium">開啟自動儲值功能</span>
        <label class="relative inline-block w-[42px] h-[26px]">
          <input type="checkbox" class="sr-only peer"/>
          <span class="absolute inset-0 bg-neutral-300 rounded-full transition peer-checked:bg-primary-500"></span>
          <span class="absolute top-1 left-1 w-[22px] h-[22px] bg-white rounded-full transition peer-checked:translate-x-full"></span>
        </label>
      </div>
      <p class="text-neutral-500 text-sm mt-2"> 開啟功能後，當您的全支付帳戶付帳或轉帳餘額不足時，將先計算差額並自動透過您指定的銀行帳戶儲值以順利完成交易。更貼心的是，您可隨時取消此服務。 </p>
    </section>
    <section class="mb-6">
      <span class="text-neutral-950 font-medium">扣款銀行帳戶</span>
      <div class="border border-neutral-300 rounded-md p-4 flex justify-between items-center mt-2">
        <span class="text-neutral-950">玉山銀行帳戶</span>
        <div class="flex items-center">
          <span class="text-neutral-500 text-sm mr-2">*12345</span>
          <i class="material-symbols-outlined text-neutral-500">expand_more</i>
        </div>
      </div>
    </section>
    <section class="mb-6">
      <div class="flex flex-col space-y-6">
          <span class="text-neutral-950 font-medium">單筆儲值上限金額</span>
          <div class="flex items-center border-b border-neutral-300 mt-2">
            <span class="text-neutral-950 text-xl font-medium">NT$</span>
            <input type="number" class="ml-2 flex-1 outline-none text-neutral-950 text-xl placeholder-neutral-500" placeholder="0"/>
          </div>
          <div>
            <span class="text-neutral-950 font-medium">每日累積儲值上限金額</span>
            <div class="flex items-center border-b border-neutral-300 mt-2">
                <span class="text-neutral-950 text-xl font-medium">NT$</span>
                <input type="number" class="ml-2 flex-1 outline-none text-neutral-950 text-xl placeholder-neutral-500" placeholder="0"/>
            </div>
          </div>
      </div>
    </section>
      <button class="w-full h-[48px] mt-2 bg-neutral-300 text-neutral-500 rounded-md"> 確認 </button>
  </div>
</template>


