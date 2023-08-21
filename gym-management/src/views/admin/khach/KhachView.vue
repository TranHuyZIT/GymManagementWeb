<template>
	<el-page-header v-if="khach" @back="$router.back">
		<template #content>
			<div v-html="ten"></div>
		</template>
	</el-page-header>

	<el-main v-if="khach">
		<el-descriptions title="Thông tin khách hàng">
			<el-descriptions-item label="Tên">
				{{ khach.ten }}
			</el-descriptions-item>

			<el-descriptions-item label="Giới tính">
				{{ khach.gioitinh ? "Nam" : "Nữ" }}
			</el-descriptions-item>

			<el-descriptions-item label="Ngày sinh">
				{{ dayjs(khach.ngaysinh).format("DD/MM/YYYY") }}
			</el-descriptions-item>

			<el-descriptions-item label="Số điện thoại">
				{{ khach.sdt }}
			</el-descriptions-item>
		</el-descriptions>

		<el-descriptions title="Thông tin gói">
			<el-descriptions-item label="Ngày hết hạn PT">
				{{
					khach.ngayHetHanPT
						? dayjs(khach.ngayHetHanPT).format("DD/MM/YYYY")
						: "Chưa có"
				}}
			</el-descriptions-item>

			<el-descriptions-item label="Ngày hết hạn tập">
				{{
					khach.ngayHetHanTap
						? dayjs(khach.ngayHetHanTap).format(
								"DD/MM/YYYY"
						  )
						: "Chưa có"
				}}
			</el-descriptions-item>
		</el-descriptions>

		<h6 class="mt-4 mb-4">Gói tập</h6>

		<el-table :data="khach.dkytap">
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

		<h6 class="mt-4 mb-4">Gói PT</h6>

		<el-table :data="khach.dkypt">
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
	</el-main>
</template>

<script setup>
import { dayjs } from "element-plus";
import formatter from "@/utils/formatter";
</script>

<script>
import khachService from "@/services/khach.service";

export default {
	data() {
		return { khach: null, ten: null };
	},
	mounted() {
		khachService
			.getById(this.$route.params.id)
			.then((res) => {
				this.khach = res;
				this.ten = res.ten;
			});
	},
};
</script>
