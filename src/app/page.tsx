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

        <main className="flex-1 p-8 bg-gradient-to-b from-[hsl(var(--light-bg))] to-white">
          {/* Section Header with Stats */}
          <div className="mb-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[hsl(var(--foreground))] mb-1">Latest News</h2>
                <p className="text-[hsl(var(--text-secondary))] text-sm">Stay updated with breaking stories</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-4 py-2 bg-white rounded-lg text-sm font-medium text-[hsl(var(--foreground))] shadow-soft hover:shadow-modern transition-all hover-lift">
                  Filter
                </button>
                <button className="flex-1 sm:flex-none px-4 py-2 bg-[hsl(var(--primary-blue))] text-white rounded-lg text-sm font-semibold shadow-soft hover:shadow-modern transition-all hover-glow whitespace-nowrap">
                  Customize Feed
                </button>
              </div>
            </div>
          </div>

          {/* Main News Grid with Staggered Animation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
            {mockArticles.map((article, index) => (
              <div
                key={article.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <NewsCard article={article} />
              </div>
            ))}
          </div>

          {/* Trending Stories Section - Modern Card Design */}
          <div className="glass-card rounded-2xl p-8 shadow-elevated hover-lift animate-scale-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--primary-blue))] to-[hsl(210,80%,65%)] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">Trending Stories</h2>
                <p className="text-sm text-[hsl(var(--text-secondary))]">Most popular right now</p>
              </div>
            </div>

            {/* Trending Images Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {trendingImages.map((src, index) => (
                <div
                  key={index}
                  className="relative rounded-xl overflow-hidden aspect-video group cursor-pointer hover-lift"
                >
                  <Image
                    src={src}
                    alt={`Trending ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-white text-xs font-semibold">Trending #{index + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Daily Digest CTA */}
            <div className="bg-gradient-to-r from-[hsl(var(--primary-blue))]/5 to-[hsl(210,80%,65%)]/5 p-6 rounded-xl border border-[hsl(var(--primary-blue))]/20">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--primary-blue))] to-[hsl(210,80%,65%)] flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[hsl(var(--primary-blue))] font-bold text-sm tracking-wide">DAILY DIGEST</span>
                      <span className="px-2 py-0.5 bg-[hsl(var(--green-accent))]/10 text-[hsl(var(--green-accent))] text-xs font-semibold rounded-full">New</span>
                    </div>
                    <p className="text-[hsl(var(--text-secondary))] text-sm">Your personalized news briefing is ready!</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button className="px-5 py-2.5 text-[hsl(var(--primary-blue))] text-sm font-semibold hover:bg-[hsl(var(--primary-blue))]/10 rounded-xl transition-all hover:scale-105 whitespace-nowrap">
                    VIEW ALL TRENDS
                  </button>
                  <button className="btn-modern px-6 py-2.5 bg-gradient-to-r from-[hsl(var(--primary-blue))] to-[hsl(210,80%,65%)] text-white rounded-xl text-sm font-semibold hover-glow shadow-lg hover:shadow-xl transition-all whitespace-nowrap">
                    SUBSCRIBE NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer - Modern Design */}
      <footer className="bg-gradient-to-b from-[hsl(var(--dark-gray))] to-black text-white py-12 mt-16">
        <div className="container mx-auto px-6">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--primary-blue))] to-[hsl(210,80%,65%)] rounded-xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <div>
                  <span className="font-bold text-xl tracking-tight uppercase block">NEWZ</span>
                  <span className="text-xs text-gray-500 tracking-wider">AGGREGATOR</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4 max-w-sm">
                Your trusted source for breaking news, trending stories, and personalized content from around the world.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[hsl(var(--primary-blue))] rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[hsl(var(--primary-blue))] rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[hsl(var(--primary-blue))] rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">ABOUT</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-[hsl(var(--primary-blue))] transition-colors">Our Mission</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[hsl(var(--primary-blue))] transition-colors">Team</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[hsl(var(--primary-blue))] transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">SOURCES</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-[hsl(var(--primary-blue))] transition-colors">All Platforms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[hsl(var(--primary-blue))] transition-colors">Partners</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[hsl(var(--primary-blue))] transition-colors">API Access</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">LEGAL</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-[hsl(var(--primary-blue))] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[hsl(var(--primary-blue))] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[hsl(var(--primary-blue))] transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                &copy; 2024 NEWZ Aggregator. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-sm text-gray-500 hover:text-[hsl(var(--primary-blue))] transition-colors">
                  Contact Us
                </a>
                <a href="#" className="text-sm text-gray-500 hover:text-[hsl(var(--primary-blue))] transition-colors">
                  Help Center
                </a>
                <button className="px-4 py-2 bg-gradient-to-r from-[hsl(var(--primary-blue))] to-[hsl(210,80%,65%)] text-white rounded-lg text-xs font-semibold hover:shadow-lg transition-all hover:scale-105">
                  Subscribe to Newsletter
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}