import {create} from 'zustand'
import api from '../api/axios.js'
import toast from 'react-hot-toast';
import { useChatStore } from './useChatStore.js';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isRegistering: false,
    isLoggingIn: false,

    checkAuth: async () => {
        try {
            const res = await api.get("/auth/check")
            set({ authUser: res.data, isCheckingAuth: false })
            // IMPORTANT: trigger chat init here
            useChatStore.getState().initializeChat()
            return res.data
        } catch (error) {
            console.log(error)
            set({ authUser: null, isCheckingAuth: false })
            return null
        }
    },

    register: async (data) => {
        try {
            set({ isRegistering: true })
            const res = await api.post("/auth/register", data)
            set({ authUser: res.data })
            toast.success("Registered Successfully")
            return res.data
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration Failed")
            throw error
        } finally {
            set({ isRegistering: false })
        }
    },

    login: async (data) => {
        try {
            set({ isLoggingIn: true })
            const res = await api.post('/auth/login', data)
            set({ authUser: res.data })
            toast.success("Logged in successfully")
            return res.data
        } catch (error) {
            toast.error(error.response?.data?.message || "Login Failed")
            throw error
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout')
            set({ authUser: null })
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout Failed")
        }
    }
}))