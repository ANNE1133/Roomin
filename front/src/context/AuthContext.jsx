import { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/axios'; // ◀️ import "ยาม" ของเรา

// 1. สร้าง "กล่อง"
const AuthContext = createContext(null);

// 2. "ผู้ให้บริการ" 
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // (user คือใคร?)
  const [loading, setLoading] = useState(true); // "สถานะ" 

  // 3. (นี่คือหัวใจ) "เช็กความจำ" เมื่อแอปโหลดครั้งแรก
  useEffect(() => {
    const checkWhoAmI = async () => {
      try {
        // 4. 🔻 ยิงไปที่ API ใหม่ที่เราสร้าง!
        const response = await apiClient.get('/auth/me');
        
        // 5. ถ้าสำเร็จ (Backend ตอบ 200 OK)
        setUser(response.data.user); // ◀️ "ฉันจำได้แล้ว!"
        
      } catch (error) {
        // 6. ถ้าล้มเหลว (Backend ตอบ 401/404/500)
        setUser(null); // ◀️ "จำไม่ได้" (คือยังไม่ล็อกอิน)
      } finally {
        // 7. ไม่ว่าจะจำได้หรือไม่... "ฉันเช็กเสร็จแล้ว"
        setLoading(false);
      }
    };

    checkWhoAmI();
  }, []); // ◀️ [] = ทำงานแค่ "ครั้งเดียว" ตอนเปิดแอป

  // 8. ส่ง "ความจำ" (user) และ "สถานะ" (loading) ให้ลูกๆ
  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 9. สร้าง "ทางลัด" ให้ลูกๆ เรียกใช้
export const useAuth = () => useContext(AuthContext);