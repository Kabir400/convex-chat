"use client";

import { useState } from "react";
import Sidebar from "../home/Sidebar";

interface ConversationLayoutProps {
  children: React.ReactNode;
}

export default function ConversationLayout({
  children,
}: ConversationLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0f0d1a]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
          fixed inset-y-0 left-0 z-40 md:static md:z-auto md:translate-x-0
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="md:hidden flex items-center gap-3 px-4 pt-4 pb-2 shrink-0 border-b border-white/6 bg-[#0f0d1a]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-white/4 border border-white/6 text-slate-400 hover:text-slate-200 hover:bg-white/8 transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="text-sm font-semibold bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            ConvexChat
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}
