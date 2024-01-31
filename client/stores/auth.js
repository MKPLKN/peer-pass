import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false
  }),
  actions: {
    setAuthStatus (status) {
      this.isAuthenticated = status
    }
  }
})
