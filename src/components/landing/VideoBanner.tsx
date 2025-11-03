"use client";
import { useRef, useState } from "react";
import Link from "next/link";

export default function VideoBanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <section className="relative  w-full h-screen overflow-hidden">
      {/* Background video (covers entire section). Provide a poster and graceful fallback via background color */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        autoPlay
        // muted={muted}
        muted
        loop
        poster="/background.jpg"
      >
        <source src="/banner.mp4" type="video/mp4" />
        {/* If the video is not available the poster or background will show */}
      </video>

      {/* Dim overlay for contrast */}
      <div className="absolute inset-0 bg-black/40" aria-hidden />

      {/* Content on top of video */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col justify-center">
        <div className="w-full md:w-3/4 lg:w-2/3">
          <h1 className="text-white text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            TheYas
            <span className="text-[#C48A06]">
              Law
            </span> &nbsp;
             Legal AI Trusted, Compliant, Ready
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-6">
            Enterprise-grade AI for contracts, compliance reviews and corporate workflows, backed by verified lawyers when you need human review.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/account" className="btn-primary">
              Get Started
            </Link>
            <a href="#services" className="btn-secondary">
              See How It Works
            </a>
          </div>
        </div>
      </div>

      {/* Fallback decorative background for when video isn't available */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#0b1220]" aria-hidden />
    </section>
  );
}
