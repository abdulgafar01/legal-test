"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import StepIndicator from "./StepIndicator";
import PersonalInfoForm from "./PersonalInfoForm";
import LicenseForm from "./LicenseForm";
import CertificationForm from "./CertificationForm";
import { useRouter } from "next/navigation";

const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const totalSteps = 3;
  const router = useRouter();

  const stepTitles = {
    1: "Personal information",
    2: "Licence information",
    3: "Certification information",
  };

  const stepDescriptions = {
    1: "Kindly enter your accurate details as they appear on your license.",
    2: "Please provide your professional license details for verification.",
    3: "Add any relevant certifications to enhance your profile.",
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    setShowSuccess(true);
    setTimeout(() => {
      router.push("/account");
    }, 3000); // Show modal for 3 seconds
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
      {/* Blurred background */}
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

      <div className="w-full max-w-md z-10 relative">
        {currentStep > 1 && !showSuccess && (
          <button
            onClick={handleBack}
            className="flex items-center text-white mb-6 hover:text-gray-200 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {!showSuccess ? (
            <>
              <div className="text-center mb-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {stepTitles[currentStep as keyof typeof stepTitles]}
                </h1>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {stepDescriptions[currentStep as keyof typeof stepDescriptions]}
                </p>
              </div>

              <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

              <div className="transition-all duration-300 ease-in-out">
                {currentStep === 1 && <PersonalInfoForm onNext={handleNext} />}
                {currentStep === 2 && <LicenseForm onNext={handleNext} />}
                {currentStep === 3 && <CertificationForm onNext={handleComplete} />}
              </div>
            </>
          ) : (
            <div className="text-center py-6 animate-fade-in">
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
              <p className="text-gray-600 mb-1">Your information has been submitted.</p>
              <p className="text-gray-400 text-sm">Redirecting to your account...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
