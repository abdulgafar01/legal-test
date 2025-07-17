'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { assets } from '@/assets/assets';
import Image from 'next/image';

const links = [
  {
    title: "Explore",
    icon: assets.explore,
    isActive: true,
    href: "/dashboard"
  },
  {
    title: "Legal AI",
    icon: assets.sparkles,
    href: "/dashboard/chat"
  },
  {
    title: "Consultation",
    icon: assets.briefcase,
    href: "/dashboard/consultation"
  },
];


export default function SidebarLinks({ expand, isMobile, toggleSidebar }:any) {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const icon = link.icon;
        return (
            
          <Link
            key={link.title}
            href={link.href}
            onClick={() => {
              if (isMobile && toggleSidebar) toggleSidebar();
            }}
            className={clsx(
              'flex mb-2 gap-3  text-xs font-semibold text-gray-700 rounded-lg transition-colors hover:bg-amber-100 hover:text-gray-900',
              {
                'bg-amber-100': pathname === link.href,
                'px-3 py-2': expand,      
                'p-2 m-4': !expand, 
                
              },
            ) }
          >
            {
                expand ?
                <>
                <Image src={icon}  alt='' className="w-4 h-4" />
                <p className="">{link.title}</p>
                </> :
                 <Image src={icon}  alt='' className="w-4 h-4 mx-auto" />
            }
          </Link>
         
        );
      })}
    </>
  );
}
