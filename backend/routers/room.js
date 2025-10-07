// ============================================
// 3. room.routes.js - จัดการห้องพัก
// ============================================

const express = require('express');
const router = express.Router();

// ดูห้องทั้งหมด
router.get('/', async (c) => {
  return c.json({ message: 'Get all rooms' })
})

// ดูห้องว่าง
router.get('/available', async (c) => {
  return c.json({ message: 'Get available rooms' })
})

// ดูห้องตาม ID
router.get('/:id', async (c) => {
  return c.json({ message: 'Get room by ID' })
})

// สร้างห้องใหม่
router.post('/', async (c) => {
  return c.json({ message: 'Create room' })
})

// แก้ไขห้อง
router.put('/:id', async (c) => {
  return c.json({ message: 'Update room' })
})

// ลบห้อง
router.delete('/:id', async (c) => {
  return c.json({ message: 'Delete room' })
})

module.exports = router