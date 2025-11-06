import prisma from '../config/prisma.js';

// ดึงข้อมูลตึกทั้งหมด
export const getAllBuildings = async (req, res) => {
  try {
    const buildings = await prisma.building.findMany({
      include: { rooms: true } // ถ้าต้องการรวม room ด้วย
    });
    res.json(buildings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ดึงข้อมูลตึกตาม ID
export const getBuildingById = async (req, res) => {
  try {
    const { id } = req.params;
    const building = await prisma.building.findUnique({
      where: { BuildingID: parseInt(id) },
      include: { rooms: true },
    });

    if (!building)
      return res.status(404).json({ message: 'Building not found' });

    res.json(building);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

//  เพิ่มตึกใหม่
export const createBuilding = async (req, res) => {
  try {
    const { BuildingName, dormitoryId } = req.body;

    if (!BuildingName || !dormitoryId) {
      return res.status(400).json({ message: 'Name and dormitoryId required' });
    }

    const building = await prisma.building.create({
      data: { BuildingName: BuildingName, 
              dormitoryId : dormitoryId },
    });

    res.status(201).json({ message: 'Building created', building });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// แก้ไขข้อมูลตึก
export const updateBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const { BuildingName } = req.body;

    if (!BuildingName) {
      return res.status(400).json({ message: 'Name required' });
    }

    const building = await prisma.building.update({
      where: { BuildingID: parseInt(id) },
      data: { BuildingName },
    });

    res.json({ message: 'Building updated', building });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ลบตึก
export const deleteBuilding = async (req, res) => {
  try {
    const { id } = req.params;

    const building = await prisma.building.delete({
      where: { BuildingID: parseInt(id) },
    });

    res.json({ message: 'Building deleted', building });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
