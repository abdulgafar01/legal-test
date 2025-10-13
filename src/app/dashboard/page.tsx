"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { assets } from '@/assets/assets';
import CategoryScroller from '@/components/CategoryScroller';
import SearchBar from '@/components/SearchBar';
import Image from 'next/image';
import { exploreApi, Category, Article } from '@/lib/api/explore';
import { Calendar, Clock, Eye, TrendingUp } from 'lucide-react';

const ExplorePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [frequentlyVisitedArticles, setFrequentlyVisitedArticles] = useState<Article[]>([]);
  const [searchResults, setSearchResults] = useState<Article[] | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const hasFetchedCategories = useRef(false);
  const restoringFromURL = useRef(false);
  
  // Get URL params once and memoize them
  const categorySlug = searchParams.get('category');
  const searchFromURL = searchParams.get('search') || '';

  // Fetch locks to avoid overlapping requests triggering extra renders
  const trendingLockRef = useRef(false);
  const categoryLockRef = useRef(false);
  const searchLockRef = useRef(false);

  const fetchFrequentlyVisitedArticles = useCallback(async () => {
    if (trendingLockRef.current) return;
    trendingLockRef.current = true;
    try {
      setArticlesLoading(true);
      const articlesData = await exploreApi.getArticles({ page_size: 20, ordering: '-view_count' });
      const sorted = articlesData.results.slice().sort((a, b) => b.view_count - a.view_count).slice(0, 8);
      setFrequentlyVisitedArticles(sorted);
    } catch (e) {
      console.warn('Primary trending fetch failed; attempting fallback');
      try {
        const fallback = await exploreApi.getArticles({ page_size: 20 });
        const sorted = fallback.results.slice().sort((a, b) => b.view_count - a.view_count).slice(0, 8);
        setFrequentlyVisitedArticles(sorted);
      } catch (e2) {
        console.error('Failed to load frequently visited articles', e2);
        setFrequentlyVisitedArticles([]);
      }
    } finally {
      setArticlesLoading(false);
      trendingLockRef.current = false;
    }
  }, []);

  const fetchArticlesByCategory = useCallback(async (categorySlug: string) => {
    if (categoryLockRef.current) return;
    categoryLockRef.current = true;
    try {
      setArticlesLoading(true);
      const data = await exploreApi.getArticles({ category: categorySlug, page_size: 8 });
      setArticles(data.results);
    } catch (e) {
      console.error('Error fetching articles', e);
      setArticles([]);
    } finally {
      setArticlesLoading(false);
      categoryLockRef.current = false;
    }
  }, []);

  const performSearch = useCallback(async (searchQuery: string, categorySlug?: string | null) => {
    if (!searchQuery.trim() || searchLockRef.current) return;
    searchLockRef.current = true;
    try {
      setArticlesLoading(true);
      const data = await exploreApi.searchArticles({ query: searchQuery, category: categorySlug || undefined, page_size: 8 });
      setSearchResults(data.results);
      setIsSearchMode(true);
    } catch (e) {
      console.error('Search failed', e);
      setSearchResults([]);
    } finally {
      setArticlesLoading(false);
      searchLockRef.current = false;
    }
  }, []);

  // Fetch categories once
  useEffect(() => {
    if (hasFetchedCategories.current) return;
    hasFetchedCategories.current = true;
    const load = async () => {
      try {
        setCategoriesLoading(true);
        const data = await exploreApi.getCategories();
        setCategories(data);
      } catch (e) {
        console.error('Failed to load categories', e);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    load();
  }, []);

  // Restore state from URL after categories available (only once)
  useEffect(() => {
    if (categoriesLoading || restoringFromURL.current) return;
    restoringFromURL.current = true;
    
    if (searchFromURL) {
      setSearchTerm(searchFromURL);
      setIsSearchMode(true);
      // Perform search across category or scoped
      performSearch(searchFromURL, categorySlug);
    }
    if (categorySlug) {
      const cat = categories.find(c => c.slug === categorySlug);
      if (cat) {
        setSelectedCategory(cat);
        if (!searchFromURL) {
          fetchArticlesByCategory(cat.slug);
        }
      }
    }
    if (!categorySlug && !searchFromURL) {
      fetchFrequentlyVisitedArticles();
    }
  // Intentionally NOT including fetch function identities in deps – they are stable ([]) and adding them
  // would cause eslint exhaustive-deps noise without functional benefit.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesLoading, categories, categorySlug, searchFromURL]);

  const updateURL = useCallback((category: Category | null, search: string) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category.slug);
    if (search.trim()) params.set('search', search.trim());
    const newUrl = params.toString() ? `/dashboard?${params.toString()}` : '/dashboard';
    const current = window.location.pathname + window.location.search;
    if (newUrl !== current) router.replace(newUrl, { scroll: false });
  }, [router]);

  const handleCategorySelect = useCallback((category: Category | null) => {
    // Avoid unnecessary updates if selecting the same category
    if (selectedCategory?.id === category?.id) {
      return;
    }

    setSelectedCategory(category);
    setIsSearchMode(false);
    setSearchResults(null);
    // Don't reset searchTerm - preserve it when switching categories
    updateURL(category, searchTerm);
    
    if (category) {
      // If there's a search term, perform search with new category
      if (searchTerm) {
        performSearch(searchTerm, category.slug);
      } else {
        // No search term, fetch articles for category
        fetchArticlesByCategory(category.slug);
      }
    } else {
      // No category selected
      if (searchTerm) {
        // Search across all categories
        performSearch(searchTerm, null);
      } else {
        // Show frequently visited articles
        setArticles([]);
        fetchFrequentlyVisitedArticles();
      }
    }
  }, [selectedCategory, searchTerm, updateURL, performSearch, fetchArticlesByCategory, fetchFrequentlyVisitedArticles]);

  const handleSearchResults = useCallback((results: Article[], searchQuery: string) => {
    setSearchResults(results);
    setIsSearchMode(true);
    setSearchTerm(searchQuery);
    updateURL(selectedCategory, searchQuery);
  }, [selectedCategory, updateURL]);

  const handleClearSearch = useCallback(() => {
    setSearchResults(null);
    setIsSearchMode(false);
    setSearchTerm('');
    updateURL(selectedCategory, '');
    
    // If category is selected, fetch its articles
    if (selectedCategory) {
      fetchArticlesByCategory(selectedCategory.slug);
    } else {
      // No category selected, show frequently visited articles
      fetchFrequentlyVisitedArticles();
    }
  }, [selectedCategory, updateURL, fetchArticlesByCategory, fetchFrequentlyVisitedArticles]);

  const handleArticleClick = useCallback((article: Article) => {
    const params = new URLSearchParams();
    
    if (selectedCategory) {
      params.set('category', selectedCategory.slug);
    }
    
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    router.push(`/dashboard/explore/${article.id}${queryString}`);
  }, [selectedCategory, searchTerm, router]);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  const truncateText = useCallback((text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }, []);

  // Determine what articles to display
  const getDisplayArticles = useCallback(() => {
    if (isSearchMode) {
      return searchResults || [];
    }
    if (selectedCategory) {
      return articles;
    }
    if (!searchTerm) {
      return frequentlyVisitedArticles;
    }
    return [];
  }, [isSearchMode, searchResults, selectedCategory, articles, searchTerm, frequentlyVisitedArticles]);

  const displayArticles = getDisplayArticles();
  const showLoading = categoriesLoading || (articlesLoading && !isSearchMode);

  return (
    <div className="flex flex-1 mx-auto h-screen">
      <div className="overflow-y-auto w-full h-full px-8 pb-20 pt-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Explore</h1>
        
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar 
            onSearchResults={handleSearchResults}
            onClearResults={handleClearSearch}
            selectedCategory={selectedCategory?.slug}
            initialSearchTerm={searchTerm}
          />
        </div>
        
        <div className="mb-8">
          <CategoryScroller 
            categories={categories}
            loading={categoriesLoading}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            {isSearchMode 
              ? `Search Results (${searchResults?.length || 0} found)`
              : selectedCategory 
                ? `Articles in ${selectedCategory.name}` 
                : searchTerm
                  ? 'No Category Selected'
                  : (
                    <>
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      {`Frequently Visited Articles (${frequentlyVisitedArticles.length})`}
                    </>
                  )
            }
          </h2>
        </div>
        
        {showLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-neutral-100 border border-gray-200 rounded-lg p-6 animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="h-5 w-5 bg-gray-300 rounded mt-1"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mt-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayArticles.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {displayArticles.map((article) => (
              <div 
                key={article.id} 
                className="bg-neutral-100 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => handleArticleClick(article)}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Image 
                      src={assets.solar_star} 
                      alt='Star icon' 
                      height={20} 
                      width={20} 
                      className='mt-1 flex-shrink-0'
                    />
                    {/* Show trending indicator for frequently visited articles */}
                    {!isSearchMode && !selectedCategory && !searchTerm && (
                      <TrendingUp className="absolute -top-1 -right-1 h-3 w-3 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      {/* Trending badge for frequently visited articles */}
                      {!isSearchMode && !selectedCategory && !searchTerm && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex-shrink-0">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      {truncateText(article.excerpt, 120)}
                    </p>
                    
                    {/* Article Meta */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      {article.published_at && (
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(article.published_at)}
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {article.estimated_read_time} min
                      </div>
                      
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {article.view_count}
                      </div>
                    </div>
                    
                    {/* Category Badge */}
                        <div className="mt-3">
                          <span 
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: article.category_color }}
                          >
                            {article.category_name}
                          </span>
                        </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <Image 
                src={assets.solar_star} 
                alt='No articles' 
                height={48} 
                width={48} 
                className='mx-auto opacity-50'
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isSearchMode 
                ? 'No Search Results' 
                : selectedCategory 
                  ? 'No Articles Found' 
                  : searchTerm
                    ? 'No Category Selected'
                    : 'No Frequently Visited Articles'
              }
            </h3>
            <p className="text-gray-600">
              {isSearchMode 
                ? 'Try adjusting your search terms or browse by category.'
                : selectedCategory 
                  ? `There are no published articles in ${selectedCategory.name} category yet.` 
                  : searchTerm
                    ? 'Please select a category above to view articles, or use the search bar to find specific content.'
                    : 'No articles have been viewed yet. Explore categories above to discover great content!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
