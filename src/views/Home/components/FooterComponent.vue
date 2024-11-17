<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import { Instagram, Facebook, Play, AppleShortcuts, AppleMac } from "@iconoir/vue";
</script>

<template>
	<footer>
		<div class="bg-[#afac99] w-screen h-72 py-10 px-32 overflow-x-scroll scrollbar-hidden">
			<div class="flex">
				<div class="leading-8 w-3/12 min-w-72">
					<div class="text-xl font-semibold">更多</div>
					<div class=""><a href="#" class="">註冊會員</a></div>
					<div class=""><a href="#" class="">升級會員</a></div>
					<div class=""><a href="#" class="">PRO認證會員</a></div>
					<div class=""><a href="#" class="">交友小技巧</a></div>
					<div class=""><a href="#" class="">聚會主題推薦</a></div>
				</div>
				<div class="leading-8 w-3/12 min-w-72">
					<div class="text-xl font-semibold">幫助</div>
					<div class=""><a href="#" class="">社群守則</a></div>
					<div class=""><a href="#" class="">使用者指南 </a></div>
					<div class=""><a href="#" class="">常見問題 </a></div>
				</div>
				<div class="leading-8 w-3/12 min-w-72">
					<div class="text-xl font-semibold">關於我們</div>
					<div class=""><a href="#" class="">加入我們</a></div>
				</div>
				<div class="leading-8 w-3/12 min-w-72">
					<div class="text-xl font-semibold">聯繫我們</div>
					<div class="">
						<a href="https://eatgether.com/zh-tw/service@eatgether.com" class="font-thin">service@eatgether.com </a>
					</div>
					<div class="flex gap-3">
						<div class="bg-[#3d392c] flex p-1.5 rounded-full text-white">
							<a href="https://www.instagram.com/eatgether_official/"><Instagram /></a>
						</div>
						<div class="bg-[#3d392c] flex p-1.5 rounded-full text-white">
							<a href="https://www.facebook.com/eatgether"><Facebook /></a>
						</div>
						<div class="bg-[#3d392c] flex p-1.5 rounded-full text-white">
							<a href="https://www.youtube.com/channel/UCcZ7tJEscY294rxTEohxQhw"><Play /></a>
						</div>
						<div class="bg-[#3d392c] flex p-1.5 rounded-full text-white">
							<a href="https://play.google.com/store/apps/details?id=com.eatme.eatgether&hl=zh-TW"
								><AppleShortcuts
							/></a>
						</div>
						<div class="bg-[#3d392c] flex p-1.5 rounded-full text-white">
							<a href="https://apps.apple.com/tw/app/id1121788143"><AppleMac /></a>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="lg:flex lg:flex-row lg:justify-between items-center flex flex-col bg-[#3d392c] w-screen h-24 px-6 py-4">
			<div class="text-white text-base font-semibold" >
				Eatgether樂宇宙科技股份有限公司 © 2022 Funiverse Co., LTD. All rights reserved. 統一編號 24545707
			</div>
			<div class="text-white text-base font-semibold">
				｜<a href="https://eatgether.com/zh-tw/privacy" class="text-white">隱私權政策</a>｜<a
					href="https://eatgether.com/zh-tw/terms"
					class="text-white"
					>使用者條款</a
				>｜
			</div>
		</div>


	</footer>
</template>

<style scoped>
.scrollbar-hidden::-webkit-scrollbar {
	display: none; /* Chrome, Safari 和 Opera 隱藏滾動條 */}
</style>
