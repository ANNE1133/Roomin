import { useState } from "react";
import Box from "./Box";

export default function CalendarBox() {
  const today = new Date();
  const [currentDate] = useState(today.getDate());
  const [currentMonth] = useState(today.getMonth()); // 0-11
  const [currentYear] = useState(today.getFullYear());

  // ชื่อเดือนภาษาอังกฤษ
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // จำนวนวันในเดือนปัจจุบัน
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // วันเริ่มต้นของเดือน (0 = Sunday, 1 = Monday, …)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // สร้าง array ของช่องปฏิทิน (รวมช่องว่างก่อนวันที่ 1)
  const calendarDays = [
    ...Array(firstDayOfMonth).fill(null), // ช่องว่าง
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  return (
    <Box variant="lavender" className="p-0 min-h-[240px]" bodyClass="p-5">
      {/* แถบหัวปฏิทิน */}
      <div className="mb-4 flex justify-center">
        <div className="flex items-center justify-between rounded-2xl bg-[#7D6796] px-6 py-2 w-[220px] md:w-[260px] shadow-sm">
          <div className="text-white text-xl md:text-2xl font-bold select-none">&lsaquo;</div>
          <h3 className="text-center text-base md:text-xl font-semibold text-white">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <div className="text-white text-xl md:text-2xl font-bold select-none">&rsaquo;</div>
        </div>
      </div>

      {/* ตารางวัน */}
      <div className="grid grid-cols-7 text-center gap-y-[1px]">
        {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((d) => (
          <div key={d} className="text-[12px] md:text-sm text-[#645278] font-semibold">
            {d}
          </div>
        ))}

        {calendarDays.map((day, i) => (
          <div
            key={i}
            className={`aspect-[1/1] grid place-items-center text-[12px] md:text-base rounded-full transition-all
              ${
                day === currentDate
                  ? "border-4 border-white text-black font-bold"
                  : "hover:bg-[#7D6796]/10 text-black"
              }`}
          >
            {day || ""}
          </div>
        ))}
      </div>
    </Box>
  );
}
