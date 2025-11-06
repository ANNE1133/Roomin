// routes/invoiceRoutes.js
import express from 'express';
import {
  getAllInvoices,
  getUnpaidInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  getInvoicesForUser
} from '../controllers/invoice.js';

const router = express.Router();

// GET /api/invoices - ดึงใบแจ้งหนี้ทั้งหมด (รองรับ ?roomId=1&dormitoryId=1&month=1&year=2024)
router.get('/invoices', getAllInvoices);

// GET /api/invoices/unpaid - ดึงใบแจ้งหนี้ที่ยังไม่ชำระ (รองรับ ?dormitoryId=1)
router.get('/invoices/unpaid', getUnpaidInvoices);

// GET /api/invoices/:id - ดึงใบแจ้งหนี้ตาม ID
router.get('/invoices/:id', getInvoiceById);

// POST /api/invoices - สร้างใบแจ้งหนี้ใหม่
router.post('/invoices', createInvoice);

// PATCH /api/invoices/:id/status - อัพเดทสถานะใบแจ้งหนี้
router.patch('/invoices/:id/status', updateInvoiceStatus);

// DELETE /api/invoices/:id - ลบใบแจ้งหนี้
router.delete('/invoices/:id', deleteInvoice);

router.get("/invoices/user/:authId", getInvoicesForUser);

export default router;