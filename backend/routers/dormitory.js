import express from 'express';
import {
    createDormitory,
    deleteDormitory
} from '../controllers/dormitory.js';

const router = express.Router();


router.post('/dormitory/createDormitory', createDormitory);
router.delete('/dormitory/:id', deleteDormitory);

export default router;