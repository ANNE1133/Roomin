// routes/receiptRoutes.js
import express from 'express';
import {
  getAllReceipts,
  getReceiptById,
  getReceiptsByInvoice,
  createReceipt,
  updateReceipt,
  deleteReceipt
} from '../controllers/receipt.js';

const router = express.Router();

// GET /api/receipts - ดึงใบเสร็จทั้งหมด (รองรับ ?invoiceId=1&startDate=2024-01-01&endDate=2024-12-31)
router.get('/receipts', getAllReceipts);

// GET /api/receipts/invoice/:invoiceId - ดึงใบเสร็จทั้งหมดของใบแจ้งหนี้หนึ่ง
router.get('/receipts/invoice/:invoiceId', getReceiptsByInvoice);

// GET /api/receipts/:id - ดึงใบเสร็จตาม ID
router.get('/receipts/:id', getReceiptById);

// POST /api/receipts - สร้างใบเสร็จใหม่ (บันทึกการชำระเงิน)
router.post('/receipts', createReceipt);

// PUT /api/receipts/:id - อัพเดทใบเสร็จ
router.put('/receipts/:id', updateReceipt);

// DELETE /api/receipts/:id - ลบใบเสร็จ
router.delete('/receipts/:id', deleteReceipt);

export default router;