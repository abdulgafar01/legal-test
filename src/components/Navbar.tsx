import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Link from 'next/link';


interface NavbarProps {
    isMobile: boolean;
    showMobileMenu: boolean;
    toggleSidebar: () => void;
}

const Navbar = ({ isMobile, showMobileMenu, toggleSidebar }: NavbarProps) => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [searchQuery, setSearchQuery] = useState('');
  // const router = useRouter();

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (searchQuery.trim()) {
  //     router.push(`/chat?query=${encodeURIComponent(searchQuery)}`);
  //   }
  // };

  return (
    <header className="w-full sticky top-0 z-20 bg-orange-50 border-b border-l border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Mobile Menu Button - only shown on mobile */}
            {isMobile && (
                <button 
                    className="p-2 rounded-md hover:bg-amber-100 cursor-pointer"
                    onClick={toggleSidebar}
                    aria-label="Toggle menu"
                    aria-expanded={showMobileMenu}
                >
                    {/* <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showMobileMenu ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg> */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
            )}
        
        {/* professional button */}
        <Link href='/dashboard/professionals'>
          <Button className='bg-amber-200 rounded-xl text-black hover:bg-amber-100 cursor-pointer'>
            Get a professional
          </Button>

        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Toggle Switch */}
          <div className="flex items-center bg-green-500 rounded-full p-1 cursor-pointer">
        
          </div>

          {/* Notification Bell */}
          <Button variant="ghost" size="sm" className="relative p-2 bg-gray-100 rounded-3xl">
            <Bell className="h-5 w-5 text-gray-600 " />
            {/* <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span> */}
          </Button>

          {/* User Avatar */}
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src="/" 
              alt="User avatar"
            />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
              U
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>

   
  );
};

export default Navbar;