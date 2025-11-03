// controllers/userController.js
import prisma from '../config/prisma.js';

// GET all users
// ดึงข้อมูล user ทั้งหมด พร้อมข้อมูล tenant ที่เชื่อมโยง (ถ้ามี)
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        tenant: true // ดึงข้อมูล tenant ที่เชื่อมกับ user นี้ด้วย
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET user by ID
// ดึงข้อมูล user ตาม UserID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { UserID: parseInt(id) },
      include: {
        tenant: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET user by authId
// ดึงข้อมูล user จาก authId (จาก authentication system เช่น Firebase, Auth0)
export const getUserByAuthId = async (req, res) => {
  try {
    const { authId } = req.params;
    const user = await prisma.user.findUnique({
      where: { authId: authId },
      include: {
        tenant: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST create user
// สร้าง user ใหม่
export const createUser = async (req, res) => {
  try {
    const { authId, fullName, email, phone, role } = req.body;
    
    // Validation - ตรวจสอบข้อมูลที่จำเป็น
    if (!authId || !fullName || !email) {
      return res.status(400).json({ 
        error: 'authId, fullName, and email are required' 
      });
    }
    
    const user = await prisma.user.create({
      data: {
        authId,
        fullName,
        email,
        phone,
        role: role || 'TENANT' // ถ้าไม่ระบุ role จะเป็น TENANT (default)
      }
    });
    
    res.status(201).json(user);
  } catch (error) {
    // P2002 = Unique constraint violation (authId ซ้ำ)
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'User with this authId already exists' 
      });
    }
    res.status(500).json({ error: error.message });
  }
};

// PUT update user
// อัพเดทข้อมูล user (อัพเดทเฉพาะ field ที่ส่งมา)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, role } = req.body;
    
    const user = await prisma.user.update({
      where: { UserID: parseInt(id) },
      data: {
        ...(fullName && { fullName }), // ใช้ spread operator เพื่ออัพเดทเฉพาะที่มีค่า
        ...(email && { email }),
        ...(phone && { phone }),
        ...(role && { role })
      }
    });
    
    res.json(user);
  } catch (error) {
    // P2025 = Record not found
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

// DELETE user
// ลบ user (ต้องระวังเรื่อง foreign key constraints)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.user.delete({
      where: { UserID: parseInt(id) }
    });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    // P2003 = Foreign key constraint (มี tenant เชื่อมอยู่)
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        error: 'Cannot delete user with associated tenant' 
      });
    }
    res.status(500).json({ error: error.message });
  }
};