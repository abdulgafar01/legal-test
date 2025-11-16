"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { exploreApi, Category, Article } from "@/lib/api/explore";
import { Calendar, Clock, Eye, TrendingUp } from "lucide-react";

const PublicExploreInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Article[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const categorySlug = searchParams.get("category") || undefined;
  const searchFromURL = searchParams.get("search") || "";

  const filterPublic = useCallback(
    (items: Article[]): Article[] =>
      items.filter((item) => (item as any).is_public === true),
    []
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await exploreApi.getCategories();
        setCategories(data);
      } catch (e) {
        console.error("Failed to load categories", e);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    setSearchTerm(searchFromURL);
  }, [searchFromURL]);

  const fetchArticles = useCallback(
    async (category?: string, query?: string) => {
      try {
        setArticlesLoading(true);
        if (query && query.trim()) {
          const data = await exploreApi.searchArticles({
            query,
            category,
            page_size: 20,
          } as any);
          setSearchResults(filterPublic(data.results));
        } else {
          const data = await exploreApi.getArticles({
            category,
            page_size: 20,
          });
          setArticles(filterPublic(data.results));
          setSearchResults(null);
        }
      } catch (e) {
        console.error("Error fetching public articles", e);
        setArticles([]);
        setSearchResults(null);
      } finally {
        setArticlesLoading(false);
      }
    },
    [filterPublic]
  );

  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) return;

    if (categorySlug) {
      const found = categories.find((c) => c.slug === categorySlug);
      setSelectedCategory(found ?? null);
    } else {
      setSelectedCategory(null);
    }

    fetchArticles(categorySlug, searchFromURL || undefined);
  }, [
    categories,
    categoriesLoading,
    categorySlug,
    searchFromURL,
    fetchArticles,
  ]);

  const handleCategoryClick = (category: Category | null) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category.slug);
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    const query = params.toString();
    router.push(query ? `/explore?${query}` : "/explore");
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory.slug);
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    const query = params.toString();
    router.push(query ? `/explore?${query}` : "/explore");
  };

  const handleArticleClick = (article: Article) => {
    router.push(`/explore/${article.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const displayArticles = searchResults ?? articles;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold text-black">Legal AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm text-gray-600">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-black">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-16 pt-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-1">
              Explore Articles
            </h1>
          </div>
          <form
            onSubmit={handleSearchSubmit}
            className="w-full md:w-80 flex items-center gap-2 border border-gray-200 rounded-full px-3 py-2 bg-gray-50"
          >
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="text-xs font-medium px-3 py-1 rounded-full bg-black text-white hover:bg-gray-800"
            >
              Search
            </button>
          </form>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleCategoryClick(null)}
            className={`px-3 py-1 rounded-full text-sm border transition ${
              !selectedCategory
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            All categories
          </button>
          {categoriesLoading
            ? [...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-7 w-20 rounded-full bg-gray-200 animate-pulse"
                />
              ))
            : categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    selectedCategory?.id === category.id
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {category.name}
                </button>
              ))}
        </div>

        {articlesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-lg p-6 animate-pulse"
              >
                <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
                <div className="h-4 bg-gray-200 rounded mb-1 w-full" />
                <div className="h-4 bg-gray-200 rounded mb-1 w-2/3" />
              </div>
            ))}
          </div>
        ) : displayArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {displayArticles.map((article) => (
              <button
                key={article.id}
                type="button"
                onClick={() => handleArticleClick(article)}
                className="text-left bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Image
                      src={assets.solar_star}
                      alt="Star icon"
                      height={20}
                      width={20}
                      className="mt-1 flex-shrink-0"
                    />
                    <TrendingUp className="absolute -top-1 -right-1 h-3 w-3 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      {truncateText(article.excerpt, 120)}
                    </p>
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
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center">
            <div className="mb-4">
              <Image
                src={assets.solar_star}
                alt="No articles"
                height={48}
                width={48}
                className="mx-auto opacity-50"
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No public articles found
            </h3>
            <p className="text-gray-600 text-sm">
              Try adjusting your search or selecting a different category.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

const PublicExplorePage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <PublicExploreInner />
    </Suspense>
  );
};

export default PublicExplorePage;
