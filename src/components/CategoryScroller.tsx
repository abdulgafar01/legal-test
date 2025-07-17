import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategoryScroller = () => {
  // Category data
  const categories = [
    { name: "Criminal Law", active: true },
    { name: "Constitutional Law", active: false },
    { name: "Administrative Law", active: false },
    { name: "Civil Law", active: false },
    { name: "International Law", active: false },
    { name: "Corporate (or Company)", active: false },
    { name: "Employment Law", active: false },
    { name: "Property Law", active: false },
    { name: "Tax Law", active: false }
  ];

  // Refs and state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState({
    left: false,
    right: true
  });

  // Scroll handler
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 200;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Check scroll position to determine button visibility
  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const canScrollLeft = scrollLeft > 0;
    const canScrollRight = scrollLeft < scrollWidth - clientWidth - 1;

    setShowScrollButtons({
      left: canScrollLeft,
      right: canScrollRight
    });
  };

  // Set up event listeners and initial check
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    updateScrollButtons(); // Initial check
    container.addEventListener('scroll', updateScrollButtons);

    return () => {
      container.removeEventListener('scroll', updateScrollButtons);
    };
  }, []);

  return (
    <div className="relative flex items-center">
      {/* Left scroll button */}
      {showScrollButtons.left && (
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50"
          aria-label="Scroll categories left"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
      )}
      
      {/* Categories container */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-3 overflow-x-auto scrollbar-hide px-8 py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category, index) => (
          <button
            key={index}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category.active
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Right scroll button */}
      {showScrollButtons.right && (
        <button
          onClick={() => handleScroll('right')}
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