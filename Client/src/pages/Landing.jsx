// import { Link } from "react-router-dom";
// import ButtonRI from "../components/ButtonRI";
// import OwnerIcon from "../assets/icons/owner.png";
// import TenantIcon from "../assets/icons/tenant.png";
// import picLdO1 from "../assets/pic-ld-o1.png";
// import picLdO2 from "../assets/pic-ld-o2.png";
// import picLdT1 from "../assets/pic-ld-t1.png";
// import picLdT2 from "../assets/pic-ld-t2.png";
// import picLdT3 from "../assets/pic-ld-t3.png";
// import { useAuth } from "../contexts/AuthContext"; // ✅ import

// const TOPBAR_H = 64; // ถ้าเปลี่ยนความสูง TopBar ปรับเลขนี้
// const VH = `calc(100dvh - ${TOPBAR_H}px)`;

// // helper เลื่อนไป anchor ของแต่ละหน้า
// function scrollToId(id) {
//   const el = document.getElementById(id);
//   if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
// }

// export default function Landing() {
// 	const { login, logout, isLoggedIn } = useAuth();

//   	return (
//     <div className="space-y-24 overflow-x-clip">
//       {/* ========== หน้า 1: มุมมองของเจ้าของหอพัก ========== */}
//       <section id="manager" className=" relative scroll-mt-16 flex items-center overflow-x-hidden" style={{ minHeight: VH }}>
//         <div className="w-full max-w-7xl mx-auto px-8">
//           {/* หัวกลางตามฟิกม่า */}
//           <div className="text-center">
//             <h1 className="text-4xl md:text-4xl font-semibold tracking-tight font-serif">
//               ยินดีต้อนรับสู่ ROOMIN
//             </h1>
//             <p className="mt-4 md:text-xl">
//               แพลตฟอร์มที่ออกแบบมาเพื่อมอบประสบการณ์โดยการแสดงข้อมูลเชิงลึกอย่างครอบคลุม
//             </p>
//             <div className="mt-10">
//               {/* คลิกแล้วจัดหน้าให้ตรง anchor เดิม (ยังอยู่หน้า Manager) */}
//               <ButtonRI
//                 size="lg"
//                 bg="#FEB863"
//                 onClick={() => scrollToId('manager')}
//                 className="-ml-2 md:-ml-6 lg:-ml-150"
//                 >
//                 มุมมองของเจ้าของหอพัก
//               </ButtonRI>
//             </div>
//           </div>

//           {/* เนื้อหาหลัก: ข้อความซ้าย / รูปขวา */}
//           <div className="mt-3 grid gap-10 lg:grid-cols-2 lg:grid-rows-2">
//             {/* แถว 1 (ซ้าย = ข้อความ “คุณจะเห็น…”, ขวา = รูป #1) */}
//             <div className="lg:row-start-1 lg:col-start-1 flex items-center">
//                 <h2 className="text-xl md:text-xl font-medium">
//                 คุณจะเห็นข้อมูลสำคัญสรุปในกราฟและรูปภาพที่ชัดเจน ไม่ว่าจะเป็นจำนวนรวม จำนวนผู้ใช้งาน
//                 หรือสถิติรายวัน เพื่อให้แน่ใจว่าคุณจะไม่พลาดความคืบหน้าสำคัญใดๆ
//                 </h2>
//             </div>
//             <div className="lg:row-start-1 lg:col-start-2">
//                 <img
//                   src={picLdO1}
//                   alt="Dashboard Owner"
//                   className="w-[80%] max-h-[300px] object-contain mx-auto"
//                 />
//             </div>

//             {/* แถว 2 (ซ้าย = ข้อความ “ใบแจ้งห้องพัก…”, ขวา = รูป #2) */}
//             <div className="lg:row-start-2 lg:col-start-2 flex items-center">
//                 <p className="text-xl md:text-xl font-medium leading-relaxed">
//                 “ใบแจ้งห้องพัก <br className="hidden sm:block" />
//                 ถูกออกแบบสำหรับเจ้าของหอพักเพื่อช่วยให้คุณทำงานได้เร็วขึ้น ง่ายขึ้น และเป็นระบบมากขึ้น"
//                 </p>
//             </div>
//             <div className="lg:row-start-2 lg:col-start-1">
//                 <img
//                   src={picLdO2}
//                   alt="Dashboard Owner"
//                   className="w-[80%] max-h-[300px] object-contain mx-auto"
//                 />
//             </div>
//             </div>
//         </div>
//       </section>

