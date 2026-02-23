"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import WelcomePanel from "./WelcomePanel";

export default function HomeLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0f0d1a]">
      {/* ── Mobile overlay backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      {/* Desktop: always visible. Mobile: slide in from left when open */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 md:static md:z-auto md:translate-x-0
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* ── Main content (WelcomePanel) ── */}
      <WelcomePanel onMenuClick={() => setSidebarOpen(true)} />
    </div>
  );
}
