import { Button } from '@/components/ui/button';
import { Scale } from 'lucide-react';
import Link from 'next/link';

const page = () => {
  return (
    <div 
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-yellow-50 flex flex-col"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Background blur effects and overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm">
        <div className="z-1 absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main content - grows to take available space */}
      <div className="relative z-10 flex-grow flex items-center justify-center p-4">
        <div className="text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mb-6 shadow-lg">
            <Scale className="w-8 h-8 text-white" />
          </div>

          <header className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4">
              TheYAS
              <span className="text-yellow-400"> Law</span>
            </h1>
            
            <div className="text-white text-4xl lg:text-6xl font-bold mb-6">
              Coming Soon
            </div>
          <Link href="/account">
          <Button className='bg-gradient-to-br from-amber-400 to-amber-600 text-gray-50 cursor-pointer hover:bg-amber-400  rounded-md p-2'>Get Started</Button>
          </Link>
          </header>
        </div>
      </div>

      {/* Footer - stays at bottom */}
      <footer className="relative z-10 text-center py-4 ">
        <p className="text-gray-200 text-md">
          © 2025 TheYAS Law. Site under construction
        </p>
      </footer>
    </div>
  );
};

export default page;