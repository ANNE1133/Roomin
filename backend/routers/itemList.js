// routes/itemListRoutes.js
import express from 'express';
import {
  getAllItemLists,
  getItemListById,
  getItemListsByInvoice,
  createItemList,
  updateItemList,
  deleteItemList
} from '../controllers/itemList.js';

const router = express.Router();

// GET /api/itemlists - ดึงรายการค่าใช้จ่ายทั้งหมด (รองรับ ?invoiceId=1&itemId=1)
router.get('/itemLists', getAllItemLists);

// GET /api/itemlists/invoice/:invoiceId - ดึงรายการของใบแจ้งหนี้หนึ่ง
router.get('/itemLists/invoice/:invoiceId', getItemListsByInvoice);

// GET /api/itemlists/:id - ดึงรายการตาม ID
router.get('/itemLists/:id', getItemListById);

// POST /api/itemlists - เพิ่มรายการค่าใช้จ่ายในใบแจ้งหนี้
router.post('/itemLists', createItemList);

// PUT /api/itemlists/:id - อัพเดทรายการ
router.put('/itemLists/:id', updateItemList);

// DELETE /api/itemlists/:id - ลบรายการ
router.delete('/itemLists/:id', deleteItemList);

export default router;