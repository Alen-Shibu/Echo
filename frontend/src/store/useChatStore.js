import {create} from 'zustand'
import api from '../api/axios.js'
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore.js';

export const useChatStore = create((set, get) => ({
    messages: [],
    chats: [],
    contacts: [],
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) ?? true,
    activeTab: "chats",
    selectedUser: null,
    isMessagesLoading: false,
    isUsersLoading: false,
    isInitialized: false,

    toggleSound: () => {
        const newState = !get().isSoundEnabled
        localStorage.setItem("isSoundEnabled", newState)
        set({ isSoundEnabled: newState })
    },

    setActiveTab: (activeTab) => set({ activeTab }),
    
    setSelectedUser: (selectedUser) => set({ selectedUser }),

initializeChat: async () => {
  const authUser = useAuthStore.getState().authUser;
  if (!authUser) return;   // 🔥 ADD THIS

  if (get().isInitialized) return;

  set({ isUsersLoading: true });

  try {
    await Promise.all([
      get().getAllContacts(),
      get().getAllChats()
    ]);

    set({ isInitialized: true });
  } catch (error) {
    console.error("Failed to initialize chat:", error);
  } finally {
    set({ isUsersLoading: false });
  }
},

    getAllContacts: async () => {
        try {
            const res = await api.get('/message/contacts')
            set({ contacts: res.data })
            return res.data
        } catch (error) {
            if (error.response?.status !== 401) {
                toast.error(error.response?.data?.message || "Failed to load contacts")
            }
            return []
        }
    },

    getAllChats: async () => {
        try {
            const res = await api.get('/message/chats')
            set({ chats: res.data })
            return res.data
        } catch (error) {
            if (error.response?.status !== 401) {
                toast.error(error.response?.data?.message || "Failed to load chats")
            }
            return []
        }
    },

    getAllMessages: async (userId) => {
        if (!userId) return
        try {
            set({ isMessagesLoading: true })
            const res = await api.get(`/message/${userId}`)
            set({ messages: res.data })
            return res.data
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load messages")
            return []
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessage: async (userId, payload) => {
        if (!userId) throw new Error("No user selected")
        try {
            const res = await api.post(`/message/send/${userId}`, payload)
            set((state) => ({ messages: [...state.messages, res.data] }))
            get().getAllChats()
            return res.data
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message")
            throw error
        }
    },

    reset: () => {
        set({
            messages: [],
            chats: [],
            contacts: [],
            selectedUser: null,
            isInitialized: false,
            isMessagesLoading: false,
            isUsersLoading: false
        })
    }
}))