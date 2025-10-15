"use client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";

const Layout = ({ children }: { children: React.ReactNode }) => {
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
    <AuthGuard>
      <div className="flex max-h-screen">
        <Sidebar
          expand={expand}
          // setExpand={setExpand}
          isMobile={isMobile}
          showMobileMenu={showMobileMenu}
          toggleSidebar={toggleSidebar}
        />
  <main className="flex-1 flex flex-col  bg-white text-black relative overflow-hidden min-h-0">
          <Navbar
            isMobile={isMobile}
            showMobileMenu={showMobileMenu}
            toggleSidebar={toggleSidebar}
          />
          <div className="flex-1 overflow-hidden">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default Layout;
