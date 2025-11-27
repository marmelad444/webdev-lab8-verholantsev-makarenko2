import axios from "axios"

const apiInstance = axios.create({
    baseURL: "https://kitek.ktkv.dev/marketplace/api/", // Изменил на marketplace
    headers: {
        "Content-Type": "application/json"
    }
})

// Исправленный интерцептор - не используем useUserStore в интерцепторе
apiInstance.interceptors.request.use((config) => {
    // Получаем сессию из localStorage напрямую
    try {
        const sessionStr = localStorage.getItem('user-session')
        if (sessionStr) {
            const session = JSON.parse(sessionStr)
            if (session?.token) {
                config.headers.Authorization = `Bearer ${session.token}`
            }
        }
    } catch (error) {
        console.error('Error getting session from localStorage:', error)
    }
    return config
})

// Обработка ошибок
apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Если токен невалидный, очищаем сессию
            localStorage.removeItem('user-session')
            window.location.href = '/signin'
        }
        return Promise.reject(error)
    }
)

// ===== АУТЕНТИФИКАЦИЯ =====
const registerUser = async (user) => {
    const res = await apiInstance.post("/auth/register", user)
    return res.data
}

const loginUser = async (user) => {
    const res = await apiInstance.post("/auth/login", user)
    return res.data
}

// ===== ТОВАРЫ =====
const getItems = async () => {
    const res = await apiInstance.get("/items")
    return res.data
}

const getItem = async (id) => {
    const res = await apiInstance.get(`/items/${id}`)
    return res.data
}

const createItem = async (itemData) => {
    const res = await apiInstance.post("/items", itemData)
    return res.data
}

const deleteItem = async (id) => {
    const res = await apiInstance.delete(`/items/${id}`)
    return res.data
}

// ===== СТАВКИ =====
const getItemBids = async (itemId) => {
    const res = await apiInstance.get(`/items/${itemId}/bids`)
    return res.data
}

const getMyBids = async () => {
    const res = await apiInstance.get("/bids/my")
    return res.data
}

const createBid = async (itemId, amount) => {
    const res = await apiInstance.post(`/items/${itemId}/bids`, { amount })
    return res.data
}

// ===== СТАТИСТИКА =====
const getStats = async () => {
    const res = await apiInstance.get("/stats")
    return res.data
}

// ===== СООБЩЕНИЯ (если они еще нужны) =====
const getMessages = async () => {
    const res = await apiInstance.get("/messages")
    return res.data
}

const sendMessage = async (message) => {
    const res = await apiInstance.post("/messages", message)
    return res.data
}

const deleteMessage = async (id) => {
    const res = await apiInstance.delete(`/messages/${id}`)
    return res.data
}

const likeMessage = async (id) => {
    const res = await apiInstance.post(`/messages/${id}/like`)
    return res.data
}

const reportMessage = async (id) => {
    const res = await apiInstance.post(`/messages/${id}/report`)
    return res.data
}

export const api = {
    // Аутентификация
    registerUser,
    loginUser,
    
    // Товары
    getItems,
    getItem,
    createItem,
    deleteItem,
    
    // Ставки
    getItemBids,
    getMyBids,
    createBid,
    
    // Статистика
    getStats,
    
    // Сообщения (опционально)
    getMessages,
    sendMessage,
    deleteMessage,
    likeMessage,
    reportMessage
}