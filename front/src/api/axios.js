import axios from "axios";

// สร้าง instance ของ axios
const apiClient = axios.create({
  // 1. ชี้ไปที่ Backend Express ของคุณ
  baseURL: "http://localhost:3000/api", 
  
  // 2. (สำคัญ!) อนุญาตให้ส่ง/รับ Cookie ข้าม Domain
  withCredentials: true, 
});

// 3. (นี่คือพระเอก!) ตั้งค่า Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // ถ้า Response สำเร็จ (2xx) ก็แค่ส่งข้อมูลกลับไป
    return response;
  },
  (error) => {
    // ถ้า Response มีปัญหา
    const status = error.response ? error.response.status : null;

    // 4. เช็กว่าใช่ 401 (Unauthorized) หรือไม่?
    if (status === 401) {
      
      // 5. (สำคัญ!) เช็กก่อนว่าเรา "ไม่ได้" อยู่ที่หน้า login อยู่แล้ว
      // เพื่อป้องกันการเด้งวนลูป
      if (window.location.pathname !== "/login/tenant") {
        console.error("UNAUTHORIZED (401). Redirecting to /login/tenant...");
        
        // 6. (นี่คือจุดที่แก้!) บังคับเด้งไปหน้า login
        window.location.href = "/login/tenant"; // ◀️ **ใช้ path ที่ถูกต้องจาก router.jsx**
      }
    }

    // ส่ง error ต่อให้ .catch() ที่เรียกใช้ API ไปจัดการ
    return Promise.reject(error);
  }
);

// export ตัว apiClient นี้ไปใช้ทั่วโปรเจกต์
export default apiClient;