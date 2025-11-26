import { create } from "zustand";
import { api } from "../api/api";

export const useItemStore = create((set) => ({
    item: [],
    getItem: async () => {
        try {
            const res = await api.getItem()
            set({item: res})
        } catch (error) {
            console.error(error)
        }
    }
}))