"use client"

import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center mb-4">
      {Array.from({ length: totalSteps }, (_, index) => (
        <React.Fragment key={index}>
          {index < totalSteps - 1 && ( // Don't show step indicator for completion step
            <>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                  index + 1 <= currentStep
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-400 border-gray-300'
                }`}
              >
                {String(index + 1).padStart(2, '0')}
              </div>
              {index < totalSteps - 2 && (
                <div
                  className={`w-32 h-0.5 mx-0.5 transition-all ${
                    index + 1 < currentStep ? 'bg-black' : 'bg-gray-300'
                  }`}
                />
              )}
            </>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
