<template>
	<el-card shadow="hover">
		<div class="p-2">
			<h6>{{ goitap.ten }}</h6>

			<p>{{ goitap.mota }}</p>

			<el-divider></el-divider>

			<p>
				<el-icon><Timer></Timer></el-icon>
				{{ goitap.songay }} ngày
			</p>

			<p>
				<el-icon><Money></Money></el-icon>
				{{ formatter.format(goitap.gia) }}
			</p>

			<el-divider></el-divider>

			<el-button
				type="primary"
				class="w-100"
				@click="visible = true"
			>
				Đăng ký
			</el-button>
		</div>
	</el-card>

	<el-dialog v-model="visible">
		<template #header="{ titleId, titleClass }">
			<div class="my-header">
				<h4 :id="titleId" :class="titleClass">
					Đăng ký gói tập
				</h4>
			</div>
		</template>

		<h5>{{ goitap.ten }}</h5>

		<p>{{ goitap.mota }}</p>

		<el-divider></el-divider>

		<p>
			<el-icon>
				<Timer></Timer>
			</el-icon>

			<span class="ml-2">{{ goitap.songay }} ngày</span>
		</p>

		<p>
			<el-icon>
				<Money></Money>
			</el-icon>

			<span class="ml-2"
				>{{ formatter.format(goitap.gia) }}
			</span>
		</p>

		<template #footer>
			<el-button @click="visible = false">Hủy</el-button>
			<el-button
				@click="subscribe"
				type="success"
				:loading="loading"
			>
				Xác nhận - {{ formatter.format(goitap.gia) }}
			</el-button>
		</template>
	</el-dialog>
</template>

<script setup>
import hoadonService from "@/services/hoadon.service";
import formatter from "@/utils/formatter";
import { ElNotification } from "element-plus";
import { defineProps, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const loading = ref(false);
const visible = ref(false);

const props = defineProps({
	goitap: Object,
});

async function subscribe() {
	try {
		loading.value = true;
		await hoadonService.create({
			dkytap: [
				{ magoitap: props.goitap._id, ngaydk: Date.now() },
			],
			dkypt: [],
		});
		
		ElNotification.success("Đăng ký thành công");
		router.push("/hoa-don");
	} catch (error) {
		ElNotification.error(error.response.data.message);
	} finally {
		loading.value = false;
		visible.value = false;
	}
}
</script>
