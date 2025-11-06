import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "/src/components/Logo.jsx";
import profile from "/src/assets/profile.png";
import correct from "/src/assets/correct.svg";
import { createInvoice as createInvoiceApi } from "../../api/invoice";
import { getTenantByAuthId } from "../../api/user";
import { createItem as createItemApi } from "../../api/item";
import { getItems as getAllItems } from "../../api/item";
import { getAllInvoices } from "../../api/invoice"

// Component สำหรับ input รายการ invoice
const InvoiceInput = ({ index, item, onUpdate, onDelete }) => {
  const handleChange = (field, value) => onUpdate(index, field, value);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <input
          type="text"
          value={item.label}
          onChange={(e) => handleChange("label", e.target.value)}
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
            onChange={(e) => handleChange("quantity", e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
          />
          <div className="text-xs text-gray-500">จำนวน</div>
        </div>
        <div className="flex-1 space-y-1">
          <input
            type="number"
            placeholder="0.00"
            value={item.price}
            onChange={(e) => handleChange("price", e.target.value)}
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
    const [tenantData, setTenantData] = useState(null);
    const initialItems = [
    { id: 1, label: "ค่าห้อง", quantity: 1, price: 5000 },
    { id: 2, label: "ค่าน้ำ", quantity: 1, price: 18 },
    { id: 3, label: "ค่าไฟ", quantity: 1, price: 8 },
    ];
    const [billingItems, setBillingItems] = useState(initialItems);
    const [showComplete, setShowComplete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSummary, setShowSummary] = useState(false); //
    const [lastInvoiceId, setLastInvoiceId] = useState(0);

    // ดึงข้อมูล tenant จาก backend ตาม authId ใน localStorage
    useEffect(() => {
        const fetchTenant = async () => {
        try {
            const tenant = await getTenantByAuthId();
            setTenantData(tenant);
        } catch (err) {
            console.error(err);
            alert("ไม่สามารถโหลดข้อมูลผู้เช่าได้");
        }
        };
        fetchTenant();
    }, []);

    useEffect(() => {
        const fetchInvoices = async () => {
            const allInvoices = await getAllInvoices(); // API ดึงข้อมูล invoice ทั้งหมด
            if (allInvoices.length > 0) {
            const maxId = Math.max(...allInvoices.map(inv => inv.InvoiceID));
            setLastInvoiceId(maxId);
            }
        };
        fetchInvoices();
    }, []);

    // ฟังก์ชันจัดการรายการ invoice
    const handleAddItem = () => {
        const newItem = { id: Date.now(), label: "รายการใหม่", quantity: "", price: "" };
        setBillingItems((prev) => [...prev, newItem]);
    };

    const handleUpdateItem = (index, field, value) => {
        const updated = billingItems.map((item, i) => (i === index ? { ...item, [field]: value } : item));
        setBillingItems(updated);
    };

    const handleDeleteItem = (id) => {
        setBillingItems(billingItems.filter((item) => item.id !== id));
    };

    const calculateTotal = () =>
        billingItems
        .reduce((sum, item) => sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0), 0)
        .toFixed(2);
    // ✅ ฟังก์ชันนี้แค่เปิด popup
    const handleCreateInvoice = () => {
    if (!tenantData) return alert("ข้อมูลผู้เช่าไม่พร้อม");
    setShowSummary(true);
    };

    // ✅ ฟังก์ชันนี้ค่อยสร้างจริงตอนยืนยัน
    const handleConfirmInvoice = async () => {
    setLoading(true);
    try {
        const existingItems = await getAllItems();

        const itemsWithIds = await Promise.all(
        billingItems.map(async (item) => {
            const found = existingItems.find((i) => i.name === item.label);
            if (found) {
            return {
                itemId: found.ItemID,
                quantity: parseFloat(item.quantity) || 0,
            };
            } else {
            const newItem = await createItemApi({
                name: item.label,
                price: parseFloat(item.price) || 0,
                statusId: 8,
            });
            return {
                itemId: newItem.ItemID,
                quantity: parseFloat(item.quantity) || 0,
            };
            }
        })
        );

        const payload = {
        Date: new Date().toISOString(),
        userId: tenantData.UserID || tenantData.id,
        roomId: tenantData.contracts[0].roomId,
        statusId: 7,
        items: itemsWithIds,
        };

        await createInvoiceApi(payload);
        setShowSummary(false);
        setShowComplete(true);
    } catch (error) {
        console.error("สร้างใบแจ้งล้มเหลว:", error);
        alert("สร้างใบแจ้งล้มเหลว: " + (error.error || error.message));
    } finally {
        setLoading(false);
    }
    };

    const grandTotal = calculateTotal();

    if (!tenantData) return <div>Loading...</div>;

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Tenant */}
                <div className="lg:col-span-1">
                    <div className="rounded-2xl border bg-white overflow-hidden">
                        <div className="bg-[#E7DDF1] text-black p-6 flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-full bg-white/40 overflow-hidden">
                            <img src={profile} alt="Tenant Avatar" className="w-full h-full object-cover" />
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
                    {tenantData.email}
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

            {/* Right Column: Invoice Form */}
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
                                {/* <p>เลขที่ 456456 วันที่ {new Date().toISOString().split('T')[0]}</p> */}
                                <p>เลขที่ {lastInvoiceId + 1} วันที่ {new Date().toLocaleDateString('th-TH')}</p>
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
                    <div className="flex items-center justify-center w-5 h-5 rounded-md bg-[#7D6796]/10 mr-2 text-[#7D6796] font-bold">+</div>
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

                <div className="flex justify-between pt-4 items-center">
                <div className="text-lg font-bold">ยอดรวม: {grandTotal} บาท</div>
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
                            onClick={handleConfirmInvoice}
                            className="rounded-full bg-[#7D6796] text-black px-5 py-3 text-sm md:text-base font-medium hover:!bg-[#FEA130]"
                            style={{ backgroundColor: "#FFB84C" }}
                        >
                            ยืนยันและสร้าง
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Popup Success */}
        {showComplete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="relative bg-white rounded-xl w-full max-w-[512px] p-8 pt-15 pb-15 shadow-lg text-center">
                <button
                    onClick={() => setShowComplete(false)}
                    className="absolute top-4 right-4 text-black hover:text-gray-600 transition-colors font-semibold text-lg"
                >
                    X
                </button>
                <div className="w-24 h-24 mx-auto mb-6">
                    <img src={correct} alt="success" className="w-full h-full" />
                </div>
                <h2 className="text-2xl font-bold mb-4">สร้างใบแจ้งค่าห้องสำเร็จ</h2>
                <p className="text-base text-gray-700 mb-6 whitespace-pre-wrap pr-10 pl-10">
                    ระบบได้สร้างใบแจ้งค่าห้องสำหรับผู้เช่าเรียบร้อยแล้ว
                    คุณสามารถดูรายละเอียดได้ในหน้าแรก
                </p>
                <button
                    onClick={() => navigate("/owner/dashboard")}
                    className="bg-[#feb863] hover:bg-[#fea130] transition-colors px-10 py-3 rounded-full"
                >
                    <span className="text-black text-sm md:text-base font-medium">หน้าแรก</span>
                </button>
            </div>
            </div>
        )}
        </div>
    );
}
