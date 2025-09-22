'use client';

import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { usePractitionerFormStore } from '@/stores/usePractitionerFormStore';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

interface SpecializationsFormProps {
  onNext: () => void;
}

// Mock specializations - In real app, fetch from API
const availableSpecializations = [
  { id: 1, name: "Corporate Law", description: "Business and corporate legal matters" },
  { id: 2, name: "Criminal Law", description: "Criminal defense and prosecution" },
  { id: 3, name: "Family Law", description: "Divorce, custody, and family matters" },
  { id: 4, name: "Real Estate Law", description: "Property and real estate transactions" },
  { id: 5, name: "Immigration Law", description: "Immigration and visa matters" },
  { id: 6, name: "Employment Law", description: "Labor and employment issues" },
  { id: 7, name: "Intellectual Property", description: "Patents, trademarks, and copyrights" },
  { id: 8, name: "Personal Injury", description: "Accident and injury claims" },
  { id: 9, name: "Tax Law", description: "Tax planning and disputes" },
  { id: 10, name: "Environmental Law", description: "Environmental regulations and compliance" },
  { id: 11, name: "Healthcare Law", description: "Medical and healthcare legal issues" },
  { id: 12, name: "Contract Law", description: "Contract drafting and disputes" },
  { id: 13, name: "Bankruptcy Law", description: "Debt relief and bankruptcy proceedings" },
  { id: 14, name: "Securities Law", description: "Financial securities and investments" },
  { id: 15, name: "International Law", description: "Cross-border and international legal matters" },
];

const SpecializationsForm: React.FC<SpecializationsFormProps> = ({ onNext }) => {
  const { formData, updateSpecializations } = usePractitionerFormStore();
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>(
    formData.specializations || []
  );
  const [searchTerm, setSearchTerm] = useState('');

  // Filter specializations based on search
  const filteredSpecializations = availableSpecializations.filter(spec =>
    spec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spec.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSpecializationToggle = (specName: string) => {
    setSelectedSpecializations(prev => {
      if (prev.includes(specName)) {
        return prev.filter(s => s !== specName);
      } else {
        return [...prev, specName];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSpecializations.length === 0) {
      toast.error('Please select at least one specialization');
      return;
    }

    updateSpecializations(selectedSpecializations);
    toast.success(`${selectedSpecializations.length} specialization(s) selected!`);
    onNext();
  };

  const isFormValid = selectedSpecializations.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Specializations
        </label>
        <input
          type="text"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Your Legal Specializations ({selectedSpecializations.length} selected)
        </label>
        
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
          {filteredSpecializations.map((specialization) => {
            const isSelected = selectedSpecializations.includes(specialization.name);
            
            return (
              <div
                key={specialization.id}
                onClick={() => handleSpecializationToggle(specialization.name)}
                className={cn(
                  "p-3 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50",
                  isSelected && "bg-blue-50 border-blue-200"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={cn(
                        "font-medium",
                        isSelected ? "text-blue-900" : "text-gray-900"
                      )}>
                        {specialization.name}
                      </h4>
                      {isSelected && (
                        <Check size={16} className="text-blue-600" />
                      )}
                    </div>
                    <p className={cn(
                      "text-sm mt-1",
                      isSelected ? "text-blue-700" : "text-gray-600"
                    )}>
                      {specialization.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredSpecializations.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No specializations found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      {selectedSpecializations.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selected Specializations:
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedSpecializations.map((spec) => (
              <span
                key={spec}
                onClick={() => handleSpecializationToggle(spec)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm cursor-pointer hover:bg-blue-200 transition-colors"
              >
                {spec}
                <span className="ml-1 text-blue-600">×</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!isFormValid}
        className={cn(
          "w-full py-2 px-4 rounded-full font-semibold transition-colors text-sm",
          isFormValid
            ? "bg-black text-white hover:bg-gray-800"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        )}
      >
        Next
      </button>
    </form>
  );
};

export default SpecializationsForm;
