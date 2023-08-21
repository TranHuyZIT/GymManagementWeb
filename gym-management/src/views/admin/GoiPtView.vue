<script setup>
import formatter from "@/utils/formatter";
</script>
<template>
	<div class="mb-2">
		<el-button @click="addDialog = true">
			<el-icon><plus></plus></el-icon>
			Thêm
		</el-button>
	</div>
	<el-table :data="goipt" v-loading="!loaded">
		<el-table-column label="STT">
			<template #default="scope">
				{{ scope.$index + 1 }}
			</template>
		</el-table-column>
		<el-table-column label="Thông tin chung">
			<el-table-column
				prop="ten"
				label="Tên gói"
			></el-table-column>

			<el-table-column
				prop="mota"
				label="Mô tả"
			></el-table-column>

			<el-table-column
				prop="songay"
				label="Số ngày"
			></el-table-column>

			<el-table-column label="Giá">
				<template #default="scope">
					{{ formatter.format(scope.row.gia) }}</template
				>
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
						title="Bạn có chắc chắn muốn xóa gói này?"
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
			<h4>Thêm gói PT</h4>
		</template>

		<goi-pt-form
			:loading="loading"
			@update:submit="handleCreate"
		></goi-pt-form>
	</el-dialog>

	<el-dialog v-model="updateDialog">
		<template #header>
			<h4>Chỉnh sửa gói PT</h4>
		</template>

		<goi-pt-form
			:key="updatePayload?._id"
			:loading="loading"
			:value="updatePayload"
			@update:submit="handleUpdate"
		></goi-pt-form>
	</el-dialog>
</template>

<script>
import GoiPtForm from "@/forms/GoiPtForm.vue";
import goiptService from "@/services/goipt.service";
import { ElNotification } from "element-plus";

export default {
	components: { GoiPtForm },
	data() {
		return {
			goipt: [],
			addDialog: false,
			loading: false,
			updatePayload: null,
			loaded: false,
		};
	},
	mounted() {
		goiptService
			.getAll()
			.then((res) => {
				this.goipt = res.data;
			})
			.finally(() => {
				this.loaded = true;
			});
	},
	methods: {
		async handleCreate(payload) {
			try {
				this.loading = true;
				const res = await goiptService.create(payload);
				this.goipt.push(res);
				ElNotification.success("Thêm gói tập thành công");
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
				await goiptService.delete(id);

				this.goipt = this.goipt.filter((e) => e._id !== id);
			} catch (error) {
				ElNotification.error(error.response?.data.message);
			} finally {
				this.loading = false;
			}
		},
		async handleUpdate(payload) {
			try {
				this.loading = true;
				await goiptService.update(payload._id, payload);
				this.goipt = this.goipt.map((e) => {
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
