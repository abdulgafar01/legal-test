"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import LoadingSpinner from "./LoadingSpinner";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireVerification?: boolean; // New prop to check practitioner verification
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  requireVerification = true,
}) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: userData, isLoading: userLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && requireAuth && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, requireAuth, router]);

  useEffect(() => {
    // Only check verification status if user is authenticated and data is loaded
    if (
      !authLoading &&
      !userLoading &&
      isAuthenticated &&
      userData?.data &&
      requireVerification
    ) {
      const user = userData.data;

      // Check if user is a legal practitioner and needs verification
      if (
        user.user_type === "legal_practitioner" &&
        user.practitioner_profile
      ) {
        const verificationStatus =
          user.practitioner_profile.verification_status;

        if (verificationStatus === "pending") {
          router.push("/pending-review");
          return;
        } else if (verificationStatus === "rejected") {
          router.push("/application-rejected");
          return;
        } else if (verificationStatus === "under_review") {
          router.push("/pending-review");
          return;
        }
        // If verified, continue to render children
      }
    }
  }, [
    authLoading,
    userLoading,
    isAuthenticated,
    userData,
    requireVerification,
    router,
  ]);

  // Show loading spinner while checking auth or user data
  if (authLoading || userLoading) {
    return <LoadingSpinner innerText="Loading..." />;
  }

  // Don't render anything if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <LoadingSpinner innerText="Redirecting to login..." />;
  }

  return <>{children}</>;
};

export default AuthGuard;
