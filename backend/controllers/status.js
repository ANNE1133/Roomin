// controllers/statusController.js
import prisma from '../config/prisma.js';

// GET all statuses
// ดึงข้อมูลสถานะทั้งหมด สามารถ filter ตาม Type ได้
export const getAllStatuses = async (req, res) => {
  try {
    const { type } = req.query; // ?type=ROOM หรือ ?type=INVOICE
    
    const where = type ? { Type: type.toUpperCase() } : {};
    
    const statuses = await prisma.status.findMany({
      where,
      orderBy: {
        Type: 'asc' // เรียงตาม Type
      }
    });
    
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET status by ID
// ดึงข้อมูลสถานะตาม ID พร้อมนับจำนวนการใช้งาน
export const getStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const status = await prisma.status.findUnique({
      where: { StatusID: parseInt(id) },
      include: {
        _count: {
          select: {
            rooms: true,    // นับจำนวนห้องที่ใช้สถานะนี้
            invoices: true, // นับจำนวนใบแจ้งหนี้
            items: true     // นับจำนวนรายการ
          }
        }
      }
    });
    
    if (!status) {
      return res.status(404).json({ error: 'Status not found' });
    }
    
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET statuses by type
// ดึงสถานะตามประเภท (ROOM, INVOICE, ITEM)
export const getStatusesByType = async (req, res) => {
  try {
    const { type } = req.params; // /statuses/type/ROOM
    
    const statuses = await prisma.status.findMany({
      where: {
        Type: type.toUpperCase()
      }
    });
    
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST create status
// สร้างสถานะใหม่
export const createStatus = async (req, res) => {
  try {
    const { Type, name } = req.body;
    
    // Validation
    if (!Type || !name) {
      return res.status(400).json({ 
        error: 'Type and name are required' 
      });
    }
    
    // ตรวจสอบว่า Type ถูกต้อง
    const validTypes = ['ROOM', 'INVOICE', 'ITEM'];
    if (!validTypes.includes(Type.toUpperCase())) {
      return res.status(400).json({ 
        error: 'Type must be ROOM, INVOICE, or ITEM' 
      });
    }
    
    const status = await prisma.status.create({
      data: {
        Type: Type.toUpperCase(),
        name
      }
    });
    
    res.status(201).json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT update status
// อัพเดทสถานะ
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { Type, name } = req.body;
    
    const status = await prisma.status.update({
      where: { StatusID: parseInt(id) },
      data: {
        ...(Type && { Type: Type.toUpperCase() }),
        ...(name && { name })
      }
    });
    
    res.json(status);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Status not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

// DELETE status
// ลบสถานะ (ต้องไม่มีห้อง/ใบแจ้งหนี้/รายการใช้งานอยู่)
export const deleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.status.delete({
      where: { StatusID: parseInt(id) }
    });
    
    res.json({ message: 'Status deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Status not found' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        error: 'Cannot delete status that is being used by rooms, invoices, or items' 
      });
    }
    res.status(500).json({ error: error.message });
  }
};