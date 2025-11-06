import prisma from '../config/prisma.js';

// GET all users
// ดึงข้อมูล user ทั้งหมด
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        contracts: true,
        roommates: true,
        invoices: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { UserID: parseInt(id) },
      include: {
        contracts: true,
        roommates: true,
        invoices: true
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
export const getUserByAuthId = async (req, res) => {
  try {
    const { authId } = req.params;
    const user = await prisma.user.findUnique({
      where: { authId },
      include: {
        contracts: true,
        roommates: true,
        invoices: true
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
export const createUser = async (req, res) => {
  try {
    const { authId, FName, LName, Name, email, phone, role } = req.body;

    if (!authId || !FName || !LName || !Name || !email) {
      return res.status(400).json({ 
        error: 'authId, FName, LName, Name, and email are required' 
      });
    }

    const user = await prisma.user.create({
      data: {
        authId,
        FName,
        LName,
        Name,
        email,
        phone,
        role: role || 'TENANT'
      }
    });

    res.status(201).json(user);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'User with this authId already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

// PUT update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { FName, LName, Name, email, phone, role } = req.body;

    const user = await prisma.user.update({
      where: { UserID: parseInt(id) },
      data: {
        ...(FName && { FName }),
        ...(LName && { LName }),
        ...(Name && { Name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(role && { role })
      }
    });

    res.json(user);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

// DELETE user
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
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Cannot delete user with associated contracts, roommates, or invoices' });
    }
    res.status(500).json({ error: error.message });
  }
};
