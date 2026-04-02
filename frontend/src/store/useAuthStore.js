import {create} from 'zustand'
import api from '../api/axios.js'
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser:null,
    isCheckingAuth: true,
    isRegistering: false,
    isLoggingIn: false,

    checkAuth: async() => {
        try {
            const res = await api.get("/auth/check")
            set({authUser: res.data})
        } catch (error) {
            console.log('User Not Authenticated Yet',error)
            set({authUser: null})
        } finally {
            set({isCheckingAuth: false})
        }
    },

    register: async(data) => {
        try {
            set({isRegistering: true})
            const res = await api.post("/auth/register",data)
            set({authUser:res.data})
            toast.success("Registered Successfully")
        } catch (error) {
            toast.error(error.response.data.message || "Registration Failed")
        } finally{
            set({isRegistering: false})
        }
    },

    login: async(data) => {
        try {
            set({isLoggingIn:true})
            const res = await api.post('/auth/login',data)
            set({authUser:res.data})
            toast.success("LoggedIn successfully")
        } catch (error) {
            toast.error(error.response.data.message || "Login Failed")
        } finally {
            set({isLoggingIn:false})
        }
    },
}))