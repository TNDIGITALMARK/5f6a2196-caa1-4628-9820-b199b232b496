import { supabase, TENANT_ID, PROJECT_ID } from './client';
import { NewsArticle } from '@/types/news';

// ==============================================
// ARTICLES QUERIES
// ==============================================

export interface DBArticle {
  id: string;
  tenantid: string;
  projectid: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  category: string;
  image_url: string;
  timestamp: string;
  reading_time: number;
  is_breaking: boolean;
  total_likes: number;
  total_views: number;
  created_at: string;
  updated_at: string;
}

/**
 * Convert database article to app format
 */
function dbArticleToNewsArticle(dbArticle: DBArticle): NewsArticle {
  return {
    id: dbArticle.id,
    title: dbArticle.title,
    summary: dbArticle.summary,
    content: dbArticle.content,
    source: dbArticle.source as any,
    category: dbArticle.category as any,
    imageUrl: dbArticle.image_url,
    timestamp: dbArticle.timestamp,
    readingTime: dbArticle.reading_time,
    isBreaking: dbArticle.is_breaking,
    likes: dbArticle.total_likes,
    views: dbArticle.total_views,
  };
}

/**
 * Convert app article to database format
 */
function newsArticleToDBArticle(article: Partial<NewsArticle>): Partial<DBArticle> {
  return {
    id: article.id,
    tenantid: TENANT_ID,
    projectid: PROJECT_ID,
    title: article.title,
    summary: article.summary,
    content: article.content,
    source: article.source,
    category: article.category,
    image_url: article.imageUrl,
    timestamp: article.timestamp,
    reading_time: article.readingTime,
    is_breaking: article.isBreaking,
    total_likes: article.likes,
    total_views: article.views,
  };
}

/**
 * Fetch all articles
 */
export async function getAllArticles(): Promise<NewsArticle[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }

  return (data || []).map(dbArticleToNewsArticle);
}

/**
 * Get article by ID
 */
export async function getArticleById(id: string): Promise<NewsArticle | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching article:', error);
    return null;
  }

  return data ? dbArticleToNewsArticle(data) : null;
}

/**
 * Insert or update articles (bulk upsert for initial seed)
 */
export async function upsertArticles(articles: NewsArticle[]): Promise<void> {
  const dbArticles = articles.map(newsArticleToDBArticle);

  const { error } = await supabase
    .from('articles')
    .upsert(dbArticles, {
      onConflict: 'id',
    });

  if (error) {
    console.error('Error upserting articles:', error);
    throw error;
  }
}

/**
 * Update article likes count
 */
