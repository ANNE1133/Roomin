import axios from 'axios';

const API_URL = "http://localhost:3000/api"; // base URL

// ดึงห้องทั้งหมด
export const getAllRooms = async () => {
  try {
    const res = await axios.get(`${API_URL}/rooms`);
    return res.data;
  } catch (err) {
    console.error("getAllRooms error:", err);
    throw err;
  }
};

// ดึงห้องว่าง (filter)
export const getAvailableRooms = async () => {
  try {
    const res = await axios.get(`${API_URL}/rooms/filter`);
    return res.data;
  } catch (err) {
    console.error("getAvailableRooms error:", err);
    throw err;
  }
};

// ดึงห้องตาม ID
export const getRoomById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/room/${id}`);
    return res.data;
  } catch (err) {
    console.error(`getRoomById error (id=${id}):`, err);
    throw err;
  }
};

// สร้างห้องใหม่
export const createRoom = async (roomData) => {
  try {
    const res = await axios.post(`${API_URL}/room/createroom`, roomData);
    return res.data;
  } catch (err) {
    console.error("createRoom error:", err);
    throw err;
  }
};

// แก้ไขห้อง
export const updateRoom = async (id, roomData) => {
  try {
    const res = await axios.put(`${API_URL}/room/${id}`, roomData);
    return res.data;
  } catch (err) {
    console.error(`updateRoom error (id=${id}):`, err);
    throw err;
  }
};

// ลบห้อง
export const deleteRoom = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/room/${id}`);
    return res.data;
  } catch (err) {
    console.error(`deleteRoom error (id=${id}):`, err);
    throw err;
  }
};
