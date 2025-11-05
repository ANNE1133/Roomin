// src/pages/auth/LoginOwner.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import bgVector from "../../assets/bg-vector.svg";
import iconGoogle from "../../assets/icon-google.svg";

// ✅ import ตัวยามของเรา
import apiClient from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function LoginOwner() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // 1. 🔻 เพิ่ม State สำหรับคุม Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 2. 🔻 เพิ่มฟังก์ชันสำหรับ Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 3. 🔻 ยิง API (ใช้ endpoint /login เดิม)
      const response = await apiClient.post("/login", {
        email: email,
        password: password,
      });

      console.log("Owner login successful:", response.data);

      // 4. 🔻 (สำคัญ!) ถ้าสำเร็จ ให้ไปหน้า Owner Dashboard
      navigate("/owner/dashboard");

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("เกิดข้อผิดพลาดในการล็อกอิน");
      }
    }
  };

  // 5. 🔻 เพิ่มฟังก์ชันสำหรับ Google Login
  const handleGoogleLogin = () => {
    // (ใช้ endpoint /api/auth/login เดิม)
    window.location.href = "http://localhost:3000/api/auth/login";
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ... (พื้นหลัง) ... */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* ... (โลโก้) ... */}

        {/* 6. 🔻 เปลี่ยนเป็น <form> */}
        <form onSubmit={handleLogin} className="w-full max-w-[564px] mt-16 md:mt-20 lg:mt-24">
          
          {/* 7. 🔻 แก้หัวข้อ */}
          <h2 className="text-center text-[36px] font-[Playfair_Display] mb-6">
            เจ้าของหอพัก
          </h2>

          {/* แสดง Error ถ้ามี */}
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
              value={email} // ◀️ ผูก State
              onChange={(e) => setEmail(e.target.value)} // ◀️ ผูก State
              required
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
              value={password} // ◀️ ผูก State
              onChange={(e) => setPassword(e.target.value)} // ◀️ ผูก State
              required
            />
            {/* ... (ปุ่มไอคอนตา) ... */}
          </div>

          {/* ปุ่มเข้าสู่ระบบ */}
          {/* 8. 🔻 เปลี่ยนเป็น type="submit" */}
          <button
            type="submit"
            className="w-full h-[70px] rounded-[19px] bg-[#FFE6C8] text-[26px] font-[Playfair_Display] text-[#7D6796] mb-8"
          >
            เข้าสู่ระบบ
          </button>

          <div className="text-center text-[22px] font-[Playfair_Display] mb-6">
            หรือ
          </div>

          {/* 9. 🔻 แก้ปุ่ม Google */}
          <button
            type="button" // (สำคัญ: ต้องเป็น "button" ไม่ใช่ "submit")
            onClick={handleGoogleLogin} // ◀️ เรียกฟังก์ชัน Google
            className="w-full h-[70px] rounded-[19px] border border-black bg-white flex items-center justify-center gap-3"
          >
            <img src={iconGoogle} alt="Google" className="w-[29px] h-[29px]" />
            <span className="text-[24px] font-[Playfair_Display] text-black">
              เข้าสู่ระบบด้วย Google
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}