import express from 'express'
import Name from '../models/Name.js'

const router = express.Router()

// POST /api/names  — save a new name
router.post('/', async (req, res) => {
  try {
    const { name } = req.body
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' })
    }
    const saved = await Name.create({ name: name.trim() })
    res.status(201).json(saved)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/names  — return all names (newest first)
router.get('/', async (req, res) => {
  try {
    const names = await Name.find().sort({ createdAt: -1 })
    res.json(names)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
