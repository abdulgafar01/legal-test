"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Eye, Heart, Tag } from "lucide-react";
import { exploreApi, Article } from "@/lib/api/explore";
import { Button } from "@/components/ui/button";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiking, setIsLiking] = useState(false);

  // Get the previous state from URL params
  const previousCategory = searchParams.get("category");
  const previousSearch = searchParams.get("search");

  const getBackToExploreUrl = () => {
    const params = new URLSearchParams();

    if (previousCategory) {
      params.set("category", previousCategory);
    }

    if (previousSearch) {
      params.set("search", previousSearch);
    }

    return params.toString() ? `/dashboard?${params.toString()}` : "/dashboard";
  };

  const handleBackToExplore = () => {
    router.push(getBackToExploreUrl());
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const articleId = parseInt(params.id as string);
        const articleData = await exploreApi.getArticleById(articleId);
        setArticle(articleData);
      } catch (err) {
        setError("Failed to load article. Please try again later.");
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  const handleLike = async () => {
    if (!article || isLiking) return;

    try {
      setIsLiking(true);
      const result = await exploreApi.likeArticle(article.id);
      setArticle((prev) =>
        prev
          ? {
              ...prev,
              like_count: result.like_count,
            }
          : prev
      );
    } catch (err) {
      console.error("Error liking article:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const formatArticleContent = (content: string) => {
    if (!content) return "";

    return (
      content
        // Handle bold text **text**
        .replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-bold text-gray-900">$1</strong>'
        )
        // Handle italic text *text*
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        // Handle line breaks - convert double newlines to paragraph breaks
        .split("\n\n")
        .map((paragraph) => {
          if (paragraph.trim()) {
            // Handle single line breaks within paragraphs
            const formattedParagraph = paragraph.replace(/\n/g, "<br>");
            return `<p class="mb-4 text-gray-800 leading-relaxed">${formattedParagraph}</p>`;
          }
          return "";
        })
        .join("")
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-60px)] overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded mb-8 w-1/4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="h-[calc(100vh-60px)] overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Article Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "The article you are looking for does not exist."}
            </p>
            <Button
              onClick={handleBackToExplore}
              className="bg-black text-white hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Explore
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto">
      <div className="max-w-5xl mx-auto p-8 pb-20">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBackToExplore}
          className="mb-6 p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Explore
        </Button>

        {/* Article Header */}
        <div className="mb-8">
          {/* Category Badge */}
          <div className="mb-4">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{
                backgroundColor:
                  article.category?.color || article.category_color,
              }}
            >
              {article.category?.name || article.category_name}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            {article.published_at && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(article.published_at)}
              </div>
            )}

            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {article.estimated_read_time} min read
            </div>

            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {article.view_count} views
            </div>
          </div>

          {/* Featured Image */}
          {article.featured_image && (
            <div className="mb-8">
              <img
                src={article.featured_image}
                alt={article.featured_image_alt || article.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Article Content */}
        {article.content && (
          <div className="max-w-none mb-8">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{
                __html: formatArticleContent(article.content),
              }}
            />
          </div>
        )}

        {/* Tags */}
        {(article.tags || article.tags_list) && (
          <div className="mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-gray-500" />
              {(article.tags_list || article.tags?.split(",") || []).map(
                (tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {typeof tag === "string" ? tag.trim() : tag}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* Like Button and Stats */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between">
            <Button
              onClick={handleLike}
              disabled={isLiking}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Heart className={`h-4 w-4 ${isLiking ? "animate-pulse" : ""}`} />
              {article.like_count} Likes
            </Button>

            <div className="text-sm text-gray-500">
              Published{" "}
              {article.published_at
                ? formatDate(article.published_at)
                : formatDate(article.created_at)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
