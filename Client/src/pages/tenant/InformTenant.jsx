import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../../components/Logo";
import bgVector from "../../assets/bg-vector.svg"; // ✅ พื้นหลังม่วงเหมือนหน้า LoginTenant

export default function InformTenant() {
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
        gender: form.gender,
        role: "TENANT",
      });

      setUser(response.data.user);
      navigate("/tenant/dashboard");
    } catch (err) {
      console.error("เกิดข้อผิดพลาดขณะบันทึกข้อมูล:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("เกิดข้อผิดพลาด ไม่สามารถบันทึกข้อมูลได้");
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ✅ พื้นหลัง vector ม่วง */}
      <img
        src={bgVector}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
        style={{
          transform: "scale(1.25) translateY(4.5%)",
          objectPosition: "center top",
        }}
      />

      {/* ✅ เนื้อหาหลัก */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-10">
        {/* โลโก้ + ROOMIN */}
        <header className="flex items-center gap-8 mb-0 select-none">
          <Logo size={92} showText={false} />
          <h1 className="text-[64px] font-bold font-[Playfair_Display] leading-[1.333] text-[#FFFDFB]">
            ROOMIN
          </h1>
        </header>

        {/* ✅ หัวข้อสีดำ */}
        <h2 className="text-center text-[36px] font-[Playfair_Display] text-black mt-14 mb-6">
          ลงทะเบียนผู้เช่า
        </h2>

        {error && (
          <div className="text-center text-red-500 font-bold mb-4 bg-red-100 rounded-lg py-2 px-3">
            {error}
          </div>
        )}

        {/* ✅ ฟอร์มลงทะเบียน */}
        <form onSubmit={handleSubmit} className="w-full max-w-[564px]">
          {/* ชื่อ / นามสกุล */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[20px] font-[Podkova] mb-1 ml-3 text-black">
                ชื่อ
              </label>
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
              <label className="block text-[20px] font-[Podkova] mb-1 ml-3 text-black">
                นามสกุล
              </label>
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
            <label className="block text-[20px] font-[Podkova] mb-1 ml-3 text-black">
              ชื่อเล่น
            </label>
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
            <label className="block text-[20px] font-[Podkova] mb-1 ml-3 text-black">
              เบอร์โทรศัพท์
            </label>
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
            <div className="block text-[20px] font-[Podkova] mb-2 ml-1 text-black">
              เพศ
            </div>
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
                <span className="text-[20px] font-[Playfair_Display] text-black">
                  หญิง
                </span>
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
                <span className="text-[20px] font-[Playfair_Display] text-black">
                  ชาย
                </span>
              </label>
            </div>
          </div>

          {/* ปุ่มยืนยัน */}
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="w-[350px] h-[60px] rounded-[19px] bg-[#FEB863] hover:bg-[#FEA130] transition-colors duration-200 text-[22px] font-[Playfair_Display] text-white"
            >
              ยืนยันการลงทะเบียน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
