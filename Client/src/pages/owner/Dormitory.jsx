import { useState } from "react";
import { createDormitory } from "../../api/dormitory";

const FormDormitory = () => {
  const [formData, setFormData] = useState({
    Dormitoryname: "",
    address: "",
    phone: "",
    ownerAuthId: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // เมื่อพิมพ์ในช่อง input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // เมื่อกดปุ่มบันทึก
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // เรียก API จากไฟล์ api/dormitory.js
      const res = await createDormitory(formData);
      setMessage("✅ เพิ่มหอพักเรียบร้อยแล้ว!");
      console.log("Response:", res.data);

      // ล้างฟอร์ม
      setFormData({
        Dormitoryname: "",
        address: "",
        phone: "",
        ownerAuthId: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded-xl bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-center">เพิ่มหอพักใหม่</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">ชื่อหอพัก</label>
          <input
            type="text"
            name="Dormitoryname"
            value={formData.Dormitoryname}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">ที่อยู่</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows="2"
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">เบอร์โทรศัพท์</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Owner Auth ID</label>
          <input
            type="number"
            name="ownerAuthId"
            value={formData.ownerAuthId}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-3 rounded-md text-white text-sm"
          style={{ backgroundColor: "#7D6796" }}
        >
          {loading ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm font-medium text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default FormDormitory;
