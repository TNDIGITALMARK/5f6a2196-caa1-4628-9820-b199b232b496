'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Image from 'next/image';
import { Clock, Share2, Bookmark, Twitter, Linkedin, Link as LinkIcon, Heart, Eye } from 'lucide-react';
import Link from 'next/link';
import { useNews } from '@/context/NewsContext';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function ArticlePage() {
  const params = useParams();
  const { getArticleById, articles, bookmarkedArticles, likedArticles, toggleBookmark, toggleLike, incrementViews } = useNews();

  const article = getArticleById(params.id as string);

  useEffect(() => {
    if (article) {
      // Increment views when article is loaded
      incrementViews(article.id);
    }
  }, [article?.id, incrementViews]);

  if (!article) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">📰</div>
            <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-2">Article not found</h1>
            <p className="text-[hsl(var(--text-secondary))] mb-6">The article you're looking for doesn't exist.</p>
            <Link href="/" className="px-6 py-3 bg-gradient-to-r from-[hsl(var(--primary-blue))] to-[hsl(210,80%,65%)] text-white rounded-lg font-semibold hover:shadow-lg transition-all">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isBookmarked = bookmarkedArticles.includes(article.id);
  const isLiked = likedArticles.includes(article.id);
  const relatedArticles = articles.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = article.title;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Header />

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Back Link */}
        <Link href="/" className="text-[hsl(var(--primary-blue))] text-sm font-medium hover:underline mb-6 inline-block">
          ← Back to News Feed
        </Link>

        {/* Article Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-2 text-[hsl(var(--primary-blue))]">
              <span className="w-2 h-2 rounded-full bg-current"></span>
              <span className="text-sm font-medium">{article.source}</span>
            </span>
            <span className="text-[hsl(var(--text-secondary))] text-sm">{article.category}</span>
            {article.isBreaking && (
              <span className="px-3 py-1 bg-gradient-to-r from-[hsl(var(--red-accent))] to-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                BREAKING
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-4 text-[hsl(var(--foreground))]">
            {article.title}
          </h1>

          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-4 text-sm text-[hsl(var(--text-secondary))]">
              <span>{article.timestamp}</span>
              <span className="flex items-center gap-1">
                <Clock size={16} />
                {article.readingTime} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye size={16} />
                {article.views} views
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  toggleLike(article.id);
                  toast.success(isLiked ? 'Removed from likes' : 'Added to likes');
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all hover:scale-110 ${
                  isLiked ? 'text-[hsl(var(--red-accent))] bg-red-50' : 'hover:bg-[hsl(var(--light-bg))]'
                }`}
              >
                <Heart size={18} className={isLiked ? 'fill-current' : ''} />
                <span className="text-sm font-medium">{article.likes}</span>
              </button>
              <button
                onClick={() => {
                  toggleBookmark(article.id);
                  toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
                }}
                className={`p-2 rounded-lg transition-all hover:scale-110 ${
                  isBookmarked ? 'text-[hsl(var(--primary-blue))] bg-blue-50' : 'hover:bg-[hsl(var(--light-bg))]'
                }`}
              >
                <Bookmark size={20} className={isBookmarked ? 'fill-current' : ''} />
              </button>
            </div>
          </div>

          {/* Article Image */}
          <div className="relative w-full h-96 rounded-lg overflow-hidden mb-6">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Article Summary */}
          <p className="text-lg text-[hsl(var(--text-secondary))] mb-6 leading-relaxed">
            {article.summary}
          </p>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <p className="mb-4 leading-relaxed">
              {article.content} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="mb-4 leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p className="mb-4 leading-relaxed">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
            <p className="mb-4 leading-relaxed">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
            </p>
          </div>

          {/* Share Buttons */}
          <div className="border-t border-[hsl(var(--border))] mt-8 pt-6">
            <h3 className="text-sm font-semibold text-[hsl(var(--text-secondary))] mb-4 uppercase tracking-wider">
              Share This Article
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary-blue))] text-white rounded-lg text-sm font-medium hover:bg-[hsl(207,77%,50%)] transition-all hover:scale-105"
              >
                <Twitter size={16} />
                Twitter
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary-blue))] text-white rounded-lg text-sm font-medium hover:bg-[hsl(207,77%,50%)] transition-all hover:scale-105"
              >
                <Linkedin size={16} />
                LinkedIn
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--light-bg))] text-[hsl(var(--foreground))] rounded-lg text-sm font-medium hover:bg-[hsl(var(--secondary))] transition-all hover:scale-105"
              >
                <LinkIcon size={16} />
                Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Related {article.category} Articles</h2>
            <div className="space-y-4">
              {relatedArticles.map((related) => (
                <Link key={related.id} href={`/article/${related.id}`}>
                  <div className="flex gap-4 p-4 hover:bg-[hsl(var(--light-bg))] rounded-lg transition-colors cursor-pointer">
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={related.imageUrl}
                        alt={related.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm mb-2 line-clamp-2">{related.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-[hsl(var(--text-secondary))]">
                        <span>{related.source}</span>
                        <span>•</span>
                        <span>{related.timestamp}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye size={12} />
                          {related.views}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
