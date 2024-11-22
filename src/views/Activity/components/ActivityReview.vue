<script setup>
import { ref, computed } from "vue";
import {
	NavArrowLeft,
	ThumbsUp,
	CheckCircle,
	CheckCircleSolid,
	FireFlame,
	Leaf,
	ArrowUpLeftSquareSolid,
	Search,
} from "@iconoir/vue";

const attendee = ref([
	{
		id: 1,
		name: "參加人01",
		avatar: "../../../assets/avatar.png",
		number: "@2af60e4cc341a435",
		message:"好期待這次的遊戲類型會是什麼！",
		date:'周一,11月18日 2024',
		approved: false,
	},
	{
		id: 2,
		name: "參加人02",
		avatar: "../../../assets/avatar.png",
		number: "@1ih499f304ja8v77",
		message:"第一次參加，團主帶帶我！",
		date:'周日,11月17日 2024',
		approved: false,
	},
]);

//切換報名,截止報名功能
const registrationStatus = ref("open");
const toggleRegistration = (status) => {
	if (status === "closed") {
		// 使用原生 confirm
		const checkClose = confirm("您是否確認截止報名？");
		if (!checkClose) return; // 如果選擇取消，直接返回
		registrationStatus.value = "closed"; // 更新狀態
	} else if (status === "open") {
		// 使用原生 confirm
		const checkOpen = confirm("您是否確認開放報名？");
		if (!checkOpen) return; // 如果選擇取消，直接返回
		registrationStatus.value = "open"; // 更新狀態
	}
};

const handleAttendeeClick = (callback) => {
	if (registrationStatus.value === "closed") {
		// 使用原生 alert 提示
		alert("目前已截止報名，請返回開放報名以調整參加資格。");
		return;
	}
	callback(); // 若狀態為 "open"，執行傳入的回調
};

// 切換審核狀態
const toggleApproval = (id) => {
	const approvalAttendee = attendee.value.find((item) => item.id === id);
	const message = approvalAttendee.approved
		? `您確定要解除 ${approvalAttendee.name} 的參加資格嗎？`
		: `您確定要允許 ${approvalAttendee.name} 參加嗎？`;

	// 彈出確認框，點擊「取消」直接返回
	if (!confirm(message)) {
		return; // 點擊取消時直接結束函數
	}

	// 切換審核狀態
	approvalAttendee.approved = !approvalAttendee.approved;
};

// 審核的人數計算
const approvedCount = computed(() => {
	return attendee.value.filter((item) => item.approved).length;
});

// 快速回覆的視窗狀態和選擇
const quickReplyVisible = ref(false); // 快速回覆視窗
const selectedReplies = ref([]); // 預設回復選項
const sentReplies = ref([]); // 送出回覆

// 快速回覆的選項
const replyOptions = [
	"審核時間未到，請耐心等候",
	"抱歉目前額滿，候補將優先審核您",
	"抱歉已經額滿，歡迎下次再來",
	"若您能邀請一位女性朋友報名，將優先審核",
	"若您能邀請一位男性朋友報名，將優先審核",
	"若您能邀請一位朋友報名，將優先審核",
	"歡迎報名我的其他揪團",
];

// 顯示快速回覆視窗
const showQuickReply = () => {
	quickReplyVisible.value = true;
};

// 隱藏快速回覆視窗
const hideQuickReply = () => {
	quickReplyVisible.value = false;
};

// 送出選擇的回覆語句
const sendReplies = () => {
	sentReplies.value = [...selectedReplies.value]; // 保存選擇的回覆
	selectedReplies.value = []; // 清空已選擇的回覆
	hideQuickReply(); // 隱藏快速回覆視窗
};
</script>

