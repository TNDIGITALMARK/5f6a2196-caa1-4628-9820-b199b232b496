'use client';

import { Category } from '@/types/news';
import { platforms } from '@/data/mockNews';
import { useNews } from '@/context/NewsContext';
import { Filter } from 'lucide-react';

const categories: Category[] = [
  'Technology',
  'Politics',
  'Sports',
  'Business',
  'Entertainment',
  'Science',
  'Health',
  'World News',
  'Culture',
];

export default function Sidebar() {
  const { selectedCategory, setSelectedCategory } = useNews();

  return (
    <aside className="w-[240px] bg-white border-r border-[hsl(var(--border))] sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto">
      <div className="p-6">
        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={14} className="text-[hsl(var(--text-secondary))]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--text-secondary))]">
              FILTER BY CATEGORY
            </h3>
          </div>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-[hsl(var(--primary-blue))] to-[hsl(210,80%,65%)] text-white shadow-md'
                  : 'hover:bg-[hsl(var(--light-bg))] text-[hsl(var(--foreground))]'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[hsl(var(--primary-blue))] to-[hsl(210,80%,65%)] text-white shadow-md'
                    : 'hover:bg-[hsl(var(--light-bg))] text-[hsl(var(--foreground))]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Platforms */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--text-secondary))] mb-4">
            PLATFORMS
          </h3>
          <div className="space-y-3">
            {platforms.map((platform) => (
              <div key={platform.name} className="flex items-center gap-3 p-2 hover:bg-[hsl(var(--light-bg))] rounded-md transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary-blue))] flex items-center justify-center text-white text-xs font-semibold">
                  {platform.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{platform.name}</div>
                  <div className="text-xs text-[hsl(var(--text-secondary))]">{platform.followers}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
