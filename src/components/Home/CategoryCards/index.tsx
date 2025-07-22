"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { useProducts } from "@/context/ProductContext";

const CategoryCards = () => {
  const { categories, getProductsByCategory } = useProducts();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Get the first product from each category for the image
  const getCategoryImage = (category: string) => {
    const categoryProducts = getProductsByCategory(category);
    return categoryProducts.length > 0 ? categoryProducts[0].images[0] : null;
  };

  // Format category name for display
  const formatCategoryName = (category: string) => {
    return category.toUpperCase();
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="py-16 bg-black">
      <div className="mx-auto px-4">
        {/* Section Header */}
        {/* <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-400 text-lg">
            Explore our collections
          </p>
        </div> */}

        {/* Swipable Category Cards Container */}
        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-gray-200 rounded-full p-2 shadow transition-all duration-200"
            aria-label="Scroll left"
            style={{ width: 40, height: 40, display: showLeftArrow ? "block" : "none" }}
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-gray-200 rounded-full p-2 shadow transition-all duration-200"
            aria-label="Scroll right"
            style={{ width: 40, height: 40, display: showRightArrow ? "block" : "none" }}
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Scrollable Category Cards */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-4"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth'
            }}
          >
            {categories.map((category) => {
              const categoryImage = getCategoryImage(category);
              
              return (
                <div
                  key={category}
                  className="group relative h-96 w-80 flex-shrink-0 bg-gray-900 overflow-hidden cursor-pointer"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  {/* Category Image */}
                  {categoryImage ? (
                    <div className="relative h-full w-full">
                      <img
                        src={categoryImage}
                        alt={category}
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        draggable={false}
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-400 text-lg">No Image</span>
                    </div>
                  )}

                  {/* Category Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-4 uppercase tracking-wide">
                        {formatCategoryName(category)}
                      </h3>
                      
                      {/* SHOP NOW Button */}
                      <Link
                        href={`/shop/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                        className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-sm font-medium uppercase tracking-wide hover:bg-white hover:text-black transition-colors duration-300 group/button"
                      >
                        <span>SHOP NOW</span>
                        <svg 
                          className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M17 8l4 4m0 0l-4 4m4-4H3" 
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCards; 