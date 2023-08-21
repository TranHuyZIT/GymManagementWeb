<template>
	<div class="container">
		<div class="row">
			<div class="col col-12 col-md-6">
				<h2 class="mt-4 mb-4">Đăng nhập</h2>

				<el-form
					:rules="formRules"
					:model="form"
					ref="formRef"
					status-icon
					label-width="120px"
					label-position="left"
				>
					<el-form-item label="Tên tài khoản" prop="tk">
						<el-input
							v-model="form.tk"
							placeholder="Tên tài khoản"
						></el-input>
					</el-form-item>

					<el-form-item label="Mật khẩu" prop="mk">
						<el-input
							v-model="form.mk"
							placeholder="Mật khẩu"
							type="password"
						></el-input>
					</el-form-item>

					<el-form-item>
						<el-button
							type="primary"
							@click="login"
							:loading="loading"
						>
							Login
						</el-button>
					</el-form-item>

					<el-form-item>
						<p>
							Chưa có tài khoản?
							<router-link to="/auth/sign-up">
								Đăng ký
							</router-link>
						</p>
					</el-form-item>
				</el-form>
			</div>
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

const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);
const form = reactive({
	tk: "",
	mk: "",
});

const formRef = ref<FormInstance>(null);

const formRules = reactive<FormRules>({
	tk: [
		{ required: true, message: "Please enter username" },
	],
	mk: [
		{ required: true, message: "Please enter password" },
	],
});

function login() {
	formRef.value.validate(async (valid) => {
		if (!valid) return;
		try {
			loading.value = true;
			const token = await authService.login(form);

			Token.token = token.toString();
			const currentUser = await authService.getIdentity();

			userStore.setUser(currentUser);
			router.push("/");
		} catch (error) {
			console.log(error);

			ElNotification.error(error.response.data.message);
		} finally {
			loading.value = false;
		}
	});
}
</script>
