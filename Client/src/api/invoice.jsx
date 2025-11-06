import axios from 'axios'
const API_URL = "http://localhost:3000/api/invoices"; // เปลี่ยนตาม backend ของคุณ

// export const createInvoice = async(invoiceData)=> {
//     return axios.post('http://localhost:3000/api/invoices',invoiceData,{

//     })
// }

/**
 * สร้าง invoice ใหม่
 * @param {Object} invoiceData - ข้อมูล invoice
 * @returns {Promise} response.data
 */
export const createInvoice = async (invoiceData) => {
  try {
    const response = await axios.post(API_URL, invoiceData, {
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

// ดึง invoices ของผู้ใช้
export const getInvoicesByAuthId = async (authId) => {
  const res = await axios.get(`${API_URL}/user/test12345`);
  return res.data;
};

export const getAllInvoices = async (invoice) => {
  const res = await axios.get(`${API_URL}`);
  return res.data;
};
