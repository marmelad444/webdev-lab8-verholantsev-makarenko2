const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs').promises
const path = require('path')

const app = express()
const PORT = 3001
const DB_FILE = path.join(__dirname, 'database.json')
const JWT_SECRET = 'your-secret-key-change-this-in-production'
const SALT_ROUNDS = 10

app.use(cors())
app.use(express.json())

async function initDatabase() {
    try {
        await fs.access(DB_FILE)
    } catch {
        const initialData = {
            items: [],
            bids: [],
            users: [],
        }
        await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2))
        console.log('Database initialized')
    }
}

async function readDB() {
    const data = await fs.readFile(DB_FILE, 'utf8')
    return JSON.parse(data)
}

async function writeDB(data) {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2))
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Access token required' })
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' })
        }
        req.user = user
        next()
    })
}

app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password, email } = req.body

        if (!username || !password) {
            return res
                .status(400)
                .json({ error: 'Username and password are required' })
        }

        if (username.length < 3) {
            return res
                .status(400)
                .json({ error: 'Username must be at least 3 characters' })
        }

        if (password.length < 6) {
            return res
                .status(400)
                .json({ error: 'Password must be at least 6 characters' })
        }

        const db = await readDB()

        if (db.users.find((u) => u.username === username)) {
            return res.status(409).json({ error: 'Username already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

        const newUser = {
            id: Date.now(),
            username,
            email: email || `${username}@example.com`,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        }

        db.users.push(newUser)
        await writeDB(db)

        const token = jwt.sign(
            { userId: newUser.id, username: newUser.username },
            JWT_SECRET,
            { expiresIn: '24h' },
        )

        res.status(201).json({
            success: true,
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            },
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error during registration' })
    }
})

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res
                .status(400)
                .json({ error: 'Username and password are required' })
        }

        const db = await readDB()
        const user = db.users.find((u) => u.username === username)

        if (!user) {
            return res
                .status(401)
                .json({ error: 'Invalid username or password' })
        }

        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            return res
                .status(401)
                .json({ error: 'Invalid username or password' })
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' },
        )

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error during login' })
    }
})

app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const db = await readDB()
        const user = db.users.find((u) => u.id === req.user.userId)

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
        })
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
})

app.get('/api/items', async (req, res) => {
    try {
        const db = await readDB()

        const items = db.items
            .map((item) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                price: item.price,
                userId: item.userId,
                username: item.username,
                status: item.status,
                imageUrl: item.imageUrl,
                createdAt: item.createdAt,
                highestBid: item.highestBid || null,
                bidCount: item.bidCount || 0
            }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        res.json(items)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch items' })
    }
})

app.post('/api/items', authenticateToken, async (req, res) => {
    try {
        const { title, description, price, imageUrl } = req.body

        if (!title || !title.trim()) {
            return res
                .status(400)
                .json({ error: 'Item title is required' })
        }

        if (!description || !description.trim()) {
            return res
                .status(400)
                .json({ error: 'Item description is required' })
        }

        if (!price || price <= 0) {
            return res
                .status(400)
                .json({ error: 'Valid price is required' })
        }

        if (title.length > 100) {
            return res
                .status(400)
                .json({ error: 'Title too long (max 100 characters)' })
        }

        if (description.length > 1000) {
            return res
                .status(400)
                .json({ error: 'Description too long (max 1000 characters)' })
        }

        const db = await readDB()

        const newItem = {
            id: Date.now(),
            title: title.trim(),
            description: description.trim(),
            price: parseFloat(price),
            imageUrl: imageUrl || null,
            userId: req.user.userId,
            username: req.user.username,
            status: 'active',
            highestBid: null,
            bidCount: 0,
            createdAt: new Date().toISOString(),
        }

        db.items.push(newItem)
        await writeDB(db)

        res.status(201).json(newItem)
    } catch (err) {
        res.status(500).json({ error: 'Failed to create item' })
    }
})

app.delete('/api/items/:id', authenticateToken, async (req, res) => {
    try {
        const itemId = parseInt(req.params.id)

        const db = await readDB()
        const itemIndex = db.items.findIndex((item) => item.id === itemId)

        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Item not found' })
        }

        if (db.items[itemIndex].userId !== req.user.userId) {
            return res
                .status(403)
                .json({ error: 'Not authorized to delete this item' })
        }

        // Check if item has bids
        const hasBids = db.bids.some(bid => bid.itemId === itemId)
        if (hasBids) {
            return res
                .status(400)
                .json({ error: 'Cannot delete item with existing bids' })
        }

        db.items.splice(itemIndex, 1)
        await writeDB(db)

        res.json({ success: true, message: 'Item deleted' })
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete item' })
    }
})

