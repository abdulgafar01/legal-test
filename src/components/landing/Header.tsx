"use client";
import Link from 'next/link';
import { useState } from 'react';

const navItems = [
  { href: '#home', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="w-full bg-white/90 backdrop-blur border-b border-gray-200 sticky top-0 z-40 font-nunito">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">
        <Link href="#home" className="text-2xl font-extrabold tracking-tight text-black">
          TheYAS<span className="text-gradient-gold">Law</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
          {navItems.map(item => (
            <a key={item.href} href={item.href} className="hover:text-black transition-colors">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-black/80 hover:text-black">Login</Link>
          <Link href="/account" className="btn-primary text-sm">Get Started</Link>
        </div>
        <button aria-label="Menu" onClick={() => setOpen(o=>!o)} className="md:hidden ml-auto text-black p-2">
          <span className="block w-6 h-0.5 bg-black mb-1" />
          <span className="block w-6 h-0.5 bg-black mb-1" />
          <span className="block w-6 h-0.5 bg-black" />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-6 pb-4 space-y-3">
          {navItems.map(item => (
            <a key={item.href} href={item.href} onClick={()=>setOpen(false)} className="block text-sm font-medium text-gray-700">
              {item.label}
            </a>
          ))}
          <div className="pt-2 flex gap-3">
            <Link href="/login" className="flex-1 btn-secondary text-center text-sm">Login</Link>
            <Link href="/account" className="flex-1 btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      )}
    </header>
  );
}
