'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { Scale, MessageCircle, LogOut, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

import { assets } from '@/assets/assets';
import SidebarLinks from './Sidebar-Links';
import ChatLabel from './ChatLabel';
import { Button } from './ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  expand: boolean;
  isMobile: boolean;
  showMobileMenu: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  expand,
  isMobile,
  showMobileMenu,
  toggleSidebar,
}) => {

   const { data: user, isLoading, error, refetch } = useCurrentUser();
   const { logout } = useAuth();
   const router = useRouter();
   const queryClient = useQueryClient();

   const handleLogout = () => {
     logout();
     toast.success('Successfully logged out');
   };

   const handleRefreshUser = () => {
     queryClient.invalidateQueries({ queryKey: ['currentUser'] });
     refetch();
     toast.success('User data refreshed');
   };

  console.log("=== USER DEBUG INFO ===");
  console.log("Raw user data:", user);
  console.log("User first_name:", user?.data?.first_name);
  console.log("User last_name:", user?.data?.last_name);
  console.log("User email:", user?.data?.email);
  console.log("User ID:", user?.data?.id);
  console.log("isLoading:", isLoading);
  console.log("error:", error);
  console.log("LocalStorage email:", typeof window !== 'undefined' ? localStorage.getItem('userEmail') : 'N/A');
  console.log("========================");
  
  // Don't render sidebar if no token exists
  if (typeof window !== 'undefined' && !localStorage.getItem('accessToken')) {
    return null;
  }
  
  const sidebarBaseClasses =
    'flex flex-col bg-orange-50 pt-7 transition-all z-50 h-screen';

  const mobileClasses = clsx(
    'fixed p-4 inset-y-0 left-0 transform transition-transform duration-300 w-64',
    showMobileMenu ? 'translate-x-0' : '-translate-x-full'
  );

  const desktopClasses = clsx(
    'hidden md:flex transition-all',
    expand ? 'p-4 w-64' : 'w-20'
  );

  const toggleTooltipClass = clsx(
    'absolute w-max opacity-0 group-hover:opacity-100 transition bg-amber-200 text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none',
    expand ? 'left-1/2 -translate-x-1/2 top-12' : '-top-12 left-0'
  );

  return (
    <div className={clsx(sidebarBaseClasses, isMobile ? mobileClasses : desktopClasses)}>
      {/* --- Top Content --- */}
      <div>
        {/* --- Brand + Toggle --- */}
        <div className={clsx('flex', expand ? 'flex-row gap-10' : 'flex-col items-center gap-8')}>
          <Link href="/">
            <div className={expand ? 'w-36' : 'w-10'}>
              {expand ? (
                <div className="flex gap-1.5 items-center">
                  <Scale className="text-yellow-500" />
                  <p className="text-black text-lg font-semibold">Legal AI</p>
                </div>
              ) : (
                <Scale className="text-yellow-500" />
              )}
            </div>
          </Link>

          {/* Toggle Sidebar */}
          <div
            onClick={toggleSidebar}
            className={clsx(
              'cursor-pointer transition-all duration-300 rounded-lg',
              isMobile
                ? 'p-2 hover:bg-amber-100'
                : 'group relative flex items-center justify-center hover:bg-gray-500/20 h-9 w-9'
            )}
          >
            {isMobile ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <>
                <Image
                  src={expand ? assets.sidebar_close_icon : assets.sidebar_icon}
                  alt="Toggle sidebar"
                  className="w-7"
                />
                <div className={toggleTooltipClass}>
                  {expand ? 'Close Sidebar' : 'Open Sidebar'}
                  <div
                    className={clsx(
                      'w-3 h-3 absolute bg-amber-200 rotate-45',
                      expand ? 'left-1/2 -top-1.5 -translate-x-1/2' : 'left-4 -bottom-1.5'
                    )}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* --- Navigation Links --- */}
        <div className="mt-2 text-white/25 text-sm">
          <SidebarLinks expand={expand} isMobile={isMobile} toggleSidebar={toggleSidebar} />
        </div>

        {/* --- New Chat Button --- */}
        <button
          className={clsx(
            'mt-2 flex items-center cursor-pointer text-gray-700',
            expand
              ? 'hover:bg-amber-100 hover:opacity-90 rounded-lg gap-2 px-3 py-2 w-full'
              : 'group relative w-5 mx-auto hover:bg-amber-100 rounded-lg'
          )}
        >
          <MessageCircle className="h-4" />
          {!expand && (
            <div className="absolute w-max -top-12 -right-12 opacity-0 group-hover:opacity-100 transition bg-amber-100 text-gray-800 text-xs px-3 py-2 rounded-lg shadow-lg pointer-events-none">
              New Chat
              <div className="w-3 h-3 absolute bg-amber-100 rotate-45 left-4 -bottom-1.5" />
            </div>
          )}
          {expand && <p className="text-xs font-medium">New Chat</p>}
        </button>
      </div>

      {/* --- Scrollable Chat History Only --- */}
      {expand && (
        <div className="mt-4 flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto pr-1">
            <ChatLabel />
          </div>
        </div>
      )}

      {/* --- Fixed Bottom User Info --- */}
      <div
        className={clsx(
          'text-black text-sm mt-2',
          expand ? 'hover:bg-white/10 rounded-lg' : 'justify-center w-full'
        )}
      >
        {expand && (
          <div className="p-4 border-t border-gray-200 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-orange-800">
                    {isLoading ? '...' : error ? '!' : (user?.data?.first_name?.slice(0,2).toUpperCase() || 'U')}
                  </span>
                </div>
                <div>
                  {isLoading ? (
                    <div className='text-xs text-gray-500'>Loading...</div>
                  ) : error ? (
                    <div className='text-xs text-red-500'>Please log in again</div>
                  ) : (
                    <>
                      <div className="text-xs font-medium text-gray-900">{user?.data.first_name} {user?.data.last_name}</div>
                      <div className="text-[10px] text-gray-500">{user?.data.email}</div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={handleRefreshUser} 
                  title='Refresh User Data' 
                  className='p-2 rounded-md hover:bg-amber-100 cursor-pointer'
                >
                  <RefreshCw className='w-3 h-3 text-gray-600' />
                </button>
                <button onClick={handleLogout} title='Logout' className='p-2 rounded-md hover:bg-amber-100 cursor-pointer'>
                  <LogOut className='w-4 h-4 text-gray-600' />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
