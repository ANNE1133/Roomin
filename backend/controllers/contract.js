// controllers/contractController.js
import prisma from '../config/prisma.js';

// GET all contracts
// ดึงข้อมูลสัญญาทั้งหมด
export const getAllContracts = async (req, res) => {
  try {
    const { tenantId, roomId, active } = req.query;
    
    const where = {};
    
    if (tenantId) {
      where.tenantId = parseInt(tenantId);
    }
    
    if (roomId) {
      where.roomId = parseInt(roomId);
    }
    
    // Filter เฉพาะสัญญาที่ยังใช้งาน
    if (active === 'true') {
      where.DayEnd = {
        gte: new Date() // สัญญาที่ยังไม่หมดอายุ
      };
    }
    
    const contracts = await prisma.contract.findMany({
      where,
      include: {
        tenant: {
          include: {
            user: true,
            roommates: true
          }
        },
        room: {
          include: {
            building: {
              include: {
                dormitory: true
              }
            },
            status: true
          }
        }
      },
      orderBy: {
        DayStart: 'desc' // เรียงจากสัญญาใหม่ล่าสุด
      }
    });
    
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET active contracts
// ดึงเฉพาะสัญญาที่ยังใช้งานอยู่
export const getActiveContracts = async (req, res) => {
  try {
    const contracts = await prisma.contract.findMany({
      where: {
        DayEnd: {
          gte: new Date()
        }
      },
      include: {
        tenant: {
          include: {
            user: true,
            roommates: true
          }
        },
        room: {
          include: {
            building: {
              include: {
                dormitory: true
              }
            },
            status: true
          }
        }
      },
      orderBy: {
        DayStart: 'desc'
      }
    });
    
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET expiring contracts
// ดึงสัญญาที่กำลังจะหมดอายุ (เช่น ใน 30 วัน)
export const getExpiringContracts = async (req, res) => {
  try {
    const { days = 30 } = req.query; // default 30 วัน
    
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(days));
    
    const contracts = await prisma.contract.findMany({
      where: {
        DayEnd: {
          gte: today, // ยังไม่หมดอายุ
          lte: futureDate // แต่จะหมดอายุใน X วัน
        }
      },
      include: {
        tenant: {
          include: {
            user: true,
            roommates: true
          }
        },
        room: {
          include: {
            building: {
              include: {
                dormitory: true
              }
            }
          }
        }
      },
      orderBy: {
        DayEnd: 'asc' // เรียงจากที่จะหมดอายุเร็วสุดก่อน
      }
    });
    
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET contract by ID
// ดึงข้อมูลสัญญาตาม ID
export const getContractById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contract = await prisma.contract.findUnique({
      where: { ContractID: parseInt(id) },
      include: {
        tenant: {
          include: {
            user: true,
            roommates: true
          }
        },
        room: {
          include: {
            building: {
              include: {
                dormitory: true
              }
            },
            status: true,
            invoices: {
              include: {
                status: true,
                itemlists: {
                  include: {
                    item: true
                  }
                }
              },
              orderBy: {
                Date: 'desc'
              }
            }
          }
        }
      }
    });
    
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    res.json(contract);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST create contract
// สร้างสัญญาใหม่ (พร้อมอัพเดทสถานะห้องเป็น "มีผู้เช่า")
export const createContract = async (req, res) => {
  try {
    const { Code, DayStart, DayEnd, roomId, tenantId } = req.body;
    
    // Validation
    if (!Code || !DayStart || !DayEnd || !roomId || !tenantId) {
      return res.status(400).json({ 
        error: 'All contract information is required' 
      });
    }
    
    // ตรวจสอบว่าห้องมีอยู่จริง
    const room = await prisma.room.findUnique({
      where: { RoomID: parseInt(roomId) },
      include: { status: true }
    });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    // ตรวจสอบว่าห้องว่างหรือไม่
    if (room.status.name !== 'ว่าง') {
      return res.status(400).json({ 
        error: 'Room is not available for rent' 
      });
    }
    
    // ตรวจสอบว่าผู้เช่ามีอยู่จริง
    const tenant = await prisma.tenant.findUnique({
      where: { TenantID: parseInt(tenantId) }
    });
    
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    // ตรวจสอบว่าวันที่ถูกต้อง
    const startDate = new Date(DayStart);
    const endDate = new Date(DayEnd);
    
    if (endDate <= startDate) {
      return res.status(400).json({ 
        error: 'End date must be after start date' 
      });
    }
    
    // หาสถานะ "มีผู้เช่า"
    const occupiedStatus = await prisma.status.findFirst({
      where: {
        Type: 'ROOM',
        name: 'มีผู้เช่า'
      }
    });
    
    if (!occupiedStatus) {
      return res.status(500).json({ 
        error: 'Occupied status not found in database' 
      });
    }
    
    // สร้างสัญญาและอัพเดทสถานะห้องพร้อมกัน (Transaction)
    const contract = await prisma.$transaction(async (tx) => {
      // สร้างสัญญา
      const newContract = await tx.contract.create({
        data: {
          Code,
          DayStart: new Date(DayStart),
          DayEnd: new Date(DayEnd),
          roomId: parseInt(roomId),
          tenantId: parseInt(tenantId)
        },
        include: {
          tenant: {
            include: {
              user: true,
              roommates: true
            }
          },
          room: {
            include: {
              building: {
                include: {
                  dormitory: true
                }
              },
              status: true
            }
          }
        }
      });
      
      // อัพเดทสถานะห้องเป็น "มีผู้เช่า"
      await tx.room.update({
        where: { RoomID: parseInt(roomId) },
        data: {
          statusId: occupiedStatus.StatusID
        }
      });
      
      return newContract;
    });
    
    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT update contract
// อัพเดทข้อมูลสัญญา
export const updateContract = async (req, res) => {
  try {
    const { id } = req.params;
    const { Code, DayStart, DayEnd, roomId, tenantId } = req.body;
    
    // ตรวจสอบวันที่ถ้ามีการส่งมา
    if (DayStart && DayEnd) {
      const startDate = new Date(DayStart);
      const endDate = new Date(DayEnd);
      
      if (endDate <= startDate) {
        return res.status(400).json({ 
          error: 'End date must be after start date' 
        });
      }
    }
    
    const contract = await prisma.contract.update({
      where: { ContractID: parseInt(id) },
      data: {
        ...(Code && { Code }),
        ...(DayStart && { DayStart: new Date(DayStart) }),
        ...(DayEnd && { DayEnd: new Date(DayEnd) }),
        ...(roomId && { roomId: parseInt(roomId) }),
        ...(tenantId && { tenantId: parseInt(tenantId) })
      },
      include: {
        tenant: {
          include: {
            user: true,
            roommates: true
          }
        },
        room: {
          include: {
            building: {
              include: {
                dormitory: true
              }
            },
            status: true
          }
        }
      }
    });
    
    res.json(contract);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Contract not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

// PUT terminate contract
// ยกเลิก/สิ้นสุดสัญญา (เปลี่ยนสถานะห้องเป็น "ว่าง")
export const terminateContract = async (req, res) => {
  try {
    const { id } = req.params;
    const { terminationDate } = req.body; // วันที่สิ้นสุดจริง
    
    // ดึงข้อมูลสัญญา
    const contract = await prisma.contract.findUnique({
      where: { ContractID: parseInt(id) },
      include: {
        room: true
      }
    });
    
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    // หาสถานะ "ว่าง"
    const availableStatus = await prisma.status.findFirst({
      where: {
        Type: 'ROOM',
        name: 'ว่าง'
      }
    });
    
    if (!availableStatus) {
      return res.status(500).json({ 
        error: 'Available status not found in database' 
      });
    }
    
    // อัพเดทสัญญาและสถานะห้องพร้อมกัน (Transaction)
    const result = await prisma.$transaction(async (tx) => {
      // อัพเดทวันสิ้นสุดสัญญา
      const updatedContract = await tx.contract.update({
        where: { ContractID: parseInt(id) },
        data: {
          DayEnd: terminationDate ? new Date(terminationDate) : new Date()
        },
        include: {
          tenant: true,
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
      });
      
      // ตรวจสอบว่ามีสัญญาอื่นที่ยังใช้งานในห้องนี้หรือไม่
      const otherActiveContracts = await tx.contract.findMany({
        where: {
          roomId: contract.roomId,
          ContractID: {
            not: parseInt(id)
          },
          DayEnd: {
            gte: new Date()
          }
        }
      });
      
      // ถ้าไม่มีสัญญาอื่น ให้เปลี่ยนสถานะห้องเป็น "ว่าง"
      if (otherActiveContracts.length === 0) {
        await tx.room.update({
          where: { RoomID: contract.roomId },
          data: {
            statusId: availableStatus.StatusID
          }
        });
      }
      
      return updatedContract;
    });
    
    res.json({
      message: 'Contract terminated successfully',
      contract: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE contract
// ลบสัญญา (ควรใช้ terminate แทน delete)
export const deleteContract = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.contract.delete({
      where: { ContractID: parseInt(id) }
    });
    
    res.json({ message: 'Contract deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Contract not found' });
    }
    res.status(500).json({ error: error.message });
  }
};