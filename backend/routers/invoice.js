import express from 'express';
// import {
//   getAllRooms,
//   getAvailableRooms,
//   getRoomById,
//   createRoom,
//   updateRoom,
//   deleteRoom
// } from '../controllers/room.js';

const router = express.Router();

// ดูใบแจ้งหนี้ทั้งหมด
router.get('/invoices', async (req, res) => {
  return res.json({ message: 'Get all invoices' });
});

// ดูใบแจ้งหนี้ของตัวเอง
router.get('/invoice/myinvoice', async (req, res) => {
  return res.json({ message: 'Get my invoices' });
});

// ดูใบแจ้งหนี้ตาม ID
router.get('/invoice/:id', async (req, res) => {
  return res.json({ message: 'Get invoice by ID' });
});

// สร้างใบแจ้งหนี้ใหม่
router.post('/invoice/create', async (req, res) => {
  return res.json({ message: 'Create invoice' });
});

// แก้ไขใบแจ้งหนี้
router.put('/invoice/:id', async (req, res) => {
  return res.json({ message: 'Update invoice' });
});

// ดาวน์โหลด PDF
router.get('/invoice/:id/pdf', async (req, res) => {
  return res.json({ message: 'Download PDF' });
});

export default router;
