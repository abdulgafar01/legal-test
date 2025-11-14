"use client";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Briefcase,
} from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "../ui/carousel";
import { Badge } from "../ui/badge";
import { useTranslations } from "next-intl";

interface Lawyer {
  id: number;
  name: string;
  specialization: string;
  location: string;
  experience: string;
  rating: number;
  reviews: number;
  image: string;
}

const topLawyers: Lawyer[] = [
  {
    id: 1,
    name: "Ahmed Al-Rashid",
    specialization: "Corporate Law",
    location: "Riyadh, Saudi Arabia",
    experience: "15+ years",
    rating: 4.9,
    reviews: 127,
    image:
      "https://images.unsplash.com/photo-1736939763234-f176517e95ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtaWRkbGUlMjBlYXN0ZXJuJTIwYnVzaW5lc3NtYW58ZW58MXx8fHwxNzYyOTU3ODE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    name: "Fatima Al-Mansoori",
    specialization: "Family Law",
    location: "Dubai, UAE",
    experience: "12+ years",
    rating: 4.8,
    reviews: 94,
    image:
      "https://images.unsplash.com/photo-1740153204804-200310378f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWRkbGUlMjBlYXN0ZXJuJTIwcHJvZmVzc2lvbmFsJTIwd29tYW58ZW58MXx8fHwxNzYyOTU3ODIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 3,
    name: "Fariha Al-balushi",
    specialization: "Commercial Litigation",
    location: "Kuwait City, Kuwait",
    experience: "18+ years",
    rating: 5.0,
    reviews: 156,
    image:
      "images/lawyerFariha.jpg",
  },
  {
    id: 4,
    name: "Layla Al-Qassimi",
    specialization: "Intellectual Property",
    location: "Doha, Qatar",
    experience: "10+ years",
    rating: 4.9,
    reviews: 83,
    image:
      "https://images.unsplash.com/photo-1698499352020-521e54040e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhcmFiaWMlMjB3b21hbiUyMGJ1c2luZXNzfGVufDF8fHx8MTc2Mjk1NzgyMHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 5,
    name: "Omar Al-Fahad",
    specialization: "Real Estate Law",
    location: "Jeddah, Saudi Arabia",
    experience: "14+ years",
    rating: 4.7,
    reviews: 112,
    image:
      "https://images.unsplash.com/photo-1758876203474-4425ac96181b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmFiJTIwYnVzaW5lc3NtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjI5NTc4MTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 6,
    name: "Noor Al-Habib",
    specialization: "International Law",
    location: "Abu Dhabi, UAE",
    experience: "16+ years",
    rating: 4.9,
    reviews: 145,
    image:
      "images/lawyerNoor.jpg",
  },
];

export function TopLawyersSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const t = useTranslations("dashboard.topLawyers");

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

    if (isHovered || userInteracted) {
      return;
    }

    const autoScrollInterval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(autoScrollInterval);
  }, [api, isHovered, userInteracted]);

  // Reset userInteracted after 5 seconds
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
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">
              {t("heading")}
            </h2>
            <p className="text-gray-600">
              {t("p1")}
            </p>
          </div>
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
              {topLawyers.map((lawyer) => (
                <CarouselItem
                  key={lawyer.id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={handleUserInteraction}
                  >
                    <div className="aspect-[3/3] overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={lawyer.image}
                        alt={lawyer.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
                            {lawyer.name}
                          </h3>
                          <Badge
                            variant="secondary"
                            className="bg-red-50 text-red-700 hover:bg-red-100"
                          >
                            {lawyer.specialization}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-red-500" />
                          {lawyer.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Briefcase className="w-4 h-4 mr-2 text-red-500" />
                          {lawyer.experience} experience
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                          <span className="mr-1">{lawyer.rating}</span>
                          <span className="text-sm text-gray-500">
                            ({lawyer.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                api?.scrollTo(index);
                handleUserInteraction();
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === current
                  ? "bg-red-500"
                  : "bg-gray-300 hover:bg-red-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
