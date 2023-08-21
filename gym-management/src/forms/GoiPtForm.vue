<template>
	<el-form
		:model="form"
		:rules="formRules"
		ref="formRef"
		label-width="120px"
		label-position="left"
		status-icon
	>
		<el-form-item label="Tên gói" prop="ten">
			<el-input
				v-model="form.ten"
				placeholder="Gói tập với PT 30 ngày"
			></el-input>
		</el-form-item>

		<el-form-item label="Mô tả" prop="mota">
			<el-input
				type="textarea"
				v-model="form.mota"
				placeholder="Tập 30 ngày xong tập tiếp 30 ngày nữa"
			></el-input>
		</el-form-item>

		<el-form-item label="Số ngày" prop="songay">
			<el-input-number
				class="w-100"
				v-model="form.songay"
			></el-input-number>
		</el-form-item>

		<el-form-item label="Giá (VND)" prop="gia">
			<el-input-number
				class="w-100"
				v-model="form.gia"
			></el-input-number>
		</el-form-item>

		<el-form-item>
			<el-button
				type="success"
				:loading="props.loading"
				@click="handleSubmit"
			>
				Xác nhận
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";

const props = defineProps({
	value: Object,
	loading: Boolean,
});

const emits = defineEmits(["update:submit"]);

const form = reactive(
	props.value || {
		ten: "",
		songay: 0,
		gia: 0,
		mota: "",
	}
);

const formRules = reactive<FormRules>({
	ten: [
		{ required: true, message: "Vui lòng nhập tên gói" },
		{ type: "string" },
	],
	songay: [
		{ required: true, message: "Vui lòng nhập số ngày" },
		{
			type: "number",
			message: "Số ngày phải lớn hơn 0",
			min: 1,
		},
	],
	gia: [
		{ required: true, message: "Vui lòng nhập giá gói" },
		{ type: "number" },
	],
	mota: [],
});

const formRef = ref<FormInstance>(null);

function handleSubmit() {
	formRef.value.validate((valid) => {
		if (!valid) return;
		emits("update:submit", form);
	});
}
</script>
