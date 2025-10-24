export type Category =
  | 'Technology'
  | 'Politics'
  | 'Sports'
  | 'Business'
  | 'Entertainment'
  | 'Science'
  | 'Health'
  | 'World News'
  | 'Culture';

export type Platform = 'CNN' | 'TechCrunch' | 'Reuters' | 'The Guardian' | 'BBC';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: Platform;
  category: Category;
  imageUrl: string;
  timestamp: string;
  likes: number;
  views: number;
  readingTime: number;
  isBreaking?: boolean;
}

export interface PlatformInfo {
  name: Platform;
  followers: string;
  icon: string;
}
