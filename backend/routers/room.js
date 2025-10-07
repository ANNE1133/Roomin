import express from 'express';
import {
  getAllRooms,
  getAvailableRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} from '../controllers/room.js';

const router = express.Router();

router.get('/', getAllRooms);
router.get('/available', getAvailableRooms);
router.get('/:id', getRoomById);
router.post('/createroom', createRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

export default router;