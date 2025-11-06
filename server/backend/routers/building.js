import express from 'express';
import {
  getAllBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  deleteBuilding
} from '../controllers/building.js';

const router = express.Router();

router.get('/Building', getAllBuildings);
router.get('/Buildings/:id', getBuildingById);
router.post('/Building/createBuilding', createBuilding);
router.put('/Building/:id', updateBuilding);
router.delete('/Building/:id', deleteBuilding);

export default router;