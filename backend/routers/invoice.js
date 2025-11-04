
// ============================================
// 4. invoice.routes.js - จัดการใบแจ้งหนี้
// ============================================

import { Router } from 'express';
const router = Router();

// ดูใบแจ้งหนี้ทั้งหมด
router.get('/', async (c) => {
  return c.json({ message: 'Get all invoices' })
})

// ดูใบแจ้งหนี้ของตัวเอง
router.get('/my/invoices', async (c) => {
  return c.json({ message: 'Get my invoices' })
})

// ดูใบแจ้งหนี้ตาม ID
router.get('/:id', async (c) => {
  return c.json({ message: 'Get invoice by ID' })
})

// สร้างใบแจ้งหนี้ใหม่
router.post('/', async (c) => {
  return c.json({ message: 'Create invoice' })
})

// แก้ไขใบแจ้งหนี้
router.put('/:id', async (c) => {
  return c.json({ message: 'Update invoice' })
})

// ดาวน์โหลด PDF
router.get('/:id/pdf', async (c) => {
  return c.json({ message: 'Download PDF' })
})

export default router