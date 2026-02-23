"use client";

import { useState } from "react";

interface GroupNameModalProps {
  onConfirm: (name: string) => void;
  onCancel: () => void;
  isCreating: boolean;
}

export default function GroupNameModal({
  onConfirm,
  onCancel,
  isCreating,
}: GroupNameModalProps) {
  const [name, setName] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#1a1628] border border-white/10 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-lg font-bold text-white mb-2 tracking-tight">
          Name your group
        </h2>
        <p className="text-[13px] text-slate-400 mb-6">
          Give your group a catchy name so everyone knows what it's about.
        </p>

        <div className="space-y-4">
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && name.trim() && !isCreating && onConfirm(name)
            }
            placeholder="e.g. The Avengers"
            disabled={isCreating}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all duration-200"
          />

          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              disabled={isCreating}
              className="flex-1 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 font-medium text-[14px]"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(name)}
              disabled={!name.trim() || isCreating}
              className="flex-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-[14px] shadow-[0_4px_14px_rgba(139,92,246,0.4)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isCreating ? (
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                "Create Group"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
