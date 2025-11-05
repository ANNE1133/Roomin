// src/pages/auth/LoginOwner.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import bgVector from "../../assets/bg-vector.svg";
import iconGoogle from "../../assets/icon-google.svg";

import apiClient from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function LoginOwner() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await apiClient.post("/login", {
        email: email,
        password: password,
      });

      const userProfile = response.data.user; // (Profile จากตาราง User)
      setUser(userProfile); // (อัปเดตความจำ)
      
      // (ตรรกะ "คัดแยก" Role)
      if (userProfile.role === 'OWNER') {
        navigate("/owner/dashboard");
      } else {
        // (ถ้า Tenant เผลอมาล็อกอินหน้านี้... ก็ส่งกลับบ้าน)
        navigate("/tenant/dashboard");
      }

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("เกิดข้อผิดพลาดในการล็อกอิน");
      }
    }
  };

  // 5. 🔻 (เพิ่ม) ฟังก์ชัน Google (ที่ "ส่งสัญญาณ" Role)
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/login?role=OWNER";
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ... (พื้นหลัง) ... */}
      
      {/* เนื้อหา */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* ... (โลโก้) ... */}

        {/* 6. 🔻 (เปลี่ยน) เป็น <form> และเชื่อม onSubmit */}
        <form onSubmit={handleLogin} className="w-full max-w-[564px] mt-16 md:mt-20 lg:mt-24">
          
          <h2 className="text-center text-[36px] font-[Playfair_Display] mb-6">
            เจ้าของหอพัก
          </h2>

          {/* 7. 🔻 (เพิ่ม) แสดง Error ถ้ามี */}
          {error && (
            <div className="text-center text-red-500 font-bold mb-4">
              {error}
            </div>
          )}

          {/* อีเมล */}
          <label className="block text-[22px] font-[Podkova] mb-1 ml-6">
            อีเมล
          </label>
          <div className="w-full h-[70px] rounded-[19px] border border-black bg-white flex items-center px-6 mb-6">
            <input
              type="email"
              placeholder="กรอก account@gmail.com"
              className="w-full outline-none border-none text-[22px] font-[Playfair_Display] placeholder:text-black/50"
              value={email} // ◀️ 8. (เชื่อม)
              onChange={(e) => setEmail(e.target.value)} // ◀️ 8. (เชื่อม)
              required // ◀️ 8. (เพิ่ม)
            />
          </div>

          {/* รหัสผ่าน + ปุ่มตา */}
          <label className="block text-[22px] font-[Podkova] mb-1 ml-6">
            รหัสผ่าน
          </label>
          <div className="w-full h-[70px] rounded-[19px] border border-black bg-white flex items-center justify-between px-6 mb-6">
            <input
              type={showPassword ? "text" : "password"} 
              placeholder="กรอกรหัสผ่าน"
              className="w-full outline-none border-none text-[22px] font-[Playfair_Display] placeholder:text-black/50 pr-3"
              value={password} // ◀️ 9. (เชื่อม)
              onChange={(e) => setPassword(e.target.value)} // ◀️ 9. (เชื่อม)
              required // ◀️ 9. (เพิ่ม)
            />
            {/* ... (ปุ่มไอคอนตา) ... */}
          </div>

          {/* ปุ่มเข้าสู่ระบบ */}
          <button
            type="submit" // ◀️ 10. (เปลี่ยน)
            className="w-full h-[70px] rounded-[19px] bg-[#FFE6C8] text-[26px] font-[Playfair_Display] text-[#7D6796] mb-8"
          >
            เข้าสู่ระบบ
          </button>

          <div className="text-center text-[22px] font-[Playfair_Display] mb-6">
            หรือ
          </div>

          {/* ปุ่ม Google */}
          <button
            type="button" // ◀️ 11. (เปลี่ยน)
            onClick={handleGoogleLogin} // ◀️ 11. (เชื่อม!)
            className="w-full h-[70px] rounded-[19px] border border-black bg-white flex items-center justify-center gap-3"
          >
            <img src={iconGoogle} alt="Google" className="w-[29px] h-[29px]" />
            <span className="text-[24px] font-[Playfair_Display] text-black">
              {/* (แก้คำจาก "สมัครสมาชิก" เป็น "เข้าสู่ระบบ") */}
              เข้าสู่ระบบด้วย Google 
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
