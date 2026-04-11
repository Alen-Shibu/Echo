import {create} from 'zustand'
import api from '../api/axios.js'
import toast from 'react-hot-toast';

export const useChatStore = create((set,get) => ({
    messages:[],
    chats:[],
    contacts:[],
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) ?? true,
    activeTab: "chats",
    selectedUser: null,
    isMessagesLoading: false,
    isUsersLoading: false,

    toggleSound : () => {
        localStorage.getItem("isSoundEnabled",!get().isSoundEnabled)
        set({isSoundEnabled: !get().isSoundEnabled})
    },

    setActiveTab: (activeTab) => set({activeTab}),
    setSelectedUser: (selectedUser) => set({selectedUser}),

    getAllContacts: async() => {
        try {
            set({isUsersLoading: true})
            const res = await api.get('/message/contacts')
            set({contacts: res.data})
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            set({isUsersLoading: false})
        }
    },

    getAllChats: async() => {
        try {
            set({isUsersLoading: true})
            const res = await api.get('/message/chats')
            set({chats: res.data})
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            set({isUsersLoading: false})
        }
    },

    getAllMessages: async(userId) => {
        try {
            set({isMessagesLoading: true})
            const res = await api.get(`/message/${userId}`)
            set({messages: res.data})
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            set({isMessagesLoading: false})
        }
    },

    sendMessage: async(userId, text, image = null) => {
        try {
            const res = await api.post(`/message/send/${userId}`, { text, image })
            set((state) => ({ messages: [...state.messages, res.data] }))
            return res.data
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
            throw error
        }
    }
}))
