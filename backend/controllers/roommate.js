// controllers/roommateController.js
import prisma from '../config/prisma.js';

// GET all roommates
// ดึงข้อมูลผู้อยู่ร่วมทั้งหมด
export const getAllRoommates = async (req, res) => {
  try {
    const { tenantId } = req.query; // Filter ตามผู้เช่า
    
    const where = tenantId ? { tenantId: parseInt(tenantId) } : {};
    
    const roommates = await prisma.roommate.findMany({
      where,
      include: {
        tenant: {
          include: {
            contracts: {
              where: {
                DayEnd: {
                  gte: new Date()
                }
              },
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
        tenant: {
          include: {
            user: true,
            contracts: {
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
    const { tenantId } = req.params;
    
    const roommates = await prisma.roommate.findMany({
      where: {
        tenantId: parseInt(tenantId)
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
    const { FName, LName, Name, Gmail, Tel, tenantId } = req.body;
    
    // Validation
    if (!FName || !LName || !Name || !Gmail || !Tel || !tenantId) {
      return res.status(400).json({ 
        error: 'All roommate information and tenant ID are required' 
      });
    }
    
    // ตรวจสอบว่าผู้เช่ามีอยู่จริง
    const tenant = await prisma.tenant.findUnique({
      where: { TenantID: parseInt(tenantId) }
    });
    
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    const roommate = await prisma.roommate.create({
      data: {
        FName,
        LName,
        Name,
        Gmail,
        Tel,
        tenantId: parseInt(tenantId)
      },
      include: {
        tenant: true
      }
    });
    
    res.status(201).json(roommate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT update roommate
// อัพเดทข้อมูลผู้อยู่ร่วม
export const updateRoommate = async (req, res) => {
  try {
    const { id } = req.params;
    const { FName, LName, Name, Gmail, Tel, tenantId } = req.body;
    
    // ถ้ามีการเปลี่ยน tenantId ให้ตรวจสอบว่ามีผู้เช่านั้นอยู่
    if (tenantId) {
      const tenant = await prisma.tenant.findUnique({
        where: { TenantID: parseInt(tenantId) }
      });
      
      if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
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
        ...(tenantId && { tenantId: parseInt(tenantId) })
      },
      include: {
        tenant: true
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
// ลบผู้อยู่ร่วม
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