<script setup>
import formatter from "@/utils/formatter";
</script>
<template>
	<el-card shadow="hover">
		<div class="p-2">
			<h5>{{ pt.ten }}</h5>

			<el-divider></el-divider>

			<p>
				{{ pt.mota }}
			</p>

			<el-divider></el-divider>

			<p>
				<el-icon><Money /></el-icon>
				{{ formatter.format(pt.gia) }}
			</p>

			<p>
				<el-icon><Timer /></el-icon>
				{{ pt.songay }} ngày
			</p>

			<el-divider></el-divider>

			<router-link :to="`/goi-pt/${pt._id}/dang-ky`">
				<el-button
					class="w-100"
					type="primary"
					:loading="loading"
					>Đăng ký</el-button
				>
			</router-link>
		</div>
	</el-card>
</template>

<script>
export default {
	props: ["pt"],
	data() {
		return { loading: false };
	},
};
</script>
