"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "../ui/carousel";
import { useState, useEffect, useCallback } from "react";
import { ImageWithFallback } from "./ImageWithFallback";
import { useTranslations } from "next-intl";
import { Article, exploreApi } from "@/lib/api/explore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { assets } from "@/assets/assets";

export function BlogCarouselSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const t = useTranslations("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const router = useRouter();

  const filterPublic = useCallback(
    (items: Article[]): Article[] =>
      items.filter((item) => (item as Article).is_public === true),
    []
  );

  const fetchArticles = useCallback(
    async () => {
      try {
        setArticlesLoading(true);

        const data = await exploreApi.getArticles({
          page_size: 20,
        });
        setArticles(filterPublic(data.results));
      } catch (e) {
        console.error("Error fetching public articles", e);
        toast.error("Error fetching public articles");
        setArticles([]);
      } finally {
        setArticlesLoading(false);
      }
    },
    [filterPublic]
  );

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-scroll effect
  useEffect(() => {
    if (!api) {
      return;
    }

    // Don't auto-scroll if user is hovering or has manually interacted
    if (isHovered || userInteracted) {
      return;
    }

    const autoScrollInterval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0); // Loop back to start
      }
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(autoScrollInterval);
  }, [api, isHovered, userInteracted]);

  // Reset userInteracted after 5 seconds of no interaction
  useEffect(() => {
    if (!userInteracted) {
      return;
    }

    const resetTimer = setTimeout(() => {
      setUserInteracted(false);
    }, 5000);

    return () => clearTimeout(resetTimer);
  }, [userInteracted]);

  const handleUserInteraction = () => {
    setUserInteracted(true);
  };

  const handleArticleClick = (article: Article) => {
    router.push(`/explore/${article.id}`);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">
            {t("blogCarousel.heading")}
          </h2>
          <div className="flex gap-2" dir="ltr">
            <button
              onClick={() => {
                api?.scrollPrev();
                handleUserInteraction();
              }}
              className="w-12 h-12 flex items-center justify-center border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--secondary)] cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous slide"
              disabled={!api?.canScrollPrev()}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                api?.scrollNext();
                handleUserInteraction();
              }}
              className="w-12 h-12 flex items-center justify-center border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--secondary)] cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next slide"
              disabled={!api?.canScrollNext()}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {articlesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-300 border border-gray-300 rounded-lg p-6 animate-pulse h-[50vh]"
              >
                <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
                <div className="h-4 bg-gray-200 rounded mb-1 w-full" />
                <div className="h-4 bg-gray-200 rounded mb-1 w-2/3" />
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            dir="ltr"
          >
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {articles.map((post) => (
                  <CarouselItem
                    key={post.id}
                    className="md:basis-1/2 lg:basis-1/3"
                    onClick={() => handleArticleClick(post)}
                  >
                    <div
                      className="bg-white overflow-hidden group cursor-pointer p-4"
                      onClick={handleUserInteraction}
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <ImageWithFallback
                          src='/background.jpg'
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="pt-6">
                        <h3 className="text-gray-900 mb-3 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-500 bg-gray-100 inline-block px-3 py-1 rounded">
                          {post.reading_time_display}
                          {/* {post.estimated_read_time} */}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
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
              {t("dashboard.explore.No public articles found")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("dashboard.explore.Try adjusting your search or selecting a different category")}
            </p>
          </div>
        )}

        {/* Dots indicator */}
        <div className="flex justify-center gap-4 mt-8">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                api?.scrollTo(index);
                handleUserInteraction();
              }}
              className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                index === current
                  ? "bg-[var(--primary)]"
                  : "bg-gray-300 hover:bg-[var(--primary)]"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
