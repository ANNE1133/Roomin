import express from 'express';
import {
  getAllItems,
  getActiveItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/item.js';

const router = express.Router();

// GET /api/items - ดึงรายการค่าใช้จ่ายทั้งหมด (รองรับ ?active=true)
router.get('/items', getAllItems);

// GET /api/items/active - ดึงเฉพาะรายการที่ใช้งาน
router.get('/items/active', getActiveItems);

// GET /api/items/:id - ดึงรายการตาม ID
router.get('/items/:id', getItemById);

// POST /api/items - สร้างรายการใหม่
router.post('/items', createItem);

// PUT /api/items/:id - อัพเดทรายการ
router.put('/items/:id', updateItem);

// DELETE /api/items/:id - ลบรายการ
router.delete('items/:id', deleteItem);

export default router;