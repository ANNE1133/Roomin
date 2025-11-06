// src/pages/auth/LoginOwner.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import bgVector from "../../assets/bg-vector.svg";
import iconGoogle from "../../assets/icon-google.svg";

import apiClient from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";

const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // (ยิง API /login ... ที่เรา "อัปเกรด" แล้วใน Backend)
      const response = await apiClient.post("/login", {
        email: email,
        password: password,
      });

      const userProfile = response.data.user; // (นี่คือ "Profile" ... ไม่ใช่ "Auth User")
      setUser(userProfile); // (อัปเดตความจำ)
      
      // (ตรรกะ "คัดแยก" Role)
      if (userProfile.role === 'OWNER') {
        navigate("/owner/dashboard");
      } else {
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

  const handleGoogleLogin = () => {
    // (ส่งสัญญาณ ?role=OWNER ... เพื่อให้ Backend "ฝัง" Cookie ที่ถูกต้อง)
    window.location.href = "http://localhost:3000/api/auth/login?role=OWNER";
  };

export default function LoginOwner() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); 
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* พื้นหลังกรอบม่วง */}
      <img
        src={bgVector}
        alt=""
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
        style={{
          transform: "scale(1.25) translateY(4.5%)",
          objectPosition: "center top",
        }}
      />

      {/* เนื้อหา */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* โลโก้ + ROOMIN */}
        <header className="flex items-center gap-8 mb-0">
          <Logo size={92} showText={false} />
          <h1 className="text-[64px] font-bold font-[Playfair_Display] leading-[1.333] text-[#FFFDFB]">
            ROOMIN
          </h1>
        </header>

        {/* เนื้อหาหลัก */}
        <main className="w-full max-w-[564px] mt-16 md:mt-20 lg:mt-24">
          <h2 className="text-center text-[36px] font-[Playfair_Display] mb-6">
            เจ้าของหอพัก
          </h2>

          {/* อีเมล */}
          <label className="block text-[22px] font-[Podkova] mb-1 ml-6">
            อีเมล
          </label>
          <div className="w-full h-[70px] rounded-[19px] border border-black bg-white flex items-center px-6 mb-6">
            <input
              type="email"
              placeholder="กรอก account@gmail.com"
              className="w-full outline-none border-none text-[22px] font-[Playfair_Display] placeholder:text-black/50"
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
            />
            {/* ปุ่มไอคอนตา */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 focus:outline-none"
            >
              {showPassword ? (
                // ถ้าเปิดให้ดูรหัส
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                // ปิดรหัส 
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.964 9.964 0 012.642-4.362M9.88 9.88A3 3 0 0114.12 14.12M6.1 6.1l11.8 11.8"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* ปุ่มเข้าสู่ระบบ */}
          <button
            onClick={() => navigate("/owner/dashboard")}
            className="w-full h-[70px] rounded-[19px] bg-[#FEB863] hover:bg-[#FEA130] transition-colors duration-200 text-[26px] font-[Playfair_Display] text-white mb-8"
          >
            เข้าสู่ระบบ
          </button>

          <div className="text-center text-[22px] font-[Playfair_Display] mb-6">
            หรือ
          </div>

          {/* ปุ่ม Google */}
          <button
            onClick={handleGoogleLogin}
            className="w-full h-[70px] rounded-[19px] border border-black bg-white flex items-center justify-center gap-3"
          >
            <img src={iconGoogle} alt="Google" className="w-[29px] h-[29px]" />
            <span className="text-[24px] font-[Playfair_Display] text-black">
              สมัครสมาชิกด้วย Google
            </span>
          </button>
        </main>
      </div>
    </div>
  );
}
