// routes/users.js
import express from 'express';
import {
  getAllUsers,
  getUserByAuthId,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} from "../controllers/users.js";

const router = express.Router();

router.post("/users", createUser);
router.get("/users", getUserByAuthId);
router.get("/users/search", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;