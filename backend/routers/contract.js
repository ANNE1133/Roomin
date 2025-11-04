// routes/contractRoutes.js
import express from 'express';
import {
  getAllContracts,
  getActiveContracts,
  getExpiringContracts,
  getContractById,
  createContract,
  updateContract,
  terminateContract,
  deleteContract
} from '../controllers/contract.js';

const router = express.Router();

// GET /api/contracts - ดึงสัญญาทั้งหมด (รองรับ ?tenantId=1&roomId=1&active=true)
router.get('/contracts', getAllContracts);

// GET /api/contracts/active - ดึงสัญญาที่ยังใช้งาน
router.get('/contracts/active', getActiveContracts);

// GET /api/contracts/expiring - ดึงสัญญาที่กำลังจะหมดอายุ (รองรับ ?days=30)
router.get('/contracts/expiring', getExpiringContracts);

// GET /api/contracts/:id - ดึงสัญญาตาม ID
router.get('/contracts/:id', getContractById);

// POST /api/contracts - สร้างสัญญาใหม่
router.post('/contracts', createContract);

// PUT /api/contracts/:id - อัพเดทสัญญา
router.put('/contracts/:id', updateContract);

// PATCH /api/contracts/:id/terminate - ยกเลิก/สิ้นสุดสัญญา
router.patch('/contracts/:id/terminate', terminateContract);

// DELETE /api/contracts/:id - ลบสัญญา
router.delete('/contracts/:id', deleteContract);

export default router;