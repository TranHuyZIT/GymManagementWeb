<script setup>
import { dayjs } from "element-plus";
</script>
<template>
	<div v-if="loaded" class="mt-4 row">
		<div class="col-2 row justify-content-end">
			<el-button
				:type="!activeMic ? 'info' : 'success'"
				@mousedown="record"
				@mouseup="stopRecord"
				:icon="Microphone"
			>
			</el-button>
		</div>
		<div class="col-10">
			<el-input
				v-model="term"
				placeholder="Please input"
				class="input-with-select"
			>
				<template #append>
					<el-select
						v-model="searchBy"
						placeholder="Chọn"
						style="width: 115px"
					>
						<el-option label="Tên Khách" value="ten" />
						<el-option label="SĐT" value="sdt" />
						<el-option label="CCCD" value="cccd" />
					</el-select>
				</template>
			</el-input>
		</div>
	</div>
	<el-table
		table-layout="auto"
		:data="khach"
		v-loading="!loaded"
	>
		<el-table-column label="STT">
			<template #default="scope">
				{{ scope.$index + 1 }}
			</template>
		</el-table-column>
		<el-table-column
			prop="ten"
			label="Họ tên"
		></el-table-column>

		<el-table-column label="Giới tính">
			<template #default="{ row }">
				{{ row.gioitinh ? "Nam" : "Nữ" }}
			</template>
		</el-table-column>

		<el-table-column label="Ngày sinh">
			<template #default="{ row }">
				{{ dayjs(row.ngaysinh).format("DD/MM/YYYY") }}
			</template>
		</el-table-column>

		<el-table-column
			prop="sdt"
			label="Số điện thoại"
		></el-table-column>

		<el-table-column
			prop="dkytap.length"
			label="Số gói tập"
		></el-table-column>

		<el-table-column
			prop="dkypt.length"
			label="Số gói PT"
		></el-table-column>

		<el-table-column label="Xem chi tiết">
			<template #default="{ row }">
				<el-button
					icon="view"
					@click="$router.push(`/admin/khach/${row._id}`)"
				>
					Xem chi tiết
				</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>

<script>
import khachService from "@/services/khach.service";
import audioService from "@/services/audio.service";
import { Microphone } from "@element-plus/icons-vue";
export default {
	data() {
		return {
			khach: [],
			loaded: false,
			searchBy: "",
			term: "",
			isRecording: false,
		};
	},
	methods: {
		record() {
			if (this.isRecording) return;
			this.device = navigator.mediaDevices
				.getUserMedia({
					audio: true,
				})
				.then((stream) => {
					this.mediaRecorder = new MediaRecorder(stream);
					let chunks = [];
					this.mediaRecorder.ondataavailable = (e) => {
						chunks.push(e.data);
					};

					this.mediaRecorder.onstop = () => {
						const blob = new Blob(chunks, {
							type: "audio/wav",
						});
						chunks = [];
						audioService
							.sendSpeechAudio(blob)
							.then((res) => {
								return res.data;
							})
							.then((data) => {
								console.log(data);
								console.log(data.hypotheses[0].utterance);
								this.term = data.hypotheses[0].utterance
									.replace(".", "")
									.trim();
							})
							.catch((err) => {
								console.log(err);
							});
					};
					this.isRecording = true;

					this.mediaRecorder.start();
				});
		},
		stopRecord() {
			this.mediaRecorder.stop();
			this.isRecording = false;
		},
	},
	watch: {
		searchBy: function () {
			this.term = "";
			khachService
				.getAll()
				.then((res) => {
					this.khach = res.data;
				})
				.finally(() => {
					this.loaded = true;
				});
		},
		term: function () {
			if (!this.searchBy) return;
			clearTimeout(this.timeOut);
			this.timeOut = setTimeout(() => {
				this.loaded = false;
				khachService
					.getAllWithParams({
						searchBy: this.searchBy,
						term: this.term.trim().replace(".", ""),
					})
					.then((res) => {
						this.khach = res.data;
					})
					.finally(() => {
						this.loaded = true;
					});
			}, 500);
		},
	},
	mounted() {
		khachService
			.getAll()
			.then((res) => {
				this.khach = res.data;
			})
			.finally(() => {
				this.loaded = true;
			});
	},
	computed: {
		activeMic: {
			get() {
				return !!this.isRecording;
			},
		},
	},
};
</script>
