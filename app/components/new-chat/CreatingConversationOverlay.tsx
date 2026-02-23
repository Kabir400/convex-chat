"use client";

export default function CreatingConversationOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f0d1a]/80 backdrop-blur-sm">
      {/* spinner ring */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-[3px] border-white/8" />
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-violet-500 animate-spin" />
      </div>

      <p className="mt-4 text-[13.5px] font-semibold text-slate-300 tracking-wide">
        Opening conversation…
      </p>
      <p className="mt-1 text-[12px] text-slate-600">Just a moment</p>
    </div>
  );
}
