<template>
	<div class="container" v-auto-animate>
		<h2 class="mt-2 mb-2">Các gói đã đăng ký</h2>

		<h4 class="mt-2 mb-2">Gói tập</h4>

		<el-table
			:data="dkytap"
			:row-class-name="tableRowClassName"
			v-if="loaded"
		>
			<el-table-column
				prop="goitap.ten"
				label="Tên gói"
			></el-table-column>

			<el-table-column
				prop="ngaydk"
				label="Ngày đăng ký"
			></el-table-column>

			<el-table-column
				prop="ngayhethan"
				label="Ngày hết hạn"
			></el-table-column>

			<el-table-column
				prop="daduyet"
				label="Trạng thái"
			></el-table-column>
		</el-table>

		<table-skeleton v-else></table-skeleton>

		<h4 class="mt-2 mb-2">Gói PT</h4>

		<el-table
			:data="dkypt"
			:row-class-name="tableRowClassName"
			v-if="loaded"
		>
			<el-table-column
				prop="goipt.ten"
				label="Tên gói"
			></el-table-column>

			<el-table-column
				prop="ngaydk"
				label="Ngày đăng ký"
			></el-table-column>

			<el-table-column
				prop="ngayhethan"
				label="Ngày hết hạn"
			></el-table-column>

			<el-table-column
				prop="daduyet"
				label="Trạng thái"
			></el-table-column>
		</el-table>

		<table-skeleton v-else></table-skeleton>
	</div>
</template>

<script>
import khachService from "@/services/khach.service";
import { useUserStore } from "@/stores/user";
import { dayjs } from "element-plus";
import TableSkeleton from "@/components/Skeleton/TableSkeleton.vue";

export default {
	components: { TableSkeleton },
	data() {
		return {
			dkypt: [],
			dkytap: [],
			loaded: false,
		};
	},
	mounted() {
		const userStore = useUserStore();
		khachService
			.getById(userStore.currentUser.info._id)
			.then((res) => {
				this.dkypt = res.dkypt.map((e) => {
					e.ngaydk = dayjs(e.ngaydk).format("DD/MM/YYYY");
					e.ngayhethan = dayjs(e.ngayhethan).format(
						"DD/MM/YYYY"
					);
					e.daduyet = e.isChecked
						? "Đã duyệt"
						: "Chưa duyệt";
					return e;
				});
				this.dkytap = res.dkytap.map((e) => {
					e.ngaydk = dayjs(e.ngaydk).format("DD/MM/YYYY");
					e.ngayhethan = dayjs(e.ngayhethan).format(
						"DD/MM/YYYY"
					);
					e.daduyet = e.isChecked
						? "Đã duyệt"
						: "Chưa duyệt";
					return e;
				});
			})
			.finally(() => {
				this.loaded = true;
			});
	},
	methods: {
		tableRowClassName({ row }) {
			if (row.isChecked) {
				return "success-row";
			}
			return "";
		},
	},
};
</script>

<style>
.el-table .success-row {
	--el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
