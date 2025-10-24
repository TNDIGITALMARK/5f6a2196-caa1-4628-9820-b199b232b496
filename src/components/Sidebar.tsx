'use client';

import { useState } from 'react';
import { Category } from '@/types/news';
import { platforms } from '@/data/mockNews';

const categories: Category[] = [
  'Technology',
  'Politics',
  'Sports',
  'Entertainment',
  'Science',
  'Culture',
];

export default function Sidebar() {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['Technology']);

  const toggleCategory = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <aside className="w-[240px] bg-white border-r border-[hsl(var(--border))] sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto">
      <div className="p-6">
        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--text-secondary))] mb-4">
            CATEGORIES
          </h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 cursor-pointer hover:bg-[hsl(var(--light-bg))] p-2 rounded-md transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="w-4 h-4 rounded border-gray-300 text-[hsl(var(--primary-blue))] focus:ring-[hsl(var(--primary-blue))]"
                />
                <span className="text-sm">{category}</span>
              </label>
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
