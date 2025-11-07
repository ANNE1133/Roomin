export const navItems = {
  public: [
    { label: "หน้าหลัก", to: "/" },
    { label: "คุณสมบัติ" },                              
    { label: "ราคา" },
    { label: "คำถามที่พบบ่อย" },
  ],

  owner: [
    { label: "หน้าแรก", to: "/owner/dashboard" },
    { label: "จัดการหอพัก" },                              
    { label: "จัดการผู้เช่า" },
    { label: "สร้างใบแจ้งค่าห้อง", to: "/owner/invoices" },
    { label: "ประกาศ/ข่าวสาร" },                              
    { label: "คำร้องแจ้งซ่อม" },
    { label: "การชำระเงิน" },                              
    { label: "บัญชีผู้ใช้" },
    { label: "ตั้งค่า" },
  ],

  tenant: [
    { label: "หน้าแรก", to: "/tenant/dashboard" }, 
    { label: "ข้อมูลห้อง" },                              
    { label: "ใบแจ้งค่าห้อง" },                         
    { label: "การแจ้งซ่อม" },
    { label: "ประวัติการชำระเงิน" , to: "/tenant/payments" },
    { label: "ติดต่อเจ้าของหอ" },
    { label: "บัญชีผู้ใช้" },
    { label: "ตั้งค่า" },
  ],
};

export const defaultTitleByVariant = {
  public: "ROOMIN",
  owner: "เจ้าของหอ",
  tenant: "ผู้เช่า",
};
