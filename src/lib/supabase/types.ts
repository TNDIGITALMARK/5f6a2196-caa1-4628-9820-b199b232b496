// Database table types for Supabase

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
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
        };
        Insert: {
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
          reading_time?: number;
          is_breaking?: boolean;
          total_likes?: number;
          total_views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenantid?: string;
          projectid?: string;
          title?: string;
          summary?: string;
          content?: string;
          source?: string;
          category?: string;
          image_url?: string;
          timestamp?: string;
          reading_time?: number;
          is_breaking?: boolean;
          total_likes?: number;
          total_views?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_interactions: {
        Row: {
          id: string;
          tenantid: string;
          projectid: string;
          user_session_id: string;
          article_id: string;
          is_bookmarked: boolean;
          is_liked: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenantid: string;
          projectid: string;
          user_session_id: string;
          article_id: string;
          is_bookmarked?: boolean;
          is_liked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenantid?: string;
          projectid?: string;
          user_session_id?: string;
          article_id?: string;
          is_bookmarked?: boolean;
          is_liked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      increment_article_views: {
        Args: { article_id: string };
        Returns: void;
      };
    };
  };
}
