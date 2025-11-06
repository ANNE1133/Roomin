import axios from 'axios'
const API_URL = "http://localhost:3000/api/items"; // เปลี่ยนตาม backend ของคุณ

// ดึง invoices ของผู้ใช้
export const getInvoicesByAuthId = async (authId) => {
  const res = await axios.get(`${API_URL}/user/test12345`);
  return res.data;
};

export const createItem = async (itemData) => {
  try {
    const response = await axios.post(API_URL, itemData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // ส่งกลับข้อมูลจาก backend
  } catch (error) {
    // จัดการ error ให้ชัดเจน
    if (error.response) {
      // backend ส่ง error มา
      throw error.response.data;
    } else {
      // network error หรืออื่น ๆ
      throw { error: error.message };
    }
  }
};

export const getItems = async (item) => {
  const res = await axios.get(`${API_URL}`);
  return res.data;
};