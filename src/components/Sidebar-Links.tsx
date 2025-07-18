'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { assets } from '@/assets/assets';
import Image, { StaticImageData } from 'next/image';
import React from 'react';

// Type for each sidebar link
interface SidebarLink {
  title: string;
  icon: StaticImageData;
  href: string;
  isActive?: boolean; // optional if not all links use it
}

// Props for the SidebarLinks component
interface SidebarLinksProps {
  expand: boolean;
  isMobile: boolean;
  toggleSidebar?: () => void;
}

const links: SidebarLink[] = [
  {
    title: 'Explore',
    icon: assets.explore,
    href: '/dashboard',
    isActive: true,
  },
  {
    title: 'Legal AI',
    icon: assets.sparkles,
    href: '/dashboard/chat',
  },
  {
    title: 'Consultation',
    icon: assets.briefcase,
    href: '/dashboard/consultation',
  },
];

export default function SidebarLinks({
  expand,
  isMobile,
  toggleSidebar,
}: SidebarLinksProps) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.title}
            href={link.href}
            onClick={() => {
              if (isMobile && toggleSidebar) {
                toggleSidebar();
              }
            }}
            className={clsx(
              'flex mb-2 gap-3 text-xs font-semibold text-gray-700 rounded-lg transition-colors hover:bg-amber-100 hover:text-gray-900',
              {
                'bg-amber-100': isActive,
                'px-3 py-2': expand,
                'p-2 m-4': !expand,
              }
            )}
          >
            {expand ? (
              <>
                <Image src={link.icon} alt={link.title} className="w-4 h-4" />
                <p>{link.title}</p>
              </>
            ) : (
              <Image
                src={link.icon}
                alt={link.title}
                className="w-4 h-4 mx-auto"
              />
            )}
          </Link>
        );
      })}
    </>
  );
}