// Create bid on item
app.post('/api/items/:id/bids', authenticateToken, async (req, res) => {
    try {
        const itemId = parseInt(req.params.id)
        const { amount } = req.body
        const userId = req.user.userId

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Valid bid amount is required' })
        }

        const db = await readDB()
        const item = db.items.find((item) => item.id === itemId)

        if (!item) {
            return res.status(404).json({ error: 'Item not found' })
        }

        if (item.userId === userId) {
            return res.status(400).json({ error: 'Cannot bid on your own item' })
        }

        if (item.status !== 'active') {
            return res.status(400).json({ error: 'Item is not available for bidding' })
        }

        // Check if bid is higher than current highest bid
        const currentHighestBid = item.highestBid || item.price
        if (amount <= currentHighestBid) {
            return res.status(400).json({ 
                error: `Bid must be higher than current highest bid (${currentHighestBid})` 
            })
        }

        const newBid = {
            id: Date.now(),
            itemId: itemId,
            userId: userId,
            username: req.user.username,
            amount: parseFloat(amount),
            createdAt: new Date().toISOString(),
        }

        db.bids.push(newBid)
        
        // Update item with new highest bid
        item.highestBid = parseFloat(amount)
        item.bidCount = db.bids.filter(bid => bid.itemId === itemId).length

        await writeDB(db)
        res.status(201).json(newBid)
    } catch (err) {
        res.status(500).json({ error: 'Failed to create bid' })
    }
})

// Get all bids for an item
app.get('/api/items/:id/bids', async (req, res) => {
    try {
        const itemId = parseInt(req.params.id)
        const db = await readDB()

        const item = db.items.find((item) => item.id === itemId)
        if (!item) {
            return res.status(404).json({ error: 'Item not found' })
        }

        const bids = db.bids
            .filter(bid => bid.itemId === itemId)
            .map(bid => ({
                id: bid.id,
                amount: bid.amount,
                userId: bid.userId,
                username: bid.username,
                createdAt: bid.createdAt
            }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        res.json(bids)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch bids' })
    }
})

// Get user's bids
app.get('/api/bids/my', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId
        const db = await readDB()

        const userBids = db.bids
            .filter(bid => bid.userId === userId)
            .map(bid => {
                const item = db.items.find(item => item.id === bid.itemId)
                return {
                    id: bid.id,
                    amount: bid.amount,
                    itemId: bid.itemId,
                    itemTitle: item ? item.title : 'Unknown Item',
                    createdAt: bid.createdAt,
                    isWinning: item && item.highestBid === bid.amount
                }
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        res.json(userBids)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user bids' })
    }
})

app.get('/api/stats', async (req, res) => {
    try {
        const db = await readDB()

        const stats = {
            totalItems: db.items.length,
            totalUsers: db.users.length,
            totalBids: db.bids.length,
            activeItems: db.items.filter(item => item.status === 'active').length,
            totalValue: db.items.reduce((sum, item) => sum + (item.highestBid || item.price), 0),
            averageItemPrice: db.items.length > 0 
                ? db.items.reduce((sum, item) => sum + item.price, 0) / db.items.length 
                : 0
        }

        res.json(stats)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch stats' })
    }
})

initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Marketplace API running on http://localhost:${PORT}`)
        console.log(`📝 Database file: ${DB_FILE}`)
        console.log(`🔐 JWT Authentication enabled`)
        console.log('\nAvailable endpoints:')
        console.log('  PUBLIC:')
        console.log('    POST   /api/auth/register')
        console.log('    POST   /api/auth/login')
        console.log('    GET    /api/items')
        console.log('    GET    /api/items/:id/bids')
        console.log('    GET    /api/stats')
        console.log('  PROTECTED (require JWT token):')
        console.log('    GET    /api/auth/me')
        console.log('    POST   /api/items')
        console.log('    DELETE /api/items/:id')
        console.log('    POST   /api/items/:id/bids')
        console.log('    GET    /api/bids/my')
    })
})

process.on('SIGINT', () => {
    console.log('\n👋 Shutting down gracefully...')
    process.exit(0)
})
