"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, BookOpen, Clock, Sparkles } from "lucide-react";

export const Header: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Tổng quan", icon: Sparkles },
    { href: "/timeline", label: "Tam Trục Niên Biểu", icon: Clock },
    { href: "/pathways", label: "Lộ Trình Thời Kỳ", icon: Compass },
    { href: "/read/Đại_Việt", label: "Đọc Tư Liệu", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-paper-50/90 backdrop-blur-md border-b border-paper-300/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo mang phong cách ấn triện cổ điển */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-crimson flex items-center justify-center text-paper-50 font-serif font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
            Sử
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg text-paper-900 tracking-tight leading-none group-hover:text-crimson transition-colors">
              Sử Việt Niên Biểu
            </span>
            <span className="text-[10px] font-sans uppercase tracking-widest text-paper-800/60 mt-0.5">
              Historical Explorer
            </span>
          </div>
        </Link>

        {/* Thanh Menu điều hướng */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-serif transition-all ${
                  isActive
                    ? "bg-paper-900 text-paper-50 font-medium shadow-sm"
                    : "text-paper-800/70 hover:text-paper-900 hover:bg-paper-200/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5 opacity-80" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

