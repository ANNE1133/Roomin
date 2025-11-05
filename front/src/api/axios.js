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
    const { response, config } = error;
    const status = error.response ? error.response.status : null;

    // 4. เช็กว่าใช่ 401 (Unauthorized) หรือไม่?
    if (status === 401) {
      
      // 5. 🔻 (เพิ่มเงื่อนไข!) เช็กว่า 401 นี้ "ไม่ใช่" จาก API ที่ "ตั้งใจ" จะเช็ก (auth/me)
      // (config.url คือ 'auth/me', 'login' ฯลฯ)
      const isPublicCheck = config.url.endsWith('/auth/me');

      // 6. (สำคัญ!) เช็กก่อนว่าเรา "ไม่ได้" อยู่ที่หน้า login อยู่แล้ว
      // (เราจะเช็กว่า path มัน "ขึ้นต้น" ด้วย /login หรือไม่)
      const isNotOnLoginPage = window.location.pathname.startsWith('/login') === false;

      // 7. 🔻 (กฎใหม่!) "ถ้า" เป็น 401... 
      //    "และ" มัน "ไม่ใช่" API เช็กตัวเอง... 
      //    "และ" เรา "ไม่ได้" อยู่หน้า Login
      if (!isPublicCheck && isNotOnLoginPage) {
        
        console.error("UNAUTHORIZED (401) on a private route. Redirecting to /login/tenant...");
        
        // 8. บังคับเด้งไปหน้า login
        window.location.href = "/login/tenant"; // (หรือ /login/owner ก็ได้ถ้าคุณมี logic)
      }
    }

    // 9. ส่ง error ต่อให้ .catch() ที่เรียกใช้ API ไปจัดการ
    // (ในกรณีนี้ /auth/me จะถูก .catch() ใน AuthContext... ซึ่งถูกต้อง!)
    return Promise.reject(error);
  }
);

// export ตัว apiClient นี้ไปใช้ทั่วโปรเจกต์
export default apiClient;