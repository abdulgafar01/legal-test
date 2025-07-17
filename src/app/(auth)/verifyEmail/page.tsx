'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccountTypeStore } from "@/stores/useAccountTypeStore";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
  const router = useRouter();
  const { accountType } = useAccountTypeStore();

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const updatedCode = [...codeDigits];
      updatedCode[index] = value;
      setCodeDigits(updatedCode);

      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (codeDigits[index] === "") {
        const prevInput = document.getElementById(`code-${index - 1}`);
        prevInput?.focus();
      }
    }
  };

const handleVerify = () => {
  const code = codeDigits.join('');
  
  if (code.length === 6) {
    if (accountType === 'professional') {
      router.push('/onboarding/professionals');
    } else if (accountType === 'service-seeker') {
      router.push('/onboarding/service-seekers');
    } else {
      // fallback or guest route (optional)
      router.push('/signup');
    }
  }
};

  const handleBack = () => {
    router.back();
  };

  const isCodeComplete = codeDigits.every((digit) => digit !== "");

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="relative z-10 w-full max-w-md">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="absolute -top-16 left-0 text-white flex items-center gap-2 hover:text-gray-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">We sent you a mail.</h2>
          <p className="text-gray-600 mb-8 text-center">
            Enter the 6-digit verification code sent to{" "}
            <span className="font-medium text-gray-500">toluwanimi544@gmail.com</span>.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
            className="space-y-6"
          >
            <div className="flex justify-center gap-3">
              {codeDigits.map((digit, index) => (
                <Input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold"
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium cursor-pointer"
              disabled={!isCodeComplete}
            >
              Verify
            </Button>

            <div className="text-center">
              <Button type="button" variant="link" className="text-blue-600 hover:underline">
                Resend Mail
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
