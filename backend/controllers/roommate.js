// controllers/roommateController.js
import prisma from '../config/prisma.js';

// GET all roommates
// ดึงข้อมูลผู้อยู่ร่วมทั้งหมด
export const getAllRoommates = async (req, res) => {
  try {
    const { userId } = req.query; // Filter ตามผู้เช่า
    const where = userId ? { userId: parseInt(userId) } : {};
    
    const roommates = await prisma.roommate.findMany({
      where,
      include: {
        user: {
          include: {
            contracts: true,
            roommates: true,
            invoices: true
          }
        }
      }
    });
    
    res.json(roommates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET roommate by ID
// ดึงข้อมูลผู้อยู่ร่วมตาม ID
export const getRoommateById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const roommate = await prisma.roommate.findUnique({
      where: { RoommateID: parseInt(id) },
      include: {
        user: {
          include: {
            contracts: true,
            roommates: true,
            invoices: true
          }
        }
      }
    });
    
    if (!roommate) {
      return res.status(404).json({ error: 'Roommate not found' });
    }
    
    res.json(roommate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET roommates by tenant
// ดึงผู้อยู่ร่วมทั้งหมดของผู้เช่าคนหนึ่ง
export const getRoommatesByTenant = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const roommates = await prisma.roommate.findMany({
      where: {
        userId: parseInt(userId)
      }
    });
    
    res.json(roommates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST create roommate
// สร้างผู้อยู่ร่วมใหม่
export const createRoommate = async (req, res) => {
  try {
    const { FName, LName, Name, Gmail, Tel, userId  } = req.body;
    
    // Validation
    if (!FName || !LName || !Name || !Gmail || !Tel || !userId ) {
      return res.status(400).json({ 
        error: 'All roommate information and User  ID are required' 
      });
    }
    
    // ตรวจสอบว่าผู้เช่ามีอยู่จริง
    const user  = await prisma.user .findUnique({
      where: { UserID: parseInt(userId ) }
    });
    
    if (!user ) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const roommate = await prisma.roommate.create({
      data: {
        FName,
        LName,
        Name,
        Gmail,
        Tel,
        userId: parseInt(userId)
      },
      include: {
        user: true
      }
    });
    
    res.status(201).json(roommate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT update roommate
export const updateRoommate = async (req, res) => {
  try {
    const { id } = req.params;
    const { FName, LName, Name, Gmail, Tel, userId } = req.body;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { UserID: parseInt(userId) }
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
    }

    const roommate = await prisma.roommate.update({
      where: { RoommateID: parseInt(id) },
      data: {
        ...(FName && { FName }),
        ...(LName && { LName }),
        ...(Name && { Name }),
        ...(Gmail && { Gmail }),
        ...(Tel && { Tel }),
        ...(userId && { userId: parseInt(userId) })
      },
      include: {
        user: true
      }
    });

    res.json(roommate);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Roommate not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

// DELETE roommate
export const deleteRoommate = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.roommate.delete({
      where: { RoommateID: parseInt(id) }
    });

    res.json({ message: 'Roommate deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Roommate not found' });
    }
    res.status(500).json({ error: error.message });
  }
};