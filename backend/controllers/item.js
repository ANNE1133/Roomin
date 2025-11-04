// controllers/itemController.js
import prisma from '../config/prisma.js';

// GET all items
// ดึงรายการค่าใช้จ่ายทั้งหมด (เช่น ค่าไฟ, ค่าน้ำ, ค่าห้อง)
export const getAllItems = async (req, res) => {
  try {
    const { statusId, active } = req.query;
    
    const where = {};
    
    if (statusId) {
      where.statusId = parseInt(statusId);
    }
    
    // Filter เฉพาะรายการที่ใช้งาน (active)
    if (active === 'true') {
      const activeStatus = await prisma.status.findFirst({
        where: {
          Type: 'ITEM',
          name: 'Active'
        }
      });
      
      if (activeStatus) {
        where.statusId = activeStatus.StatusID;
      }
    }
    
    const items = await prisma.item.findMany({
      where,
      include: {
        status: true,
        _count: {
          select: {
            itemlists: true // นับว่ารายการนี้ถูกใช้กี่ครั้ง
          }
        }
      },
      orderBy: {
        name: 'asc' // เรียงตามชื่อ
      }
    });
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET active items
// ดึงเฉพาะรายการที่ใช้งานอยู่
export const getActiveItems = async (req, res) => {
  try {
    const activeStatus = await prisma.status.findFirst({
      where: {
        Type: 'ITEM',
        name: 'Active'
      }
    });
    
    if (!activeStatus) {
      return res.status(500).json({ error: 'Active item status not found' });
    }
    
    const items = await prisma.item.findMany({
      where: {
        statusId: activeStatus.StatusID
      },
      include: {
        status: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET item by ID
// ดึงข้อมูลรายการตาม ID พร้อมประวัติการใช้งาน
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await prisma.item.findUnique({
      where: { ItemID: parseInt(id) },
      include: {
        status: true,
        itemlists: {
          include: {
            invoice: {
              include: {
                room: {
                  include: {
                    building: {
                      include: {
                        dormitory: true
                      }
                    }
                  }
                }
              }
            }
          },
          take: 10, // แสดงแค่ 10 รายการล่าสุด
          orderBy: {
            ItemListID: 'desc'
          }
        }
      }
    });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST create item
// สร้างรายการค่าใช้จ่ายใหม่
export const createItem = async (req, res) => {
  try {
    const { name, price, statusId } = req.body;
    
    // Validation
    if (!name || !price || !statusId) {
      return res.status(400).json({ 
        error: 'Name, price, and status ID are required' 
      });
    }
    
    // ตรวจสอบว่าเป็น ITEM status
    const status = await prisma.status.findFirst({
      where: { 
        StatusID: parseInt(statusId),
        Type: 'ITEM'
      }
    });
    
    if (!status) {
      return res.status(404).json({ error: 'Item status not found' });
    }
    
    const item = await prisma.item.create({
      data: {
        name,
        price: parseFloat(price),
        statusId: parseInt(statusId)
      },
      include: {
        status: true
      }
    });
    
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT update item
// อัพเดทข้อมูลรายการค่าใช้จ่าย
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, statusId } = req.body;
    
    // ถ้ามีการเปลี่ยนสถานะ ตรวจสอบว่าเป็น ITEM status
    if (statusId) {
      const status = await prisma.status.findFirst({
        where: { 
          StatusID: parseInt(statusId),
          Type: 'ITEM'
        }
      });
      
      if (!status) {
        return res.status(404).json({ error: 'Item status not found' });
      }
    }
    
    const item = await prisma.item.update({
      where: { ItemID: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(statusId && { statusId: parseInt(statusId) })
      },
      include: {
        status: true
      }
    });
    
    res.json(item);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

// DELETE item
// ลบรายการค่าใช้จ่าย (ต้องไม่มี itemlist ใช้งานอยู่)
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.item.delete({
      where: { ItemID: parseInt(id) }
    });
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Item not found' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        error: 'Cannot delete item that is being used in invoices' 
      });
    }
    res.status(500).json({ error: error.message });
  }
};
      