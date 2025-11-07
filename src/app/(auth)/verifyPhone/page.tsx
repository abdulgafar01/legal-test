"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resendPhoneOtp, verifyPhoneOtp } from "@/lib/api/auth";
import { useAccountTypeStore } from "@/stores/useAccountTypeStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/provider/LanguageSwitcher";

const CODE_LENGTH = 6;

type VerificationCodeForm = {
  code: string[];
};

export default function PhoneVerificationPage() {
  const router = useRouter();
  const { accountType } = useAccountTypeStore();
  const { login } = useAuth();
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const t = useTranslations("verifyPhone");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<VerificationCodeForm>({
    defaultValues: {
      code: Array(CODE_LENGTH).fill(""),
    },
    mode: "onChange",
  });

  const codeValues = watch("code");

  // Retrieve stored phone number from localStorage
  useEffect(() => {
    const storedPhone = localStorage.getItem("userPhone");
    if (!storedPhone) {
      toast.error("No phone number found. Please register again.");
      router.push("/signup");
      return;
    }
    setPhoneNumber(storedPhone);

    // Check if there's debug OTP stored (from signup/login)
    const storedDebugOtp = localStorage.getItem("debugOtp");
    const storedDebugMode = localStorage.getItem("debugMode");
    if (storedDebugOtp) {
      setDebugOtp(storedDebugOtp);
      setDebugMode(storedDebugMode === "true");
    }

    firstInputRef.current?.focus();
  }, [router]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Handle input change
  const handleCodeChange = (value: string, index: number) => {
    const newCode = [...codeValues];
    newCode[index] = value.length > 1 ? value[0] : value;
    setValue("code", newCode, { shouldValidate: true });

    if (value && index < CODE_LENGTH - 1) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !codeValues[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Verify phone OTP mutation
  const verifyMutation = useMutation({
    mutationFn: (payload: { phone_number: string; otp_code: string }) =>
      verifyPhoneOtp(payload),
    onSuccess: (data: any) => {
      const tokens = data?.data?.tokens || data?.tokens;
      const user = data?.data?.user || data?.user;
      const isNewUser = data?.data?.is_new_user || data?.is_new_user || false;
      const requiresProfileCompletion =
        data?.data?.requires_profile_completion || false;

      if (tokens?.access && tokens?.refresh) {
        const userPhone = localStorage.getItem("userPhone") || "";
        login(tokens.access, tokens.refresh, userPhone);
      }

      toast.success("Phone number verified successfully! 🎉");

      // Route based on profile completion status
      if (requiresProfileCompletion || isNewUser) {
        // Get user type from backend response (more reliable than local store)
        const userType =
          user?.user_type ||
          localStorage.getItem("pendingUserType") ||
          accountType;

        if (userType === "legal_practitioner") {
          router.push("/onboarding/professionals");
        } else {
          router.push("/onboarding/service-seekers");
        }
      } else {
        // Existing user with complete profile
        router.push("/dashboard");
      }
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data as {
          error?: {
            details?: {
              detail?: string;
              otp_code?: string | string[];
              phone_number?: string | string[];
            };
          };
        };

        const details = errorData?.error?.details;
        const detail = details?.detail;
        const otpError = details?.otp_code;
        const phoneError = details?.phone_number;

        if (detail) {
          toast.error(detail);
        } else if (otpError) {
          const msg = Array.isArray(otpError) ? otpError.join(" ") : otpError;
          toast.error(msg);
        } else if (phoneError) {
          const msg = Array.isArray(phoneError)
            ? phoneError.join(" ")
            : phoneError;
          toast.error(msg);
        } else {
          toast.error("Invalid OTP code. Please try again.");
        }

        // Clear the code inputs
        for (let i = 0; i < CODE_LENGTH; i++) {
          setValue(`code.${i}`, "", { shouldValidate: false });
        }

        firstInputRef.current?.focus();
      } else {
        toast.error("An unexpected error occurred.");
        console.error("Unknown error:", err);
      }
    },
  });

  // Resend OTP mutation
  const resendMutation = useMutation({
    mutationFn: () => resendPhoneOtp(phoneNumber),
    onSuccess: (data) => {
      toast.success(t("otpResent"));

      // Check if debug mode is enabled
      const responseData = data?.data;
      if (responseData?.debug_mode && responseData?.debug_otp) {
        setDebugOtp(responseData.debug_otp);
        setDebugMode(true);
        localStorage.setItem("debugOtp", responseData.debug_otp);
        localStorage.setItem("debugMode", "true");
      }

      setCanResend(false);
      setResendTimer(60);
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
        toast.error(detail || "Failed to resend OTP. Please try again.");
      } else {
        toast.error("Failed to resend OTP.");
      }
    },
  });

  // Submit verification code
  const onSubmit = () => {
    const code = codeValues.join("");

    if (code.length !== CODE_LENGTH) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    if (!phoneNumber) {
      toast.error("Missing phone number. Please register again.");
      return;
    }

    verifyMutation.mutate({ phone_number: phoneNumber, otp_code: code });
  };

  return (
    <>
      <LanguageSwitcher isAbsolute={true} />
      <div
        className="min-h-screen flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              {t("pageTitle")}
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              {t("enterCode")}{" "}
              <span className="font-medium text-gray-900">{phoneNumber}</span>.
            </p>

            {debugMode && debugOtp && (
              <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-700 font-semibold">
                    🔧 DEBUG MODE
                  </span>
                </div>
                <p className="text-sm text-yellow-700 mb-2">
                  SMS sending is disabled. Use this OTP code:
                </p>
                <div className="bg-white p-3 rounded border border-yellow-300">
                  <p className="text-2xl font-bold text-center text-gray-900 tracking-widest">
                    {debugOtp}
                  </p>
                </div>
                <p className="text-xs text-yellow-600 mt-2 text-center">
                  This code is only visible in development mode
                </p>
              </div>
            )}

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
                    value={codeValues[index] || ""}
                    className="w-12 h-12 text-center text-lg font-semibold"
                    aria-label={`Digit ${index + 1}`}
                    ref={index === 0 ? firstInputRef : null}
                  />
                ))}
              </div>

              {resendTimer > 0 && (
                <p className="text-center text-sm text-gray-500">
                  {t("resendIn", { resendTimer })}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium cursor-pointer"
                disabled={!isValid || verifyMutation.isPending}
              >
                {verifyMutation.isPending
                  ? t("Verifying")
                  : t("Verify Phone Number")}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-600 hover:underline"
                  onClick={() => resendMutation.mutate()}
                  disabled={!canResend || resendMutation.isPending}
                >
                  {resendMutation.isPending ? t("Resending") : t("Resend OTP")}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/signup"
                className="text-sm text-gray-600 hover:underline"
              >
                {t("Wrong number? Go back to signup")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
