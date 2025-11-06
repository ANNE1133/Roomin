import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../../components/Logo";
import bgVector from "../../assets/bg-vector.svg"; // ✅ เพิ่ม vector พื้นหลัง

export default function InformOwner() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    phone: "",
    gender: "",
    creditCard: "",
    promotion: "",
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
        creditCard: form.creditCard,
        promotion: form.promotion,
        role: "OWNER",
      });

      setUser(response.data.user);
      navigate("/owner/dashboard");
    } catch (err) {
      console.error("เกิดข้อผิดพลาดขณะบันทึกข้อมูล:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("เกิดข้อผิดพลาด ไม่สามารถบันทึกข้อมูลได้");
      }
    }
  };

  const promotions = [
    {
      id: "basic",
      title: "Roomin Basic",
      price: "ฟรี",
      desc: "เหมาะสำหรับเจ้าของหอพักที่เพิ่งเริ่มต้น จัดการห้องพักได้สูงสุด 10 ห้อง",
    },
    {
      id: "plus",
      title: "Roomin Plus",
      price: "฿199 / เดือน",
      desc: "เพิ่มระบบแจ้งเตือนอัตโนมัติและรายงานสรุปรายได้แบบรายเดือน",
    },
    {
      id: "premium",
      title: "Roomin Premium",
      price: "฿299 / เดือน",
      desc: "ครบทุกฟีเจอร์ รวมถึงระบบวิเคราะห์รายได้และจัดการหลายสาขา",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ✅ พื้นหลัง Vector ม่วง */}
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* โลโก้ + ROOMIN */}
        <header className="flex items-center gap-8 mb-6 select-none">
          <Logo size={92} showText={false} />
          <h1 className="text-[64px] font-bold font-[Playfair_Display] text-[#FFFDFB]">
            ROOMIN
          </h1>
        </header>

        <h2 className="text-center text-[36px] font-[Playfair_Display] text-black mt-20 mb-8">
          ลงทะเบียนเจ้าของหอพัก
        </h2>

        {error && (
          <div className="w-full max-w-[720px] text-center text-red-500 font-bold mb-4 p-3 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* ✅ ฟอร์มอยู่ตรงกลาง */}
        <form onSubmit={handleSubmit} className="w-full max-w-[720px] mx-auto">
          {/* ชื่อ / นามสกุล */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[20px] font-[Podkova] mb-1 ml-3 text-black">ชื่อ</label>
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
              <label className="block text-[20px] font-[Podkova] mb-1 ml-3 text-black">นามสกุล</label>
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
            <label className="block text-[20px] font-[Podkova] mb-1 ml-3 text-black">ชื่อเล่น</label>
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
            <label className="block text-[20px] font-[Podkova] mb-1 ml-3 text-black">เบอร์โทรศัพท์</label>
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
            <div className="block text-[20px] font-[Podkova] mb-2 ml-1 text-black">เพศ</div>
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
                <span className="text-[20px] font-[Playfair_Display] text-black">หญิง</span>
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
                <span className="text-[20px] font-[Playfair_Display] text-black">ชาย</span>
              </label>
            </div>
          </div>

          {/* เลขบัตรเครดิต */}
          <div className="mt-6">
            <label className="block text-[20px] font-[Podkova] mb-1 ml-3 text-black">เลขบัตรเครดิต</label>
            <div className="w-full h-[60px] rounded-[19px] border border-black bg-white flex items-center px-6">
              <input
                name="creditCard"
                value={form.creditCard}
                onChange={handleChange}
                type="text"
                inputMode="numeric"
                placeholder="กรอกเลขบัตรเครดิต"
                className="w-full outline-none border-none text-[18px] md:text-[20px] font-[Playfair_Display] placeholder:text-black/50"
              />
            </div>
          </div>

          {/* โปรโมชั่นแบบการ์ด */}
          <div className="mt-8">
            <div className="block text-[20px] font-[Podkova] mb-3 ml-1 text-black">เลือกโปรโมชั่น</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {promotions.map((p) => (
                <label
                  key={p.id}
                  className={`cursor-pointer border rounded-2xl p-5 transition-all duration-200 ${
                    form.promotion === p.id
                      ? "border-[#7D6796] bg-[#FFF3E4] shadow-md"
                      : "border-gray-300 bg-white hover:border-[#E6C7A8] hover:bg-[#FFF8F1]"
                  }`}
                >
                  <input
                    type="radio"
                    name="promotion"
                    value={p.id}
                    checked={form.promotion === p.id}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="text-[22px] font-[Playfair_Display] font-semibold mb-1 text-[#645278]">
                    {p.title}
                  </div>
                  <div className="text-[20px] text-[#FEA130] font-semibold mb-2">
                    {p.price}
                  </div>
                  <div className="text-[16px] text-gray-600 leading-snug">{p.desc}</div>
                </label>
              ))}
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