//         {/* ========== หน้า 2: มุมมองของผู้เช่า ========== */}
//         <section id="tenant" className="relative scroll-mt-16 flex items-center overflow-x-hidden" style={{ minHeight: VH }}>
//           <div className="w-full max-w-7xl mx-auto px-8">
//             {/* บล็อก 1: ข้อความซ้าย / รูปขวา */}
//             <div id="tenant-b1" className="grid lg:grid-cols-2 gap-10 items-center scroll-mt-20">
//             <div>
//                 <p className="text-xl md:text-xl font-medium leading-relaxed">
//                 "ภาพรวมสถานะ <br className="hidden sm:block" />
//                 จะเปลี่ยนการจัดการการเงินหอพักของคุณให้เป็นเรื่องง่าย ๆ เพียงปลายนิ้ว สังเกตทุกอย่างได้ชัดเจนและไม่พลาดการชำระเงิน!"
//                 </p>
//             </div>
//             <img
//               src={picLdT1}
//               alt="Dashboard Owner"
//               className="w-[80%] max-h-[300px] object-contain mx-auto"
//             />
//             </div>

//             {/* ButtonRI กลางหน้า */}
//             <div className="my-10">
//                 <ButtonRI
//                     size="lg"
//                     bg="#FEB863"
//                     onClick={() => scrollToId('tenant-b1')}
//                     className="ml-4 md:ml-8 lg:ml-30"
//                     >
//                     มุมมองของผู้เช่า
//                 </ButtonRI>
//             </div>

//             {/* บล็อก 2: รูปซ้าย / ข้อความขวา */}
//             <div className="grid lg:grid-cols-2 gap-10 items-center">
//               <img
//                 src={picLdT2}
//                 alt="Dashboard Owner"
//                 className="w-[80%] max-h-[300px] object-contain mx-auto"
//               />
//             <div>
//                 <p className="text-xl md:text-xl font-medium leading-relaxed">
//                   เชื่อมโยงข้อมูลผู้เช่ากับการสร้างใบแจ้งหนี้ได้อย่างราบรื่น ลดขั้นตอนที่ซับซ้อน และประหยัดเวลาที่มีค่าของคุณ
//                 </p>
//             </div>
//             </div>

//             {/* บล็อก 3: ข้อความซ้าย / รูปขวา */}
//             <div className="mt-10 grid lg:grid-cols-2 gap-10 items-center">
//             <div>
//                 <p className="text-xl md:text-xl font-medium leading-relaxed font-serif">
//                 "ROOMIN <br className="hidden sm:block" />
//                 ถูกออกแบบมาเพื่อทำให้ชีวิตของผู้เช่าของคุณง่ายขึ้น และสะดวกยิ่งขึ้น บอกลาเรื่องยุ่งยากในการติดต่อหรือตามหาข้อมูล"
//                 </p>
//             </div>
//               <img
//                 src={picLdT3}
//                 alt="Dashboard Owner"
//                 className="w-[80%] max-h-[300px] object-contain mx-auto"
//               />
//             </div>
//         </div>
//       </section>


//       {/* ========== หน้า 3: เริ่มใช้งาน ========== */}
// 	{!isLoggedIn && ( 
//       <section id="start" className="scroll-mt-16 flex items-center" style={{ minHeight: VH }}>
//         <div className="w-full">
//           <div className="text-center -mt-4 md:-mt-6 mb-8">
//             {/* กดแล้วเลื่อนมาจุดเริ่มของหน้านี้เอง */}
//             <ButtonRI
//                 size="lg"
//                 bg="#FEB863"
//                 onClick={() => scrollToId('start')}
//                 className="ml-4 md:ml-8 lg:ml-0"
//                 >
//                 เริ่มต้นใช้งาน
//               </ButtonRI>
//           </div>

//             {/* การ์ดเลือกเข้าสู่ระบบ */}
//             <div className="max-w-7xl mx-auto px-4
// +                 flex flex-wrap justify-center gap-10 gap-y-12">
//             {/* === การ์ดผู้จัดการ === */}
//             <div
//                 className="
//                 shrink-0 w-[240px] md:w-[260px]        /* ← ปรับ 'กว้าง' การ์ดขาว */
//                 rounded-2xl p-6 bg-white shadow-sm
//                 flex flex-col items-center text-center
//                 "
//             >
//                 <div
//                 className="
//                     w-[220px] h-[220px] md:h-[260px] /* ← ปรับ 'สูง' กล่องม่วงด้านใน */
//                     rounded-xl bg-[#E4E0E9]
//                     grid place-items-center mb-4
//                 "
//                 >
//                 <img
//                     src={OwnerIcon} alt="Owner"
//                     className="w-[80%] max-h-[80%] object-contain"
//                 />
//                 </div>

