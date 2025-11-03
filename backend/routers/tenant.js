import express from 'express';
import {
  getAllTenants,
  getTenantById,
  getTenantPaymentHistory,
  createTenant,
  updateTenant,
  deleteTenant
} from "../controllers/tenant.js";

const router = express.Router();

router.post("/tenant", createTenant);
router.get('/:id/payments', getTenantPaymentHistory);
router.get("/tenant/search", getAllTenants);
router.get("/tenant/:id", getTenantById);
router.put("/tenant/:id", updateTenant);
router.delete("/tenant/:id", deleteTenant);

export default router;