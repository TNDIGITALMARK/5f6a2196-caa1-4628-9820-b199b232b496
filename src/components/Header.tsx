'use client';

import Link from 'next/link';
import { Bell, User, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-[hsl(var(--dark-gray))] text-white h-[70px] sticky top-0 z-50 shadow-lg backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-10">
          {/* Logo - Enhanced */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--primary-blue))] to-[hsl(210,80%,65%)] rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight uppercase block">NEWZ</span>
              <span className="text-xs text-gray-400 tracking-wider">AGGREGATOR</span>
            </div>
          </Link>

          {/* Navigation - Modern Pills */}
          <nav className="hidden md:flex items-center gap-2">
            <Link href="/" className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-lg transition-all hover:text-[hsl(var(--primary-blue))]">
              Home
            </Link>
            <Link href="/" className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-lg transition-all hover:text-[hsl(var(--primary-blue))]">
              Feed
            </Link>
            <Link href="/" className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-lg transition-all hover:text-[hsl(var(--primary-blue))]">
              Discover
            </Link>
            <Link href="/bookmarks" className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-lg transition-all hover:text-[hsl(var(--primary-blue))]">
              Bookmarks
            </Link>
            <div className="ml-2 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center gap-2 shadow-lg animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="text-xs font-bold">LIVE</span>
            </div>
          </nav>
        </div>

        {/* User Actions - Enhanced */}
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 hover:bg-white/10 rounded-lg transition-all hover:scale-110 group">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full group-hover:animate-ping"></span>
          </button>
          <button className="p-2.5 hover:bg-white/10 rounded-lg transition-all hover:scale-110">
            <User size={20} />
          </button>
          <button className="md:hidden p-2.5 hover:bg-white/10 rounded-lg transition-all">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
