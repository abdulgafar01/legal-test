import React from "react";

const LoadingSpinner = ({ innerText }: { innerText: string }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">{innerText}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
