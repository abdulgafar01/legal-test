"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "../LanguageSwitcher";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    // Ensure we return to homepage after logout
    router.push("/");
  };
  return (
    <header className="w-full bg-white/90 backdrop-blur border-b border-gray-200 sticky top-0 z-40 font-nunito">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">
        <Link
          href="#home"
          className="text-2xl font-extrabold tracking-tight text-black"
        >
          TheYAS<span className="text-gradient-gold">Law</span>
        </Link>
        <LanguageSwitcher />
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-black transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-black/80 hover:text-black"
              >
                Login
              </Link>
              <Link href="/account" className="btn-primary text-sm">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-black/80 hover:text-black"
              >
                Go to Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-secondary text-sm">
                Logout
              </button>
            </>
          )}
        </div>
        <button
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
          className="md:hidden ml-auto text-black p-2 cursor-pointer"
        >
          {open ? (
            <FaTimes className="text-3xl" />
          ) : (
            <FaBars className="text-3xl" />
          )}
        </button>
      </div>
        {/* Mobile menu */}
      <AnimatePresence >
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 15,
            }}
            className="h-screen"
          >
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 mt-6">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="text-2xl font-semibold text-gray-800 transition-all duration-300"
                >
                  {item.label}
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 flex gap-4 flex-col"
            >
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="w-full text-center py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition-all font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="w-full text-center py-3 rounded-xl btn-secondary text-smtransition-all"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="w-full text-center py-3 rounded-xl btn-secondary text-sm transition-all font-medium"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="w-full py-3 rounded-xl btn-secondary text-sm transition-all"
                  >
                    Logout
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
