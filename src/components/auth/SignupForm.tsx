"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Scale, User } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerUser, requestPhoneOtp } from "@/lib/api/auth";
import { toast } from "sonner";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useLocale, useTranslations } from "next-intl";

type FormValues = {
  email: string;
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
};

type AccountType = "professional" | "service-seeker";

interface SignupFormProps {
  accountType: AccountType;
}

export default function SignupForm({ accountType }: SignupFormProps) {

  // change direction alignment with respect to language
  const locale = useLocale();
  const direction = locale === "ar" ? "rtl" : "ltr";
  const isRTL = locale === "ar";

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [usePhone, setUsePhone] = useState(false);
  const t = useTranslations("signUp");

  const getContentByAccountType = () => {
    if (accountType === "professional") {
      return {
        icon: Scale,
        title: t("professionalTitle"),
        subtitle: t("professionalSubTitle"),
        description: t("professionalDescription"),
        formTitle: t("professionalFormTitle"),
        formSubtitle: t("professionalFormSubTitle"),
        accountLabel: t("professionalAccountLabel"),
        switchLabel: t("seekerAccountLabel"),
        switchLink: "/signup/seeker",
      };
    } else {
      return {
        icon: User,
        title: t("seekerTitle"),
        subtitle: t("seekerSubTitle"),
        description: t("seekerDescription"),
        formTitle: t("seekerFormTitle"),
        formSubtitle: t("seekerFormSubTitle"),
        accountLabel: t("seekerAccountLabel"),
        switchLabel: t("professionalAccountLabel"),
        switchLink: "/signup/practitioner",
      };
    }
  };

  const content = getContentByAccountType();
  const IconComponent = content.icon;

  // Clear any existing auth tokens when component mounts
  useEffect(() => {
    // Clear old/invalid tokens to prevent authentication errors on public endpoints
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange" });

  const email = watch("email");
  const password = watch("password");

  // Phone OTP mutation
  const phoneOtpMutation = useMutation({
    mutationFn: async () => {
      const user_type =
        accountType === "professional"
          ? "legal_practitioner"
          : "service_seeker";
      return requestPhoneOtp({
        phone_number: phoneNumber,
        user_type,
        is_signup: true, // This is a signup attempt, not login
      });
    },
    onSuccess: (data) => {
      toast.success("OTP sent successfully!");

      // Store phone and user type for verification page
      localStorage.setItem("userPhone", phoneNumber);
      localStorage.setItem("pendingPhone", phoneNumber);
      localStorage.setItem(
        "pendingUserType",
        accountType === "professional" ? "legal_practitioner" : "service_seeker"
      );

      // Check if debug mode is enabled and store debug OTP
      const responseData = data?.data;
      if (responseData?.debug_mode && responseData?.debug_otp) {
        localStorage.setItem("debugOtp", responseData.debug_otp);
        localStorage.setItem("debugMode", "true");
      } else {
        localStorage.removeItem("debugOtp");
        localStorage.removeItem("debugMode");
      }

      // Navigate to phone verification page
      router.push("/verifyPhone");
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data as {
          error?: {
            details?: {
              detail?: string;
              phone_number?: string | string[];
            };
          };
          message?: string;
        };

        // Check for phone_number specific error first
        const phoneError = errorData?.error?.details?.phone_number;
        if (phoneError) {
          const msg = Array.isArray(phoneError) ? phoneError[0] : phoneError;
          toast.error(msg);
          return;
        }

        // Then check for general detail error
        const detailError = errorData?.error?.details?.detail;
        if (detailError) {
          toast.error(detailError);
          return;
        }

        // Finally use message or fallback
        const errorMessage = errorData?.message || "Failed to send OTP";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to send OTP");
      }
    },
  });

  // Email/Password mutation
  const mutation = useMutation({
    mutationFn: async (formData: FormValues) => {
      const payload = {
        email: formData.email,
        phone_number: phoneNumber || undefined,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        user_type:
          accountType === "professional"
            ? "legal_practitioner"
            : "service_seeker",
      };
      return registerUser(payload);
    },
    onSuccess: (data, variables) => {
      toast.success("Account created successfully!", data.message);
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      if (variables.email) {
        localStorage.setItem("userEmail", variables.email);
      }
      router.push("/verifyEmail");
      console.log("Registration successful:", data);
    },
    onError: (err: unknown) => {
      if (!axios.isAxiosError(err)) {
        toast.error("Unexpected error occurred. Please try again.");
        return;
      }
      if (axios.isAxiosError(err)) {
        if (err.message === "Network Error") {
          toast.error("Network error - please check your internet connection");
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
            ? details.email.join(" ")
            : details.email;
          setError("email", { type: "server", message: msg });
          toast.error(msg);
        }

        if (details?.password) {
          const msg = Array.isArray(details.password)
            ? details.password.join(" ")
            : details.password;
          setError("password", { type: "server", message: msg });
          toast.error(msg);
        }

        if (details?.confirm_password) {
          const msg = Array.isArray(details.confirm_password)
            ? details.confirm_password.join(" ")
            : details.confirm_password;
          setError("confirmPassword", { type: "server", message: msg });
          toast.error(msg);
        }

        if (
          !detail &&
          !details?.email &&
          !details?.password &&
          !details?.confirm_password
        ) {
          toast.error("Server did not return a specific error message.");
        }
      }
    },
  });

  const onSubmit = async (data: FormValues) => {
    // Validate: at least one of email or phone must be provided
    if (!data.email && !phoneNumber) {
      toast.error("Please provide either email or phone number");
      return;
    }

    // If using phone number, skip password and go straight to OTP
    if (usePhone && phoneNumber) {
      try {
        await phoneOtpMutation.mutateAsync();
      } catch (error) {
        console.error("Phone OTP error:", error);
      }
      return;
    }

    // Email flow - validate email first
    if (data.email && !usePhone) {
      const isEmailValid = await trigger("email");
      if (!isEmailValid || errors.email) return;
    }

    // Show password fields for email signup
    if (!showPasswordField) {
      setShowPasswordField(true);
      return;
    }

    // Submit email signup
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-slate-800 relative"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs"></div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl mx-auto relative z-10">
        <div className={`flex-1 text-center lg:${isRTL ? "text-right" : "text-left"} max-w-xl`}>
          <IconComponent className="w-20 h-20 text-white mb-8 mx-auto lg:mx-0" />
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {content.title}
            <br />
            {content.subtitle}
            {accountType === "service-seeker" && (
              <>
                <br />
                {/* Instantly. */}
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

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {content.formTitle}
            </h2>
            <p className="text-gray-600 mb-4">{content.formSubtitle}</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {!showPasswordField ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("Email")}
                    </label>
                    <Input
                      type="email"
                      placeholder={t("Enter your email")}
                      disabled={usePhone}
                      {...register("email", {
                        required: !usePhone ? "Email is required" : false,
                        pattern: !usePhone
                          ? {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Invalid email address",
                            }
                          : undefined,
                      })}
                      onBlur={() => !usePhone && trigger("email")}
                      className={`w-full ${
                        errors.email ? "border-red-500" : "border-yellow-400"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-sm text-gray-500">OR</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("Phone Number")}
                    </label>
                    <div style={{ width: "100%", position: "relative" }} dir="ltr">
                      <PhoneInput
                        international
                        defaultCountry="KW"
                        value={phoneNumber}
                        onChange={(value) => {
                          setPhoneNumber(value || "");
                          setUsePhone(!!value);
                        }}
                        disabled={!!email && !usePhone}
                        className="PhoneInput"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {usePhone ? phoneNumber : email}
                </p>
              )}

              {showPasswordField && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("Password")}
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("Enter your password")}
                        {...register("password", {
                          required: t("Password is required"),
                          minLength: {
                            value: 8,
                            message: t("passwordCharacters"),
                          },
                        })}
                        className="w-full pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("Confirm Password")}
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t("Confirm your password")}
                        {...register("confirmPassword", {
                          validate: (value) =>
                            value === password || t("Passwords do not match"),
                        })}
                        className="w-full pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
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
                disabled={mutation.isPending || phoneOtpMutation.isPending}
              >
                {mutation.isPending || phoneOtpMutation.isPending
                  ? t("Loading")
                  : usePhone && phoneNumber
                  ? t("Send OTP")
                  : showPasswordField
                  ? t("Sign Up")
                  : t("Continue")}
              </Button>

              <div className="text-center">
                <span className="text-gray-500">
                  {t("Already have an account?")}{" "}
                </span>
                <Link
                  href="/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  {t("Sign in")}
                </Link>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                By signing up as a {content.accountLabel}, you agree to our{" "}
                <Link href="/terms" className="underline">
                  Terms and Conditions of Use
                </Link>{" "}
                and our{" "}
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
