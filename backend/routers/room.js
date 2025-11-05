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

router.get('/rooms', getAllRooms);
router.get('/rooms/filter', getAvailableRooms);
router.get('/room/:id', getRoomById);
router.post('/room/createroom', createRoom);
router.put('/room/:id', updateRoom);
router.delete('/room/:id', deleteRoom);

export default router;