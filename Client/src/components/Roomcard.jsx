import { useNavigate } from "react-router-dom";
import HomeIcon from "../assets/icons/tenant.png"; // import asset

export default function RoomCard({ roomNumber, hasBill, tenant, month }) {
  const bgColor = hasBill ? "bg-[#E8F5E9]" : "bg-[#FFEBEE]";
  const iconBg = hasBill ? "bg-[#81C784]" : "bg-[#EF5350]";
  const statusText = hasBill ? "สร้างใบแจ้งแล้ว" : "ยังไม่สร้างใบแจ้ง";

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/owner/invoices/${roomNumber}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`${bgColor} rounded-lg p-4 relative w-full text-left transition-transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#7D6796]`}
    >
      <div className={`${iconBg} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3`}>
        <img src={HomeIcon} alt="Home" className="w-6 h-6" />
      </div>

      <h3 className="text-center font-semibold text-lg mb-2">ห้อง {roomNumber}</h3>
      <div className="text-sm text-gray-700 space-y-1">
        <p className="font-medium">{statusText}</p>
        <p>ประจำเดือน: {month}</p>
        {tenant && <p>ผู้เช่า: {tenant}</p>}
      </div>
    </button>
  );
}
