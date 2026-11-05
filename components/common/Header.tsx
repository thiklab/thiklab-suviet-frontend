"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/common/Icon";

const isActiveLink = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`) || (href === "/doc/dai-viet" && pathname.startsWith("/doc"));

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLinks: { href: string; label: string; icon: IconName }[] = [
    { href: "/", label: "Tổng quan", icon: "sparkles" },
    { href: "/timeline", label: "Dòng thời gian", icon: "clock" },
    { href: "/pathways", label: "Các Giai Đoạn", icon: "compass" },
    { href: "/doc/dai-viet", label: "Đọc Bài Viết", icon: "book-open" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-paper-50/90 backdrop-blur-md border-b border-paper-300/40">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo mang phong cách ấn triện cổ điển */}
        <Link prefetch={false} href="/" className="flex items-center gap-3 group">
          <Icon name="logo" className="w-9 h-9 rounded-xl shadow-sm font-serif transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="font-serif font-bold text-base sm:text-lg text-paper-900 tracking-tight leading-none group-hover:text-crimson transition-colors">
              Sử Việt Niên Biểu
            </span>
            <span className="hidden sm:block text-[10px] font-sans uppercase tracking-widest text-paper-800/60 mt-0.5">
              Historical Explorer
            </span>
          </div>
        </Link>

        {/* Thanh Menu điều hướng */}
        <nav aria-label="Điều hướng chính" className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item) => {
            const isActive = isActiveLink(pathname, item.href);
            return (
              <Link prefetch={false}
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs lg:text-sm font-serif transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-paper-900 text-paper-50 font-medium shadow-sm"
                    : "text-paper-800/70 hover:text-paper-900 hover:bg-paper-200/50"
                }`}
              >
                <Icon name={item.icon} className="w-3.5 h-3.5 opacity-80" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden p-2 -mr-2 rounded-full text-paper-900 hover:bg-paper-200/50 transition-colors"
        >
          {menuOpen ? <Icon name="x" className="w-5 h-5" /> : <Icon name="menu" className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-paper-300/40 bg-paper-50/95 px-4 py-3 space-y-1">
          {navLinks.map((item) => {
            const isActive = isActiveLink(pathname, item.href);
            return (
              <Link prefetch={false}
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-serif transition-colors ${
                  isActive
                    ? "bg-paper-900 text-paper-50 font-medium"
                    : "text-paper-800 hover:bg-paper-200/50"
                }`}
              >
                <Icon name={item.icon} className="w-4 h-4 opacity-80" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
};

