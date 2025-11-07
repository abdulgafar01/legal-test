"use client";
import { useTranslations } from "next-intl";
import MotionSection from "./MotionSection";

export default function Footer() {
  const t = useTranslations();
  return (
    <footer
      className="relative bg-[#FEF7D4] border-t border-gray-200 font-jost overflow-hidden"
      dir="ltr"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#FEF7D4] via-[#FEF7D4]/80 to-[#FEF7D4] opacity-60 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10">
        <MotionSection>
          <h3 className="text-xl font-extrabold text-black mb-3">
            TheYAS<span className="text-gradient-gold">Law</span>
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
            {t("footer.subHeading")}
          </p>
        </MotionSection>
        <MotionSection delay={0.05}>
          <h4 className="text-sm font-bold text-black mb-3 uppercase tracking-wide">
            {t("footer.heading1")}
          </h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
            <a href="#home" className="hover:text-black">
              {t("footer.link1_1")}
            </a>
            <a href="/signup/seeker" className="hover:text-black">
              {t("footer.link1_2")}
            </a>
            <a href="/signup/practitioner" className="hover:text-black">
              {t("footer.link1_3")}
            </a>
            <a href="#features" className="hover:text-black">
              {t("footer.link1_4")}
            </a>
            <a href="#services" className="hover:text-black">
              {t("footer.link1_5")}
            </a>
            <a href="#pricing" className="hover:text-black">
              Pricing
            </a>
            {/* <a href="#contact" className="hover:text-black">Contact</a> */}
          </div>
        </MotionSection>
        <MotionSection delay={0.1}>
          <h4 className="text-sm font-bold text-black mb-3 uppercase tracking-wide">
            {t("footer.heading2")}
          </h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <a href="/privacy" className="hover:text-black">
                {t("footer.link2_1")}
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-black">
                {t("footer.link2_2")}
              </a>
            </li>
          </ul>
        </MotionSection>
      </div>
      <div className="relative border-t border-gray-300 py-6 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} TheYAS Law. {t("footer.copyMessage")}.
      </div>
    </footer>
  );
}
