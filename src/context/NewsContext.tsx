'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NewsArticle, Category } from '@/types/news';
import { mockArticles } from '@/data/mockNews';
import {
  getAllArticles,
  upsertArticles,
  toggleBookmark as dbToggleBookmark,
  toggleLike as dbToggleLike,
  incrementArticleViews,
  getBookmarkedArticleIds,
  getLikedArticleIds,
  getOrCreateSessionId,
} from '@/lib/supabase/queries';

interface NewsContextType {
  articles: NewsArticle[];
  bookmarkedArticles: string[];
  likedArticles: string[];
  searchQuery: string;
  selectedCategory: Category | 'All';
  isLoading: boolean;
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
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>([]);
  const [likedArticles, setLikedArticles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');

  // Initialize session ID and load data from Supabase on mount
  useEffect(() => {
    async function initializeData() {
      try {
        // Get or create session ID
        const sid = getOrCreateSessionId();
        setSessionId(sid);

        // Load articles from Supabase
        const dbArticles = await getAllArticles();

        if (dbArticles.length === 0) {
          // First time - seed database with mock articles
          console.log('Seeding database with mock articles...');
          await upsertArticles(mockArticles);
          setArticles(mockArticles);
        } else {
          setArticles(dbArticles);
        }

        // Load user interactions (bookmarks and likes)
        const [bookmarks, likes] = await Promise.all([
          getBookmarkedArticleIds(sid),
          getLikedArticleIds(sid),
        ]);

        setBookmarkedArticles(bookmarks);
        setLikedArticles(likes);
      } catch (error) {
        console.error('Error initializing data:', error);
        // Fallback to mock articles if database fails
        setArticles(mockArticles);
      } finally {
        setIsLoading(false);
      }
    }

    initializeData();
  }, []);

  const toggleBookmark = async (articleId: string) => {
    const isCurrentlyBookmarked = bookmarkedArticles.includes(articleId);
    const newBookmarkedState = !isCurrentlyBookmarked;

    // Optimistic update
    setBookmarkedArticles((prev) =>
      newBookmarkedState
        ? [...prev, articleId]
        : prev.filter((id) => id !== articleId)
    );

    try {
      // Persist to database
      await dbToggleBookmark(sessionId, articleId, newBookmarkedState);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      // Revert optimistic update on error
      setBookmarkedArticles((prev) =>
        isCurrentlyBookmarked
          ? [...prev, articleId]
          : prev.filter((id) => id !== articleId)
      );
    }
  };

  const toggleLike = async (articleId: string) => {
    const isCurrentlyLiked = likedArticles.includes(articleId);
    const newLikedState = !isCurrentlyLiked;

    // Optimistic update
    setLikedArticles((prev) =>
      newLikedState
        ? [...prev, articleId]
        : prev.filter((id) => id !== articleId)
    );

    // Update local article likes count
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.id === articleId
          ? {
              ...article,
              likes: newLikedState ? article.likes + 1 : article.likes - 1,
            }
          : article
      )
    );

    try {
      // Persist to database (this also updates the aggregate count)
      await dbToggleLike(sessionId, articleId, newLikedState);
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic updates on error
      setLikedArticles((prev) =>
        isCurrentlyLiked
          ? [...prev, articleId]
          : prev.filter((id) => id !== articleId)
      );
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.id === articleId
            ? {
                ...article,
                likes: isCurrentlyLiked ? article.likes + 1 : article.likes - 1,
              }
            : article
        )
      );
    }
  };

  const incrementViews = async (articleId: string) => {
    // Optimistic update
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.id === articleId
          ? { ...article, views: article.views + 1 }
          : article
      )
    );

    try {
      // Persist to database
      await incrementArticleViews(articleId);
    } catch (error) {
      console.error('Error incrementing views:', error);
      // Note: We don't revert this optimistic update as it's less critical
    }
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
        isLoading,
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
