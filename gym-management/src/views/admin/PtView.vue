<script setup>
import { dayjs } from "element-plus";
</script>
<template>
	<div class="mb-2">
		<el-button @click="addDialog = true">
			<el-icon><plus></plus></el-icon>
			Thêm
		</el-button>
	</div>
	<el-table :data="pt" v-loading="!loaded">
		<el-table-column label="STT">
			<template #default="scope">
				{{ scope.$index + 1 }}
			</template>
		</el-table-column>
		<el-table-column label="Thông tin chung">
			<el-table-column
				prop="ten"
				label="Họ tên"
			></el-table-column>

			<el-table-column label="Cân nặng">
				<template #default="{ row }">
					{{ row.cannang }}Kg
				</template>
			</el-table-column>

			<el-table-column label="Chiều cao">
				<template #default="{ row }">
					{{ row.chieucao }}cm
				</template>
			</el-table-column>

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
		</el-table-column>

		<el-table-column label="Hành động">
			<el-table-column label="Chỉnh sửa">
				<template #default="scope">
					<el-button
						type="primary"
						icon="edit"
						:loading="loading"
						@click="updatePayload = scope.row"
					>
						Chỉnh sửa
					</el-button>
				</template>
			</el-table-column>
			<el-table-column label="Xóa">
				<template #default="scope">
					<el-popconfirm
						title="Bạn có chắc chắn muốn xóa PT này?"
						@confirm="handleDelete(scope.row._id)"
					>
						<template #reference>
							<el-button icon="delete" :loading="loading">
								Xóa
							</el-button>
						</template>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table-column>
	</el-table>

	<el-dialog v-model="addDialog">
		<template #header>
			<h4>Thêm PT</h4>
		</template>

		<pt-form
			:loading="loading"
			@update:submit="handleCreate"
		></pt-form>
	</el-dialog>

	<el-dialog v-model="updateDialog">
		<template #header>
			<h4>Chỉnh sửa thông tin PT</h4>
		</template>

		<pt-form
			edit
			:key="updatePayload?._id"
			:loading="loading"
			:value="updatePayload"
			@update:submit="handleUpdate"
		></pt-form>
	</el-dialog>
</template>

<script>
import PtForm from "@/forms/PtForm.vue";
import ptService from "@/services/pt.service";
import { ElNotification } from "element-plus";

export default {
	components: { PtForm },
	data() {
		return {
			pt: [],
			addDialog: false,
			loading: false,
			updatePayload: null,
			loaded: false,
		};
	},
	mounted() {
		ptService
			.getAll()
			.then((res) => {
				this.pt = res.data;
			})
			.finally(() => {
				this.loaded = true;
			});
	},
	methods: {
		async handleCreate(payload) {
			try {
				this.loading = true;
				const res = await ptService.create({
					user: payload,
					pt: payload,
				});
				this.pt.push(res);
				ElNotification.success("Thêm PT thành công");
			} catch (error) {
				ElNotification.error(error.response?.data.message);
			} finally {
				this.loading = false;
				this.addDialog = false;
			}
		},
		async handleDelete(id) {
			try {
				this.loading = true;
				await ptService.delete(id);

				this.goipt = this.pt.filter((e) => e._id !== id);
			} catch (error) {
				ElNotification.error(error.response?.data.message);
			} finally {
				this.loading = false;
			}
		},
		async handleUpdate(payload) {
			try {
				this.loading = true;
				await ptService.update(payload._id, payload);
				this.goipt = this.pt.map((e) => {
					if (e._id === payload._id) return payload;
					return e;
				});
			} catch (error) {
				ElNotification.error(error.response.data.message);
			} finally {
				this.loading = false;
				this.updateDialog = false;
			}
		},
	},
	computed: {
		updateDialog: {
			get() {
				return !!this.updatePayload;
			},
			set() {
				this.updatePayload = null;
			},
		},
	},
};
</script>
