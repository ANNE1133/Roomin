import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ดึงข้อมูลตึกทั้งหมด
export const getAllBuildings = async () => {
  const res = await axios.get(`${BASE_URL}/Building`);
  return res.data;
};

// ดึงข้อมูลตึกตาม ID
export const getBuildingById = async (id) => {
  const res = await axios.get(`${BASE_URL}/Buildings/${id}`);
  return res.data;
};

// เพิ่มตึกใหม่
export const createBuilding = async (data) => {
  // data = { BuildingName, dormitoryId }
  const res = await axios.post(`${BASE_URL}/Building/createBuilding`, data);
  return res.data;
};

// แก้ไขตึก
export const updateBuilding = async (id, data) => {
  // data = { BuildingName }
  const res = await axios.put(`${BASE_URL}/Building/${id}`, data);
  return res.data;
};

// ลบตึก
export const deleteBuilding = async (id) => {
  const res = await axios.delete(`${BASE_URL}/Building/${id}`);
  return res.data;
};
