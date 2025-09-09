'use client';

import FilterModal from '@/components/FilterModal';
import LawyerCard from '@/components/LawyerCard';
import { Button } from '@/components/ui/button';
import { FilterValues, Practitioner, PractitionerFilters } from '@/lib/types';
import { getPractitioners } from '@/lib/api/practitioners';
import { ChevronDown, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const Page = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilterType, setCurrentFilterType] = useState("pricing");
  const [filters, setFilters] = useState<FilterValues>({
    expertise: [],
    location: "",
    pricing: { min: 5, max: 1000 },
    experience: { min: 0, max: 10 },
    ratings: "",
    availability: "",
    expertiseIds: []
  });
  
  // Practitioners state
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load practitioners
  const loadPractitioners = async (appliedFilters: FilterValues = filters, page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Loading practitioners with filters:', appliedFilters);
      
      const apiFilters: PractitionerFilters = {
        page,
        ordering: '-average_rating,-total_consultations', // Default ordering
      };

      // Map frontend filters to API filters
      if (appliedFilters.expertiseIds && appliedFilters.expertiseIds.length > 0) {
        apiFilters.specializations = appliedFilters.expertiseIds;
      } else if (appliedFilters.expertise.length > 0) {
        // Fallback: search by name if IDs not available
        apiFilters.search = appliedFilters.expertise.join(' ');
      }
      
      if (appliedFilters.location) {
        apiFilters.country = appliedFilters.location;
      }
      
      if (appliedFilters.pricing.min > 5) {
        apiFilters.min_price = appliedFilters.pricing.min;
      }
      
      if (appliedFilters.pricing.max < 1000) {
        apiFilters.max_price = appliedFilters.pricing.max;
      }
      
      if (appliedFilters.experience.min > 0) {
        apiFilters.min_experience = appliedFilters.experience.min;
      }
      
      // Map ratings filter (4+ -> 4, 3+ -> 3, etc.)
      if (appliedFilters.ratings) {
        const minRating = parseInt(appliedFilters.ratings.replace('+', ''));
        if (!isNaN(minRating)) {
          apiFilters.min_rating = minRating;
        }
      }
      
      if (appliedFilters.availability === 'available') {
        apiFilters.availability_status = 'available';
      }

      console.log('📡 API Filters:', apiFilters);

      const response = await getPractitioners(apiFilters);
      
      console.log('📥 API Response:', response);

      // Handle the response - it should always have success: true now due to our API wrapper
      let practitioners = response.data || response.results || [];
      
      // Client-side filtering for ratings (fallback if backend doesn't support min_rating)
      if (appliedFilters.ratings) {
        const minRating = parseInt(appliedFilters.ratings.replace('+', ''));
        if (!isNaN(minRating)) {
          practitioners = practitioners.filter((p: any) => 
            (p.average_rating || 0) >= minRating
          );
          console.log(`🔍 Filtered ${practitioners.length} practitioners with rating >= ${minRating}`);
        }
      }
      
      const count = response.pagination?.count || response.count || practitioners.length;      setPractitioners(practitioners);
      setTotalCount(count);
      setCurrentPage(page);
      console.log('✅ Successfully loaded', practitioners.length, 'practitioners');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load practitioners';
      console.error('💥 Exception in loadPractitioners:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load practitioners on component mount
  useEffect(() => {
    loadPractitioners();
  }, []);

  // Reload practitioners when filters change
  const handleFiltersChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    loadPractitioners(newFilters, 1); // Reset to page 1 when filters change
  };

  const openFilter = (filterType: string) => {
    setCurrentFilterType(filterType);
    setIsFilterOpen(true);
  };

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

            {/* Content Section */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
                <span className="ml-2 text-gray-600">Loading practitioners...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">⚠️ {error}</div>
                <Button 
                  onClick={() => loadPractitioners()} 
                  variant="outline"
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Try Again
                </Button>
              </div>
            ) : practitioners.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-600 mb-4">No practitioners found matching your criteria</div>
                <Button 
                  onClick={() => {
                    const resetFilters: FilterValues = {
                      expertise: [],
                      location: "",
                      pricing: { min: 5, max: 1000 },
                      experience: { min: 0, max: 10 },
                      ratings: "",
                      availability: "",
                      expertiseIds: []
                    };
                    handleFiltersChange(resetFilters);
                  }}
                  variant="outline"
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-4 text-sm text-gray-600">
                  Found {totalCount} practitioner{totalCount !== 1 ? 's' : ''}
                </div>
                
                {/* Practitioners Grid */}
                <div className="space-y-6">
                  {practitioners.map((practitioner) => (
                    <LawyerCard 
                      key={practitioner.id} 
                      lawyer={{
                        id: practitioner.id,
                        name: `${practitioner.user_info.first_name} ${practitioner.user_info.last_name}`,
                        image: practitioner.user_info.profile_image || "/placeholderImage.png",
                        rating: Math.round(practitioner.average_rating),
                        expertise: (() => {
                          const names = practitioner.specializations?.map((s: any) => s?.name) || [];
                          // Flatten possible JSON array stored as name
                          return names.flatMap((n: any) => {
                            if (typeof n === 'string') {
                              const t = n.trim();
                              if (t.startsWith('[')) {
                                try {
                                  const parsed = JSON.parse(t);
                                  return Array.isArray(parsed)
                                    ? parsed.map((v) => (typeof v === 'string' ? v : v?.name)).filter(Boolean)
                                    : [n];
                                } catch {
                                  return t.replace(/^\[|\]$/g, '').replace(/\"/g, '').split(',').map(s => s.trim()).filter(Boolean);
                                }
                              }
                            }
                            return [n];
                          }).filter(Boolean);
                        })(),
                        qualification: practitioner.experience_level || "Legal Professional",
                        price: practitioner.hourly_rate,
                        location: practitioner.user_info.country,
                        status: practitioner.is_available_for_booking ? "available" : "booked"
                      }} 
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>

      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        filterType={currentFilterType}
      />
    </div>
  );

}

export default Page
