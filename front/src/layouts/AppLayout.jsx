import { useState, useEffect } from "react";
import { Outlet, useMatches } from "react-router-dom";
import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar";
import { defaultTitleByVariant } from "../nav/config";
import FullBleedDecor from "../components/FullBleedDecor";

export default function AppLayout({ variant = "public" }) {
  const [open, setOpen] = useState(false);
  const matches = useMatches();
  const pageTitle = matches.at(-1)?.handle?.title ?? defaultTitleByVariant[variant];
  const showLandingDecor = matches.at(-1)?.handle?.decorFullBleed === true;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="min-h-dvh grid grid-cols-12">
      {/* Desktop sidebar: ซ่อนบนจอเล็กด้วย hidden md:block */}
      <div className="hidden md:block md:col-span-3 lg:col-span-2">
        <div className="sticky top-0 h-dvh overflow-y-auto">
          <SideBar variant={variant} />
        </div>
      </div>

      {/* Main + TopBar */}
      <main className="relative overflow-x-clip col-span-12 md:col-span-9 lg:col-span-10">
        {/* TopBar: ติดบนเฉพาะคอลัมน์นี้ */}
        <div className="sticky top-0 z-40">
          <TopBar
            variant={variant}
            title={pageTitle}
            onOpenMenu={() => setOpen(true)}
          />
        </div>
        {/* decor แบบเต็มจอ: เปิดเฉพาะหน้า Landing */}
        {showLandingDecor && <FullBleedDecor top="18.5%" height="12rem" />}
        {showLandingDecor && <FullBleedDecor top="54%" height="12rem" />}

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile drawer: โชว์เฉพาะจอเล็ก และให้แผงเลื่อนมีพื้นหลังทึบเอง */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setOpen(false)}>
          {/* ฉากหลังจาง */}
          <div className="absolute inset-0 bg-black/40" />

          {/* แผงเมนู (เป็นคนเลื่อนเอง) */}
          <div
            className="absolute left-0 top-0 h-[100dvh] w-72 bg-[#645278] shadow-xl ring-1 ring-black/5
                        overflow-y-auto overscroll-contain"
            onClick={(e) => e.stopPropagation()}
            style={{ WebkitOverflowScrolling: "touch", willChange: "transform" }}
            aria-modal="true" role="dialog"
         >
            {/* ใส่ Sidebar ได้ตามเดิม */}
            <SideBar variant={variant} onNavigate={() => setOpen(false)} />
          </div>
        </div>
    )}
    </div>
  );
}
