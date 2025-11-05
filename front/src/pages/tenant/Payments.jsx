import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PaymentPopup from "../../components/PaymentPopup";
import arrowSort from "../../assets/arrow-sort.png";

export default function Payments() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const bills = [
    {
      id: "INV-2025-09",
      room: "1101",
      createdAt: "01/09/2025",
      dueAt: "10/09/2025",
      paidAt: null, // ยังไม่ชำระ
      amount: 5500,
      status: "OVERDUE",
    },
    {
      id: "INV-2025-08",
      room: "1101",
      createdAt: "01/08/2025",
      dueAt: "10/08/2025",
      paidAt: "05/08/2025",
      amount: 5700,
      status: "PAID",
    },
    {
      id: "INV-2025-07",
      room: "1101",
      createdAt: "01/07/2025",
      dueAt: "10/07/2025",
      paidAt: "05/07/2025",
      amount: 5900,
      status: "PAID",
    },
    {
      id: "INV-2025-06",
      room: "1101",
      createdAt: "01/06/2025",
      dueAt: "10/06/2025",
      paidAt: "05/06/2025",
      amount: 6500,
      status: "PAID",
    },
  ];

  const formatAmount = (n) =>
    n.toLocaleString("th-TH", { minimumFractionDigits: 0 });

  const handleDownload = (bill) => {
    alert(`ดาวน์โหลดใบแจ้งหนี้: ${bill.id}`);
  };

  const handlePay = (bill) => {
    setShowPopup(true);
  };

  const handleDetail = (bill) => {
    navigate(`/tenant/payments?detail=${bill.id}`);
  };

  return (
    <div className="w-full h-full">
      <div className="px-2 py-0">
        <div className="bg-white rounded-2xl p-4 md:p-6 overflow-x-auto">
          <div className="min-w-[950px]">
            <div className="grid grid-cols-12 items-center bg-[#645278] text-white rounded-xl px-4 py-4 text-sm md:text-base">
              <div className="col-span-1 flex items-center justify-center gap-1">
                ห้อง
                <img
                  src={arrowSort}
                  alt="sort"
                  className="w-5 h-5 p-[2px] rounded-md transition-colors duration-200 hover:bg-[#8D77A4] cursor-pointer"
                />
              </div>
              <div className="col-span-2 text-center">วันที่แจ้ง</div>
              <div className="col-span-2 text-center">กำหนดชำระ</div>
              <div className="col-span-2 text-center">วันที่ชำระ</div>
              <div className="col-span-2 text-center">จำนวนเงิน</div>
              <div className="col-span-3 text-center pr-[87px]">สถานะ</div>
            </div>

            <div className="mt-3 space-y-3">
              {bills.map((b) => {
                const isPaid = b.status === "PAID";
                return (
                  <div
                    key={b.id}
                    className="grid grid-cols-12 items-center bg-[#E7DDF1] rounded-xl px-4 py-2"
                  >
                    <div className="col-span-1 text-center">
                      <span className="inline-flex items-center justify-center bg-white rounded-xl px-3 py-1 text-[#3A3A3A] font-medium">
                        {b.room}
                      </span>
                    </div>

                    <div className="col-span-2 text-center text-[#3A3A3A]">{b.createdAt}</div>
                    <div className="col-span-2 text-center text-[#3A3A3A]">{b.dueAt}</div>
                    <div className="col-span-2 text-center text-[#3A3A3A]">
                      {b.paidAt ? b.paidAt : "-"}
                    </div>

                    <div className="col-span-2 text-center font-medium">
                      {formatAmount(b.amount)} บาท
                    </div>

                    {/* สถานะ + ปุ่ม */}
                    <div className="col-span-3 text-center flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleDownload(b)}
                        className="p-2 rounded-lg hover:bg-[#DCCBE9] active:scale-95 transition"
                        title="ดาวน์โหลด"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path d="M12 3a1 1 0 011 1v9.586l2.293-2.293a1 1 0 111.414 1.414l-4.007 4.007a1.25 1.25 0 01-1.414 0L7.279 12.707a1 1 0 111.414-1.414L11 13.586V4a1 1 0 011-1z" />
                          <path d="M5 20a1 1 0 100 2h14a1 1 0 100-2H5z" />
                        </svg>
                      </button>

                      {/* ป้ายสถานะ */}
                      <span
                        className={
                          "flex items-center justify-center w-[120px] h-[34px] rounded-full text-sm font-medium " +
                          (isPaid
                            ? "bg-[#97D76C] text-black"
                            : "bg-[#F15F5B] text-black")
                        }
                      >
                        {isPaid ? "ชำระแล้ว" : "ค้างชำระ"}
                      </span>

                      {/* ปุ่มการกระทำ */}
                      {isPaid ? (
                        <button
                          onClick={() => handleDetail(b)}
                          className="w-[150px] h-[34px] rounded-full text-sm font-medium bg-[#FEB863] text-black hover:bg-[#FEA130] active:scale-95 transition"
                        >
                          ดูรายละเอียด
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePay(b)}
                          className="w-[150px] h-[34px] rounded-full text-sm font-medium bg-[#FEB863] text-black hover:bg-[#FEA130] active:scale-95 transition"
                        >
                          ชำระเงิน
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {showPopup && <PaymentPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
}
