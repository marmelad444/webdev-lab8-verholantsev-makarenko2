import { create } from 'zustand'
import { api } from '../api/api'

export const useItemStore = create((set, get) => ({
  // Состояние
  items: [],
  stats: null,
  loadingItems: false,
  error: null,
  currentItem: null,
  itemBids: [],
  myBids: [],
  actionInProgress: false,

  // Действия для товаров
  fetchItems: async () => {
    set({ loadingItems: true, error: null })
    try {
      const items = await api.getItems()
      set({ items })
    } catch (error) {
      set({ error: error.message })
    } finally {
      set({ loadingItems: false })
    }
  },

  fetchStats: async () => {
    try {
      const stats = await api.getStats()
      set({ stats })
    } catch (error) {
      set({ error: error.message })
    }
  },

  fetchItem: async (id) => {
    set({ loadingItem: true, error: null })
    try {
      const currentItem = await api.getItem(id)
      set({ currentItem })
    } catch (error) {
      set({ error: error.message })
    } finally {
      set({ loadingItem: false })
    }
  },

  fetchItemBids: async (id) => {
    try {
      const itemBids = await api.getItemBids(id)
      set({ itemBids })
    } catch (error) {
      set({ error: error.message })
    }
  },

  fetchMyBids: async () => {
    try {
      const myBids = await api.getMyBids()
      set({ myBids })
    } catch (error) {
      set({ error: error.message })
    }
  },

  createItem: async (itemData) => {
    set({ actionInProgress: true, error: null })
    try {
      const newItem = await api.createItem(itemData)
      set((state) => ({ items: [...state.items, newItem] }))
      return newItem
    } catch (error) {
      set({ error: error.message })
      throw error
    } finally {
      set({ actionInProgress: false })
    }
  },

  createBid: async (itemId, amount) => {
    set({ actionInProgress: true, error: null })
    try {
      const newBid = await api.createBid(itemId, amount)
      
      // Обновляем ставки для текущего товара
      set((state) => ({ 
        itemBids: [...state.itemBids, newBid]
      }))
      
      // Обновляем текущий товар если он загружен
      const { currentItem } = get()
      if (currentItem && currentItem.id === itemId) {
        set({
          currentItem: {
            ...currentItem,
            highestBid: Math.max(currentItem.highestBid || 0, amount),
            bidCount: (currentItem.bidCount || 0) + 1
          }
        })
      }
      
      return newBid
    } catch (error) {
      set({ error: error.message })
      throw error
    } finally {
      set({ actionInProgress: false })
    }
  },

  deleteItem: async (itemId) => {
    set({ actionInProgress: true, error: null })
    try {
      await api.deleteItem(itemId)
      set((state) => ({ 
        items: state.items.filter(item => item.id !== itemId)
      }))
    } catch (error) {
      set({ error: error.message })
      throw error
    } finally {
      set({ actionInProgress: false })
    }
  },

  resetItemState: () => {
    set({ 
      currentItem: null, 
      itemBids: [], 
      error: null 
    })
  }
}))