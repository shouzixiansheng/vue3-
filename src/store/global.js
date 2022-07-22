import { defineStore } from 'pinia'

export const globalStore = defineStore('global', {
    state: () => {
        return {
            token: false
        }
    },
    getters: {
        getToken: (state) => {
            return state.token
        },
    },
    actions: {
        setToken(token) {
            this.token=token
        }
    }
})