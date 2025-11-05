// src/pages/owner/InformOwner.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function InformOwner() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    phone: "",
    gender: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await apiClient.post("/auth/complete-profile", {
        FName: form.firstName,
        LName: form.lastName,
        Name: form.nickname,
        phone: form.phone,
        role: 'OWNER' 
      });

      setUser(response.data.user); 
      console.log("สมัคร Owner สำเร็จ:", form);
      navigate("/owner/dashboard"); 

    } catch (err) {
      console.error("เกิดข้อผิดพลาดขณะบันทึกข้อมูล:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("เกิดข้อผิดพลาด ไม่สามารถบันทึกข้อมูลได้");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-start pt-7 px-4 py-10">
      
      <h2 className="text-center text-[36px] font-[Playfair_Display] mb-7">
        ลงทะเบียน (เจ้าของหอพัก)
      </h2>

      {error && (
        <div className="w-full max-w-[720px] text-center text-red-500 font-bold mb-4 p-3 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

     
      <form onSubmit={handleSubmit} className="w-full max-w-[720px]">
        {/* ชื่อ / นามสกุล */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[20px] font-[Podkova] mb-1 ml-3">ชื่อ</label>
            <div className="w-full h-[60px] rounded-[19px] border border-black bg-white flex items-center px-6">
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                type="text"
                placeholder="กรอกชื่อ"
                className="w-full outline-none border-none text-[18px] md:text-[20px] font-[Playfair_Display] placeholder:text-black/50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[20px] font-[Podkova] mb-1 ml-3">นามสกุล</label>
            <div className="w-full h-[60px] rounded-[19px] border border-black bg-white flex items-center px-6">
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                type="text"
                placeholder="กรอกนามสกุล"
                className="w-full outline-none border-none text-[18px] md:text-[20px] font-[Playfair_Display] placeholder:text-black/50"
                required
              />
            </div>
          </div>
        </div>

        {/* ชื่อเล่น */}
        <div className="mt-6">
          <label className="block text-[20px] font-[Podkova] mb-1 ml-3">ชื่อเล่น</label>
          <div className="w-full h-[60px] rounded-[19px] border border-black bg-white flex items-center px-6">
            <input
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              type="text"
              placeholder="กรอกชื่อเล่น"
              className="w-full outline-none border-none text-[18px] md:text-[20px] font-[Playfair_Display] placeholder:text-black/50"
              required
            />
          </div>
        </div>

        {/* เบอร์โทรศัพท์ */}
        <div className="mt-6">
          <label className="block text-[20px] font-[Podkova] mb-1 ml-3">เบอร์โทรศัพท์</label>
          <div className="w-full h-[60px] rounded-[19px] border border-black bg-white flex items-center px-6">
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              type="tel"
              placeholder="กรอกเบอร์โทรศัพท์"
              className="w-full outline-none border-none text-[18px] md:text-[20px] font-[Playfair_Display] placeholder:text-black/50"
              required
            />
          </div>
        </div>

        {/* เพศ */}
        <div className="mt-6">
          <div className="block text-[20px] font-[Podkova] mb-2 ml-1">เพศ</div>
          <div className="flex items-center gap-8 pl-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={form.gender === "female"}
                onChange={handleChange}
                className="w-5 h-5 accent-pink-400"
              />
              <span className="text-[20px] font-[Playfair_Display]">หญิง</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={form.gender === "male"}
                onChange={handleChange}
                className="w-5 h-5 accent-[#1081D2]"
              />
              <span className="text-[20px] font-[Playfair_Display]">ชาย</span>
            </label>
          </div>
        </div>

        {/* ปุ่มยืนยัน */}
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            className="w-[350px] h-[60px] rounded-[19px] bg-[#FFE6C8] text-[22px] font-[Playfair_Display] text-[#7D6796]"
          >
            ยืนยันการลงทะเบียน
          </button>
        </div>
      </form>
    </div>
  );
}