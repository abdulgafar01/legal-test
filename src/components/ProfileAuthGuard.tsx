"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface ProfileAuthGuardProps {
  children: React.ReactNode;
}

const ProfileAuthGuard: React.FC<ProfileAuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return <LoadingSpinner innerText="Loading..." />;
  }

  // Don't render anything if user is not authenticated
  if (!isAuthenticated) {
    return <LoadingSpinner innerText="Redirecting to login..." />;
  }

  return <>{children}</>;
};

export default ProfileAuthGuard;
