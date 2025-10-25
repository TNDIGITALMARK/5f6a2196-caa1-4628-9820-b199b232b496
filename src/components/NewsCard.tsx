'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye, Bookmark } from 'lucide-react';
import { NewsArticle } from '@/types/news';

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technology':
        return 'text-[hsl(var(--green-accent))]';
      case 'Politics':
        return 'text-[hsl(var(--primary-blue))]';
      case 'Science':
        return 'text-[hsl(var(--green-accent))]';
      case 'Business':
        return 'text-[hsl(var(--orange-accent))]';
      default:
        return 'text-[hsl(var(--primary-blue))]';
    }
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'CNN':
        return 'bg-[hsl(var(--red-accent))]';
      case 'TechCrunch':
        return 'bg-[hsl(var(--green-accent))]';
      case 'Reuters':
        return 'bg-[hsl(var(--orange-accent))]';
      default:
        return 'bg-[hsl(var(--primary-blue))]';
    }
  };

  return (
    <Link href={`/article/${article.id}`}>
      <div className="news-card hover-lift group cursor-pointer relative overflow-hidden">
        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 gradient-card-hover opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="flex gap-4 relative z-10">
          {/* Thumbnail with Modern Styling */}
          <div className="flex-shrink-0 relative">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={article.imageUrl}
                alt={article.title}
                width={100}
                height={100}
                className="news-thumbnail transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            {article.isBreaking && (
              <span className="absolute -top-2 -left-2 bg-gradient-to-r from-[hsl(var(--red-accent))] to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                BREAKING
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 ${getCategoryColor(article.category)}`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                  <span className="text-xs font-semibold tracking-wide">{article.source}</span>
                </span>
                <span className={`text-xs font-medium ${getCategoryColor(article.category)}`}>
                  · {article.category}
                </span>
              </div>
              <button className="flex-shrink-0 p-1.5 hover:bg-[hsl(var(--primary-blue))] hover:text-white rounded-lg transition-all transform hover:scale-110">
                <Bookmark size={16} className="transition-colors" />
              </button>
            </div>

            <h3 className="text-base font-semibold text-[hsl(var(--foreground))] mb-3 line-clamp-2 group-hover:text-[hsl(var(--primary-blue))] transition-colors leading-snug">
              {article.title}
            </h3>

            <div className="flex items-center gap-4 text-[hsl(var(--text-secondary))] text-xs">
              <span className="flex items-center gap-1.5 hover:text-[hsl(var(--red-accent))] transition-colors cursor-pointer">
                <Heart size={14} className="group-hover:fill-current" />
                <span className="font-medium">{article.likes}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={14} />
                <span className="font-medium">{article.views}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-current"></span>
                <span>{article.timestamp}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Border Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[hsl(var(--primary-blue))] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
      </div>
    </Link>
  );
}
