<template>
	<header
		class="header-area header-sticky"
		:style="{
			background:
				$route.path !== '/' ? '#000' : '#ffffff10',
		}"
	>
		<div class="container">
			<div class="row">
				<div class="col-12">
					<nav class="main-nav">
						<router-link to="/" class="logo"
							>Tran<em> Huy</em></router-link
						>
						<ul class="nav">
							<li class="scroll-to-section">
								<router-link to="/">Home</router-link>
							</li>

							<li class="scroll-to-section">
								<router-link to="/goi-pt">PT</router-link>
							</li>

							<li class="scroll-to-section">
								<router-link to="/goi-tap"
									>Gói tập</router-link
								>
							</li>

							<el-dropdown
								trigger="click"
								v-if="userStore.currentUser"
							>
								<el-button icon="arrow-down">
									{{ userStore.currentUser.info.ten }}
								</el-button>
								<template #dropdown>
									<el-dropdown-menu>
										<router-link to="/hoa-don">
											<el-dropdown-item>
												Hóa đơn
											</el-dropdown-item>
										</router-link>

										<router-link
											to="/admin"
											v-if="userStore.currentUser.laadmin"
										>
											<el-dropdown-item>
												Quản trị
											</el-dropdown-item>
										</router-link>

										<el-dropdown-item @click="logout">
											Đăng xuất
										</el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>

							<li
								v-if="!userStore.currentUser"
								class="scroll-to-section"
							>
								<router-link to="/auth/login">
									Login
								</router-link>
							</li>
							<li
								v-if="!userStore.currentUser"
								class="main-button"
							>
								<router-link to="/auth/sign-up">
									Sign Up
								</router-link>
							</li>
						</ul>
						<a class="menu-trigger">
							<span>Menu</span>
						</a>
					</nav>
				</div>
			</div>
		</div>
	</header>
</template>

<script lang="ts" setup>
import Token from "@/utils/token";
import { ElButton } from "element-plus";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";

const router = useRouter();

const userStore = useUserStore();
const logout = () => {
	Token.token = null;
	userStore.setUser(null);
	router.push("/auth/login");
};
</script>

<style scoped>
.dialog-footer button:first-child {
	margin-right: 10px;
}
.dialog {
	transition: all 0.1s linear;
}
</style>
