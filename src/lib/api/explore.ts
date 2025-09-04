import axiosInstance from '../axios';
import { API_ENDPOINTS } from '@/config/api';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  articles_count?: number;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string; // Not always included in list responses
  category?: Category; // For detailed responses
  category_name: string; // For list responses
  category_slug: string;
  category_color: string;
  status: 'draft' | 'published' | 'archived';
  is_active: boolean;
  is_featured: boolean;
  featured_image?: string;
  featured_image_alt?: string;
  meta_title?: string;
  meta_description?: string;
  tags?: string;
  tags_list?: string[]; // API returns this for list views
  view_count: number;
  like_count: number;
  estimated_read_time: number;
  reading_time_display?: string;
  published_at?: string;
  created_at: string;
  updated_at?: string;
  has_user_viewed?: boolean;
  has_user_liked?: boolean;
}

export interface ArticleSearchRequest {
  query?: string;
  category?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedArticles {
  count: number;
  next?: string;
  previous?: string;
  results: Article[];
}

export interface ExploreListResponse<T> {
  success: boolean;
  data: {
    results: T[];
    count: number;
  };
  message?: string;
  timestamp: string;
}

export interface ExploreResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export const exploreApi = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get<ExploreListResponse<Category>>(
      API_ENDPOINTS.explore.categories
    );
    return response.data.data.results;
  },

  // Get category by ID
  getCategoryById: async (id: number): Promise<Category> => {
    const response = await axiosInstance.get<ExploreResponse<Category>>(
      `${API_ENDPOINTS.explore.categories}${id}/`
    );
    return response.data.data;
  },

  // Get all articles with optional pagination
  getArticles: async (params?: {
    page?: number;
    page_size?: number;
    category?: string; // Changed from number to string (slug)
    ordering?: string; // Add ordering parameter
  }): Promise<PaginatedArticles> => {
    const response = await axiosInstance.get<ExploreListResponse<Article>>(
      API_ENDPOINTS.explore.articles,
      { params }
    );
    return {
      count: response.data.data.count,
      results: response.data.data.results,
      next: undefined,
      previous: undefined
    };
  },

  // Get article by ID
  getArticleById: async (id: number): Promise<Article> => {
    const response = await axiosInstance.get<ExploreResponse<Article>>(
      `${API_ENDPOINTS.explore.articles}${id}/`
    );
    return response.data.data;
  },

  // Get featured articles
  getFeaturedArticles: async (): Promise<Article[]> => {
    const response = await axiosInstance.get<ExploreListResponse<Article>>(
      API_ENDPOINTS.explore.featuredArticles
    );
    return response.data.data.results;
  },

  // Search articles
  searchArticles: async (searchRequest: ArticleSearchRequest): Promise<PaginatedArticles> => {
    try {
      const response = await axiosInstance.post<ExploreListResponse<Article>>(
        API_ENDPOINTS.explore.searchArticles,
        searchRequest
      );
      return {
        count: response.data.data.count,
        results: response.data.data.results,
        next: undefined,
        previous: undefined
      };
    } catch (error: any) {
      console.error('Search API error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: `${axiosInstance.defaults.baseURL}${API_ENDPOINTS.explore.searchArticles}`
      });
      throw error;
    }
  },

  // Like an article (requires authentication)
  likeArticle: async (id: number): Promise<{ liked: boolean; like_count: number }> => {
    const response = await axiosInstance.post<ExploreResponse<{ liked: boolean; like_count: number }>>(
      `${API_ENDPOINTS.explore.articles}${id}/like/`
    );
    return response.data.data;
  },
};
