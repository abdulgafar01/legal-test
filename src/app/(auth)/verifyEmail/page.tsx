'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resendVerificationCode, verifyEmail } from '@/lib/api/auth';
import { useAccountTypeStore } from '@/stores/useAccountTypeStore';
import { useMutation } from '@tanstack/react-query';
import axios  from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const CODE_LENGTH = 6;

type VerificationCodeForm = {
  code: string[];
};

export default function VerificationPage() {
  const router = useRouter();
  const { accountType } = useAccountTypeStore();
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<VerificationCodeForm>({
    defaultValues: {
      code: Array(CODE_LENGTH).fill(''),
    },
    mode: 'onChange',
  });

  const codeValues = watch('code');

  // Retrieve stored email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (!storedEmail) {
      toast.error('No email found. Please register again.');
      router.push('/signup');
      return;
    }
    setEmail(storedEmail);
    firstInputRef.current?.focus();
  }, [router]);

  // Handle input change
  const handleCodeChange = (value: string, index: number) => {
    const newCode = [...codeValues];
    newCode[index] = value.length > 1 ? value[0] : value;
    setValue('code', newCode, { shouldValidate: true });

    if (value && index < CODE_LENGTH - 1) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !codeValues[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Verify email mutation
  const verifyMutation = useMutation({
    mutationFn: (payload: 
      { email: string;   verification_code: string }) => verifyEmail(payload),
    onSuccess: () => {
      toast.success('Email verified successfully!');
      if (accountType === 'professional') {
        router.push('/onboarding/professionals');
      } else if (accountType === 'service-seeker') {
        router.push('/onboarding/service-seekers');
      } else {
        router.push('/signup');
      }
    },


     onError: (err: unknown) => {
  if (axios.isAxiosError(err)) {
    const errorData = err.response?.data as {
      error?: {
        details?: {
          detail?: string;
        };
      };
    };

    const detail = errorData?.error?.details?.detail;

    if (detail) {
      toast.error(detail);
    } else {
      toast.error('Server did not return a specific error message.');
    }

    for (let i = 0; i < CODE_LENGTH; i++) {
      setValue(`code.${i}`, '', { shouldValidate: false });
    }

    firstInputRef.current?.focus();
  } else {
    toast.error('An unexpected error occurred.');
    console.error("Unknown error:", err);
  }
},



  });

  // Resend code mutation
  const resendMutation = useMutation({
    mutationFn: () => resendVerificationCode(email),
    onSuccess: () => toast.success('Verification code resent successfully.'),
    onError: () => toast.error('Failed to resend verification code.'),
  });

  // Submit verification code
  const onSubmit = () => {
    const code = codeValues.join('');
    console.log('Sending verification code:', code, 'to email:', email);
    
    if (code.length !== CODE_LENGTH) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    if (!email) {
      toast.error('Missing email. Please register again.');
      return;
    }

    verifyMutation.mutate({ email, verification_code: code });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">We sent you a mail.</h2>
          <p className="text-gray-600 mb-8 text-center">
            Enter the 6-digit verification code sent to{' '}
            <span className="font-medium text-gray-500">{email}</span>.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center gap-3">
              {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                <Input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  {...register(`code.${index}`, {
                    required: true,
                    pattern: /^[0-9]$/,
                  })}
                  onChange={(e) => handleCodeChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  value={codeValues[index] || ''}
                  className="w-12 h-12 text-center text-lg font-semibold"
                  aria-label={`Digit ${index + 1}`}
                  ref={index === 0 ? firstInputRef : null}
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium cursor-pointer"
              disabled={!isValid || verifyMutation.isPending}
            >
              {verifyMutation.isPending ? 'Verifying...' : 'Verify'}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-blue-600 hover:underline"
                onClick={() => resendMutation.mutate()}
                disabled={resendMutation.isPending}
              >
                {resendMutation.isPending ? 'Resending...' : 'Resend code'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
