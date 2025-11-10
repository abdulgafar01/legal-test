"use client";
import Link from "next/link";
import MotionSection from "./MotionSection";
import { FaCheckCircle } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function CTAForLawyers() {
  const t = useTranslations("ctaLawyers");

  const points = ["p1", "p2", "p3", "p4"];
  const stats = ["s1", "s2", "s3", "s4"];

  return (
    <section className="py-16 md:mx-10 md:rounded-3xl bg-[#FEF7D4] font-jost relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#FEF7D4] via-white/40 to-[#FEF7D4]" />

      <div className="relative max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">

        <MotionSection className="flex-1">
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-4 leading-snug">
            {t.rich("heading", {
              gold: (chunk) => (
                <span className="text-gradient-gold">{chunk}</span>
              )
            })}
          </h2>

          <p className="text-gray-700 text-lg mb-6 max-w-xl">
            {t("subheading")}
          </p>

          <ul className="text-sm text-gray-700 space-y-2 mb-6">
            {points.map((key) => (
              <li key={key} className="flex items-start gap-2">
                <FaCheckCircle className="text-[#BE9C05] mt-0.5 flex-shrink-0" />
                <span>{t(`points.${key}`)}</span>
              </li>
            ))}
          </ul>

          <Link href="/signup/practitioner" className="btn-primary text-sm">
            {t("button")}
          </Link>
        </MotionSection>

        <MotionSection delay={0.15} className="flex-1 grid grid-cols-2 gap-4 w-full">
          {stats.map((key) => (
            <div
              key={key}
              className="rounded-lg bg-white/80 backdrop-blur border border-gray-200 p-4 text-sm font-semibold text-gray-800 flex items-center justify-center text-center"
            >
              {t(`stats.${key}`)}
            </div>
          ))}
        </MotionSection>
      </div>
    </section>
  );
}
