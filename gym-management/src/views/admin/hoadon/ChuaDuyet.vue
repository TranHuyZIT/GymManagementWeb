<template>
	<div v-if="loaded" class="my-4 row">
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
				v-model="name"
				placeholder="Please input"
				class="input-with-select"
			>
			</el-input>
		</div>
	</div>
	<el-table v-loading="!loaded" :data="hoadon">
		<el-table-column label="STT">
			<template #default="{ $index }">
				{{ $index + 1 }}
			</template>
		</el-table-column>

		<el-table-column label="Thông tin khách hàng">
			<el-table-column
				label="Họ tên"
				prop="khach.ten"
			></el-table-column>

			<el-table-column
				label="Số điện thoại"
				prop="khach.sdt"
			></el-table-column>
		</el-table-column>

		<el-table-column label="Thông tin hóa đơn">
			<el-table-column label="Gói tập">
				<template #default="{ row }">
					{{ row.dkytap.length }}
				</template>
			</el-table-column>
			<el-table-column label="Gói PT">
				<template #default="{ row }">
					{{ row.dkypt.length }}
				</template>
			</el-table-column>

			<el-table-column label="Tổng tiền">
				<template #default="{ row }">
					{{ formatter.format(row.tongtien) }}
				</template>
			</el-table-column>
		</el-table-column>

		<el-table-column label="Duyệt">
			<template #default="{ row }">
				<el-button
					type="success"
					plain
					class="w-100"
					:loading="loading"
					@click="applyPayload = row"
				>
					<el-icon>
						<circle-plus></circle-plus>
					</el-icon>
					Duyệt
				</el-button>
			</template>
		</el-table-column>
	</el-table>

	<el-dialog v-model="checkDialog" :key="applyPayload?._id">
		<template #header>
			<h4>Duyệt hóa đơn</h4>
		</template>

		<div v-if="checkDialog">
			<el-descriptions title="Thông tin khách hàng">
				<el-descriptions-item label="Họ tên">
					{{ applyPayload.khach.ten }}
				</el-descriptions-item>

				<el-descriptions-item label="Số điện thoại">
					{{ applyPayload.khach.sdt }}
				</el-descriptions-item>
			</el-descriptions>

			<el-table :data="applyPayload.dkytap">
				<el-table-column label="STT">
					<template #default="{ $index }">
						{{ $index + 1 }}
					</template>
				</el-table-column>

				<el-table-column
					label="Tên gói"
					prop="goitap.ten"
				></el-table-column>

				<el-table-column
					label="Số ngày"
					prop="goitap.songay"
				></el-table-column>

				<el-table-column label="Ngày đăng ký">
					<template #default="{ row }">
						{{ dayjs(row.ngaydk).format("DD/MM/YYYY") }}
					</template>
				</el-table-column>

				<el-table-column label="Ngày hết hạn">
					<template #default="{ row }">
						{{ dayjs(row.ngayhethan).format("DD/MM/YYYY") }}
					</template>
				</el-table-column>

				<el-table-column label="Giá">
					<template #default="{ row }">
						{{ formatter.format(row.goitap.gia) }}
					</template>
				</el-table-column>
			</el-table>

			<el-table :data="applyPayload.dkypt">
				<el-table-column label="STT">
					<template #default="{ $index }">
						{{ $index + 1 }}
					</template>
				</el-table-column>

				<el-table-column
					label="Tên gói"
					prop="goipt.ten"
				></el-table-column>

				<el-table-column
					label="Số ngày"
					prop="goipt.songay"
				></el-table-column>

				<el-table-column label="Ngày đăng ký">
					<template #default="{ row }">
						{{ dayjs(row.ngaydk).format("DD/MM/YYYY") }}
					</template>
				</el-table-column>

				<el-table-column label="Ngày hết hạn">
					<template #default="{ row }">
						{{ dayjs(row.ngayhethan).format("DD/MM/YYYY") }}
					</template>
				</el-table-column>

				<el-table-column label="Giá">
					<template #default="{ row }">
						{{ formatter.format(row.goipt.gia) }}
					</template>
				</el-table-column>
			</el-table>

			<el-descriptions title="Tổng">
				<el-descriptions-item label="Ngày lập">
					{{
						dayjs(applyPayload.ngaylap).format(
							"HH:mm, DD/MM/YYYY"
						)
					}}
				</el-descriptions-item>

				<el-descriptions-item label="Tổng tiền">
					{{ formatter.format(applyPayload.tongtien) }}
				</el-descriptions-item>
			</el-descriptions>
		</div>

		<template #footer>
			<el-popconfirm
				confirm-button-text="Xóa"
				cancel-button-text="Hủy"
				title="Bạn có chắc chắn muốn xóa hóa đơn này?"
				@confirm="handleDelete(applyPayload._id)"
			>
				<template #reference>
					<el-button
						type="danger"
						plain
						icon="delete"
						:loading="loading"
					>
						Xóa
					</el-button>
				</template>
			</el-popconfirm>
			<el-button
				:loading="loading"
				type="success"
				icon="check"
				@click="handleCheck(applyPayload._id)"
			>
				Duyệt
			</el-button>
		</template>
	</el-dialog>
</template>

<script setup>
import formatter from "@/utils/formatter";
import { ElNotification, dayjs } from "element-plus";
import audioService from "@/services/audio.service";
import { Microphone } from "@element-plus/icons-vue";
</script>

<script>
import hoadonService from "@/services/hoadon.service";

export default {
	data() {
		return {
			hoadon: [],
			loaded: false,
			applyPayload: null,
			loading: false,
			isRecording: false,
			name: "",
		};
	},
	mounted() {
		hoadonService
			.getAll()
			.then((res) => {
				this.hoadon = res.data.filter((e) => !e.isChecked);
			})
			.finally(() => {
				this.loaded = true;
			});
	},
	watch: {
		name: function () {
			clearTimeout(this.timeOut);
			this.timeOut = setTimeout(() => {
				this.loaded = false;
				hoadonService
					.getAllWithParams({
						name: this.name.trim().replace(".", ""),
					})
					.then((res) => {
						this.hoadon = res.data.filter(
							(e) => !e.isChecked
						);
					})
					.finally(() => {
						this.loaded = true;
					});
			}, 300);
		},
	},
	methods: {
		async handleDelete(id) {
			try {
				this.loading = true;
				await hoadonService.delete(id);
				this.hoadon = this.hoadon.filter(
					(e) => e._id !== id
				);
				ElNotification.info("Đã xóa hóa đơn");
			} catch (error) {
				ElNotification.error(error.response.data.message);
			} finally {
				this.loading = false;
				this.checkDialog = false;
			}
		},
		async handleCheck(id) {
			try {
				this.loading = true;
				await hoadonService.check(id);
				this.hoadon = this.hoadon.filter(
					(e) => e._id !== id
				);
				ElNotification.success("Đã duyệt hóa đơn");
			} catch (error) {
				ElNotification.error(error.response.data.message);
			} finally {
				this.loading = false;
				this.checkDialog = false;
			}
		},
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
								this.name = data.hypotheses[0].utterance
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
	computed: {
		checkDialog: {
			get() {
				return !!this.applyPayload;
			},
			set() {
				this.applyPayload = null;
			},
		},
		activeMic: {
			get() {
				return !!this.isRecording;
			},
		},
	},
};
</script>
