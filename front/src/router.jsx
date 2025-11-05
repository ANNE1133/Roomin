import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import BlankLayout from "./layouts/BlankLayout";

import Landing from "./pages/Landing";

import LoginOwner from "./pages/auth/LoginOwner";
import LoginTenant from "./pages/auth/LoginTenant";

import DashboardOwner from "./pages/owner/DashboardOwner";
import Invoices from "./pages/owner/Invoices";

import DashboardTenant from "./pages/tenant/DashboardTenant";
import Payments from "./pages/tenant/Payments";

import InformTenant from "./pages/tenant/InformTenant";
import InformOwner from "./pages/owner/InformOwner";

export const router = createBrowserRouter([
  // Landing 
  {
    path: "/",
    element: <AppLayout variant="public" />,
    children: [{ index: true, element: <Landing />, handle: { title: "สวัสดี", decorFullBleed: true } },],
  },

  // Login (ไม่มี bar)
  {
    path: "/login",
    element: <BlankLayout />,
    children: [
      { path: "owner", element: <LoginOwner /> },
      { path: "tenant", element: <LoginTenant /> },
    ],
  },

  // Owner
  {
    path: "/owner",
    element: <AppLayout variant="owner" />,
    children: [
      { index: true, element: <DashboardOwner />, handle: { title: "หน้าแรก" } },
      { path: "dashboard", element: <DashboardOwner />, handle: { title: "หน้าแรก" } },
      { path: "invoices", element: <Invoices />, handle: { title: "สร้างใบแจ้งค่าห้อง" } },
      { path: "inform", element: <InformOwner />, handle: { title: "ลงทะเบียนเจ้าของหอ" } },
    ],
  },

  // Tenant
  {
    path: "/tenant",
    element: <AppLayout variant="tenant" />,
    children: [
      { index: true, element: <DashboardTenant />, handle: { title: "หน้าแรก" } },
      { path: "dashboard", element: <DashboardTenant />, handle: { title: "หน้าแรก" } },
      { path: "payments", element: <Payments />, handle: { title: "การชำระเงิน" } },
      { path: "inform", element: <InformTenant />, handle: { title: "ลงทะเบียน" } },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);
