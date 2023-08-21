<template>
	<el-form
		:model="form"
		:rules="formRules"
		ref="formRef"
		label-width="120px"
		label-position="left"
		status-icon
	>
		<el-form-item
			label="Tên đăng nhập"
			prop="tk"
			v-if="!edit"
		>
			<el-input
				placeholder="Tên đăng nhập"
				v-model="form.tk"
			></el-input>
		</el-form-item>

		<el-form-item label="Mật khẩu" prop="mk" v-if="!edit">
			<el-input
				placeholder="Mật khẩu"
				type="password"
				v-model="form.mk"
			></el-input>
		</el-form-item>

		<el-form-item label="Họ tên" prop="ten">
			<el-input
				placeholder="Họ tên"
				v-model="form.ten"
			></el-input>
		</el-form-item>

		<el-form-item label="Số CCCD" prop="cccd">
			<el-input
				placeholder="Số CCCD"
				v-model="form.cccd"
			></el-input>
		</el-form-item>

		<el-form-item label="Số điện thoại" prop="sdt">
			<el-input
				placeholder="Số điện thoại"
				v-model="form.sdt"
			></el-input>
		</el-form-item>

		<el-form-item label="Chiều cao (cm)" prop="chieucao">
			<el-input-number
				class="w-100"
				placeholder="Chiều cao"
				v-model="form.chieucao"
			></el-input-number>
		</el-form-item>

		<el-form-item label="Cân nặng (kg)" prop="cannang">
			<el-input-number
				class="w-100"
				placeholder="Cân nặng"
				v-model="form.cannang"
			></el-input-number>
		</el-form-item>

		<el-form-item label="Giới tính" prop="gender">
			<el-select class="w-100" v-model="form.gioitinh">
				<el-option label="Nam" :value="true"></el-option>
				<el-option label="Nữ" :value="false"></el-option>
			</el-select>
		</el-form-item>

		<el-form-item label="Ngày sinh" prop="ngaysinh">
			<el-date-picker
				placeholder="Ngày sinh"
				v-model="form.ngaysinh"
				format="DD/MM/YYYY"
				class="w-100"
			></el-date-picker>
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
	edit: Boolean,
});

const emits = defineEmits(["update:submit"]);

const form = reactive(
	props.value || {
		tk: "",
		mk: "",
		ngaysinh: "",
		gioitinh: true,
		cccd: "",
		sdt: "",
		ten: "",
		chieucao: 0,
		cannang: 0,
	}
);

const formRules = reactive<FormRules>({
	tk: [
		{
			required: true,
			message: "Vui lòng nhập username",
		},
	],
	mk: [
		{
			required: true,
			message: "Vui lòng nhập password",
		},
	],
	ngaysinh: [
		{
			required: true,
			message: "Vui lòng nhập ngày sinh",
		},
	],
	cccd: [
		{
			required: true,
			message: "Vui lòng nhập CCCD",
		},
	],
	sdt: [
		{
			required: true,
			message: "Vui lòng nhập số điện thoại",
		},
		{
			min: 10,
			max: 11,
			message: "Độ dài của số điện thoại phải từ 10 - 11",
		},
	],
	ten: [{ required: true, message: "Vui lòng nhập tên" }],
	chieucao: [
		{ required: true, message: "Vui lòng nhập chiều cao" },
	],
	cannang: [
		{ required: true, message: "Vui lòng nhập chiều cao" },
	],
});

const formRef = ref<FormInstance>(null);

function handleSubmit() {
	formRef.value.validate((valid) => {
		if (!valid) return;
		emits("update:submit", form);
	});
}
</script>