export async function updateArticleLikes(articleId: string, newLikesCount: number): Promise<void> {
  const { error } = await supabase
    .from('articles')
    .update({
      total_likes: newLikesCount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', articleId);

  if (error) {
    console.error('Error updating article likes:', error);
    throw error;
  }
}

/**
 * Increment article views count
 */
export async function incrementArticleViews(articleId: string): Promise<void> {
  // Use RPC function for atomic increment
  const { error } = await supabase.rpc('increment_article_views', {
    article_id: articleId,
  });

  if (error) {
    // Fallback: fetch current count and increment
    const { data: article } = await supabase
      .from('articles')
      .select('total_views')
      .eq('id', articleId)
      .single();

    if (article) {
      const { error: updateError } = await supabase
        .from('articles')
        .update({
          total_views: article.total_views + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', articleId);

      if (updateError) {
        console.error('Error incrementing article views:', updateError);
      }
    }
  }
}

// ==============================================
// USER INTERACTIONS QUERIES
// ==============================================

export interface UserInteraction {
  id?: string;
  tenantid: string;
  projectid: string;
  user_session_id: string; // Client-side generated session ID
  article_id: string;
  is_bookmarked: boolean;
  is_liked: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get user's interactions for all articles
 */
export async function getUserInteractions(sessionId: string): Promise<UserInteraction[]> {
  const { data, error } = await supabase
    .from('user_interactions')
    .select('*')
    .eq('user_session_id', sessionId);

  if (error) {
    console.error('Error fetching user interactions:', error);
    return [];
  }

  return data || [];
}

/**
 * Get user's interaction for a specific article
 */
export async function getUserInteraction(
  sessionId: string,
  articleId: string
): Promise<UserInteraction | null> {
  const { data, error } = await supabase
    .from('user_interactions')
    .select('*')
    .eq('user_session_id', sessionId)
    .eq('article_id', articleId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned - not an error
      return null;
    }
    console.error('Error fetching user interaction:', error);
    return null;
  }

  return data;
}

/**
 * Toggle bookmark for an article
 */
export async function toggleBookmark(
  sessionId: string,
  articleId: string,
  isBookmarked: boolean
): Promise<void> {
  const existing = await getUserInteraction(sessionId, articleId);

  if (existing) {
    // Update existing interaction
    const { error } = await supabase
      .from('user_interactions')
      .update({
        is_bookmarked: isBookmarked,
        updated_at: new Date().toISOString(),
      })
      .eq('user_session_id', sessionId)
      .eq('article_id', articleId);

    if (error) {
      console.error('Error updating bookmark:', error);
      throw error;
    }
  } else {
    // Create new interaction
    const { error } = await supabase
      .from('user_interactions')
      .insert({
        tenantid: TENANT_ID,
        projectid: PROJECT_ID,
        user_session_id: sessionId,
        article_id: articleId,
        is_bookmarked: isBookmarked,
        is_liked: false,
      });

    if (error) {
      console.error('Error creating bookmark:', error);
      throw error;
    }
  }
}

/**
 * Toggle like for an article
 */
export async function toggleLike(
  sessionId: string,
  articleId: string,
  isLiked: boolean
): Promise<void> {
  const existing = await getUserInteraction(sessionId, articleId);

  if (existing) {
    // Update existing interaction
    const { error } = await supabase
      .from('user_interactions')
      .update({
        is_liked: isLiked,
        updated_at: new Date().toISOString(),
      })
      .eq('user_session_id', sessionId)
      .eq('article_id', articleId);

    if (error) {
      console.error('Error updating like:', error);
      throw error;
    }
  } else {
    // Create new interaction
    const { error } = await supabase
      .from('user_interactions')
      .insert({
        tenantid: TENANT_ID,
        projectid: PROJECT_ID,
        user_session_id: sessionId,
        article_id: articleId,
        is_bookmarked: false,
        is_liked: isLiked,
      });

    if (error) {
      console.error('Error creating like:', error);
      throw error;
    }
  }

  // Update article's aggregate like count
  const { data: article } = await supabase
    .from('articles')
    .select('total_likes')
    .eq('id', articleId)
    .single();

  if (article) {
    const newCount = isLiked ? article.total_likes + 1 : article.total_likes - 1;
    await updateArticleLikes(articleId, Math.max(0, newCount));
  }
}

/**
 * Get all bookmarked article IDs for a user
 */
export async function getBookmarkedArticleIds(sessionId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_interactions')
    .select('article_id')
    .eq('user_session_id', sessionId)
    .eq('is_bookmarked', true);

  if (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }

  return (data || []).map((row) => row.article_id);
}

/**
 * Get all liked article IDs for a user
 */
export async function getLikedArticleIds(sessionId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_interactions')
    .select('article_id')
    .eq('user_session_id', sessionId)
    .eq('is_liked', true);

  if (error) {
    console.error('Error fetching likes:', error);
    return [];
  }

  return (data || []).map((row) => row.article_id);
}

// ==============================================
// SESSION UTILITIES
// ==============================================

/**
 * Generate or retrieve a persistent session ID for the current user
 * This is stored in localStorage and persists across sessions
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return 'server-session';
  }

  const STORAGE_KEY = 'news_app_session_id';
  let sessionId = localStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    // Generate a new session ID
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(STORAGE_KEY, sessionId);
  }

  return sessionId;
}
