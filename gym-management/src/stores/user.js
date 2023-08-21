import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
	state: () => ({ currentUser: null, token: null }),
	getters: {
		user: (state) => state.currentUser,
	},
	actions: {
		setUser(user) {
			this.$state.currentUser = user;
		},
	},
});
