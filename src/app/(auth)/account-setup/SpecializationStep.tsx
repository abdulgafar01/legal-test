'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SpecializationStepProps {
  onNext: (data: { specializations: string[] }) => void;
  initialData?: { specializations?: string[] };
}

const specializationsList = [
  'Criminal Law',
  'Civil Law',
  'Constitutional Law',
  'Administrative Law',
  'International Law',
  'Labour & Employment Law',
  'Corporate (or Company) Law',
  'Tax Law',
  'Commercial Law',
  'Family Law',
  'Property Law',
  'Environmental Law',
  'Intellectual Property Law',
  'Human Rights Law',
  'Immigration Law'
];

const SpecializationStep: React.FC<SpecializationStepProps> = ({ onNext, initialData = {} }) => {
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>(
    initialData.specializations || []
  );

  const toggleSpecialization = (specialization: string) => {
    setSelectedSpecializations(prev =>
      prev.includes(specialization)
        ? prev.filter(s => s !== specialization)
        : [...prev, specialization]
    );
  };

  const handleContinue = () => {
    if (selectedSpecializations.length > 0) {
      onNext({ specializations: selectedSpecializations });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-2">Select your area of specialization</h2>
      <p className="text-gray-600 text-center mb-8">
        These details will be displayed on your profile for service seekers to see.
      </p>

      <div className="space-y-4 mb-8">
        <Label className="text-sm font-medium">Select your specialization(s)</Label>
        <div className="flex flex-wrap gap-3">
          {specializationsList.map((specialization) => {
            const isSelected = selectedSpecializations.includes(specialization);
            return (
              <button
                key={specialization}
                type="button"
                onClick={() => toggleSpecialization(specialization)}
                aria-pressed={isSelected}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full border transition-colors ${
                  isSelected
                    ? 'bg-black text-white border-black'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Checkbox
                  id={specialization}
                  checked={isSelected}
                  onCheckedChange={() => toggleSpecialization(specialization)}
                  className="data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-black"
                />
                <label
                  htmlFor={specialization}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {specialization}
                </label>
              </button>
            );
          })}
        </div>
      </div>

      <Button
        onClick={handleContinue}
        disabled={selectedSpecializations.length === 0}
        className="w-full disabled:bg-gray-300 disabled:cursor-not-allowed bg-black hover:bg-gray-800"
      >
        Continue
      </Button>
    </div>
  );
};

export default SpecializationStep;
