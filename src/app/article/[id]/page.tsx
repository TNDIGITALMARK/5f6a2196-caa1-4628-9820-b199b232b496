'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { mockArticles } from '@/data/mockNews';
import Image from 'next/image';
import { Clock, Share2, Bookmark, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function ArticlePage() {
  const params = useParams();
  const article = mockArticles.find((a) => a.id === params.id);

  if (!article) {
    return <div>Article not found</div>;
  }

  const relatedArticles = mockArticles.filter((a) => a.id !== article.id).slice(0, 3);

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
          </div>

          <h1 className="text-3xl font-bold mb-4 text-[hsl(var(--foreground))]">
            {article.title}
          </h1>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 text-sm text-[hsl(var(--text-secondary))]">
              <span>{article.timestamp}</span>
              <span className="flex items-center gap-1">
                <Clock size={16} />
                {article.readingTime} min read
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-[hsl(var(--light-bg))] rounded-lg transition-colors">
                <Bookmark size={20} className="text-[hsl(var(--text-secondary))]" />
              </button>
              <button className="p-2 hover:bg-[hsl(var(--light-bg))] rounded-lg transition-colors">
                <Share2 size={20} className="text-[hsl(var(--text-secondary))]" />
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
          </div>

          {/* Share Buttons */}
          <div className="border-t border-[hsl(var(--border))] mt-8 pt-6">
            <h3 className="text-sm font-semibold text-[hsl(var(--text-secondary))] mb-4 uppercase tracking-wider">
              Share This Article
            </h3>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary-blue))] text-white rounded-lg text-sm font-medium hover:bg-[hsl(207,77%,50%)] transition-colors">
                <Twitter size={16} />
                Twitter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary-blue))] text-white rounded-lg text-sm font-medium hover:bg-[hsl(207,77%,50%)] transition-colors">
                <Linkedin size={16} />
                LinkedIn
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--light-bg))] text-[hsl(var(--foreground))] rounded-lg text-sm font-medium hover:bg-[hsl(var(--secondary))] transition-colors">
                <LinkIcon size={16} />
                Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Related Articles</h2>
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
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
