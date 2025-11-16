"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Eye, Heart, Tag } from "lucide-react";
import { exploreApi, Article } from "@/lib/api/explore";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PublicArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const articleId = parseInt(params.id as string);
        const articleData = await exploreApi.getArticleById(articleId);
        if (articleData?.is_public) {
          setArticle(articleData);
        } else {
          setError("This article is not public.");
        }
      } catch (err) {
        setError("Failed to load article. Please try again later.");
        console.error("Error fetching public article:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  const formatArticleContent = (content: string) => {
    if (!content) return "";

    return (
      content
        .replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-bold text-gray-900">$1</strong>'
        )
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .split("\n\n")
        .map((paragraph) => {
          if (paragraph.trim()) {
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
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto p-8">
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
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto p-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Article Not Available
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button asChild className="bg-black text-white hover:bg-gray-800">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

      <main className="max-w-5xl mx-auto p-8 pb-20">
        <Button
          variant="ghost"
          asChild
          className="mb-6 p-2 hover:bg-gray-100"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
        </Button>

        <div className="mb-8">
          <div className="mb-4">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{
                backgroundColor:
                  (article as any).category?.color || article.category_color,
              }}
            >
              {(article as any).category?.name || article.category_name}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>
          )}

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

        {(article.tags || article.tags_list) && (
          <div className="mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-gray-500" />
              {(article.tags_list || (article.tags as any)?.split(",") || []).map(
                (tag: any, index: number) => (
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

        <div className="border-t pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Heart className="h-4 w-4" />
              {article.like_count} likes
            </div>

            <div className="text-sm text-gray-500">
              Published{" "}
              {article.published_at
                ? formatDate(article.published_at)
                : formatDate((article as any).created_at)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
