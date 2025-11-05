// src/pages/owner/InformOwner.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import { useAuth } from "../../context/AuthContext"; // ◀️ 1. (เพิ่ม) Import ความจำ

export default function InformOwner() {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // ◀️ 2. (เพิ่ม) ดึง "คนอัปเดตความจำ"
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    phone: "",
    gender: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    // ... (เหมือนเดิม) ...
  };

  // 🔻 (นี่คือ "หัวใจ" ที่เปลี่ยนไป) 🔻
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 3. 🔻 (สำคัญ!) ส่ง "Role" ไปให้ Backend! 🔻
      const response = await apiClient.post("/auth/complete-profile", {
        FName: form.firstName,
        LName: form.lastName,
        Name: form.nickname,
        phone: form.phone,
        role: 'OWNER' // ◀️ (เปลี่ยน!) บอก Backend ว่านี่คือ "OWNER"
      });

      // 4. (เพิ่ม!) "อัปเดต" ความจำทันที (ด้วย Profile ที่ Backend ส่งกลับมา)
      setUser(response.data.user); 
      
      console.log("สมัคร Owner สำเร็จ:", form);
      navigate("/owner/dashboard"); // ◀️ (เปลี่ยน!) ส่งไป Dashboard Owner

    } catch (err) {
      // ... (โค้ด Error handling เหมือนเดิม) ...
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center ...">
      <h2 className="text-center ... mb-7">
        ลงทะเบียน (เจ้าของหอพัก) {/* ◀️ (เปลี่ยน!) แก้ไข Title */}
      </h2>

      {/* ... (ฟอร์มทั้งหมด... เหมือนเดิมเป๊ะ) ... */}
    </div>
  );
}