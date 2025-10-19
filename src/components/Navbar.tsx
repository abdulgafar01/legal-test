"use client";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { useCurrentUser, useProfileImage } from "@/hooks/useCurrentUser";
import { useState } from "react";
import Notifications from "./Notifications";

interface NavbarProps {
  isMobile: boolean;
  showMobileMenu: boolean;
  toggleSidebar: () => void;
}

const Navbar = ({ isMobile, showMobileMenu, toggleSidebar }: NavbarProps) => {
  const { data: user } = useCurrentUser();
  const { data: profileImage } = useProfileImage();
  const userType = (user as any)?.data?.user_type || (user as any)?.user_type;
  const hasPractitionerProfile = Boolean(
    (user as any)?.data?.practitioner_profile
  );
  const isPractitioner =
    userType === "legal_practitioner" ||
    userType === "professional" ||
    hasPractitionerProfile;
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <>
      <header className="w-full sticky top-0 z-20 bg-orange-50 border-b border-l border-gray-200 px-6 py-3">
        <div className="flex items-center max-w-7xl mx-auto">
          {/* Mobile Menu Button - only shown on mobile */}
          {isMobile && (
            <button
              className="p-2 rounded-md hover:bg-amber-100 cursor-pointer"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
              aria-expanded={showMobileMenu}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          {/* professional button (hidden for practitioner accounts only) */}
          {!isPractitioner && (
            <Link href="/dashboard/professionals">
              <Button className="bg-amber-200 rounded-xl text-black hover:bg-amber-100 cursor-pointer ml-2">
                Get a professional
              </Button>
            </Link>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Notification Bell */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 bg-amber-100 rounded-3xl hover:bg-amber-200 cursor-pointer"
              onClick={() => setNotificationOpen(true)}
            >
              <Bell className="h-5 w-5 text-gray-600 " />
              {/* this to indicate when there is a notification */}
              <span className="absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full"></span>
            </Button>

            {/* User Info with Profile Button (moved from sidebar) */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/profile"
                  title="View Profile"
                  className="cursor-pointer p-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={profileImage?.data.profile_image_url}
                      alt="User avatar"
                    />
                    <AvatarFallback className="bg-amber-200 text-amber-900 text-sm font-medium p-2">
                      {user?.data?.first_name?.slice(0, 1).toUpperCase() || ""}
                      {user?.data?.last_name?.slice(0, 1).toUpperCase() || ""}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                {!isMobile && (
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {user?.data?.first_name} {user?.data?.last_name}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {user?.data?.email}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <Notifications
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </>
  );
};

export default Navbar;
