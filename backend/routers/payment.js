// ============================================
// 5. payment.routes.js - จัดการการชำระเงิน
// ============================================

import { Router } from 'express';
const router = Router();

// ดูการชำระเงินทั้งหมด
router.get('/payments', async (c) => {
  return c.json({ message: 'Get all payments' })
})

// ดูการชำระเงินตาม ID
router.get('/payments/:id', async (c) => {
  return c.json({ message: 'Get payment by ID' })
})

// ส่งหลักฐานการชำระเงิน
router.post('/payments', async (c) => {
  return c.json({ message: 'Submit payment proof' })
})

// อัปโหลดสลิป
router.post('/payments/upload-slip', async (c) => {
  return c.json({ message: 'Upload slip' })
})

// ยืนยันการชำระเงิน (Admin/Staff)
router.patch('/payments/:id/verify', async (c) => {
  return c.json({ message: 'Verify payment' })
})

// ปฏิเสธการชำระเงิน (Admin/Staff)
router.patch('/payments/:id/reject', async (c) => {
  return c.json({ message: 'Reject payment' })
})

export default router