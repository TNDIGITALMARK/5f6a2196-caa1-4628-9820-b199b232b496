'use client';

import Link from 'next/link';
import { Bell, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-[hsl(var(--dark-gray))] text-white h-[60px] sticky top-0 z-50">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-[hsl(var(--dark-gray))] font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-lg tracking-tight uppercase">NEWZ</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-[hsl(var(--primary-blue))] transition-colors">
              Home
            </Link>
            <Link href="/" className="text-sm font-medium hover:text-[hsl(var(--primary-blue))] transition-colors">
              Feed
            </Link>
            <Link href="/" className="text-sm font-medium hover:text-[hsl(var(--primary-blue))] transition-colors">
              Feed
            </Link>
            <Link href="/" className="text-sm font-medium hover:text-[hsl(var(--primary-blue))] transition-colors">
              Discover
            </Link>
            <Link href="/bookmarks" className="text-sm font-medium hover:text-[hsl(var(--primary-blue))] transition-colors">
              Bookmarks
            </Link>
            <span className="flex items-center gap-1 text-sm font-medium">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              LIVE
            </span>
          </nav>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Bell size={20} />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
