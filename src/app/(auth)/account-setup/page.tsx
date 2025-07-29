'use client';

import React, { useState } from 'react';
import StepIndicator from './StepIndicator';
import ProfileDetailsStep, { ProfileFormData } from './ProfileDetailsStep';
import SpecializationStep from './SpecializationStep';
import ExperienceStep, { Experience } from './ExperienceStep';
import PricingStep from './PricingStep';
import SuccessModal from './SuccessModal';
import { Scale } from 'lucide-react';

// Step-specific types
// interface ProfileDetails extends ProfileFormData {}

interface PricingFormData {
  consultationRate: string;
  consultationCurrency: 'USD' | 'EUR' | 'GBP';
  hireRate: string;
  hireCurrency: 'USD' | 'EUR' | 'GBP';
  minConsultation: string;
  maxConsultation: string;
  unavailableDates: Date[];
}

interface FormData {
  profileDetails: ProfileFormData;
  specializations: string[];
  experiences: Experience[];
  pricing: PricingFormData;
}

const totalSteps = 4;

const Page: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    profileDetails: {
      fullName: '',
      phoneNumber: "",
      address: "",
      state: "",
      city: "",
      profilePhoto: "",
    },
    specializations: [],
    experiences: [],
    pricing: {
      consultationRate: '',
      consultationCurrency: 'USD',
      hireRate: '',
      hireCurrency: 'USD',
      minConsultation: '',
      maxConsultation: '',
      unavailableDates: [],
    },
  });

  const handleStepComplete = <K extends keyof FormData>(
    stepData: FormData[K],
    stepName: K
  ) => {
    const updated = {
      ...formData,
      [stepName]: stepData,
    };

    setFormData(updated);

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      console.log('Form completed:', updated);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProfileDetailsStep
            onNext={(data: ProfileFormData) => handleStepComplete(data, 'profileDetails')}
            initialData={formData.profileDetails}
          />
        );
      case 2:
        return (
          <SpecializationStep
            onNext={(data: string[]) => handleStepComplete(data, 'specializations')}
            initialData={formData.specializations}
          />
        );
      case 3:
        return (
         <ExperienceStep
         onNext={(data:Experience[]) => handleStepComplete(data, 'experiences')}
         initialData={formData.experiences}
       />

        );
      case 4:
        return (
          <PricingStep
            onNext={(data: PricingFormData) => handleStepComplete(data, 'pricing')}
            initialData={formData.pricing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 mx-auto ">
      {/* Header */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center mb-6">
          <div className="text-2xl text-yellow-600">
            <Scale />
          </div>
          <h1 className="text-xl font-semibold ml-2">Legal AI</h1>
        </div>
        <p className="text-gray-600 max-w-md mx-auto text-xs">
          To make your profile visible as a professional, please complete your account setup.
        </p>
      </div>


      {/* Step Content */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        {renderCurrentStep()}
      </div>

      {/* Success Modal */}
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
};

export default Page;