<template>
	<div id="review" class="m-5 max-w-[768px]">
		<div class="my-2">
			<a href="#"><NavArrowLeft width="32px" height="32" /></a>
		</div>
		<div class="text-2xl font-bold text-gray-700">審核列表</div>

		<div class="flex items-center bg-gray-100 rounded-xl p-3 my-4 text-sm font-semibold">
			<img src="../assets/pass.png" alt="" class="w-8" />{{ attendee.length }} 位報名( {{ approvedCount }}位審核通過)
		</div>

		<div class="flex bg-gray-100 border-solid border-2 border-gray-200 rounded-full text-center max-w-[768px]">
			<div
				@click="toggleRegistration('open')"
				:class="{
					'bg-yellow-400': registrationStatus === 'open',
					'bg-gray-100 text-gray-500': registrationStatus !== 'open',
				}"
				class="w-1/2 p-1 text-sm rounded-full cursor-pointer transition-all"
			>
				<a href="#">開放報名</a>
			</div>
			<div
				@click="toggleRegistration('closed')"
				:class="{
					'bg-yellow-400': registrationStatus === 'closed',
					'bg-gray-100 text-gray-500': registrationStatus !== 'closed',
				}"
				class="w-1/2 p-1 text-sm rounded-full cursor-pointer transition-all"
			>
				<a href="#">截止報名</a>
			</div>
		</div>

		<div class="mx-2 flex items-center bg-gray-100 text-gray-400 my-3 rounded-full transition-all duration-200">
			<input
				type="text"
				placeholder="🔍請輸入會員名稱進行搜尋"
				class="bg-gray-100 h-10 w-full outline-none outline-[3px] focus:outline-yellow-400 p-2 rounded-full transition-all"
			/>
		</div>

		<div class="flex flex-col bg-gray-50 p-5 my-7 w-full rounded-xl text-blue-600 font-semibold">
			<div class="flex items-center mb-1 text-[14px]">
				<ThumbsUp width="18" height="18" />

				<div class="mx-2">審核不受限</div>
			</div>
			<div class="text-xs font-normal">
				你可以審核擁有此徽章的報名者，不會有人數限制。如果審核沒有此徽章的報名者，需要使用額外的酒杯來增加名額，你也可以升級VIP會員來解除限制。
			</div>
		</div>

		<!-- 未審核通過時畫面 -->
		<div
			v-for="(item, index) in attendee"
			:key="item.id"
			
			class="flex flex-col text-gray-500 rounded-3xl my-2"
		>
			<div class="flex py-3 px-1 rounded-2xl bg-gray-50  transition-all duration-75"
			:class="[
				item.approved
					? 'border-yellow-400 border-4 rounded-2xl  transition-all duration-75'
					: 'border-4 border-solid border-gray-100 transition-all duration-200',
			]">
				<div class="mx-2 w-1/12">
					<img src="../assets/avatar.png" class="w-[60px] rounded-full" alt="" />
				</div>
				<div class="flex flex-col w-11/12 mx-2">
					<div class="text-sm">{{ item.name }}</div>
					<div class="my-1 text-xs">{{ item.number }}</div>
					<div class="flex">
						<div
							class="flex flex-row justify-center items-center text-[10px] text-red-500 border-solid border-2 border-red-500 px-1 rounded-md"
						>
							<FireFlame width="13" height="13" />10
						</div>
						<div
							class="flex flex-row justify-center items-center bg-green-100 text-[10px] text-green-500 border-solid border-2 border-green-500 px-1 ml-1 rounded-md"
						>
							<leaf width="13" height="13" />新手
						</div>
					</div>
					<div class="flex items-center mt-2">
						<div class="w-1 h-4 rounded-full bg-blue-600"></div>
						<div class="ml-2 mr-1 text-xs font-semibold">審核不受限</div>
						<ThumbsUp width="16" height="16" />
					</div>
				</div>

				<div class="flex flex-col justify-center items-center w-3/12">
					<p v-if="!item.approved" class="text-xs text-gray-400 my-1">尚未審核</p>
					<p v-else class="flex justify-center items-center text-xs text-green-600 my-1">
						審核已通過<CheckCircleSolid width="14" height="14" />
					</p>
					<button
						@click="handleAttendeeClick(() => toggleApproval(item.id))"
						:class="[
							'flex justify-center items-center w-28 h-7 py-1 border-2 rounded-md text-sm hover:scale-105 transition-all',
							item.approved
								? 'bg-red-500 text-gray-100 border-red-600 font-semibold'
								: 'hover:bg-yellow-400 hover:text-yellow-700 border-gray-300 hover:border-yellow-500',
							registrationStatus === 'closed' ? 'opacity-50 cursor-not-allowed' : '', // 禁用樣式
						]"
						:disabled="registrationStatus === 'closed'"
					>
						{{ item.approved ? "解除參加資格" : "允許參加" }}
					</button>
				</div>
				
			</div>
			<div class="flex flex-col text-gray-500 m-2">
				<div class="text-gray-700 text-[12px]">{{item.message}}</div>
				<div class="flex items-center text-sm">
					<div class="text-[10px]">{{item.date}}</div>
					<button @click="showQuickReply" class="flex items-center ml-3 text-xs text-black hover:text-yellow-600">
						快速回覆
						<ArrowUpLeftSquareSolid width="14" height="14" class="mx-1" />
					</button>
				</div>
			</div>
			<!-- <div class="flex flex-col text-gray-500 mt-3">
			<div class="text-gray-700 text-[14px]">希望可以跟團主一起出去</div>
			<div class="flex items-center text-sm">
				<div class="text-xs">周一,11月18日 2024</div>
				<button @click="showQuickReply" class="flex ml-3 text-black hover:text-yellow-600">
					快速回覆
					<ArrowUpLeftSquareSolid width="18" height="18" class="mx-1" />
				</button>
			</div> -->
		</div>

		<!-- 快速回覆視窗 -->
		<div
			v-if="quickReplyVisible"
			class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
		>
			<div class="bg-white p-10 rounded-lg w-[460px] shadow-lg">
				<div class="text-lg font-semibold">快速回覆</div>
				<div>
					<label
						v-for="(option, index) in replyOptions"
						:key="index"
						class="flex items-center mb-2 px-3 py-1 rounded-md cursor-pointer hover:bg-yellow-100 hover:scale-105 transition-all"
					>
						<input type="checkbox" v-model="selectedReplies" :value="option" class="mr-2 accent-yellow-400" />
						{{ option }}
					</label>
				</div>
				<div class="flex justify-between mt-4">
					<button
						@click="hideQuickReply"
						class="bg-gray-200 py-2 px-4 rounded hover:bg-gray-300 hover:scale-105 transition-all"
					>
						取消
					</button>
					<button
						@click="sendReplies"
						class="bg-yellow-300 py-2 px-4 rounded hover:bg-yellow-400 hover:scale-105 transition-all"
					>
						送出
					</button>
				</div>
			</div>
		</div>

		<!-- 顯示送出的回覆內容 -->
		<div v-if="sentReplies.length" class="w-full my-2 p-3 border-[1px] bg-gray-50 border-solid rounded-xl">
			<h3 class="font-semibold text-sm mb-1 text-gray-600">團主回覆：</h3>
			<div v-for="(reply, index) in sentReplies" :key="index" class="">
				<div class="rounded-full w-96 text-sm text-gray-600">
					{{ reply }}
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
