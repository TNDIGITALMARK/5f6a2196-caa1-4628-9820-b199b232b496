'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NewsArticle, Category } from '@/types/news';
import { mockArticles } from '@/data/mockNews';

interface NewsContextType {
  articles: NewsArticle[];
  bookmarkedArticles: string[];
  likedArticles: string[];
  searchQuery: string;
  selectedCategory: Category | 'All';
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: Category | 'All') => void;
  toggleBookmark: (articleId: string) => void;
  toggleLike: (articleId: string) => void;
  incrementViews: (articleId: string) => void;
  getArticleById: (id: string) => NewsArticle | undefined;
  filteredArticles: NewsArticle[];
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<NewsArticle[]>(mockArticles);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>([]);
  const [likedArticles, setLikedArticles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBookmarks = localStorage.getItem('bookmarkedArticles');
      const savedLikes = localStorage.getItem('likedArticles');
      const savedArticles = localStorage.getItem('articles');

      if (savedBookmarks) {
        setBookmarkedArticles(JSON.parse(savedBookmarks));
      }
      if (savedLikes) {
        setLikedArticles(JSON.parse(savedLikes));
      }
      if (savedArticles) {
        setArticles(JSON.parse(savedArticles));
      }
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarkedArticles));
    }
  }, [bookmarkedArticles]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('likedArticles', JSON.stringify(likedArticles));
      localStorage.setItem('articles', JSON.stringify(articles));
    }
  }, [likedArticles, articles]);

  const toggleBookmark = (articleId: string) => {
    setBookmarkedArticles((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
  };

  const toggleLike = (articleId: string) => {
    setLikedArticles((prev) => {
      const isLiked = prev.includes(articleId);
      const newLiked = isLiked
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId];

      // Update article likes count
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.id === articleId
            ? {
                ...article,
                likes: isLiked ? article.likes - 1 : article.likes + 1,
              }
            : article
        )
      );

      return newLiked;
    });
  };

  const incrementViews = (articleId: string) => {
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.id === articleId
          ? { ...article, views: article.views + 1 }
          : article
      )
    );
  };

  const getArticleById = (id: string) => {
    return articles.find((article) => article.id === id);
  };

  // Filter articles based on search and category
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.source.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <NewsContext.Provider
      value={{
        articles,
        bookmarkedArticles,
        likedArticles,
        searchQuery,
        selectedCategory,
        setSearchQuery,
        setSelectedCategory,
        toggleBookmark,
        toggleLike,
        incrementViews,
        getArticleById,
        filteredArticles,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
}
