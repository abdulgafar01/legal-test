"use client"

import { useState, useEffect } from "react";
import { X, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { FilterValues, PractitionerSpecialization, Country } from "@/lib/types";
import { getSpecializations, getPractitionerCountries } from "@/lib/api/practitioners";



// type FilterValues = {
//   expertise: string[];
//   location: string;
//   pricing: { min: number; max: number };
//   experience: { min: number; max: number };
//   ratings: string;
//   availability: string;
// };

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterValues; // Adjust type as needed
  // Assuming filters is an object with properties like pricing, expertise, etc.
  onFiltersChange:(filters: FilterValues) => void;
  filterType?: string;
}

const FilterModal = ({ isOpen, onClose, filters, onFiltersChange, filterType = "pricing" }: FilterModalProps) => {
  const [priceRange, setPriceRange] = useState([filters.pricing.min, filters.pricing.max]);
  const [selectedExpertise, setSelectedExpertise] = useState(filters.expertise || []);
  const [experienceRange, setExperienceRange] = useState({ min: 0, max: 10 });
  const [selectedRating, setSelectedRating] = useState(filters.ratings || "");
  const [selectedAvailability, setSelectedAvailability] = useState(filters.availability || "");
  const [selectedLocation, setSelectedLocation] = useState(filters.location || "");
  const [hasChanges, setHasChanges] = useState(false);
  const [specializations, setSpecializations] = useState<PractitionerSpecialization[]>([]);
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);

  // Load specializations when modal opens and filterType is expertise
  useEffect(() => {
    if (isOpen && filterType === "expertise" && specializations.length === 0) {
      setLoadingSpecializations(true);
      getSpecializations()
        .then((response) => {
          console.log('🔍 Specializations API Response:', response);
          
          // Updated response format handling for list_response
          if (response.success && Array.isArray(response.data)) {
            setSpecializations(response.data);
            console.log('✅ Specializations loaded:', response.data.length, 'items');
          } else if (Array.isArray(response)) {
            // Handle case where response is directly an array
            setSpecializations(response);
            console.log('✅ Specializations loaded (direct array):', response.length, 'items');
          } else {
            console.error('❌ Invalid specializations response format:', response);
            setSpecializations([]);
          }
        })
        .catch((error) => {
          console.error('❌ Error loading specializations:', error);
          setSpecializations([]);
        })
        .finally(() => {
          setLoadingSpecializations(false);
        });
    }
  }, [isOpen, filterType, specializations.length]);

  // Load countries when modal opens and filterType is location
  useEffect(() => {
    if (isOpen && filterType === "location" && countries.length === 0) {
      setLoadingCountries(true);
      getPractitionerCountries()
        .then((response) => {
          console.log('🔍 Countries API Response:', response);
          
          if (response.success && Array.isArray(response.data)) {
            // Filter to only active countries
            const activeCountries = response.data.filter(country => country.is_active);
            setCountries(activeCountries);
            console.log('✅ Countries loaded:', activeCountries.length, 'items');
          } else if (Array.isArray(response)) {
            // Handle case where response is directly an array
            setCountries(response);
            console.log('✅ Countries loaded (direct array):', response.length, 'items');
          } else {
            console.error('❌ Invalid countries response format:', response);
            setCountries([]);
          }
        })
        .catch((error) => {
          console.error('❌ Error loading countries:', error);
          setCountries([]);
        })
        .finally(() => {
          setLoadingCountries(false);
        });
    }
  }, [isOpen, filterType, countries.length]);

  // Check if any filters have been changed from their initial state
  useEffect(() => {
    const checkForChanges = () => {
      switch (filterType) {
        case "expertise":
          return selectedExpertise.length > 0;
        case "experience":
          return experienceRange.min > 0 || experienceRange.max !== 10;
        case "ratings":
          return selectedRating !== "";
        case "availability":
          return selectedAvailability !== "";
        case "location":
          return selectedLocation !== "";
        case "pricing":
          return priceRange[0] !== filters.pricing.min || priceRange[1] !== filters.pricing.max;
        default:
          return false;
      }
    };
    
    setHasChanges(checkForChanges());
  }, [selectedExpertise, experienceRange, selectedRating, selectedAvailability, selectedLocation, priceRange, filterType, filters]);

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    onFiltersChange({
      ...filters,
      pricing: { min: values[0], max: values[1] }
    });
  };

  const handleExpertiseChange = (expertise: string, checked: boolean) => {
    let newExpertise;
    let newExpertiseIds: number[] = [];
    
    if (checked) {
      newExpertise = [...selectedExpertise, expertise];
    } else {
      newExpertise = selectedExpertise.filter((item: string) => item !== expertise);
    }
    
    // Map expertise names to IDs
    newExpertiseIds = specializations
      .filter(spec => newExpertise.includes(spec.name))
      .map(spec => spec.id);
    
    setSelectedExpertise(newExpertise);
    onFiltersChange({
      ...filters,
      expertise: newExpertise,
      expertiseIds: newExpertiseIds
    });
  };

  const handleSave = () => {
    if (hasChanges) {
      // Create the final filter state to apply
      const finalFilters = {
        ...filters,
        expertise: selectedExpertise,
        location: selectedLocation,
        pricing: { min: priceRange[0], max: priceRange[1] },
        experience: experienceRange,
        ratings: selectedRating,
        availability: selectedAvailability,
        expertiseIds: specializations
          .filter(spec => selectedExpertise.includes(spec.name))
          .map(spec => spec.id)
      };
      
      // Apply the final filters
      onFiltersChange(finalFilters);
      onClose();
    }
  };

  const renderExpertiseFilter = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {loadingSpecializations ? (
          <div className="flex justify-center py-4">
            <div className="text-sm text-gray-500">Loading specializations...</div>
          </div>
        ) : Array.isArray(specializations) && specializations.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {specializations.map((specialization) => (
              <div key={specialization.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`specialization-${specialization.id}`}
                  checked={selectedExpertise.includes(specialization.name)}
                  onCheckedChange={(checked) => handleExpertiseChange(specialization.name, checked as boolean)}
                  className={selectedExpertise.includes(specialization.name) ? "bg-black border-black" : ""}
                />
                <Label 
                  htmlFor={`specialization-${specialization.id}`}
                  className={`text-sm ${selectedExpertise.includes(specialization.name) ? "font-medium" : ""}`}
                >
                  {specialization.name}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center py-4">
            <div className="text-sm text-gray-500">No specializations available</div>
          </div>
        )}
      </div>
      
      <Button 
        onClick={handleSave}
        disabled={!hasChanges}
        className={`w-full ${hasChanges ? "bg-black text-white hover:bg-gray-800" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
      >
        Save
      </Button>
    </div>
  );

  const renderExperienceFilter = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-6">
        <div className="space-y-2">
          <Label className="text-sm text-gray-500">Min</Label>
          <Input
            type="number"
            value={experienceRange.min}
            onChange={(e) => {
              const newMin = parseInt(e.target.value) || 0;
              const newRange = { ...experienceRange, min: newMin };
              setExperienceRange(newRange);
              onFiltersChange({
                ...filters,
                experience: newRange
              });
            }}
            className="w-20 text-center"
            min="0"
          />
        </div>
        <span className="text-xl text-gray-400 mt-6">-</span>
        <div className="space-y-2">
          <Label className="text-sm text-gray-500">Max</Label>
          <Input
            type="number"
            value={experienceRange.max}
            onChange={(e) => {
              const newMax = parseInt(e.target.value) || 10;
              const newRange = { ...experienceRange, max: newMax };
              setExperienceRange(newRange);
              onFiltersChange({
                ...filters,
                experience: newRange
              });
            }}
            className="w-20 text-center"
            min="0"
          />
        </div>
      </div>
      
      <Button 
        onClick={handleSave}
        disabled={!hasChanges}
        className={`w-full ${hasChanges ? "bg-black text-white hover:bg-gray-800" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
      >
        Save
      </Button>
    </div>
  );

  const renderLocationFilter = () => (
    <div className="space-y-6">
      {loadingCountries ? (
        <div className="flex justify-center py-4">
          <div className="text-sm text-gray-500">Loading countries...</div>
        </div>
      ) : Array.isArray(countries) && countries.length > 0 ? (
        <div className="space-y-4">
          {/* Add "All Countries" option for unselecting */}
          <div 
            className={`flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer ${selectedLocation === "" ? "bg-gray-100" : ""} border-b border-gray-200`}
            onClick={() => {
              setSelectedLocation("");
              onFiltersChange({
                ...filters,
                location: ""
              });
            }}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-400">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="text-sm font-medium">All Countries</span>
          </div>
          
          {countries.map((country, index) => (
            <div 
              key={country.code}
              className={`flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer ${selectedLocation === country.name ? "bg-gray-100" : ""}`}
              onClick={() => {
                setSelectedLocation(country.name);
                onFiltersChange({
                  ...filters,
                  location: country.name
                });
              }}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center`}
                   style={{ backgroundColor: `hsl(${(index * 137.508) % 360}, 70%, 50%)` }}>
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <span className="text-sm">{country.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center py-4">
          <div className="text-sm text-gray-500">No countries available</div>
        </div>
      )}
      
      <Button 
        onClick={handleSave}
        disabled={!hasChanges}
        className={`w-full ${hasChanges ? "bg-black text-white hover:bg-gray-800" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
      >
        Save
      </Button>
    </div>
  );

  const renderRatingFilter = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {[
          { rating: "4+", stars: 4, label: "4+" },
          { rating: "3+", stars: 3, label: "3+" },
          { rating: "2+", stars: 2, label: "2+" },
          { rating: "1+", stars: 1, label: "1+" }
        ].map((item) => (
          <div key={item.rating} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < item.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm">{item.label}</span>
            </div>
            <Checkbox
              checked={selectedRating === item.rating}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedRating(item.rating);
                  onFiltersChange({ ...filters, ratings: item.rating });
                } else {
                  // Allow unselecting
                  setSelectedRating("");
                  onFiltersChange({ ...filters, ratings: "" });
                }
              }}
              className={selectedRating === item.rating ? "bg-black border-black" : ""}
            />
          </div>
        ))}
      </div>
      
      <Button 
        onClick={handleSave}
        disabled={!hasChanges}
        className={`w-full ${hasChanges ? "bg-black text-white hover:bg-gray-800" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
      >
        Save
      </Button>
    </div>
  );

  const renderAvailabilityFilter = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">All</span>
          <Checkbox
            checked={selectedAvailability === "all"}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedAvailability("all");
                onFiltersChange({ ...filters, availability: "all" });
              } else {
                setSelectedAvailability("");
                onFiltersChange({ ...filters, availability: "" });
              }
            }}
            className={selectedAvailability === "all" ? "bg-black border-black" : ""}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Available now</span>
          <Checkbox
            checked={selectedAvailability === "available"}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedAvailability("available");
                onFiltersChange({ ...filters, availability: "available" });
              } else {
                setSelectedAvailability("");
                onFiltersChange({ ...filters, availability: "" });
              }
            }}
            className={selectedAvailability === "available" ? "bg-black border-black" : ""}
          />
        </div>
      </div>
      
      <Button 
        onClick={handleSave}
        disabled={!hasChanges}
        className={`w-full ${hasChanges ? "bg-black text-white hover:bg-gray-800" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
      >
        Save
      </Button>
    </div>
  );

  const renderPricingFilter = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            max={1000}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>0</span>
            <span>1000</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">$</span>
            <Input 
              type="number" 
              value={priceRange[0]} 
              onChange={(e) => handlePriceChange([parseInt(e.target.value) || 0, priceRange[1]])}
              className="w-20"
            />
          </div>
          <span className="text-gray-500">-</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">$</span>
            <Input 
              type="number" 
              value={priceRange[1]} 
              onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value) || 1000])}
              className="w-20"
            />
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleSave}
        disabled={!hasChanges}
        className={`w-full ${hasChanges ? "bg-black text-white hover:bg-gray-800" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
      >
        Save
      </Button>
    </div>
  );

  const getFilterTitle = () => {
    switch (filterType) {
      case "expertise": return "Expertise";
      case "location": return "Country";
      case "experience": return "Years of Experience";
      case "ratings": return "Rating";
      case "availability": return "Availability";
      default: return "Pricing";
    }
  };

  const renderFilterContent = () => {
    switch (filterType) {
      case "expertise": return renderExpertiseFilter();
      case "location": return renderLocationFilter();
      case "experience": return renderExperienceFilter();
      case "ratings": return renderRatingFilter();
      case "availability": return renderAvailabilityFilter();
      default: return renderPricingFilter();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {getFilterTitle()}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          {renderFilterContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
