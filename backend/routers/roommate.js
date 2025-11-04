// routes/roommateRoutes.js
import express from 'express';
import {
  getAllRoommates,
  getRoommateById,
  getRoommatesByTenant,
  createRoommate,
  updateRoommate,
  deleteRoommate
} from '../controllers/roommate.js';

const router = express.Router();

// GET /api/roommates - ดึงผู้อยู่ร่วมทั้งหมด (รองรับ ?tenantId=1)
router.get('/roommate', getAllRoommates);

// GET /api/roommates/tenant/:tenantId - ดึงผู้อยู่ร่วมของผู้เช่าคนหนึ่ง
router.get('/user/:userId', getRoommatesByTenant);

// GET /api/roommates/:id - ดึงผู้อยู่ร่วมตาม ID
router.get('/roommate/:id', getRoommateById);

// POST /api/roommates - สร้างผู้อยู่ร่วมใหม่
router.post('/roommate', createRoommate);

// PUT /api/roommates/:id - อัพเดทผู้อยู่ร่วม
router.put('/roommate/:id', updateRoommate);

// DELETE /api/roommates/:id - ลบผู้อยู่ร่วม
router.delete('/roommate/:id', deleteRoommate);

export default router;