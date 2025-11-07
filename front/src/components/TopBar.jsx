// TopBar.jsx
import bellIcon from "../assets/icons/noti.png";
import userIcon from "../assets/icons/user.png";

export default function TopBar({ title, onOpenMenu }) {
  // อ่านชื่อชั่วคราวจาก localStorage (ต่อ backend ภายหลังได้)
  const displayName = (() => {
    try {
      const raw = localStorage.getItem("roomin:user");
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.name) return u.name;
      }
    } catch {}
    return "User";
  })();

  return (
    // TopBar แถบสีม่วง
    <header className="bg-[#7D6796] text-white h-16 pl-10 pr-4 flex items-center justify-between sticky top-0 z-40">
      {/* กลุ่มซ้าย: ปุ่มเมนู (มือถือ) + หัวเรื่อง */}
      <div className="flex items-center gap-4 min-w-0 ">
        <button className="md:hidden -ml-4 p-2 text-2xl leading-none shrink-0 rounded-md hover:bg-white/10 active:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                onClick={onOpenMenu} aria-label="Open menu">
          ☰
        </button>
        <h1 className="text-2xl font-semibold leading-none whitespace-nowrap">{title}</h1>
      </div>

      {/* กลุ่มขวา: noti + user + ชื่อ (เดสก์ท็อปขึ้นไป) */}
      <div className="flex items-center gap-2 shrink-0">
        <button className="p-2 rounded-md hover:bg-white/10 active:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                aria-label="Notifications">
            <img src={bellIcon} alt="" className="w-5 h-5" />
        </button>
        <button
            className="flex items-center gap-2 p-2 rounded-md hover:bg-white/10 active:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Open user menu"
            onClick={() => console.log("open user menu")} // TODO: ต่อเมนู/โปรไฟล์จริง
    >
            <img src={userIcon} alt="" className="w-6 h-6" />
            <span className="hidden sm:inline text-md">{displayName}</span>
        </button>
      </div>
    </header>
  );
}
