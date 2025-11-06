import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "../../components/Box";
import ButtonRI from "../../components/ButtonRI";
import { getTenantByAuthId } from "../../api/user";
import CalendarBox from "../../components/CalendarBox"

export default function DashboardTenant() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getTenantByAuthId();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  if (!user) return <div>Loading...</div>;

  // ดึงข้อมูลค่าเช่า, สถานะ, ประวัติ, การแจ้งซ่อม
  const currentContract = user.contracts.find(c => c.isActive); // สมมติมี isActive
  const rentThisMonth = currentContract ? currentContract.rent : 0;
  const rentStatus = currentContract ? currentContract.paymentStatus : "ไม่มีข้อมูล";
  const repairRequests = user.repairRequests || []; // สมมติ user มี repairRequests
  const paymentHistory = user.invoices || []; // สมมติ invoices มี month, amount, status

  return (
    <div className="w-full">
      <div className="px-4 lg:px-6 pb-10">
        {/* แถบต้อนรับ */}
        <section className="bg-white rounded-2xl px-6 py-6 md:px-8 md:py-8 mb-5">
          <h1 className="text-4xl md:text-3xl lg:text-4xl font-bold text-black">
            สวัสดี คุณ {user.Name}
          </h1>
          <p className="mt-4 text-base md:text-lg text-black leading-snug">
            คุณสามารถติดตามค่าใช้จ่าย แจ้งซ่อม และเข้าถึงข้อมูลสำคัญได้ง่าย ๆ
            หวังว่าการใช้งาน ROOMIN จะช่วยให้ชีวิตในหอพักของคุณราบรื่นยิ่งขึ้น
          </p>
        </section>

        {/* แถวบน */}
        <div className="flex flex-wrap gap-6 items-start">
          {/* ปฏิทิน */}
          <div className="w-full lg:w-[40%] space-y-4">
            <CalendarBox />


          {/* ปุ่มเพิ่มกิจกรรม */}
          <div className="mt-5">
            <ButtonRI
              size="md" 
              bg="#7D6796"
              text="#FFFDFB"
              className="px-35 py-3 text-base font-medium rounded-2xl hover:!bg-[#645278]"
            >
              เพิ่มกิจกรรม
            </ButtonRI>
          </div>
        </div>

          {/* ค่าเช่าประจำเดือนนี้ */}
          <div className="w-full sm:w-[48%] lg:w-[24%]">
            <Box
              variant="lavender"
              className="min-h-[320px] flex flex-col justify-between p-4 pb-0 rounded-2xl"
            >
              <h2 className="text-lg md:text-2xl font-bold text-black mb-3">
                ค่าเช่าประจำเดือนนี้
              </h2>

              <div className="flex flex-col gap-3">
                <div className="text-4xl md:text-4xl font-semibold text-[#645278] leading-tight">
                  {rentThisMonth} <span className="text-xl md:text-2xl font-medium">บาท</span>
                </div>
                <div className="text-sm md:text-base text-black leading-relaxed">
                  สถานะ :{" "}
                  <span className={`font-semibold ${rentStatus === "ค้างชำระ" ? "text-[#E21717]" : "text-[#43A047]"}`}>
                    {rentStatus}
                  </span>
                </div>
              </div>

              <div className="mt-21">
                <ButtonRI
                  size="md"
                  bg="#7D6796"
                  text="white"
                  className="w-full py-3 text-base font-medium hover:!bg-[#645278]"
                  onClick={() => navigate("/tenant/payments")}
                >
                  ไปหน้าชำระเงิน
                </ButtonRI>
              </div>
            </Box>
          </div>

          {/* การแจ้งซ่อม */}
          <div className="w-full sm:w-[48%] lg:w-[30%]">
            <Box
              variant="peach"
              className="min-h-[320px] flex flex-col justify-between p-4 pb-1 rounded-2xl"
            >
              <div className="mb-3">
                <h2 className="text-lg md:text-2xl font-bold text-black">การแจ้งซ่อม</h2>
                <p className="text-sm md:text-base text-black mt-2">
                  อัปเดตล่าสุด :{" "}
                  <span className="text-black">
                    {repairRequests.length > 0 ? repairRequests[0].updatedAt : "-"}
                  </span>
                </p>
              </div>

              <div className="bg-peach rounded-lg p-2 md:p-3 w-full">
                <ul className="list-disc list-inside space-y-1 text-black text-sm md:text-base">
                  {repairRequests.length > 0 ? repairRequests.map((r, i) => (
                    <li key={i}>
                      {r.title} –{" "}
                      <span className="font-medium" style={{ color: r.statusColor }}>
                        {r.status}
                      </span>
                    </li>
                  )) : <li>ยังไม่มีข้อมูล</li>}
                </ul>
              </div>

              <div className="mt-20 mb-1 flex gap-2">
                <ButtonRI
                  size="md"
                  bg="#FEB863"
                  text="white"
                  className="flex-1 py-3 text-base font-medium rounded-full hover:!bg-[#FEA130]"
                >
                  แจ้งซ่อมใหม่
                </ButtonRI>

                <ButtonRI
                  size="md"
                  variant="outline"
                  bg="#FEB863"
                  text="#FEA130"
                  borderWidth={3}
                  className="flex-1 py-3 text-base font-medium rounded-full bg-white/80 hover:!bg-[#FFDBAF]"
                >
                  ดูทั้งหมด
                </ButtonRI>
              </div>
            </Box>
          </div>
        </div>

        {/* แถวล่าง: ประวัติการชำระเงิน + การแจ้งเตือน */}
        <div className="flex flex-wrap gap-6 mt-8 items-start">
          {/* กล่องซ้าย: สถิติการใช้น้ำ/ไฟ */}
          <div className="w-full lg:w-[40%] flex flex-col">
            <Box
              variant="peach"
              className="flex flex-col justify-between min-h-[350px] p-4 pb-3 rounded-2xl"
            >
              {/* หัวข้อ */}
              <h2 className="text-lg md:text-2xl font-bold text-black mb-3">
                สถิติการใช้น้ำ/ไฟ
              </h2>

              {/* รูปกราฟ */}
              <div className="flex justify-center items-center flex-grow">
                <img
                  src="/src/assets/graph_dt.png"
                  alt="กราฟแสดงสถิติการใช้น้ำ/ไฟ"
                  className="w-full max-w-[350px] h-auto object-contain"
                />
              </div>

              {/* ปุ่ม */}
              <div className="mt-5 flex justify-center">
                <ButtonRI
                  size="md"
                  bg="#FEB863"
                  text="white"
                  className="w-[370px] py-3 text-base font-medium rounded-full hover:!bg-[#FEA130]"
                >
                  ดูรายละเอียด
                </ButtonRI>
              </div>
            </Box>
          </div>

          {/* กล่องขวา: ประวัติ + การแจ้งเตือน */}
          <div className="w-full lg:w-full xl:w-[55%] flex flex-row flex-wrap gap-6 items-start lg:mt-0 xl:mt-[-240px]">
            {/* ประวัติการชำระเงิน */}
            <div className="flex-1 min-w-[300px]">
              <Box
                variant="outlined"
                className="flex flex-col justify-between min-h-[320px] p-4 rounded-2xl"
              >
                <h2 className="text-lg md:text-2xl font-bold text-black mb-3">
                  ประวัติการชำระเงิน
                </h2>

                {/* จำกัดสูงสุด ~4 กล่องและให้สกรอลล์ */}
                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                  {paymentHistory.length > 0 ? paymentHistory.map((it, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl p-4 bg-[#E7DDF1] flex items-center justify-between ${
                        it.status === "ค้างชำระ" ? "cursor-pointer hover:bg-[#DCCBE9]" : ""
                      }`}
                      onClick={() => {
                        if (it.status === "ค้างชำระ") navigate("/tenant/payments");
                      }}
                    >
                      <div>
                        <div>เดือน : {it.month}</div>
                        <div className="text-[#7D6796] text-sm">จำนวนเงิน : {it.amount} บาท</div>
                      </div>
                      <div className="font-semibold" style={{ color: it.statusColor }}>
                        {it.status}
                      </div>
                    </div>
                  )) : <div>ยังไม่มีประวัติการชำระเงิน</div>}
                </div>
              </Box>
            </div>

            {/* การแจ้งเตือน */}
            <div className="flex-[0.7] min-w-[260px]">
              <Box
                variant="soft"
                className="flex flex-col justify-between min-h-[420px] p-4 rounded-2xl"
              >
                <h2 className="text-lg md:text-2xl font-bold text-black mb-3">
                  การแจ้งเตือน
                </h2>

                <div className="space-y-3">
                  {user.notifications && user.notifications.length > 0 ? user.notifications.map((n, i) => (
                    <div key={i} className="rounded-2xl p-3 md:p-4 bg-[#E7DDF1] flex gap-3 items-start">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#7D6796] grid place-items-center shrink-0">
                        <img src={`/src/assets/icons/${n.icon}`} alt="แจ้งเตือน" className="w-5 h-5 md:w-6 md:h-6 opacity-95" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm md:text-base font-normal text-black leading-snug">{n.title}</div>
                        <div className="mt-1 text-xs md:text-sm text-[#7D6796] flex items-center gap-1">
                          <span className="inline-block w-2 h-2 rounded-full bg-[#7D6796]" />
                          <span>{n.time}</span>
                        </div>
                      </div>
                    </div>
                  )) : <div>ยังไม่มีการแจ้งเตือน</div>}
                </div>
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
