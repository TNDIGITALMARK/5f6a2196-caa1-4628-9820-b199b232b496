'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Sidebar from '@/components/Sidebar';
import NewsCard from '@/components/NewsCard';
import { mockArticles } from '@/data/mockNews';
import Image from 'next/image';

export default function HomePage() {
  const trendingImages = [
    '/generated/news-space-launch.png',
    '/generated/news-ai-tech.png',
    '/generated/news-culture.png',
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Header />
      <Hero />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          {/* Main News Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            {mockArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>

          {/* Trending Stories */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Trending Stories</h2>
            <div className="flex gap-4 mb-4">
              {trendingImages.map((src, index) => (
                <div key={index} className="w-32 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={src}
                    alt={`Trending ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="bg-[hsl(var(--light-bg))] p-4 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[hsl(var(--primary-blue))] font-semibold text-sm">DAILY DIGEST</span>
                <span className="text-[hsl(var(--text-secondary))] text-sm ml-2">- Your personalized news briefing is ready!</span>
              </div>
              <div className="flex gap-2">
                <button className="text-[hsl(var(--primary-blue))] text-sm font-medium hover:underline">
                  VIEW ALL TRENDS
                </button>
                <button className="bg-[hsl(var(--primary-blue))] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[hsl(207,77%,50%)] transition-colors">
                  SUBSCRIBE
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[hsl(var(--dark-gray))] text-white py-8 mt-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-sm mb-3 uppercase tracking-wider">ABOUT</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Our Mission</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-3 uppercase tracking-wider">SOURCES</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">All Platforms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-3 uppercase tracking-wider">SOURCES</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">All Platforms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-3 uppercase tracking-wider">LEGAL</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2024 NEWZ Aggregator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}