

import React from "react";
import { FaHome, FaBriefcase, FaClipboardList } from "react-icons/fa";

const sidebarLinks = [
  { label: "Home", icon: <FaHome />, href: "/dashboard/rh" },
  { label: "Job Offers", icon: <FaBriefcase />, href: "/dashboard/rh" },
  { label: "Applications", icon: <FaClipboardList />, href: "/dashboard/rh?tab=applications" },
];

export default function RHDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100 w-full h-full">
      {/* Sidebar */}
      <aside className="w-64 bg-[#144D56] text-white flex flex-col py-8 px-4 shadow-lg">
        <div className="mb-10 flex items-center gap-3">
          <span className="text-2xl font-bold">RH Admin</span>
        </div>
        <nav className="flex-1">
          <ul className="space-y-4">
            {sidebarLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-[#17606a] transition"
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-8 text-xs text-[#b2d0d6]">
          &copy; {new Date().getFullYear()} DRÄXLMAIER
        </div>
      </aside>
      {/* Main content */}
      <main className="flex p-4 w-full h-full">{children}</main>
    </div>
  );
}



