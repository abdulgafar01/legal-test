"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";

/**
 * Layout for Zoom meeting pages
 * Only includes the navigation bar, no sidebar or other dashboard elements
 */
export default function MeetingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex flex-col h-screen w-full overflow-hidden">
        {/* Navigation bar only */}
        <Navbar isMobile={false} showMobileMenu={false} toggleSidebar={() => {}} />
        
        {/* Meeting content fills remaining space */}
        <main className="flex-1 w-full min-h-0 overflow-hidden">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
