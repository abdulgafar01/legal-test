"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Category } from "@/lib/api/explore";

interface CategoryScrollerProps {
  categories: Category[];
  loading?: boolean;
  selectedCategory?: Category | null;
  onCategorySelect?: (category: Category | null) => void;
}

const CategoryScroller = ({
  categories,
  loading = false,
  selectedCategory,
  onCategorySelect,
}: CategoryScrollerProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState({
    left: false,
    right: true,
  });

  // Filter and sort categories (memoized to avoid new array each render causing effect churn)
  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => cat.is_active)
      .slice() // defensive copy before sort
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [categories]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 200;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const canScrollLeft = scrollLeft > 0;
    const canScrollRight = scrollLeft < scrollWidth - clientWidth - 1;
    setShowScrollButtons((prev) => {
      if (prev.left === canScrollLeft && prev.right === canScrollRight)
        return prev; // avoid unnecessary state update
      return { left: canScrollLeft, right: canScrollRight };
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    updateScrollButtons();
    container.addEventListener("scroll", updateScrollButtons);

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
    };
  }, [filteredCategories]);

  if (loading) {
    return (
      <div className="relative flex items-center">
        <div className="flex space-x-3 px-8 py-2">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center">
      {showScrollButtons.left && (
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50"
          aria-label="Scroll categories left"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex space-x-3 overflow-x-auto scrollbar-hide px-8 py-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {filteredCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              // Allow deselecting if the same category is clicked
              if (selectedCategory?.id === category.id) {
                onCategorySelect?.(null); // Deselect
              } else {
                onCategorySelect?.(category);
              }
            }}
            className={`whitespace-nowrap px-4 py-2 rounded-2xl cursor-pointer text-sm font-medium transition-colors ${
              selectedCategory?.id === category.id
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            title={
              selectedCategory?.id === category.id
                ? "Click to deselect"
                : `Select ${category.name}`
            }
          >
            {category.name}
          </button>
        ))}
      </div>

      {showScrollButtons.right && (
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50"
          aria-label="Scroll categories right"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default CategoryScroller;
