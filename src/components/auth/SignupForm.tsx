'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Scale, User } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '@/lib/api/auth';
import { toast } from 'sonner'; 
import axios from 'axios';

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

type AccountType = 'professional' | 'service-seeker';

interface SignupFormProps {
  accountType: AccountType;
}

export default function SignupForm({ accountType }: SignupFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);

  const getContentByAccountType = () => {
    if (accountType === 'professional') {
      return {
        icon: Scale,
        title: "Join Our Legal Network",
        subtitle: "Share Your Expertise",
        description: "Connect with clients who need your specialized legal knowledge and grow your practice.",
        formTitle: "Start Your Professional Journey",
        formSubtitle: "Join thousands of legal professionals already serving clients on our platform.",
        accountLabel: "Legal Professional",
        switchLabel: "Service Seeker",
        switchLink: "/signup/seeker"
      };
    } else {
      return {
        icon: User,
        title: "Need Legal Help?",
        subtitle: "Get Matched Instantly",
        description: "Connect with verified legal professionals in your area or field — fast, secure, and AI-assisted.",
        formTitle: "Create an account",
        formSubtitle: "Secure your access to legal support — anytime, anywhere.",
        accountLabel: "Service Seeker",
        switchLabel: "Legal Professional",
        switchLink: "/signup/practitioner"
      };
    }
  };

  const content = getContentByAccountType();
  const IconComponent = content.icon;

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

  const mutation = useMutation({
    mutationFn: async (formData: FormValues) => {
      const payload = {
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        user_type: accountType === 'professional' ? 'legal_practitioner' : 'service_seeker',
      };
      return registerUser(payload);
    },
    onSuccess: (data, variables) => {
      toast.success('Account created successfully!', data.message);
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
          const msg = Array.isArray(details.email) ? details.email.join(' ') : details.email;
          setError('email', { type: 'server', message: msg });
          toast.error(msg);
        }

        if (details?.password) {
          const msg = Array.isArray(details.password) ? details.password.join(' ') : details.password;
          setError('password', { type: 'server', message: msg });
          toast.error(msg);
        }

        if (details?.confirm_password) {
          const msg = Array.isArray(details.confirm_password)
            ? details.confirm_password.join(' ')
            : details.confirm_password;
          setError('confirmPassword', { type: 'server', message: msg });
          toast.error(msg);
        }

        if (!detail && !details?.email && !details?.password && !details?.confirm_password) {
          toast.error('Server did not return a specific error message.');
        }
      }
    }
  });

  const onSubmit = async (data: FormValues) => {
    const isEmailValid = await trigger('email');
    if (!isEmailValid || errors.email) return;
    
    if (!showPasswordField) {
      setShowPasswordField(true);
      return;
    }

    try {
      await mutation.mutateAsync(data);
    } catch (error) {
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
          <IconComponent className="w-20 h-20 text-white mb-8 mx-auto lg:mx-0" />
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {content.title}
            <br />
            {content.subtitle}
            {accountType === 'service-seeker' && (
              <>
                <br />
                Instantly.
              </>
            )}
          </h1>
          <p className="text-xl text-gray-200 max-w-lg">
            {content.description}
          </p>
        </div>

        <div className="flex-1 max-w-md w-full">
          <div className="bg-white rounded-2xl py-6 px-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <IconComponent className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {content.accountLabel}
                </span>
              </div>
              <Link 
                href={content.switchLink}
                className="text-xs text-blue-600 hover:underline"
              >
                {content.switchLabel} Signup
              </Link>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{content.formTitle}</h2>
            <p className="text-gray-600 mb-4">{content.formSubtitle}</p>

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

              <p className="text-xs text-gray-500 text-center mt-4">
                By signing up as a {content.accountLabel}, you agree to our{' '}
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
        </div>
      </div>
    </div>
  );
}
