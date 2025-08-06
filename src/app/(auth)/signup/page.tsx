'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Apple, Eye, EyeOff, Facebook, Scale } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '@/lib/api/auth';
import { toast } from 'sonner'; // optional for user feedback
import axios from 'axios';

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

const Page = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onChange' });

  const email = watch('email');
  const password = watch('password');
  // const confirm_password = watch('confirmPassword');

  // Mutation for user registration
  // Using react-query for better state management and error handling

      const mutation = useMutation({
        mutationFn: async (formData: FormValues) => {

          // const accountType = localStorage.getItem('accountType');
          const payload = {
            email: formData.email,
            password: formData.password,
            confirm_password: formData.confirmPassword,
            // Add any other required fields the API expects
            // user_type:
            //   accountType === 'service_seeker'
            //     ? 'service_seeker'
            //     : accountType === 'practitional'
            //     ? 'practitional'
            //     : null,
          };

        //   if (accountType === 'service_seeker' || accountType === 'practitional') {
        //   payload.user_type = accountType;
        // }
          return registerUser(payload);
        },
        onSuccess: (data, variables) => {
          toast.success('Account created successfully!',data.message);
          //  to store the token if the API returns one
          if (data.token) {
            localStorage.setItem('authToken', data.token);
          }

          if (variables.email) {
              localStorage.setItem('userEmail', variables.email);
            }

            
          router.push('/verifyEmail');
          console.log('Registration successful:', data);
        },
        
      onError: (err: unknown) => {
          if (!axios.isAxiosError(err)) {
            toast.error('Unexpected error occurred. Please try again.');
            return;
          }
      if (axios.isAxiosError(err)) {
        // Handle network errors first
        if (err.message === 'Network Error') {
          toast.error('Network error - please check your internet connection');
          return;
        }

  const responseData = err.response?.data as {
    error?: {
      details?: Record<string, string | string[]>;
    };
  };

  const apiError = responseData?.error;
  const details = apiError?.details || {};
  const detail = details?.detail;

  if (detail) {
    toast.error(detail);
  }

  if (details?.email) {
    const msg = Array.isArray(details.email)
      ? details.email.join(' ')
      : details.email;

    setError('email', {
      type: 'server',
      message: msg,
    });

    toast.error(msg);
  }

  if (details?.password) {
    const msg = Array.isArray(details.password)
      ? details.password.join(' ')
      : details.password;

    setError('password', {
      type: 'server',
      message: msg,
    });

    toast.error(msg);
  }

  if (details?.confirm_password) {
    const msg = Array.isArray(details.confirm_password)
      ? details.confirm_password.join(' ')
      : details.confirm_password;

    setError('confirmPassword', {
      type: 'server',
      message: msg,
    });

    toast.error(msg);
  }

  // Optional: catch-all if no specific message is shown
  if (!detail && !details?.email && !details?.password && !details?.confirm_password) {
    toast.error('Server did not return a specific error message.');
  }
}

  }

      });


// Function to handle form submission
  // This will be called when the user clicks "Sign Up" after entering their email

      const onSubmit = async (data: FormValues) => {
        // If the email field is not valid, we don't proceed to show password fields
        
         const isEmailValid = await trigger('email');
          if (!isEmailValid || errors.email) return;
          
        if (!showPasswordField) {
          setShowPasswordField(true);
          return;
        }

        try {
          await mutation.mutateAsync(data);
        } catch (error) {
          // Error is already handled in the mutation's onError
          console.error('Registration error:', error);
        }
      };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-slate-800 relative"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs"></div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl mx-auto relative z-10">
        <div className="flex-1 text-center lg:text-left max-w-xl">
          <Scale className="w-20 h-20 text-white mb-8 mx-auto lg:mx-0" />
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Need Legal Help?
            <br />
            Get Matched
            <br />
            Instantly.
          </h1>
          <p className="text-xl text-gray-200 max-w-lg">
            Connect with verified legal professionals in your area or field — fast, secure, and AI-assisted.
          </p>
        </div>

        <div className="flex-1 max-w-md w-full">
          <div className="bg-white rounded-2xl py-6 px-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create an account</h2>
            <p className="text-gray-600 mb-4">Secure your access to legal support — anytime, anywhere.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {!showPasswordField ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email address',
                      },
                    })}
                    onBlur={() => trigger('email')}
                    className={`w-full ${errors.email ? 'border-red-500' : 'border-yellow-400'}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm font-medium text-gray-700 mb-1">{email}</p>
              )}

              {showPasswordField && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters',
                          },
                        })}
                        className="w-full pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        {...register('confirmPassword', {
                          validate: (value) =>
                            value === password || 'Passwords do not match',
                        })}
                        className="w-full pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-4xl font-medium"
                disabled={mutation.isPending}
              >
                {mutation.isPending
                  ? 'Loading...'
                  : showPasswordField
                  ? 'Sign Up'
                  : 'Continue'}
              </Button>

              <div className="text-center">
                <span className="text-gray-500">Already have an account? </span>
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </Link>
              </div>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button variant="outline" className="w-full py-3 border-gray-300">
                  Continue with Google
                </Button>
                <Button variant="outline" className="w-full py-3 border-gray-300">
                  <span className="mr-2">
                    <Facebook />
                  </span>
                  Continue with Facebook
                </Button>
                <Button variant="outline" className="w-full py-3 border-gray-300">
                  <span className="mr-2">
                    <Apple />
                  </span>
                  Continue with Apple
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                By signing up, you agree to our{' '}
                <Link href="/terms" className="underline">
                  Terms and Conditions of Use
                </Link>{' '}
                and our{' '}
                <Link href="/privacy" className="underline">
                  Privacy Policy
                </Link>
              </p>
            </form>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <Button className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-400/30">
              I am a legal practitioner
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
