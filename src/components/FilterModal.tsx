"use client"

import { useState, useEffect } from "react";
import { X, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { FilterValues } from "@/lib/types";



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

  // Check if any filters have been changed from their initial state
  useEffect(() => {
    const checkForChanges = () => {
      switch (filterType) {
        case "expertise":
          return selectedExpertise.length > 0;
        case "experience":
          return experienceRange.min > 0 || experienceRange.max < 10;
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
    if (checked) {
      newExpertise = [...selectedExpertise, expertise];
    } else {
      newExpertise = selectedExpertise.filter((item: string) => item !== expertise);
    }
    setSelectedExpertise(newExpertise);
    onFiltersChange({
      ...filters,
      expertise: newExpertise
    });
  };

  const handleSave = () => {
    if (hasChanges) {
      onClose();
    }
  };

  const renderExpertiseFilter = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[
            "Criminal Law", "Civil Law", "Constitutional Law",
            "Administrative Law", "International Law", "Labour & Employment Law",
            "Corporate (or Company) Law", "Tax Law", "Commercial Law",
            "Family Law", "Property Law", "Environmental Law",
            "Intellectual Property Law", "Human Rights Law", "Immigration Law"
          ].map((expertise) => (
            <div key={expertise} className="flex items-center space-x-2">
              <Checkbox
                id={expertise}
                checked={selectedExpertise.includes(expertise)}
                onCheckedChange={(checked) => handleExpertiseChange(expertise, checked as boolean)}
                className={selectedExpertise.includes(expertise) ? "bg-black border-black" : ""}
              />
              <Label 
                htmlFor={expertise} 
                className={`text-sm ${selectedExpertise.includes(expertise) ? "font-medium" : ""}`}
              >
                {expertise}
              </Label>
            </div>
          ))}
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

  const renderExperienceFilter = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-6">
        <div className="space-y-2">
          <Label className="text-sm text-gray-500">Min</Label>
          <Input
            type="number"
            value={experienceRange.min}
            onChange={(e) => setExperienceRange({ ...experienceRange, min: parseInt(e.target.value) || 0 })}
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
            onChange={(e) => setExperienceRange({ ...experienceRange, max: parseInt(e.target.value) || 10 })}
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
      <div className="space-y-4">
        <div className={`flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer ${selectedLocation === "Kuwait" ? "bg-gray-100" : ""}`}
             onClick={() => setSelectedLocation("Kuwait")}>
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="text-sm">Kuwait</span>
        </div>
        <div className={`flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer ${selectedLocation === "Nigeria" ? "bg-gray-100" : ""}`}
             onClick={() => setSelectedLocation("Nigeria")}>
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="text-sm">Nigeria</span>
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
              }
            }}
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
