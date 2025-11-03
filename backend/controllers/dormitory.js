import prisma from '../config/prisma.js';

//  เพิ่มหอใหม่
export const createDormitory = async (req, res) => {
  try {
    const { Dormitoryname, address, phone, ownerId } = req.body;

    if (!Dormitoryname) {
      return res.status(400).json({ message: 'Dormitoryname is required' });
    }

    const dormitory = await prisma.dormitory.create({
      data: { 
        Dormitoryname,
        address,
        phone,
        ownerId
      },
    });

    res.status(201).json({ message: 'Dormitory created', dormitory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// ลบหอ
export const deleteDormitory = async (req, res) => {
  try {
    const { id } = req.params;

    const dormitory  = await prisma.dormitory .delete({
      where: { DormitoryID: parseInt(id) },
    });

    res.json({ message: 'Dormitory deleted', dormitory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
