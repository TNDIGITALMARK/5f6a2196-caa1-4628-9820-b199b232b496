'use client';

import Header from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import { useNews } from '@/context/NewsContext';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';

export default function BookmarksPage() {
  const { articles, bookmarkedArticles } = useNews();

  const bookmarkedArticlesList = articles.filter((article) =>
    bookmarkedArticles.includes(article.id)
  );

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Header />

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--primary-blue))] to-[hsl(210,80%,65%)] flex items-center justify-center shadow-lg">
              <Bookmark className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">Bookmarks</h1>
              <p className="text-[hsl(var(--text-secondary))]">
                {bookmarkedArticlesList.length} saved {bookmarkedArticlesList.length === 1 ? 'article' : 'articles'}
              </p>
            </div>
          </div>
        </div>

        {bookmarkedArticlesList.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {bookmarkedArticlesList.map((article, index) => (
              <div
                key={article.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <NewsCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[hsl(var(--primary-blue))] to-[hsl(210,80%,65%)] flex items-center justify-center shadow-lg">
              <Bookmark className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-2">No bookmarks yet</h2>
            <p className="text-[hsl(var(--text-secondary))] mb-6">
              Start bookmarking articles you want to read later
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[hsl(var(--primary-blue))] to-[hsl(210,80%,65%)] text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              Explore Articles
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
