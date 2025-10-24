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
      <div className="news-card group cursor-pointer">
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="flex-shrink-0 relative">
            <Image
              src={article.imageUrl}
              alt={article.title}
              width={80}
              height={80}
              className="news-thumbnail"
            />
            {article.isBreaking && (
              <span className="absolute -top-2 -left-2 bg-[hsl(var(--red-accent))] text-white text-xs font-bold px-2 py-0.5 rounded">
                BREAKING
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 ${getCategoryColor(article.category)}`}>
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  <span className="text-xs font-medium">{article.source}</span>
                </span>
              </div>
              <button className="flex-shrink-0 p-1 hover:bg-[hsl(var(--light-bg))] rounded transition-colors">
                <Bookmark size={16} className="text-[hsl(var(--text-secondary))]" />
              </button>
            </div>

            <h3 className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 line-clamp-2 group-hover:text-[hsl(var(--primary-blue))] transition-colors">
              {article.title}
            </h3>

            <div className="flex items-center gap-4 text-[hsl(var(--text-secondary))] text-xs">
              <span className="flex items-center gap-1">
                <Heart size={14} />
                {article.likes}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={14} />
                {article.views}
              </span>
              <span>{article.timestamp}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
