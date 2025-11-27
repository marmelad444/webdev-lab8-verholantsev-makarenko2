// store/useUserStore.js
import { create } from 'zustand'

export const useUserStore = create((set) => ({
    session: JSON.parse(localStorage.getItem('user-session') || 'null'),
    
    setSession: (data) => {
        set({ session: data })
        localStorage.setItem('user-session', JSON.stringify(data))
    },
    
    clearSession: () => {
        set({ session: null })
        localStorage.removeItem('user-session')
    }
}))