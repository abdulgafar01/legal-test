"use client";
import { useAccountTypeStore } from '@/stores/useAccountTypeStore';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowDown, Scale, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { setAccountType } = useAccountTypeStore();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 bg-slate-800 relative"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the account selection if user is authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-slate-800 relative"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Account Type Selection */}
        <div className="mb-8">
          <p className="text-white text-lg mb-6 flex items-center justify-center gap-2">
            Create account as 
            {/* <span className="text-amber-400">↓</span> */}
            <ArrowDown className='text-amber-400'
            />
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-8">
              {/* Professional Card */}
              <Link href="/signup" passHref>
                <div
                  className="bg-transparent backdrop-blur-sm border border-gray-700 rounded-lg w-3xs p-4 hover:border-amber-400/50 transition-colors cursor-pointer"
                  onClick={() => setAccountType('professional')}
                >
                  <Scale className="w-17 h-17 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">Professional</h3>
                  <p className="text-gray-400 text-sm mb-6 text-center">
                    I&apos;m a certified lawyer and want to offer my services.
                  </p>
                </div>
              </Link>

            {/* Service Seeker Card */}
            <Link href="/signup" passHref>
            <div className="bg-transparent backdrop-blur-sm border border-gray-700 rounded-lg w-3xs p-4 hover:border-amber-400/50 transition-colors"
            onClick={() => setAccountType('service-seeker')}
            >
              <User className="w-17 h-17 text-slate-400 mx-auto mb-4" />
              <h3 className="text-2xl  font-semibold text-white mb-3">Service Seeker</h3>
              <p className="text-gray-400 text-sm mb-6">
                I want to get a certified lawyer or I want to use the legal AI
              </p>
              {/* <Link href="/signup">
               
              </Link> */}
            </div>

            </Link>
          </div>
        </div>
        
        {/* Bottom Actions */}
        <div className="flex flex-col md:flex-row items-center  justify-between max-w-md mx-auto">
    
          <Link href='/chat'
            className='text-gray-400' 
            onClick={() => setAccountType('guest')}      
            >
           Continue As Guest
          </Link>
          <Link href='/login'
            className='text-gray-100'       
            >
           Login
          </Link>
        </div>
      </div>
    </div>
  );
}