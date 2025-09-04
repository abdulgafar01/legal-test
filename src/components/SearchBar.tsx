"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { exploreApi, ArticleSearchRequest, Article } from '@/lib/api/explore';

interface SearchBarProps {
  onSearchResults?: (results: Article[], searchQuery: string) => void;
  onClearResults?: () => void;
  selectedCategory?: string;
  initialSearchTerm?: string;
}

export default function SearchBar({ onSearchResults, onClearResults, selectedCategory, initialSearchTerm }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchTerm || '');
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update searchQuery when initialSearchTerm changes
  useEffect(() => {
    setSearchQuery(initialSearchTerm || '');
  }, [initialSearchTerm]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      onClearResults?.();
      return;
    }

    try {
      setIsSearching(true);
      console.log('Searching for:', query);
      
      const searchRequest: ArticleSearchRequest = {
        query: query.trim(),
        page_size: 20
      };

      // Only include category filter if a category is actually selected
      if (selectedCategory) {
        searchRequest.category = selectedCategory;
      }

      console.log('Search request:', searchRequest);
      const results = await exploreApi.searchArticles(searchRequest);
      console.log('Search results:', results);
      onSearchResults?.(results.results, query);
    } catch (error) {
      console.error('Error searching articles:', error);
      onClearResults?.(); // Clear results on error
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set new timeout for debounced search
    debounceTimeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const handleClear = () => {
    setSearchQuery('');
    // Clear timeout if exists
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    // Immediately call onClearResults when user manually clears
    onClearResults?.();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder={selectedCategory ? "Search articles..." : "Search all articles..."}
          value={searchQuery}
          onChange={handleInputChange}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>
      
      {isSearching && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-sm p-3 z-10">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
            <span className="text-sm text-gray-600">Searching...</span>
          </div>
        </div>
      )}
    </div>
  );
}
