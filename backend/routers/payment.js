// ============================================
// 5. payment.routes.js - จัดการการชำระเงิน
// ============================================

const express = require('express');
const router = express.Router();

// ดูการชำระเงินทั้งหมด
router.get('/', async (c) => {
  return c.json({ message: 'Get all payments' })
})

// ดูการชำระเงินตาม ID
router.get('/:id', async (c) => {
  return c.json({ message: 'Get payment by ID' })
})

// ส่งหลักฐานการชำระเงิน
router.post('/', async (c) => {
  return c.json({ message: 'Submit payment proof' })
})

// อัปโหลดสลิป
router.post('/upload-slip', async (c) => {
  return c.json({ message: 'Upload slip' })
})

// ยืนยันการชำระเงิน (Admin/Staff)
router.patch('/:id/verify', async (c) => {
  return c.json({ message: 'Verify payment' })
})

// ปฏิเสธการชำระเงิน (Admin/Staff)
router.patch('/:id/reject', async (c) => {
  return c.json({ message: 'Reject payment' })
})

module.exports = router