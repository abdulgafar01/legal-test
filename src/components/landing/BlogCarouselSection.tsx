"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "../ui/carousel";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "./ImageWithFallback";
import { useTranslations } from "next-intl";

interface BlogPost {
  id: number;
  title: string;
  image: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Top 8 Legal Areas Impacted by Generative AI",
    image:
      "https://images.unsplash.com/photo-1758518731462-d091b0b4ed0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXd5ZXJzJTIwbWVldGluZyUyMGNvbnN1bHRhdGlvbnxlbnwxfHx8fDE3NjIxMzYyMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    readTime: "4 min read",
  },
  {
    id: 2,
    title: "Emergence of AI-Related Legislation",
    image:
      "https://images.unsplash.com/photo-1718734799011-eeac7cc634f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwbGVnaXNsYXR1cmUlMjBjaGFtYmVyfGVufDF8fHx8MTc2MjEzNjIxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    readTime: "3 min read",
  },
  {
    id: 3,
    title:
      "LexisNexis Introduces Lexis+ AI Protégé, Personal Legal Assistant with AI",
    image:
      "https://images.unsplash.com/photo-1758518727821-442e0ba373f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYyMTM2MjEzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    readTime: "4 min read",
  },
  {
    id: 4,
    title: "The Future of Legal Research with AI Technology",
    image:
      "https://images.unsplash.com/photo-1736939678218-bd648b5ef3bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGxhd3llcnxlbnwxfHx8fDE3NjIwNzUzNzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    readTime: "5 min read",
  },
];

export function BlogCarouselSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const t = useTranslations();

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

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">{t("blogCarousel.heading")}</h2>
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
              {blogPosts.map((post) => (
                <CarouselItem
                  key={post.id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div
                    className="bg-white overflow-hidden group cursor-pointer"
                    onClick={handleUserInteraction}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <ImageWithFallback
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="pt-6">
                      <h3 className="text-gray-900 mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 bg-gray-100 inline-block px-3 py-1 rounded">
                        {post.readTime}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

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
