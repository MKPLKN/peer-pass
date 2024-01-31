import { defineStore } from 'pinia'

const { ipcRenderer } = window

export const usePasswordStore = defineStore('passwords', {
  state: () => ({
    passwords: []
  }),
  getters: {
    hasPasswords: (state) => state.passwords.length > 0
  },
  actions: {
    async getAnswers (id) {
      return await ipcRenderer.invoke('answers/index', { id })
    },
    async checkAnswer (id, { userInput, triggerType }) {
      return await ipcRenderer.invoke('answers/store', { id, userInput, triggerType })
    },
    async getPasswords () {
      this.passwords = await ipcRenderer.invoke('passwords/index')
    },
    async addPassword (newCard) {
      const { success, password } = await ipcRenderer.invoke(
        'passwords/store',
        { ...newCard }
      )
      if (success) {
        this.passwords.push(password)
      } else {
        console.log('Something went wrong!')
      }
    },
    updatePassword (id, updatedPassword) {
      const index = this.passwords.findIndex((f) => f.id === id)
      if (index !== -1) {
        this.passwords[index] = updatedPassword
      }
    },
    async deletePassword (id) {
      await ipcRenderer.invoke('passwords/destroy', id)
      await this.getpasswords()
    },
    getPasswordById (id) {
      return this.passwords.find((f) => f.id === id)
    }
  }
})
