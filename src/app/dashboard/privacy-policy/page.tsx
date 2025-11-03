"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PrivacyPolicyRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/privacy");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Redirecting to Privacy Policy...</p>
    </div>
  );
}
