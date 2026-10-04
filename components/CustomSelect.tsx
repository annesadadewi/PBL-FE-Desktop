"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CustomSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({
  options = [],
  value,
  onChange,
  placeholder = "Pilih...",
  className = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown jika klik di luar area komponen
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block w-full ${className}`} ref={dropdownRef}>
      {/* Tombol Utama */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#294371] text-white text-[8px] sm:text-sm font-regular px-3 py-1.5 rounded-xl flex items-center justify-between gap-2 shadow-sm hover:bg-[#1f3763] transition-all cursor-pointer"
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Menu Popover Pilihan */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-full bg-[#E2EDFF] text-slate-800 rounded-2xl shadow-xl border border-blue-200/80 p-1.5 z-50 space-y-0.5 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                value === option
                  ? "bg-[#3B6DB3] text-white font-semibold"
                  : "hover:bg-blue-200/70 text-slate-800"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}