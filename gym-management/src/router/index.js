import authService from "@/services/auth.service";
import { useUserStore } from "@/stores/user";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/goi-pt",
			component: () => import("@/views/GoiPtView.vue"),
		},
		{
			path: "/goi-pt/:id/dang-ky",
			component: () =>
				import("@/views/goi-pt/DangKyView.vue"),
			meta: { transition: "slide-right" },
		},
		{
			path: "/goi-tap",
			component: () => import("@/views/GoiTapView.vue"),
		},
		{
			path: "/hoa-don",
			component: () => import("@/views/HoaDonView.vue"),
		},
		{
			path: "/auth/login",
			component: () => import("@/views/auth/LoginView.vue"),
			beforeEnter() {
				const userStore = useUserStore();

				if (userStore.currentUser) return "/";
			},
		},
		{
			path: "/auth/sign-up",
			component: () =>
				import("@/views/auth/SignUpView.vue"),
			beforeEnter() {
				const userStore = useUserStore();

				if (userStore.currentUser) return "/";
			},
		},
		{
			path: "/admin",
			redirect: "/admin/goi-tap",
			children: [
				{
					path: "/admin/goi-tap",
					component: () =>
						import("@/views/admin/GoiTapView.vue"),
				},
				{
					path: "/admin/goi-pt",
					component: () =>
						import("@/views/admin/GoiPtView.vue"),
				},
				{
					path: "/admin/pt",
					component: () =>
						import("@/views/admin/PtView.vue"),
				},
				{
					path: "/admin/khach",
					component: () =>
						import("@/views/admin/KhachView.vue"),
				},
				{
					path: "/admin/khach/:id",
					component: () =>
						import("@/views/admin/khach/KhachView.vue"),
				},
				{
					path: "/admin/hoa-don/chua-duyet",
					component: () =>
						import("@/views/admin/hoadon/ChuaDuyet.vue"),
				},
				{
					path: "/admin/hoa-don/da-duyet",
					component: () =>
						import("@/views/admin/hoadon/DaDuyet.vue"),
				},
			],
			meta: {
				layout: "admin",
			},
			beforeEnter() {
				const userStore = useUserStore();

				if (!userStore.currentUser.laadmin) return "/";
			},
		},
	],
});

router.beforeEach(async (to) => {
	const userStore = useUserStore();
	try {
		if (!userStore.currentUser) {
			const currentUser = await authService.getIdentity();

			userStore.setUser(currentUser);
		}
	} catch (error) {
		console.log(error);
	}

	if (to.path !== "/" && !to.path.startsWith("/auth")) {
		if (!userStore.currentUser) return "/auth/login";
	}
});

export default router;
