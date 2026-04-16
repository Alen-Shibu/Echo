// frontend/src/store/useSocketStore.js
import { create } from 'zustand'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

export const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],

  connectSocket: (userId) => {
    if (get().socket?.connected) return   // already connected

    const socket = io(SOCKET_URL, {
      query: { userId },
      withCredentials: true
    })

    socket.on("onlineUsers", (users) => {
      set({ onlineUsers: users })
    })

    set({ socket })
  },

  disconnectSocket: () => {
    get().socket?.disconnect()
    set({ socket: null, onlineUsers: [] })
  }
}))