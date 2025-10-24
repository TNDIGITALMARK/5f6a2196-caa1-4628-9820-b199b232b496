'use client';

import { Search } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-[hsl(207,77%,59%)] to-[hsl(207,77%,65%)] py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-white text-[32px] font-bold mb-4 tracking-tight">
          STAY INFORMED, INSTANTLY
        </h1>
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
          />
        </div>
      </div>
    </section>
  );
}
