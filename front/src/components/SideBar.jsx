// src/components/SideBar.jsx
// 🔻 (1. "รวมร่าง" import 2 บรรทัด ให้เหลือบรรทัดเดียว) 🔻
import { NavLink, Link, useNavigate } from "react-router-dom"; 
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';

import { navItems } from "../nav/config";
import Logo from "./Logo"; 

export default function SideBar({ variant = "public", onNavigate }) {
  const items = navItems[variant] || [];
  const base = "block w-full text-left rounded-lg px-3 py-2 text-sm transition";

  // 2. 🔻 ดึง Hooks ที่จำเป็น
  const { user, setUser } = useAuth(); // ดึง "ความจำ"
  const navigate = useNavigate();      // ดึง "คนนำทาง"

  // 3. 🔻 สร้างฟังก์ชัน "ออกจากระบบ" (ตัวจริง)
  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout'); // ยิง API Logout
      setUser(null); // "ล้าง" ความจำใน React
      if (onNavigate) onNavigate(); // (สำหรับปิด Mobile Drawer)
      navigate('/');   // "เด้ง" กลับไปหน้า Landing
    } catch (err) {
      console.error("Failed to logout", err);
      // (ถึง API จะพัง, ก็บังคับล้างความจำหน้าบ้านอยู่ดี)
      setUser(null); 
      if (onNavigate) onNavigate();
      navigate('/');
    }
  };

  return (
    <aside className="h-full">
      <div className="h-full bg-[#645278] text-white p-4 flex flex-col">
        {/* --- โลโก้ + ชื่อแบรนด์ด้านบนของ Sidebar --- */}
        <div className="mt-4 mb-9 flex flex-col items-center">
          <Link to="/" className="flex flex-col items-center cursor-pointer select-none">
            <Logo size={80} showText={false} />
            <div className="mt-2 text-2xl font-semibold font-[Playfair_Display] leading-none">
              ROOMIN
            </div>
          </Link>
        </div>

        {/* --- รายการเมนูใน Sidebar --- */}
        <nav className="space-y-2">
          {items.map((it) =>
            it.to ? (
              // เมนูที่มีลิงก์จริง (มี active state)
              <NavLink
                key={it.label}
                to={it.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `${base} ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
                }
              >
                {it.label}
              </NavLink>
            ) : (
              // เมนูที่ยังไม่ต้องลิงก์ (ปุ่มเฉยๆ มี hover)
              <button
                key={it.label}
                type="button"
                className={`${base} hover:bg-white/10 cursor-default`}
                aria-disabled="true"
              >
                {it.label}
              </button>
            )
          )}
        </nav>

        {/* 4. 🔻 (แทนที่) ปุ่มออกจากระบบ (ตรึงไว้ล่างสุด) 🔻 */}
        <div className="mt-auto pt-4 border-t border-white/20">
          {user ? (
            // (ถ้า "จำได้" / ล็อกอินแล้ว) -> โชว์ปุ่ม "ออกจากระบบ"
            <button
              type="button"
              className="w-full rounded-lg px-3 py-2 text-sm hover:bg-white/10 text-left"
              onClick={handleLogout} // ◀️ (เชื่อมฟังก์ชัน!)
            >
              ออกจากระบบ
            </button>
          ) : (
            // (ถ้า "จำไม่ได้" / ยังไม่ล็อกอิน) -> โชว์ปุ่ม "เข้าสู่ระบบ"
            <Link
              to="/" // (กลับไปหน้า Landing)
              onClick={onNavigate}
              className="w-full rounded-lg px-3 py-2 text-sm hover:bg-white/10 text-left"
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}