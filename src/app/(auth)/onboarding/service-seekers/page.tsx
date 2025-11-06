'use client'

import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { seekerSchema, seekerSchemaType } from '@/schemas/seekerSchema'
import SeekerInfo from './SeekerInfo'
import { useCompleteProfile } from '@/hooks/useCompleteProfile'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import axios from 'axios'

const Page = () => {
  const router = useRouter()
  
  // Check authentication method
  const authMethod = typeof window !== 'undefined' ? localStorage.getItem('authMethod') : null
  const userPhone = typeof window !== 'undefined' ? localStorage.getItem('userPhone') : null
  const isPhoneAuth = authMethod === 'phone'
  
  const methods = useForm<seekerSchemaType>({
    resolver: zodResolver(seekerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone_number: isPhoneAuth ? userPhone || '' : '',
      country: '',
      state: '',
      city: '',
      date_of_birth: '',
      
    },
    mode: 'onTouched',
  })

  const { mutate, isPending } = useCompleteProfile()

  const {
    handleSubmit,
    formState: { isValid },
    setError,
  } = methods

  const onSubmit = (data: seekerSchemaType) => {
      const storedEmail = localStorage.getItem('userEmail');

       const payload = {
        ...data,
        email: storedEmail,
      };


    mutate(payload, {
    onSuccess: () => {
      router.push("/dashboard")
    },
      onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as {
          error?: {
            code?: string;
            message?: string;
            details?:{
                detail?: string;
            }
          };
          errors?: Record<string, string[] | string>;
          message?: string;
        };

        const errors = data?.errors;
        const errorData = data?.error;

         if (errorData?.code === 'not_authenticated') {
            toast.error(errorData.message || "You must be logged in to complete this action.");
            
             localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            router.push('/login'); // or redirect to login page
            return;
          }

        if (errorData?.code === "USER_NOT_FOUND") {
          toast.error(errorData.message || "User not found or email not verified");
          router.push("/signup");
          return;
        }
   if (errorData?.code === 'VALIDATION_ERROR') {
      const detailMessage = errorData.details?.detail || errorData.message;
      toast.error(detailMessage || 'Validation error occurred.');

      // This is to redirect if profile is already complete
      if (detailMessage === 'Profile is already complete') {
        router.push('/dashboard');
      }

      return;
    }

        if (errors && typeof errors === "object") {
          Object.entries(errors).forEach(([field, messages]) => {
            setError(field as keyof seekerSchemaType, {
              type: "manual",
              message: Array.isArray(messages) ? messages[0] : String(messages),
            });
          });
        } else if (typeof data?.message === "string") {
          toast.error(data.message);
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    }, 
  })
    console.log('Submitted Data:', payload)
    // Submit to API or backend handler here
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden p-4">
      {/* Blurred background image */}
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
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10" />

      {/* Form container */}
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 z-20 relative w-full max-w-md">

         <div className="text-center mb-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                 Help us to know you better
                </h1>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Kindly enter your accurate details.
                </p>
              </div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <SeekerInfo isPhoneAuth={isPhoneAuth} />

            <button
              type="submit"
              disabled={!isValid || isPending}
              className={`w-full font-medium py-2 rounded-3xl  transition-colors duration-200 ${
                isValid
                  ? 'bg-black text-white hover:bg-gray-900 cursor-pointer'
                  : 'bg-gray-300 text-gray-500'
              }`}
            >
             {isPending ? "Submitting..." : "Submit"}
            </button>
          </form>
        </FormProvider>
      </div>
    </main>
  )
}

export default Page
