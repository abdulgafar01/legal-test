'use client';

import FilterModal from '@/components/FilterModal';
import LawyerCard from '@/components/LawyerCard';
import { Button } from '@/components/ui/button';
import { FilterValues } from '@/lib/types';
import { ChevronDown,} from 'lucide-react';
import React, { useState } from 'react'

const Page = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilterType, setCurrentFilterType] = useState("pricing");
  const [filters, setFilters] = useState<FilterValues>({
    expertise: [],
    location: "",
    pricing: { min: 5, max: 1000 },
    experience: { min: 0, max: 10 },
    ratings: "",
    availability: ""
  });

  const openFilter = (filterType: string) => {
    setCurrentFilterType(filterType);
    setIsFilterOpen(true);
  };

  const lawyers = [
    {
      id: 1,
      name: "Wade Warren",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 4,
      expertise: ["Criminal Law", "Family Law"],
      qualification: "Undergraduate Law",
      price: 79.99,
      location: "Lagos, Nigeria",
      status: "available"
    },
    {
      id: 2,
      name: "Wade Warren",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 4,
      expertise: ["Criminal Law", "Family Law"],
      qualification: "Undergraduate Law",
      price: 79.99,
      location: "Lagos, Nigeria",
      status: "booked"
    },
    {
      id: 3,
      name: "Wade Warren",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      rating: 4,
      expertise: ["Criminal Law", "Family Law"],
      qualification: "Undergraduate Law",
      price: 79.99,
      location: "Lagos, Nigeria",
      status: "available"
    },
    {
      id: 4,
      name: "Wade Warren",
      image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
      rating: 4,
      expertise: ["Criminal Law", "Family Law"],
      qualification: "Undergraduate Law",
      price: 79.99,
      location: "Lagos, Nigeria",
      status: "available"
    }
  ];

  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto  flex-1"> 
        {/* Main Content */}
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Professional</h1>
            
            {/* Filter Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Filter</h3>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => openFilter("expertise")}
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Expertise <ChevronDown/>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => openFilter("location")}
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Location <ChevronDown/>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => openFilter("pricing")}
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Pricing <ChevronDown/>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => openFilter("experience")}
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Years of experience <ChevronDown/>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => openFilter("ratings")}
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Ratings <ChevronDown/>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => openFilter("availability")}
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Availability <ChevronDown/>
                </Button>
              </div>
            </div>

            {/* Lawyers Grid */}
            <div className="space-y-6">
              {lawyers.map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </div>
          </div>
        </main>


      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        filterType={currentFilterType}
      />
    </div>
  );

}

export default Page
