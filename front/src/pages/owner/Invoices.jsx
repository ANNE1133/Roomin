import React, { useState } from "react";
import Logo from "/src/components/Logo.jsx"; 
import profile from "/src/assets/profile.png";
import correct from "/src/assets/correct.svg";
import { useNavigate } from "react-router-dom";

const getFormattedCurrentDate = () => {
    const today = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const formattedDate = today.toLocaleDateString('th-TH', options);
    return formattedDate;
};

const InvoiceInput = ({ index, item, onUpdate, onDelete }) => { 
    const handleChange = (field, value) => {
        onUpdate(index, field, value);
    };

    return (
        <div className="space-y-1">
            <div className="flex justify-between items-center">
                <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleChange('label', e.target.value)}
                    className="flex-1 text-gray-700 text-sm font-medium border-gray-400 focus:border-solid focus:border-indigo-400 outline-none mr-4 bg-transparent"
                />
                
                {index >= 3 && ( 
                    <button 
                        onClick={() => onDelete(item.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium p-1 leading-none transition"
                        aria-label="ลบรายการ"
                    >
                        ลบ
                    </button>
                )}
            </div>

            <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                    <input
                        type="number"
                        placeholder="0"
                        value={item.quantity}
                        onChange={(e) => handleChange('quantity', e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                    />
                    <div className="text-xs text-gray-500">จำนวน</div> 
                </div>
                
                <div className="flex-1 space-y-1">
                    <input
                        type="number"
                        placeholder="0.00"
                        value={item.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                    />
                    <div className="text-xs text-gray-500">ราคาต่อหน่วย</div>
                </div>
            </div>
        </div>
    );
};

export default function CreateInvoice() {
    const navigate = useNavigate();
    const currentDate = getFormattedCurrentDate();
    
    const tenantData = {
        name: "นายโรเบิร์ต จอห์น",
        contract: "31/05/2026",
        phone: "085-555-5555",
        line: "roberthandsomeandcool",
    };
    
    const initialItems = [
        { id: 1, label: "ค่าห้อง" , quantity: 1, price: 5000 },
        { id: 2, label: "ค่าน้ำ ", quantity: 1, price: 300 },
        { id: 3, label: "ค่าไฟ ", quantity: 1, price: 300 },
    ];
    
    const [billingItems, setBillingItems] = useState(initialItems);
    const [showSummary, setShowSummary] = useState(false);
    const [showComplete, setShowComplete] = useState(false);
    
    const handleAddItem = () => {
        const newItem = {
            id: Date.now(), 
            label: "รายการใหม่", 
            quantity: '', 
            price: ''
        };
        setBillingItems(prevItems => [...prevItems, newItem]);
    };
    
    const handleUpdateItem = (index, field, value) => {
        const updatedItems = billingItems.map((item, i) => {
            if (i === index) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setBillingItems(updatedItems);
    };

    const handleDeleteItem = (idToDelete) => {
        const updatedItems = billingItems.filter(item => item.id !== idToDelete);
        setBillingItems(updatedItems);
    };

    const calculateTotal = () => {
        let grandTotal = 0;
        billingItems.forEach(item => {
            const quantity = parseFloat(item.quantity) || 0;
            const price = parseFloat(item.price) || 0;
            grandTotal += quantity * price;
        });
        return grandTotal.toFixed(2);
    };
    
    const handleCreateInvoice = () => {
        setShowSummary(true);
    };

    const grandTotal = calculateTotal();

    return (
        <div className="p-6 md:p-8 space-y-6">      
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* === Left Column: Tenant Information Card === */}
                <div className="lg:col-span-1">
                    <div className="rounded-2xl border border-[#E7DDF1] bg-white overflow-hidden">
                        {/* ส่วนหัว - พื้นหลังม่วง */}
                        <div className="bg-[#E7DDF1] text-black p-6 flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-full bg-white/40 overflow-hidden">
                            <img 
                                src={profile}
                                alt="Tenant Avatar" 
                                className="w-full h-full object-cover"
                            />
                            </div>
                            <div className="flex flex-col">
                            <div className="text-xl font-semibold">{tenantData.name}</div>
                            <div className="text-sm">
                                หมดสัญญา <span className="font-medium ml-1">{tenantData.contract}</span>
                            </div>
                            </div>
                        </div>

                        {/* เส้นคั่นม่วง */}
                        <hr className="border-[#E7DDF1] m-0" />

                        {/* ส่วนเนื้อหา */}
                        <div className="p-6 space-y-3">
                            <div className="flex items-center text-sm text-black">
                                <span className="w-5 h-5 mr-3 text-gray-500">📞</span>
                                {tenantData.phone}
                                </div>
                                <div className="flex items-center text-sm text-black">
                                <span className="w-5 h-5 mr-3 text-gray-500">💬</span>
                                {tenantData.line}
                            </div>

                            {/* ปุ่ม */}
                            <div className="flex gap-4 pt-2">
                                <button className="flex-1 rounded-full bg-[#7D6796] text-white py-3 text-sm md:text-base font-medium hover:!bg-[#645278]">
                                    ปัญหาแจ้งซ่อม
                                </button>
                                <button className="flex-1 rounded-full bg-[#7D6796] text-white py-3 text-sm md:text-base font-medium hover:!bg-[#645278]">
                                    สัญญาเช่า
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* === Right Column: Invoice Form === */}
                <div className="lg:col-span-2">
                    <div className="rounded-xl border bg-white p-6 space-y-6">
                        
                        {/* Invoice Header */}
                        <div className="flex justify-between items-start border-b pb-4">
                            <div className="space-y-1"> 
                                <div className="mb-3 flex flex-col items-start ">
                                    <Logo size={50} showText={false} />
                                    <div className="mt-2 text-sm font-semibold leading-none font-serif">ROOMIN</div>
                                </div>
                                
                                <div className="text-sm text-gray-600 font-serif ">
                                    ใบแจ้งค่าห้อง ห้อง 1101 คอนโด พีเค อาคาร 2
                                </div>
                                
                                <div className="text-sm text-gray-600 font-serif">
                                    <span className="font-bold">ผู้อยู่อาศัย :</span>
                                    <span className="font-serif ml-1">{tenantData.name}</span>
                                </div>
                            </div>
                            
                            <div className="mt-3 text-right space-y-1">
                                <div className="text-base font-bold text-gray-800">ใบแจ้งค่าห้อง</div>
                                <div className="text-sm text-gray-600 whitespace-nowrap">
                                    เลขที่ 456456 วันที่ {currentDate}
                                </div>
                            </div>
                        </div>

                        <div className="mt-0">
                            <div className="flex items-center gap-3"> 
                                <div className="text-sm mb-2 font-semibold text-gray-700">รายการชำระเงิน</div> 
                                <button 
                                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                                    onClick={handleAddItem}
                                >
                                    <div className="flex items-center justify-center w-5 h-5 rounded-md bg-[#7D6796]/10 mr-2 text-[#7D6796] font-bold">
                                        +
                                    </div>
                                </button>
                            </div>
                            
                            <div className="mt-4 space-y-5"> 
                                {billingItems.map((item, index) => (
                                    <InvoiceInput 
                                        key={item.id}
                                        index={index}
                                        item={item}
                                        onUpdate={handleUpdateItem}
                                        onDelete={handleDeleteItem}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleCreateInvoice} 
                                className="rounded-full bg-[#7D6796] text-black px-8 py-3 text-sm md:text-base font-medium hover:!bg-[#FEA130]"
                                style={{ backgroundColor: "#FFB84C" }}
                            >
                                สร้างใบแจ้งค่าห้อง
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        
            {/* Popup */}
            {showSummary && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 space-y-6">
                        
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-3">
                            สรุปใบแจ้งค่าห้อง (ห้อง 1101)
                        </h2>

                        {/* ตารางแสดงรายการ */}
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {billingItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-start text-sm border-b last:border-b-0 pb-1">
                                    <div className="flex-1 pr-4">
                                        <div className="font-medium">{item.label}</div>
                                        <div className="text-xs text-gray-500">
                                            {item.quantity || 0} x {parseFloat(item.price || 0).toFixed(2)} บาท
                                        </div>
                                    </div>
                                    <div className="text-right font-semibold whitespace-nowrap">
                                        {(parseFloat(item.quantity || 0) * parseFloat(item.price || 0)).toFixed(2)} บาท
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ยอดรวมทั้งหมด */}
                        <div className="flex justify-between items-center pt-3 border-t">
                            <div className="text-lg font-bold text-gray-800">ยอดรวมทั้งหมด</div>
                            <div className="text-xl font-bold text-[#FFB84C]">{grandTotal} บาท</div>
                        </div>

                        {/* ปุ่ม Action ใน Modal */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => setShowSummary(false)}
                                className="rounded-full px-5 py-3 text-sm md:text-base font-medium border text-black hover:bg-gray-100 transition"
                            >
                                แก้ไขต่อ
                            </button>
                            <button
                                onClick={() => {
                                    setShowSummary(false);
                                    setShowComplete(true);
                                }} 
                                className="rounded-full bg-[#7D6796] text-black px-5 py-3 text-sm md:text-base font-medium hover:!bg-[#FEA130]"
                                style={{ backgroundColor: "#FFB84C" }}
                            >
                                ยืนยันและสร้าง
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showComplete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="relative bg-white rounded-xl w-full max-w-[512px] p-8 pt-15 pb-15 shadow-lg text-center">
                    {/* ปุ่มปิด */}
                    <button
                        onClick={() => setShowComplete(false)}
                        className="absolute top-4 right-4 text-black hover:text-gray-600 transition-colors font-semibold text-lg"
                    >
                        X
                    </button>

                    {/* ไอคอน */}
                    <div className="w-24 h-24 mx-auto mb-6">
                        <img src={correct} alt="success" className="w-full h-full" />
                    </div>

                    {/* หัวเรื่อง */}
                    <h2 className="text-2xl font-bold mb-4">สร้างใบแจ้งค่าห้องสำเร็จ</h2>

                    {/* คำอธิบาย */}
                    <p className="text-base text-gray-700 mb-6 whitespace-pre-wrap pr-10 pl-10">
                        ระบบได้สร้างใบแจ้งค่าห้องสำหรับผู้เช่าเรียบร้อยแล้ว และได้ส่งแจ้งเตือนไปยังผู้เช่าแล้ว
                        คุณสามารถดูรายละเอียดได้ในหน้าแรก
                    </p>

                    {/* ปุ่มไปหน้าแรก/ปิด */}
                    <button
                        onClick={() => navigate("/owner/dashboard")}
                        className="bg-[#feb863] hover:bg-[#fea130] transition-colors px-10 py-3 rounded-full"
                    >
                        <span className="text-black text-sm md:text-base font-medium">
                        หน้าแรก
                        </span>
                    </button>
                    </div>
                </div>
                )}
            
        </div>
    );
}