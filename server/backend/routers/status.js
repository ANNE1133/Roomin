import express from 'express';
import {
  getAllStatuses,
  getStatusById,
  createStatus,
  updateStatus,
  deleteStatus
} from '../controllers/status.js';

const router = express.Router();

router.get('/Statuses', getAllStatuses);
router.get('/Status/:id', getStatusById);
router.post('/Status/createStatus', createStatus);
router.put('/Status/:id', updateStatus);
router.delete('/Status/:id', deleteStatus);

export default router;