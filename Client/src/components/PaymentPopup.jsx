// "use client";

// import React, { useState } from "react";

// function PaymentButton({ onClick, children, className }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`bg-[#FEB863] hover:bg-[#FEA130] transition-colors px-10 py-3 rounded-full ${className}`}
//     >
//       <span className="font-normal text-black text-lg">
//         {children}
//       </span>
//     </button>
//   );
// }

// export default function PaymentPopup({ onClose, amount }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//       <div className="relative bg-white rounded-xl w-full max-w-[440px] p-8 shadow-lg">
//         {/* ปุ่มปิด */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-black hover:text-gray-600 transition-colors font-semibold text-lg"
//         >
//           X
//         </button>

//         {/* Title */}
//         <h2 className="text-2xl sm:text-2xl font-bold text-left mb-2">
//           ยืนยันการชำระเงิน
//         </h2>

//         {/* จำนวนเงิน */}
//         <div className="flex items-baseline gap-2 mb-2">
//           <span className="text-5xl sm:text-6xl font-bold text-[#645278]">{amount.toLocaleString('th-TH')}</span>
//           <span className="text-2xl sm:text-2xl font-bold">บาท</span>
//         </div>

//         {/* ช่องทางการชำระเงิน */}
//         <div className="text-left mb-4">
//           <p className="text-xl font-semibold mb-2">ช่องทางการชำระเงิน</p>
//           <div className="flex flex-col sm:flex-row gap-6">
//             <div className="w-40 h-40 border border-[#645278] rounded-lg flex items-center justify-center">
//               <span className="text-sm text-gray-500">QR Code</span>
//             </div>
//             <div className="flex flex-col items-start">
//               <p className="font-semibold">ชื่อ :</p>
//               <p className="font-semibold">เลขบัญชี :</p>
//               <p className="font-semibold">ธนาคาร :</p>
//             </div>
            
//           </div>
//         </div>

//         {/* แนบหลักฐาน */}
//         <div className="text-center mb-6">
//           <p className="text-xl font-semibold mb-2">แนบหลักฐานการชำระเงิน</p>
//           <div className="mx-auto w-48 h-12 border-2 border-[#FEA130] rounded-xl flex items-center justify-center mb-2 cursor-pointer hover:bg-[#FFE6C8] transition-colors">
//             <span className="text-base font-normal text-[#FEA130]">อัปโหลดสลิป</span>
//           </div>
//           <p className="text-sm text-gray-700">
//             โปรดแนบสลิปการโอนเงินเป็นไฟล์ .jpg หรือ .png
//           </p>
//         </div>

//         {/* ปุ่มส่ง/ยกเลิก */}
//         <div className="flex justify-center gap-5 mt-6">
//           <PaymentButton>ส่งหลักฐาน</PaymentButton>
//           <button
//             onClick={onClose}
//             className="bg-gray-300 hover:bg-gray-400 transition-colors px-8 py-3 rounded-full"
//           >
//             <span className="text-black font-normal text-lg">ยกเลิก</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState } from "react";

function PaymentButton({ onClick, children, className }) {
  return (
    <button
      onClick={onClick}
      className={`bg-[#FEB863] hover:bg-[#FEA130] transition-colors px-10 py-3 rounded-full ${className}`}
    >
      <span className="font-normal text-black text-lg">{children}</span>
    </button>
  );
}

export default function PaymentPopup({ onClose, amount }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("โปรดเลือกไฟล์ก่อนส่ง");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/upload-slip", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Upload success:", data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("อัปโหลดไม่สำเร็จ");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative bg-white rounded-xl w-full max-w-[440px] p-8 shadow-lg">
        {/* ปุ่มปิด */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-gray-600 transition-colors font-semibold text-lg"
        >
          X
        </button>

        {/* Title */}
        <h2 className="text-2xl sm:text-2xl font-bold text-left mb-2">
          ยืนยันการชำระเงิน
        </h2>

        {/* จำนวนเงิน */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-5xl sm:text-6xl font-bold text-[#645278]">
            {amount.toLocaleString("th-TH")}
          </span>
          <span className="text-2xl sm:text-2xl font-bold">บาท</span>
        </div>

        {/* ช่องทางการชำระเงิน */}
        <div className="text-left mb-4">
          <p className="text-xl font-semibold mb-2">ช่องทางการชำระเงิน</p>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-40 h-40 border border-[#645278] rounded-lg flex items-center justify-center">
              <span className="text-sm text-gray-500">QR Code</span>
            </div>
            <div className="flex flex-col items-start">
              <p className="font-semibold">ชื่อ :</p>
              <p className="font-semibold">เลขบัญชี :</p>
              <p className="font-semibold">ธนาคาร :</p>
            </div>
          </div>
        </div>

        {/* แนบหลักฐาน */}
        <div className="text-center mb-6">
          <p className="text-xl font-semibold mb-2">แนบหลักฐานการชำระเงิน</p>
          
          {/* ปุ่มอัปโหลดไฟล์ */}
          <div
            className="mx-auto w-48 h-12 border-2 border-[#FEA130] rounded-xl flex items-center justify-center mb-2 cursor-pointer hover:bg-[#FFE6C8] transition-colors"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <span className="text-base font-normal text-[#FEA130]">
              {selectedFile ? selectedFile.name : "อัปโหลดสลิป"}
            </span>
          </div>

          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept=".jpg,.png"
            onChange={handleFileChange}
          />

          <p className="text-sm text-gray-700">
            โปรดแนบสลิปการโอนเงินเป็นไฟล์ .jpg หรือ .png
          </p>
        </div>

        {/* ปุ่มส่ง/ยกเลิก */}
        <div className="flex justify-center gap-5 mt-6">
          <PaymentButton onClick={handleUpload}>ส่งหลักฐาน</PaymentButton>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 transition-colors px-8 py-3 rounded-full"
          >
            <span className="text-black font-normal text-lg">ยกเลิก</span>
          </button>
        </div>
      </div>
    </div>
  );
}
