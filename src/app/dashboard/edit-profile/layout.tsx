"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProfileAuthGuard from "@/components/ProfileAuthGuard";

const EditProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const [expand, setExpand] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's 'md' breakpoint
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setShowMobileMenu(!showMobileMenu);
    } else {
      setExpand(!expand);
    }
  };

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    if (!isMobile) {
      setShowMobileMenu(false);
    }
  }, [isMobile]);

  return (
    <ProfileAuthGuard>
      <div className="flex  max-h-screen">
        <main className="flex-1 flex flex-col pb-8 bg-white text-black relative overflow-hidden">
          <Navbar
            isMobile={isMobile}
            showMobileMenu={showMobileMenu}
            toggleSidebar={toggleSidebar}
          />
          <div>{children}</div>
        </main>
      </div>
    </ProfileAuthGuard>
  );
};

export default EditProfileLayout;
