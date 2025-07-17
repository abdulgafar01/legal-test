
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        
        return (
          <React.Fragment key={stepNumber}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                isActive
                  ? 'bg-black text-white'
                  : isCompleted
                  ? 'bg-gray-300 text-gray-600'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {stepNumber.toString().padStart(2, '0')}
            </div>
            {stepNumber < totalSteps && (
              <div className={`w-16 h-0.5 mx-2 ${isCompleted ? 'bg-gray-300' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
