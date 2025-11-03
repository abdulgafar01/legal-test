"use client";
import React from "react";
import Image from "next/image";
import clsx from "clsx";

interface InvertedRadiusCardProps {
  src?: string;
  alt?: string;
  children?: React.ReactNode;
  className?: string;
}

const InvertedRadiusCard: React.FC<InvertedRadiusCardProps> = ({
  src,
  alt = "Card image",
  children,
  className,
}) => {
  const hasImage = !!src;

  return (
    <div
      className={clsx(
        "inverted-radius flex items-center justify-center overflow-hidden",
        className
      )}
    >
      {hasImage ? (
        <Image
          src={src!}
          alt={alt}
          width={250}
          height={250}
          className="object-cover w-full h-full"
        />
      ) : (
        children ?? (
          <div className="flex flex-col items-center justify-center text-center p-4 text-gray-700">
            <p>No image provided</p>
          </div>
        )
      )}
    </div>
  );
};

export default InvertedRadiusCard;
