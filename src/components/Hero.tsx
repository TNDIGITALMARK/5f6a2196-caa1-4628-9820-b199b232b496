'use client';

import { Search, TrendingUp, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="gradient-hero py-16 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Zap size={16} className="text-white" />
            <span className="text-white text-sm font-medium">Breaking News Updates</span>
            <span className="flex items-center gap-1 text-white text-xs">
              <TrendingUp size={14} />
              Live
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-white text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-bold mb-4 tracking-tight leading-tight animate-fade-in-up">
            Stay Informed,
            <br />
            <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Instantly
            </span>
          </h1>

          <p className="text-white/90 text-base md:text-lg mb-8 max-w-2xl mx-auto animate-fade-in px-4">
            Discover breaking news, trending stories, and personalized content from trusted sources worldwide
          </p>

          {/* Modern Search Bar */}
          <div className="relative max-w-2xl mx-auto animate-scale-in">
            <div className="glass-card rounded-2xl p-2 shadow-elevated">
              <div className="flex items-center gap-3">
                <Search className="ml-4 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for news, topics, or sources..."
                  className="flex-1 py-3 bg-transparent border-0 focus:outline-none text-sm placeholder:text-gray-400"
                />
                <button className="btn-modern bg-[hsl(207,77%,59%)] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[hsl(207,77%,50%)] transition-all hover-glow">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in">
            {['Technology', 'Politics', 'Business', 'Science', 'Sports'].map((topic) => (
              <button
                key={topic}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full transition-all hover:scale-105"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
