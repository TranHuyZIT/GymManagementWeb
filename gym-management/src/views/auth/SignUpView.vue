<template>
	<div class="container">
		<div class="row">
			<div class="col col-12">
				<h2 class="mt-4 mb-4">Sign up</h2>
			</div>

			<el-form
				:model="form"
				:rules="formRules"
				class="col col-12 row"
				ref="formRef"
				label-width="120px"
				label-position="left"
				status-icon
			>
				<div class="col col-12 col-md-6">
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

					<el-form-item label="Ngày sinh" prop="ngaysinh">
						<el-date-picker
							placeholder="Ngày sinh"
							v-model="form.ngaysinh"
							format="DD/MM/YYYY"
							class="w-100"
						></el-date-picker>
					</el-form-item>
				</div>

				<div class="col col-12 col-md-6">
					<el-form-item label="Tên đăng nhập" prop="tk">
						<el-input
							placeholder="Tên đăng nhập"
							v-model="form.tk"
						></el-input>
					</el-form-item>

					<el-form-item label="Mật khẩu" prop="mk">
						<el-input
							placeholder="Mật khẩu"
							type="password"
							v-model="form.mk"
						></el-input>
					</el-form-item>

					<el-form-item label="Giới tính" prop="gender">
						<el-select
							class="w-100"
							v-model="form.gioitinh"
						>
							<el-option
								label="Nam"
								:value="true"
							></el-option>
							<el-option
								label="Nữ"
								:value="false"
							></el-option>
						</el-select>
					</el-form-item>
				</div>

				<div class="col col-12">
					<el-button
						type="primary"
						:loading="loading"
						@click="signUp"
					>
						Đăng ký
					</el-button>
					<p class="mt-2">
						Bạn đã có tài khoản?
						<router-link to="/auth/login">
							Đăng nhập
						</router-link>
					</p>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script lang="ts" setup>
import authService from "@/services/auth.service";
import { useUserStore } from "@/stores/user";
import Token from "@/utils/token";
import {
	ElNotification,
	FormInstance,
	FormRules,
} from "element-plus";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const loading = ref<Boolean>(false);

const formRef = ref<FormInstance>(null);

const form = reactive({
	tk: "",
	mk: "",
	ngaysinh: "",
	gioitinh: true,
	cccd: "",
	sdt: "",
	ten: "",
});

const formRules = reactive<FormRules>({
	tk: [
		{
			required: true,
			message: "Please input username",
		},
	],
	mk: [
		{
			required: true,
			message: "Please input password",
		},
	],
	ngaysinh: [
		{
			required: true,
			message: "Please input date of birth",
		},
	],
	gender: [
		{
			message: "Please input gender",
		},
	],
	cccd: [
		{
			required: true,
			message: "Please input CCCD",
		},
	],
	sdt: [
		{
			required: true,
			message: "Please input phone number",
		},
	],
	ten: [
		{ required: true, message: "Please input your name" },
	],
});

function signUp() {
	formRef.value.validate(async (valid) => {
		if (!valid) return;

		try {
			loading.value = true;
			const payload = { user: form, khach: form };

			await authService.register(payload);

			const token = await authService.login(form);

			Token.token = token.toString();

			const currentUser = await authService.getIdentity();

			userStore.setUser(currentUser);

			router.push("/");
		} catch (error) {
			ElNotification.error(error.response.data.message);
		} finally {
			loading.value = false;
		}
	});
}
</script>
