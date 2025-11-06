// ===== SelectRoom Component (Main Page) =====
import React, { useState } from "react";
import RoomCard from "/src/components/Roomcard.jsx"; 
import { useNavigate } from "react-router-dom";

export default function SelectRoom() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("ทั้งหมด");
  const [selectedMonth, setSelectedMonth] = useState("กันยายน");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");

  // Sample data
  const rooms = [
    { id: 1, number: "101", hasBill: false, tenant: "สมชาย ใจดี", month: "กันยายน" },
    { id: 2, number: "102", hasBill: true, tenant: "สมหญิง รักสวย", month: "กันยายน" },
    { id: 3, number: "103", hasBill: false, tenant: "วิชัย มั่นคง", month: "กันยายน" },
    { id: 4, number: "104", hasBill: false, tenant: "นิดา สุขใจ", month: "กันยายน" },
    { id: 5, number: "105", hasBill: true, tenant: "ประยุทธ์ เก่งกล้า", month: "กันยายน" },
    { id: 6, number: "106", hasBill: true, tenant: "วันดี สดใส", month: "กันยายน" },
    { id: 7, number: "107", hasBill: false, tenant: "สุภาพ งามเลิศ", month: "กันยายน" },
    { id: 8, number: "108", hasBill: false, tenant: "มานะ ขยัน", month: "กันยายน" },
    { id: 9, number: "109", hasBill: true, tenant: "สุดา เรียบง่าย", month: "กันยายน" },
    { id: 10, number: "110", hasBill: false, tenant: "กิตติ์ ซื่อสัตย์", month: "กันยายน" },
    { id: 11, number: "111", hasBill: true, tenant: "อารี มีสุข", month: "กันยายน" },
    { id: 12, number: "112", hasBill: false, tenant: "วรรณา สวยงาม", month: "กันยายน" },
    { id: 13, number: "113", hasBill: false, tenant: "ธนา รวยเงิน", month: "กันยายน" },
    { id: 14, number: "114", hasBill: true, tenant: "จิรา สบายดี", month: "กันยายน" },
    { id: 15, number: "115", hasBill: false, tenant: "พงษ์ วีระ", month: "กันยายน" },
    { id: 16, number: "116", hasBill: true, tenant: "สุขสม บุญมี", month: "กันยายน" },
  ];

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    if (statusFilter === "สร้างแล้ว") return room.hasBill;
    if (statusFilter === "ยังไม่สร้าง") return !room.hasBill;
    return true;
  });

  const handleRoomClick = (room) => {
    // TODO: Navigate to invoice page with room data
    console.log("Selected room:", room);
    // Example: navigate(`/owner/create-invoice/${room.id}`, { state: { room } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D6796]"
          >
            <option>เลือกห้อง</option>
            <option>ทั้งหมด</option>
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D6796]"
          >
            <option>มกราคม</option>
            <option>กุมภาพันธ์</option>
            <option>มีนาคม</option>
            <option>เมษายน</option>
            <option>พฤษภาคม</option>
            <option>มิถุนายน</option>
            <option>กรกฎาคม</option>
            <option>สิงหาคม</option>
            <option>กันยายน</option>
            <option>ตุลาคม</option>
            <option>พฤศจิกายน</option>
            <option>ธันวาคม</option>
          </select>

          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7D6796]">
            ⇅
          </button>
        </div>

        {/* Status filter chips */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className="text-sm font-medium">สถานะใบแจ้งค่าห้อง</span>
          <button
            onClick={() => setStatusFilter("ทั้งหมด")}
            className={`px-4 py-1 rounded-full text-sm transition ${
              statusFilter === "ทั้งหมด"
                ? "bg-[#7D6796] text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setStatusFilter("สร้างแล้ว")}
            className={`px-4 py-1 rounded-full text-sm transition ${
              statusFilter === "สร้างแล้ว"
                ? "bg-green-500 text-white"
                : "bg-white border border-green-500 text-green-500 hover:bg-green-50"
            }`}
          >
            สร้างแล้ว
          </button>
          <button
            onClick={() => setStatusFilter("ยังไม่สร้าง")}
            className={`px-4 py-1 rounded-full text-sm transition ${
              statusFilter === "ยังไม่สร้าง"
                ? "bg-red-500 text-white"
                : "bg-white border border-red-500 text-red-500 hover:bg-red-50"
            }`}
          >
            ยังไม่สร้าง
          </button>
        </div>

        {/* Legend */}
        <div className="flex gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#81C784] rounded"></div>
            <span>สร้างใบแจ้งแล้ว</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#EF5350] rounded"></div>
            <span>ยังไม่สร้างใบแจ้ง</span>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              roomNumber={room.number}
              hasBill={room.hasBill}
              tenant={room.tenant}
              month={room.month}
              onClick={() => navigate("/owner/Invoices")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}