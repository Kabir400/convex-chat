"use client";

import { useRef, useEffect } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
  isLoading?: boolean;
  debouncedValue?: string;
}

export default function SearchBar({
  value,
  onChange,
  resultCount,
  isLoading,
  debouncedValue,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative z-10 px-5 pt-4 pb-3">
      {/* input wrapper */}
      <div className="relative">
        {/* search icon */}
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>

        <input
          ref={inputRef}
          id="new-chat-search"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/8 text-[13.5px] text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all duration-200"
        />

        {/* clear button */}
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* result count hint */}
      {!isLoading && resultCount !== undefined && (
        <p className="text-[11.5px] text-slate-600 mt-2 px-0.5">
          {resultCount === 0
            ? debouncedValue
              ? "No users match your search"
              : "No users found"
            : `${resultCount} user${resultCount !== 1 ? "s" : ""}${debouncedValue ? " found" : ""}`}
        </p>
      )}
    </div>
  );
}
