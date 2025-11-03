"use client";
import React from "react";
import { motion } from "framer-motion";

type Props = {
  children?: React.ReactNode;
};
// IPhoneFramePro.tsx
export default function IPhoneFramePro({ children }: Props) {
  return (
   <div>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="relative w-[300px] h-[580px] rounded-[3rem] shadow-[0_0_40px_rgba(190,156,5,0.25)] bg-gray-900 border-[6px] border-gray-600 overflow-visible"
      >
        {/* Reflection */}
        <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-gray-700/20 to-gray-300/10 pointer-events-none" />

        {/* Notch */}
        <div className="absolute z-30 -top-1 left-1/2 -translate-x-1/2 w-[150px] h-[28px] bg-black rounded-b-3xl flex items-center justify-center gap-2">
          <div className="w-10 h-2 rounded-full bg-gray-800" />
          <div className="w-2 h-2 rounded-full bg-gray-700" />
        </div>

        {/* Left-side hardware (mute switch + volume) */}
        <div className="absolute -left-[9px] top-[90px] z-30 flex flex-col items-center gap-3 pointer-events-none">
          {/* Mute switch (horizontal pill) */}

          <div
            role="img"
            aria-label="mute switch"
            title="mute switch"
            className="w-[4px] h-[24px] rounded-l-full bg-gray-700/95 drop-shadow-[0_2px_3px_rgba(0,0,0,0.45)]"
          />

          {/* Volume up */}
          <div
            role="img"
            aria-label="Volume up"
            title="Volume up"
            className="w-[6px] h-[36px] rounded-l-full bg-gray-700/95 drop-shadow-[0_2px_3px_rgba(0,0,0,0.45)]"
          />

          {/* Volume down */}
          <div
            role="img"
            aria-label="Volume down"
            title="Volume down"
            className="w-[6px] h-[36px] rounded-l-full bg-gray-700/90 drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]"
          />
        </div>

        {/* Screen */}
        <div className="absolute inset-[10px] rounded-[2.5rem] overflow-hidden bg-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full h-full"
          >
            {children || (
              <div className="flex items-center justify-center h-full text-gray-500">
                Drop your app preview here
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 w-[120px] h-[5px] bg-gray-300/70 rounded-full" />

        {/* Right-side hardware (power button) */}
        <div className="absolute -right-[8px] top-[150px] z-30 pointer-events-none">
          <div
            role="img"
            aria-label="Power button"
            title="Power button"
            className="w-[5px] h-[86px] rounded-r-full bg-gray-700/95 drop-shadow-[0_2px_3px_rgba(0,0,0,0.45)]"
          />
        </div>

        {/* Subtle animation reflection */}
        <motion.div
          initial={{ opacity: 0.1, x: -50 }}
          animate={{ opacity: 0.3, x: 0 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-[3rem] pointer-events-none"
        />
      </motion.div>
    </div>
  );
}
