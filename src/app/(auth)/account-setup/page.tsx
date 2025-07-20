'use client';

import React, { useState } from 'react';
import StepIndicator from './StepIndicator';
import ProfileDetailsStep from './ProfileDetailsStep';
import SpecializationStep from './SpecializationStep';
import ExperienceStep from './ExperienceStep';
import PricingStep from './PricingStep';
import SuccessModal from './SuccessModal';
import { Scale } from 'lucide-react';

interface FormData {
  profileDetails: Record<string, any>;
  specializations: string[];
  experiences: any[];
  pricing: Record<string, any>;
}

const Page = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    profileDetails: {},
    specializations: [],
    experiences: [],
    pricing: {},
  });

  const totalSteps = 4;

  const handleStepComplete = (stepData: any, stepName: keyof FormData) => {
    setFormData(prev => ({
      ...prev,
      [stepName]: stepData,
    }));

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final step - show success
      console.log('Form completed:', { ...formData, [stepName]: stepData });
      setShowSuccess(true);

      // Hide modal after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProfileDetailsStep
            onNext={data => handleStepComplete(data, 'profileDetails')}
            initialData={formData.profileDetails}
          />
        );
      case 2:
        return (
          <SpecializationStep
            onNext={data => handleStepComplete(data, 'specializations')}
            initialData={{ specializations: formData.specializations }}
          />
        );
      case 3:
        return (
        <ExperienceStep
          onNext={data => handleStepComplete(data.experiences, 'experiences')}
          initialData={{ experiences: formData.experiences }}
        />
        );
      case 4:
        return (
          <PricingStep
            onNext={data => handleStepComplete(data, 'pricing')}
            initialData={formData.pricing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center mb-6">
          <div className="text-2xl text-yellow-600">
            <Scale />
          </div>
          <h1 className="text-xl font-semibold ml-2">Legal AI</h1>
        </div>
        <p className="text-gray-600 max-w-md mx-auto">
          To make your profile visible as a professional, please complete your account setup.
        </p>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

      {/* Step Content */}
      <div className="pb-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto bg-white rounded-lg shadow-md mt-6">
        {renderCurrentStep()}
      </div>

      {/* Success Modal */}
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
};

export default Page;
