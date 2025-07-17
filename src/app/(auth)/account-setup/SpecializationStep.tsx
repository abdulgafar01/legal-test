
'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SpecializationStepProps {
  onNext: (data: any) => void;
  initialData?: any;
}

const SpecializationStep: React.FC<SpecializationStepProps> = ({ onNext, initialData = {} }) => {
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>(
    initialData.specializations || []
  );

  const specializations = [
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

  const handleSpecializationToggle = (specialization: string) => {
    setSelectedSpecializations(prev => {
      if (prev.includes(specialization)) {
        return prev.filter(s => s !== specialization);
      } else {
        return [...prev, specialization];
      }
    });
  };

  const isFormValid = selectedSpecializations.length > 0;

  const handleContinue = () => {
    if (isFormValid) {
      onNext({ specializations: selectedSpecializations });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-2">Select your area of specialisation</h2>
      <p className="text-gray-600 text-center mb-8">This details will be displayed on your profile for service seekers to see.</p>

      <div className="space-y-4 mb-8">
        <Label className="text-sm font-medium">Select your Specialisation(s)</Label>
        <div className="flex flex-wrap gap-3">
          {specializations.map((specialization) => (
            <div 
              key={specialization} 
              className={`flex items-center space-x-2 px-3 py-2 rounded-full border cursor-pointer transition-colors ${
                selectedSpecializations.includes(specialization)
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => handleSpecializationToggle(specialization)}
            >
              <Checkbox
                id={specialization}
                checked={selectedSpecializations.includes(specialization)}
                onCheckedChange={() => handleSpecializationToggle(specialization)}
                className="data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-black"
              />
              <label
                htmlFor={specialization}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {specialization}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={handleContinue}
        disabled={!isFormValid}
        className={`w-full ${isFormValid ? 'bg-black hover:bg-gray-800' : 'bg-gray-300 cursor-not-allowed'}`}
      >
        Continue
      </Button>
    </div>
  );
};

export default SpecializationStep;
