'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { ProfessionalSchema, ProfessionalType,  } from '@/schemas/professionalSchema';
import StepIndicator from '@/components/StepIndicator';
import PersonalInformation from './PersonalInformation';
import License from './License';
import Certificate from './Certificate';
import { cn } from '@/lib/utils';

type Step = {
  id: string;
  title: string;
  description: string;
  component: React.FC;
  inputs: (keyof ProfessionalType)[];
};

const steps: Step[] = [
  {
    id: '1',
    title: 'Personal Information',
    description: 'Kindly enter your personal details',
    component: PersonalInformation,
    inputs: ['firstName', 'lastName', 'middleName', 'country', 'qualification', 'dateOfBirth'],
  },
  {
    id: '2',
    title: 'Lincence Information',
    description: 'Kindly enter your accurate details as they appear on your license.',
    component: License,
    inputs: ['country', 'date_of_license', 'typeOfLicense'],
  },
  {
    id: '3',
    title: 'Certification Information',
    description:
    'Kindly enter your accurate personal details as they appear on your Certificate',
    component: Certificate,
    inputs: ['country', 'date_of_license', 'typeOfLicense'],
  },
];

const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isStepValid, setIsStepValid] = useState(true)
  const router = useRouter();

  const methods = useForm<ProfessionalType>({
    resolver: zodResolver(ProfessionalSchema),
    mode: 'onTouched',
  });

  const { handleSubmit, trigger } = methods;

  const onSubmit = (data: ProfessionalType) => {
    console.log('Form Data:', data);
    setShowSuccess(true);
    setTimeout(() => {
      router.push('/account');
    }, 3000);
  };

  const StepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="w-full max-w-md z-10 relative">
        {currentStep > 0 && !showSuccess && (
          <button
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="flex items-center text-white mb-6 hover:text-gray-200 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {!showSuccess ? (
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="text-center mb-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {steps[currentStep].title}
                  </h1>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {steps[currentStep].description}
                  </p>
                </div>

                <StepIndicator currentStep={currentStep + 1} totalSteps={steps.length} />

                <div className="transition-all duration-300 ease-in-out mt-4">
                  <StepComponent />
                </div>

                <div className="mt-6 flex justify-end">
                  {currentStep < steps.length - 1 ? (
                    <button
                          type="button"
                          // disabled={!isStepValid}
                          onClick={async () => {
                            const stepInputs = steps[currentStep].inputs;
                            const isValid = await trigger(stepInputs); // Validate only current step fields
                            setIsStepValid(isValid);
                            if (isValid) {
                              setCurrentStep((prev) => prev + 1);
                            }
                          }}
                          className={cn(
                                      "w-full py-2 px-4 rounded-full font-semibold transition-colors text-sm",
                                      isStepValid
                                        ? "bg-black text-white hover:bg-gray-800"
                                        : "bg-gray-300 text-gray-500"
                                    )}
                        >
                          Next
                        </button>

                  ) : (
                         <button
                           type="submit"
                           disabled={!isStepValid}
                           className={cn(
                             "w-full py-2 px-4 cursor-pointer rounded-full font-semibold transition-colors text-sm",
                             isStepValid
                               ? "bg-black text-white hover:bg-gray-800"
                               : "bg-gray-300 text-gray-500 cursor-not-allowed"
                           )}
                         >
                           Submit
                         </button>
                  )}
                </div>
              </form>
            </FormProvider>
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
