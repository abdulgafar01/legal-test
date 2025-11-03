"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Redirect from old meeting route to new standalone meeting page
 * This maintains backward compatibility for any existing links
 */
export default function MeetingRedirect() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const consultationId = params.id;
    if (consultationId) {
      router.replace(`/meeting/${consultationId}`);
    }
  }, [params.id, router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
}

