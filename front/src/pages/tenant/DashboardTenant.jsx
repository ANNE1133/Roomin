import Box from "../../components/Box";
import ButtonRI from "../../components/ButtonRI";
import { useNavigate } from "react-router-dom";

export default function DashboardTenant() {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      <div className="px-4 lg:px-6 pb-10">
        {/* แถบต้อนรับ */}
        <section className="bg-white rounded-2xl px-6 py-6 md:px-8 md:py-8 mb-5">
          <h1 className="text-4xl md:text-3xl lg:text-4xl font-bold text-black">
            สวัสดี คุณ โรเบิร์ต
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
          <Box variant="lavender" className="p-0 min-h-[240px]" bodyClass="p-5">
            {/* แถบหัวปฏิทิน (กรอบเฉพาะเดือน) */}
            <div className="mb-4 flex justify-center">
              <div className="flex items-center justify-between rounded-2xl bg-[#7D6796] px-6 py-2 w-[220px] md:w-[260px] shadow-sm">
                {/* ลูกศรซ้าย */}
                <div className="text-white text-xl md:text-2xl font-bold select-none">
                  &lsaquo;
                </div>
                {/* ชื่อเดือน */}
                <h3 className="text-center text-base md:text-xl font-semibold text-white">
                  October 2025
                </h3>
                {/* ลูกศรขวา */}
                <div className="text-white text-xl md:text-2xl font-bold select-none">
                  &rsaquo;
                </div>
              </div>
            </div>

            {/* ตารางวัน */}
            <div className="grid grid-cols-7 text-center gap-y-[1px] md:gap-y-[1px]">
              {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((d) => (
                <div key={d} className="text-[12px] md:text-sm text-[#645278] font-semibold">
                  {d}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-[1/1] grid place-items-center text-[12px] md:text-base rounded-full transition-all
                    ${i === 17 ? "border-4 border-white text-black" : "hover:bg-[#7D6796]/10 text-black"}`}
                >
                  {i - 1 > 0 && i - 1 <= 31 ? i - 1 : ""}
                </div>
              ))}
            </div>
          </Box>

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
              {/* หัวข้อ */}
              <h2 className="text-lg md:text-2xl font-bold text-black mb-3">
                ค่าเช่าประจำเดือนนี้
              </h2>

              {/* เนื้อหาหลัก */}
              <div className="flex flex-col gap-3">
                <div className="text-4xl md:text-4xl font-semibold text-[#645278] leading-tight">
                  5,500 <span className="text-xl md:text-2xl font-medium">บาท</span>
                </div>

                <div className="text-sm md:text-base text-black leading-relaxed">
                  สถานะ : <span className="text-[#E21717] font-semibold">ค้างชำระ</span>
                </div>
              </div>

              {/* ปุ่ม */}
              <div className="mt-20">
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
              {/* หัวข้อ */}
              <div className="mb-3">
                <h2 className="text-lg md:text-2xl font-bold text-black">การแจ้งซ่อม</h2>
                <p className="text-sm md:text-base text-black mt-2">
                  อัปเดตล่าสุด : <span className="text-black">19 ก.ย. 2025</span>
                </p>
              </div>

              {/* รายการแจ้งซ่อม */}
              <div className="bg-peach rounded-lg p-2 md:p-3 w-full">
                <ul className="list-disc list-inside space-y-1 text-black text-sm md:text-base">
                  <li>
                    น้ำรั่วในห้องน้ำ –{" "}
                    <span className="text-[#FEA130] font-medium">กำลังดำเนินการ</span>
                  </li>
                  <li>
                    ไฟในห้องเสีย –{" "}
                    <span className="text-[#7D6796] font-medium">รอดำเนินการ</span>
                  </li>
                </ul>
              </div>

              {/* ปุ่มการแจ้งซ่อม */}
              <div className="mt-12 mb-1 flex gap-2">
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

        {/* แถวล่าง */}
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
          <div className="w-full lg:w-full xl:w-[55%] flex flex-row flex-wrap gap-6 items-start lg:mt-0 xl:mt-[-170px]">
            {/* ประวัติการชำระเงิน */}
            <div className="flex-1 min-w-[300px]">
              <Box
                variant="outlined"
                className="flex flex-col justify-between min-h-[320px] p-4 rounded-2xl"
              >
                {/* หัวข้อ */}
                <h2 className="text-lg md:text-2xl font-bold text-black mb-3">
                  ประวัติการชำระเงิน
                </h2>

                {/* รายการประวัติ */}
                <div className="space-y-3">
                  {[
                    { month: "กันยายน",  amount: "5,500", status: "ค้างชำระ",    color: "#E21717" },
                    { month: "สิงหาคม",  amount: "5,700", status: "ชำระเสร็จสิ้น", color: "#43A047" },
                    { month: "กรกฎาคม",  amount: "5,900", status: "ชำระเสร็จสิ้น", color: "#43A047" },
                    { month: "มิถุนายน", amount: "6,500", status: "ชำระเสร็จสิ้น", color: "#43A047" },
                  ].map((it, idx) => (
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
                      <div className="font-semibold" style={{ color: it.color }}>
                        {it.status}
                      </div>
                    </div>
                  ))}
                </div>
              </Box>
            </div>

            {/* การแจ้งเตือน */}
            <div className="flex-[0.7] min-w-[260px]">
              <Box
                variant="soft"
                className="flex flex-col justify-between min-h-[320px] p-4 rounded-2xl"
              >
                {/* หัวข้อ */}
                <h2 className="text-lg md:text-2xl font-bold text-black mb-3">
                  การแจ้งเตือน
                </h2>

                {/* รายการแจ้งเตือน */}
                <div className="space-y-3">
                  {[
                    { title: "จะมีการล้างแอร์วันพรุ่งนี้บ่ายโมง", time: "30 นาทีที่แล้ว", icon: "announce.png" },
                    { title: "การแจ้งซ่อมของคุณกำลังดำเนินการ", time: "2 วันที่แล้ว", icon: "repair.png" },
                    { title: "ค่าเช่าประจำเดือนกันยายนถึงเวลา...", time: "3 วันที่แล้ว", icon: "paybill.png" },
                  ].map((n, i) => (
                    <div
                      key={i}
                      className="rounded-2xl p-3 md:p-4 bg-[#E7DDF1] flex gap-3 items-start"
                    >
                      {/* กรอบไอคอนสีม่วงเข้ม */}
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#7D6796] grid place-items-center shrink-0">
                        <img
                          src={`/src/assets/icons/${n.icon}`}
                          alt="แจ้งเตือน"
                          className="w-5 h-5 md:w-6 md:h-6 opacity-95"
                        />
                      </div>

                      {/* ข้อความ + เวลา */}
                      <div className="flex-1">
                        <div className="text-sm md:text-base font-normal text-black leading-snug">
                          {n.title}
                        </div>
                        <div className="mt-1 text-xs md:text-sm text-[#7D6796] flex items-center gap-1">
                          <span className="inline-block w-2 h-2 rounded-full bg-[#7D6796]" />
                          <span>{n.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
