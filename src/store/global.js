import { defineStore } from 'pinia'

export const globalStore = defineStore('global', {
    state: () => {
        return {
            token: false
        }
    },
    getters: {
        getToken: (state) => {
            state.token = localStorage.getItem("token")
            return state.token
        },
    },
    actions: {
        setToken(token) {
            localStorage.setItem("token", token);
            this.token=token
        }
    }
})