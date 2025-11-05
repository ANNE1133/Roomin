export default function FullBleedDecor({
  top = "58%",           // ตำแหน่งตามแนวแกน Y ของ decor
  height = "12rem",      // ความสูงของแถบ
  className = "",        // เผื่อส่งคลาสเพิ่ม
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 -translate-x-1/2"
      style={{ top }}
    >
      <div className="w-[100dvw]" style={{ height }}>
        <div
          className={
            "h-full w-full bg-[linear-gradient(165deg,#7D6796_0%,#BFAED1_55%,#E9E1ED_100%)] " +
            className
          }
        />
      </div>
    </div>
  );
}
