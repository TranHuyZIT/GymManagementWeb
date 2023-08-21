<template>
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

		<el-table-column label="Xem chi tiết">
			<template #default="{ row }">
				<el-button
					type="default"
					plain
					class="w-100"
					:loading="loading"
					@click="applyPayload = row"
				>
					<el-icon><View /></el-icon>
					Xem
				</el-button>
			</template>
		</el-table-column>
	</el-table>

	<el-dialog v-model="checkDialog" :key="applyPayload?._id">
		<template #header>
			<h4>Hóa đơn</h4>
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
		</template>
	</el-dialog>
</template>

<script setup>
import formatter from "@/utils/formatter";
import { ElNotification, dayjs } from "element-plus";
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
		};
	},
	mounted() {
		hoadonService
			.getAll()
			.then((res) => {
				this.hoadon = res.data.filter((e) => e.isChecked);
			})
			.finally(() => {
				this.loaded = true;
			});
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
	},
};
</script>
