// ============================================
// 6. repair.routes.js - จัดการแจ้งซ่อม
// ============================================

const express = require('express');
const router = express.Router();

// ดูรายการแจ้งซ่อมทั้งหมด
router.get('/', async (c) => {
  return c.json({ message: 'Get all repairs' })
})

// ดูรายการแจ้งซ่อมตาม ID
router.get('/:id', async (c) => {
  return c.json({ message: 'Get repair by ID' })
})

// สร้างรายการแจ้งซ่อม
router.post('/', async (c) => {
  return c.json({ message: 'Create repair request' })
})

// อัปเดตสถานะ (Admin/Staff)
router.patch('/:id/status', async (c) => {
  return c.json({ message: 'Update repair status' })
})

// ลบรายการแจ้งซ่อม
router.delete('/:id', async (c) => {
  return c.json({ message: 'Delete repair' })
})

module.exports = router