// controllers/itemListController.js
import prisma from '../config/prisma.js';

// GET all item lists
// ดึงรายการค่าใช้จ่ายทั้งหมด
export const getAllItemLists = async (req, res) => {
  try {
    const { invoiceId, itemId } = req.query;
    
    const where = {};
    
    if (invoiceId) {
      where.invoiceId = parseInt(invoiceId);
    }
    
    if (itemId) {
      where.itemId = parseInt(itemId);
    }
    
    const itemlists = await prisma.itemList.findMany({
      where,
      include: {
        item: true,
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
            },
            status: true
          }
        }
      }
    });
    
    // เพิ่มการคำนวณยอดรวมของแต่ละรายการ
    const itemlistsWithTotal = itemlists.map(itemlist => ({
      ...itemlist,
      totalPrice: itemlist.quantity * itemlist.item.price
    }));
    
    res.json(itemlistsWithTotal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET item list by ID
// ดึงรายการค่าใช้จ่ายตาม ID
export const getItemListById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const itemlist = await prisma.itemList.findUnique({
      where: { ItemListID: parseInt(id) },
      include: {
        item: true,
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
            },
            status: true
          }
        }
      }
    });
    
    if (!itemlist) {
      return res.status(404).json({ error: 'Item list not found' });
    }
    
    res.json({
      ...itemlist,
      totalPrice: itemlist.quantity * itemlist.item.price
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET item lists by invoice
// ดึงรายการค่าใช้จ่ายทั้งหมดของใบแจ้งหนี้หนึ่ง
export const getItemListsByInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    
    const itemlists = await prisma.itemList.findMany({
      where: {
        invoiceId: parseInt(invoiceId)
      },
      include: {
        item: true
      }
    });
    
    // คำนวณยอดรวม
    const itemlistsWithTotal = itemlists.map(itemlist => ({
      ...itemlist,
      totalPrice: itemlist.quantity * itemlist.item.price
    }));
    
    const grandTotal = itemlistsWithTotal.reduce(
      (sum, itemlist) => sum + itemlist.totalPrice,
      0
    );
    
    res.json({
      itemlists: itemlistsWithTotal,
      summary: {
        totalItems: itemlists.length,
        grandTotal
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST create item list
// เพิ่มรายการค่าใช้จ่ายในใบแจ้งหนี้
export const createItemList = async (req, res) => {
  try {
    const { invoiceId, itemId, quantity } = req.body;
    
    // Validation
    if (!invoiceId || !itemId || !quantity) {
      return res.status(400).json({ 
        error: 'Invoice ID, item ID, and quantity are required' 
      });
    }
    
    if (parseInt(quantity) <= 0) {
      return res.status(400).json({ 
        error: 'Quantity must be greater than 0' 
      });
    }
    
    // ตรวจสอบว่าใบแจ้งหนี้มีอยู่จริง
    const invoice = await prisma.invoice.findUnique({
      where: { InvoiceID: parseInt(invoiceId) }
    });
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    // ตรวจสอบว่ารายการค่าใช้จ่ายมีอยู่จริง
    const item = await prisma.item.findUnique({
      where: { ItemID: parseInt(itemId) }
    });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // ตรวจสอบว่ารายการนี้ยังไม่ได้ถูกเพิ่มในใบแจ้งหนี้นี้แล้ว
    const existingItemList = await prisma.itemList.findFirst({
      where: {
        invoiceId: parseInt(invoiceId),
        itemId: parseInt(itemId)
      }
    });
    
    if (existingItemList) {
      return res.status(400).json({ 
        error: 'This item already exists in the invoice. Use update to change quantity.' 
      });
    }
    
    const itemlist = await prisma.itemList.create({
      data: {
        invoiceId: parseInt(invoiceId),
        itemId: parseInt(itemId),
        quantity: parseInt(quantity)
      },
      include: {
        item: true,
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
      }
    });
    
    res.status(201).json({
      ...itemlist,
      totalPrice: itemlist.quantity * itemlist.item.price
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT update item list
// อัพเดทรายการค่าใช้จ่าย (โดยปกติจะเปลี่ยนแค่ quantity)
export const updateItemList = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, itemId } = req.body;
    
    if (quantity && parseInt(quantity) <= 0) {
      return res.status(400).json({ 
        error: 'Quantity must be greater than 0' 
      });
    }
    
    // ถ้ามีการเปลี่ยน itemId ตรวจสอบว่ารายการใหม่มีอยู่จริง
    if (itemId) {
      const item = await prisma.item.findUnique({
        where: { ItemID: parseInt(itemId) }
      });
      
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
    }
    
    const itemlist = await prisma.itemList.update({
      where: { ItemListID: parseInt(id) },
      data: {
        ...(quantity && { quantity: parseInt(quantity) }),
        ...(itemId && { itemId: parseInt(itemId) })
      },
      include: {
        item: true,
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
      }
    });
    
    res.json({
      ...itemlist,
      totalPrice: itemlist.quantity * itemlist.item.price
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Item list not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

// DELETE item list
// ลบรายการค่าใช้จ่ายออกจากใบแจ้งหนี้
export const deleteItemList = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.itemList.delete({
      where: { ItemListID: parseInt(id) }
    });
    
    res.json({ message: 'Item list deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Item list not found' });
    }
    res.status(500).json({ error: error.message });
  }
};