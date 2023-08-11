import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({ currentUser: null, token: null }),
  getters: {
    user: () => this.$state.currentUser,
    token: () => this.$state.token
  },
  actions: {
    setUser: (user) => {
      this.$state.currentUser = user
    },
    setToken: (token) => {
      this.$state.token = token
    }
  }
})