//                 <h3 className="text-2xl font-semibold">เจ้าของหอพัก</h3>
//                 <Link
//                   to="/login/owner"
//                   className="mt-1 text-xl text-[#FEB863] no-underline hover:underline underline-offset-2 decoration-[#FEB863] transition-colors"
//                 >
//                   เข้าสู่ระบบ
//                 </Link>
//             </div>

//             {/* === การ์ดผู้เช่า === */}
//             <div
//                 className="
//                 shrink-0 w-[240px] md:w-[260px]        /* ← ปรับ 'กว้าง' การ์ดขาว */
//                 rounded-2xl p-6 bg-white shadow-sm
//                 flex flex-col items-center text-center
//                 "
//             >
//                 <div
//                 className="
//                     w-[220px] h-[220px] md:h-[260px] /* ← ปรับ 'สูง' กล่องม่วงด้านใน */
//                     rounded-xl bg-[#E4E0E9]
//                     grid place-items-center mb-4
//                 "
//                 >
//                 <img
//                     src={TenantIcon} alt="Tenant"
//                     className="w-[70%] max-h-[80%] object-contain"
//                 />
//                 </div>

//                 <h3 className="text-2xl font-semibold">ผู้เช่า</h3>
//                 <Link
//                   to="/login/tenant"
//                   className="mt-1 text-xl text-[#FEB863] no-underline hover:underline underline-offset-2 decoration-[#FEB863] transition-colors"
//                 >
//                   เข้าสู่ระบบ
//                 </Link>
//             </div>
//             </div>
//         </div>
//       </section>
// 	  )}
//     </div>
//   );
// }
import { Link } from "react-router-dom";
import ButtonRI from "../components/ButtonRI";
import OwnerIcon from "../assets/icons/owner.png";
import TenantIcon from "../assets/icons/tenant.png";
import picLdO1 from "../assets/pic-ld-o1.png";
import picLdO2 from "../assets/pic-ld-o2.png";
import picLdT1 from "../assets/pic-ld-t1.png";
import picLdT2 from "../assets/pic-ld-t2.png";
import picLdT3 from "../assets/pic-ld-t3.png";

import { useAuth } from '../contexts/AuthContext';

const TOPBAR_H = 64; // ถ้าเปลี่ยนความสูง TopBar ปรับเลขนี้
const VH = `calc(100dvh - ${TOPBAR_H}px)`;

