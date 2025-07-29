"use client";

import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="flex items-center justify-center mb-4">
      {Array.from({ length: totalSteps }, (_, index) => {
        const isActive = index + 1 <= currentStep;
        const isLast = index === totalSteps - 1;

        return (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                isActive
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-400 border-gray-300"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </div>

            {!isLast && (
              <div
                className={`w-20 sm:w-28 h-0.5 mx-1 transition-all ${
                  currentStep > index + 1 ? "bg-black" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
