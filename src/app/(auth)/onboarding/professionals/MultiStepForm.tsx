"use client";
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import StepIndicator from './StepIndicator';
import PersonalInfoForm from './PersonalInfoForm';
import LicenseForm from './LicenseForm';
import CertificationForm from './CertificationForm';
import Link from 'next/link';

const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const stepTitles = {
    1: 'Personal information',
    2: 'Licence information',
    3: 'Certification information',
    4: 'Complete'
  };

  const stepDescriptions = {
    1: 'Kindly enter your accurate details as they appear on your license.',
    2: 'Please provide your professional license details for verification.',
    3: 'Add any relevant certifications to enhance your profile.',
    4: 'Your information has been submitted successfully.'
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    console.log('Form completed!');
    setCurrentStep(4);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
      {/* Blurred background with overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      />
       <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
      
      {/* Main content container */}
      <div className="w-full max-w-md z-1 relative">
        {currentStep < 4 && (
          <button
            onClick={handleBack}
            className={`flex items-center text-white mb-6 hover:text-gray-200 transition-colors ${
              currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={currentStep === 1}
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          
          {/* form heading */}
          <div className="text-center mb-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {stepTitles[currentStep as keyof typeof stepTitles]}
            </h1>
            <p className="text-gray-400 text-xs  leading-relaxed">
              {stepDescriptions[currentStep as keyof typeof stepDescriptions]}
            </p>
          </div>

          {/* step indicator */}

          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

          {/* Form steps */}
          <div className="transition-all duration-300 ease-in-out">
            {currentStep === 1 && <PersonalInfoForm onNext={handleNext} />}
            {currentStep === 2 && <LicenseForm onNext={handleNext} />}
            {currentStep === 3 && (
              <CertificationForm onBack={handleBack} onNext={handleComplete} />
            )}
            {currentStep === 4 && (
              <div className="text-center py-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg 
                    className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">All Done!</h2>
                <p className="text-gray-600 mb-6">Your information has been submitted successfully.</p>
                
                <Link href='/dashboard'>
                <button
                  className="bg-black text-white px-6 py-2.5 sm:px-8 sm:py-3 
                  rounded-full font-semibold hover:bg-gray-800 transition-colors text-sm sm:text-base cursor-pointer"
                >
                  ok
                </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;