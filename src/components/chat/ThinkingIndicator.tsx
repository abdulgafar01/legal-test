"use client";

import React from "react";

const BAR_DELAYS = [0, 0.1, 0.2, 0.3, 0.4];

const ThinkingIndicator = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-4 items-end gap-1">
        {BAR_DELAYS.map((delay) => (
          <span
            key={delay}
            className="h-full w-1 rounded-full bg-gradient-to-t from-[#7B61FF] to-[#FF7AD9] animate-bounce"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-gray-600">Thinking</span>
    </div>
  );
};

export default ThinkingIndicator;