// helper เลื่อนไป anchor ของแต่ละหน้า
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Landing() {

  const { user, setUser, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout'); // ยิง API Logout
      setUser(null); // 3. "ล้าง" ความจำใน React
      // (ไม่ต้อง navigate, เราอยู่ที่หน้า Landing อยู่แล้ว)
    } catch (err) {
      console.error("Failed to logout", err);
    }
  };

  return (
    <div className="space-y-24 overflow-x-clip">
      {/* ========== หน้า 1: มุมมองของเจ้าของหอพัก ========== */}
      <section id="manager" className=" relative scroll-mt-16 flex items-center overflow-x-hidden" style={{ minHeight: VH }}>
        <div className="w-full max-w-7xl mx-auto px-8">
          {/* หัวกลางตามฟิกม่า */}
          <div className="text-center">
            <h1 className="text-4xl md:text-4xl font-semibold tracking-tight font-serif">
              ยินดีต้อนรับสู่ ROOMIN
            </h1>
            <p className="mt-4 md:text-xl">
              แพลตฟอร์มที่ออกแบบมาเพื่อมอบประสบการณ์โดยการแสดงข้อมูลเชิงลึกอย่างครอบคลุม
            </p>
            <div className="mt-10">
              {/* คลิกแล้วจัดหน้าให้ตรง anchor เดิม (ยังอยู่หน้า Manager) */}
              <ButtonRI
                size="lg"
                bg="#FEB863"
                onClick={() => scrollToId('manager')}
                className="-ml-2 md:-ml-6 lg:-ml-150"
                >
                มุมมองของเจ้าของหอพัก
              </ButtonRI>
            </div>
          </div>

          {/* เนื้อหาหลัก: ข้อความซ้าย / รูปขวา */}
          <div className="mt-3 grid gap-10 lg:grid-cols-2 lg:grid-rows-2">
            {/* แถว 1 (ซ้าย = ข้อความ “คุณจะเห็น…”, ขวา = รูป #1) */}
            <div className="lg:row-start-1 lg:col-start-1 flex items-center">
                <h2 className="text-xl md:text-xl font-medium">
                คุณจะเห็นข้อมูลสำคัญสรุปในกราฟและรูปภาพที่ชัดเจน ไม่ว่าจะเป็นจำนวนรวม จำนวนผู้ใช้งาน
                หรือสถิติรายวัน เพื่อให้แน่ใจว่าคุณจะไม่พลาดความคืบหน้าสำคัญใดๆ
                </h2>
            </div>
            <div className="lg:row-start-1 lg:col-start-2">
                <img
                  src={picLdO1}
                  alt="Dashboard Owner"
                  className="w-[80%] max-h-[300px] object-contain mx-auto"
                />
            </div>

            {/* แถว 2 (ซ้าย = ข้อความ “ใบแจ้งห้องพัก…”, ขวา = รูป #2) */}
            <div className="lg:row-start-2 lg:col-start-2 flex items-center">
                <p className="text-xl md:text-xl font-medium leading-relaxed">
                “ใบแจ้งห้องพัก <br className="hidden sm:block" />
                ถูกออกแบบสำหรับเจ้าของหอพักเพื่อช่วยให้คุณทำงานได้เร็วขึ้น ง่ายขึ้น และเป็นระบบมากขึ้น"
                </p>
            </div>
            <div className="lg:row-start-2 lg:col-start-1">
                <img
                  src={picLdO2}
                  alt="Dashboard Owner"
                  className="w-[80%] max-h-[300px] object-contain mx-auto"
                />
            </div>
            </div>
        </div>
      </section>

        {/* ========== หน้า 2: มุมมองของผู้เช่า ========== */}
        <section id="tenant" className="relative scroll-mt-16 flex items-center overflow-x-hidden" style={{ minHeight: VH }}>
          <div className="w-full max-w-7xl mx-auto px-8">
            {/* บล็อก 1: ข้อความซ้าย / รูปขวา */}
            <div id="tenant-b1" className="grid lg:grid-cols-2 gap-10 items-center scroll-mt-20">
            <div>
                <p className="text-xl md:text-xl font-medium leading-relaxed">
                "ภาพรวมสถานะ <br className="hidden sm:block" />
                จะเปลี่ยนการจัดการการเงินหอพักของคุณให้เป็นเรื่องง่าย ๆ เพียงปลายนิ้ว สังเกตทุกอย่างได้ชัดเจนและไม่พลาดการชำระเงิน!"
                </p>
            </div>
            <img
              src={picLdT1}
              alt="Dashboard Owner"
              className="w-[80%] max-h-[300px] object-contain mx-auto"
            />
            </div>

            {/* ButtonRI กลางหน้า */}
            <div className="my-10">
                <ButtonRI
                    size="lg"
                    bg="#FEB863"
                    onClick={() => scrollToId('tenant-b1')}
                    className="ml-4 md:ml-8 lg:ml-30"
                    >
                    มุมมองของผู้เช่า
                </ButtonRI>
            </div>

            {/* บล็อก 2: รูปซ้าย / ข้อความขวา */}
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <img
                src={picLdT2}
                alt="Dashboard Owner"
                className="w-[80%] max-h-[300px] object-contain mx-auto"
              />
            <div>
                <p className="text-xl md:text-xl font-medium leading-relaxed">
                  เชื่อมโยงข้อมูลผู้เช่ากับการสร้างใบแจ้งหนี้ได้อย่างราบรื่น ลดขั้นตอนที่ซับซ้อน และประหยัดเวลาที่มีค่าของคุณ
                </p>
            </div>
            </div>

            {/* บล็อก 3: ข้อความซ้าย / รูปขวา */}
            <div className="mt-10 grid lg:grid-cols-2 gap-10 items-center">
            <div>
                <p className="text-xl md:text-xl font-medium leading-relaxed font-serif">
                "ROOMIN <br className="hidden sm:block" />
                ถูกออกแบบมาเพื่อทำให้ชีวิตของผู้เช่าของคุณง่ายขึ้น และสะดวกยิ่งขึ้น บอกลาเรื่องยุ่งยากในการติดต่อหรือตามหาข้อมูล"
                </p>
            </div>
              <img
                src={picLdT3}
                alt="Dashboard Owner"
                className="w-[80%] max-h-[300px] object-contain mx-auto"
              />
            </div>
        </div>
      </section>


      {/* ========== หน้า 3: เริ่มใช้งาน ========== */}
      <section id="start" className="scroll-mt-16 flex items-center" style={{ minHeight: VH }}>
        <div className="w-full">
          <div className="text-center -mt-4 md:-mt-6 mb-8">
            {/* กดแล้วเลื่อนมาจุดเริ่มของหน้านี้เอง */}
            <ButtonRI
                size="lg"
                bg="#FEB863"
                onClick={() => scrollToId('start')}
                className="ml-4 md:ml-8 lg:ml-0"
                >
                เริ่มต้นใช้งาน
              </ButtonRI>
          </div>

            {/* การ์ดเลือกเข้าสู่ระบบ */}
            <div className="max-w-7xl mx-auto px-4
+                         flex flex-wrap justify-center gap-10 gap-y-12">
            
            {/* === ตรรกะใหม่ === */}
            {loading ? (
              // 1. ถ้ากำลัง "เช็ก" API (/auth/me)...
              <div className="text-xl text-center text-gray-600">
                Loading...
              </div>

            ) : user ? (
              // 2. ถ้า "จำได้" (มี user ล็อกอินอยู่)
              <div className="text-center">
                <h3 className="text-2xl font-semibold">
                  ยินดีต้อนรับ, {user.FName}!
                </h3>
                <Link
                  // (ฉลาดพอที่จะเช็ก Role ของ user)
                  to={user.role === 'OWNER' ? '/owner/dashboard' : '/tenant/dashboard'}
                  className="mt-1 text-xl text-[#FEB863] no-underline hover:underline"
                >
                  ไปที่ Dashboard
                </Link>
                <br />
                {/* <button
                  onClick={handleLogout}
                  className="mt-4 text-lg text-red-500 hover:underline"
                >
                  ออกจากระบบ
                </button> */}
              </div>

            ) : (
              // 3. ถ้า "จำไม่ได้" (user เป็น null)
              // (เราจะโชว์ 2 การ์ดเดิมของคุณ)
              <>
                {/* === การ์ดผู้จัดการ (โค้ดเดิม) === */}
                <div
                  className="
                    shrink-0 w-[240px] md:w-[260px]      /* ← ปรับ 'กว้าง' การ์ดขาว */
                    rounded-2xl p-6 bg-white shadow-sm
                    flex flex-col items-center text-center
                    "
                >
                  <div
                    className="
                      w-[220px] h-[220px] md:h-[260px] /* ← ปรับ 'สูง' กล่องม่วงด้านใน */
                      rounded-xl bg-[#E4E0E9]
                      grid place-items-center mb-4
                    "
                  >
                    <img
                      src={OwnerIcon} alt="Owner"
                      className="w-[80%] max-h-[80%] object-contain"
                    />
                  </div>

                  <h3 className="text-2xl font-semibold">เจ้าของหอพัก</h3>
                  <Link
                    to="/login/owner"
                    className="mt-1 text-xl text-[#FEB863] no-underline hover:underline underline-offset-2 decoration-[#FEB863] transition-colors"
                  >
                    เข้าสู่ระบบ
                  </Link>
                </div>

                {/* === การ์ดผู้เช่า (โค้ดเดิม) === */}
                <div
                  className="
                    shrink-0 w-[240px] md:w-[260px]      /* ← ปรับ 'กว้าง' การ์ดขาว */
                    rounded-2xl p-6 bg-white shadow-sm
                    flex flex-col items-center text-center
                    "
                >
                  <div
                    className="
                      w-[220px] h-[220px] md:h-[260px] /* ← ปรับ 'สูง' กล่องม่วงด้านใน */
                      rounded-xl bg-[#E4E0E9]
                      grid place-items-center mb-4
                    "
                  >
                    <img
                      src={TenantIcon} alt="Tenant"
                      className="w-[70%] max-h-[80%] object-contain"
                    />
                  </div>

                  <h3 className="text-2xl font-semibold">ผู้เช่า</h3>
                  <Link
                    to="/login/tenant"
                    className="mt-1 text-xl text-[#FEB863] no-underline hover:underline underline-offset-2 decoration-[#FEB863] transition-colors"
                  >
                    เข้าสู่ระบบ
                  </Link>
                </div>
              </>
            )}
            </div>
        </div>
      </section>
    </div>
  );
}