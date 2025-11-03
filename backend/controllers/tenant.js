// controllers/tenantController.js
import prisma from '../config/prisma.js';

// GET all tenants ดึงข้อมูลผู้เช่าทั้งหมด
export const getAllTenants = async (req, res) => {
  try {
    const tenants = await prisma.tenant.findMany({
      include: {
        user: true, // ข้อมูล user ที่เชื่อมกับ tenant
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
        },
        roommates: true, // ผู้อยู่ร่วม
        _count: {
          select: {
            contracts: true,
            roommates: true
          }
        }
      }
    });
    
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET tenant by ID ดึงข้อมูลผู้เช่าตาม ID พร้อมประวัติสัญญาทั้งหมด
export const getTenantById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tenant = await prisma.tenant.findUnique({
      where: { TenantID: parseInt(id) },
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
                },
                status: true
              }
            }
          },
          orderBy: {
            DayStart: 'desc' // เรียงจากสัญญาใหม่ล่าสุดไปเก่าที่สุด
          }
        },
        roommates: true
      }
    });
    
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET active contracts for tenant ดึงสัญญาที่ยังใช้งานอยู่ของผู้เช่า (วันสิ้นสุดยังไม่ถึง)
export const getActiveTenantContracts = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contracts = await prisma.contract.findMany({
      where: {
        tenantId: parseInt(id),
        DayEnd: {
          gte: new Date() // gte = greater than
          }
       },
        include: {
            room: {
            include: {
                building: {
                include: {
                    dormitory: true
                }
                },
                status: true
            }
            },
            tenant: {
            include: {
                roommates: true
            }
            }
        }
        });
        
        res.json(contracts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET tenant payment history ดึงประวัติการชำระเงินของผู้เช่า
export const getTenantPaymentHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // หาสัญญาทั้งหมดของผู้เช่า
    const contracts = await prisma.contract.findMany({
      where: { tenantId: parseInt(id) },
      include: {
        room: {
          include: {
            invoices: {
              include: {
                status: true,
                receipts: true,
                itemlists: {
                  include: {
                    item: true
                  }
                }
              },
              orderBy: {
                Date: 'desc' // เรียงจากใหม่ไปเก่า
              }
            }
          }
        }
      }
    });
    
    // รวมใบแจ้งหนี้จากทุกห้องที่เคยเช่า
    const allInvoices = contracts.flatMap(contract => contract.room.invoices);
    
    // คำนวณสถิติ
    const totalPaid = allInvoices
      .filter(inv => inv.status.name === 'ชำระแล้ว')
      .reduce((sum, inv) => {
        const invoiceTotal = inv.itemlists.reduce(
          (itemSum, item) => itemSum + (item.quantity * item.item.price),
          0
        );
        return sum + invoiceTotal;
      }, 0);
    
    const totalPending = allInvoices
      .filter(inv => inv.status.name === 'รอชำระ')
      .reduce((sum, inv) => {
        const invoiceTotal = inv.itemlists.reduce(
          (itemSum, item) => itemSum + (item.quantity * item.item.price),
          0
        );
        return sum + invoiceTotal;
      }, 0);
    
    res.json({
      tenant: {
        id: parseInt(id)
      },
      summary: {
        totalPaid,
        totalPending,
        totalInvoices: allInvoices.length
      },
      invoices: allInvoices
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST create tenant สร้างผู้เช่าใหม่
export const createTenant = async (req, res) => {
  try {
    const { FName, LName, Name, Gmail, Tel, userId } = req.body;
    
    // Validation - ตรวจสอบข้อมูลที่จำเป็น
    if (!FName || !LName || !Name || !Gmail || !Tel) {
      return res.status(400).json({ 
        error: 'All tenant information (FName, LName, Name, Gmail, Tel) is required' 
      });
    }
    
    // ถ้ามี userId ให้ตรวจสอบว่า user มีอยู่จริง
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { UserID: parseInt(userId) }
      });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // ตรวจสอบว่า user นี้ยังไม่มี tenant profile อยู่แล้ว
      const existingTenant = await prisma.tenant.findUnique({
        where: { userId: parseInt(userId) }
      });
      
      if (existingTenant) {
        return res.status(400).json({ 
          error: 'This user already has a tenant profile' 
        });
      }
    }
    
    const tenant = await prisma.tenant.create({
      data: {
        FName,
        LName,
        Name,
        Gmail,
        Tel,
        ...(userId && { userId: parseInt(userId) })
      },
      include: {
        user: true
      }
    });
    
    res.status(201).json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT update tenant อัพเดทข้อมูลผู้เช่า
export const updateTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const { FName, LName, Name, Gmail, Tel, userId } = req.body;
    
    // ถ้ามีการเปลี่ยน userId ให้ตรวจสอบ
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { UserID: parseInt(userId) }
      });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // ตรวจสอบว่า userId นี้ไม่ได้ถูกใช้โดย tenant อื่น
      const existingTenant = await prisma.tenant.findUnique({
        where: { userId: parseInt(userId) }
      });
      
      if (existingTenant && existingTenant.TenantID !== parseInt(id)) {
        return res.status(400).json({ 
          error: 'This user is already linked to another tenant' 
        });
      }
    }
    
    const tenant = await prisma.tenant.update({
      where: { TenantID: parseInt(id) },
      data: {
        ...(FName && { FName }),
        ...(LName && { LName }),
        ...(Name && { Name }),
        ...(Gmail && { Gmail }),
        ...(Tel && { Tel }),
        ...(userId !== undefined && { userId: userId ? parseInt(userId) : null })
      },
      include: {
        user: true
      }
    });
    
    res.json(tenant);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

// DELETE tenant ลบผู้เช่า (ต้องไม่มีสัญญาหรือผู้อยู่ร่วมเชื่อมอยู่)
export const deleteTenant = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.tenant.delete({
      where: { TenantID: parseInt(id) }
    });
    
    res.json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        error: 'Cannot delete tenant with existing contracts or roommates' 
      });
    }
    res.status(500).json({ error: error.message });
  }
};