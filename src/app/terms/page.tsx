"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ScrollToTop } from "@/components/ScrollToTop";

export default function TermsAndConditions() {
  const t = useTranslations("terms");
  return (
    <main className="bg-white min-h-screen text-gray-900 font-nunito">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
            {t("title")}
          </h1>
          <p className="text-sm text-gray-600">{t("date")}</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section1.heading")}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t("section1.p1")}
            </p>
            <p className="text-gray-700 leading-relaxed">{t("section1.p2")}</p>
          </section>

          {/* Services Description */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section2.heading")}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t("section2.p1")}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{t("section2.list.item1")}</li>
              <li>{t("section2.list.item2")}</li>
              <li>{t("section2.list.item3")}</li>
              <li>{t("section2.list.item4")}</li>
              <li>{t("section2.list.item5")}</li>
              <li>{t("section2.list.item6")}</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              {t("section2.p2")}
            </p>
          </section>

          {/* User Eligibility */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section3.heading")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section3.heading2")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section3.p1")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section3.heading3")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section3.p2")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section3.heading4")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section3.p3")}
                </p>
              </div>
            </div>
          </section>

          {/* AI Services and Limitations */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section4.heading1")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section4.heading2")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section4.p1")}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                  <li>{t("section4.ul.li1")}</li>
                  <li>{t("section4.ul.li2")}</li>
                  <li>{t("section4.ul.li3")}</li>
                  <li>{t("section4.ul.li4")}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section4.heading3")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section4.p2")}
                </p>
              </div>
            </div>
          </section>

          {/* Professional Services */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section5.heading")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section5.heading1")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section5.p1")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section5.heading2")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section5.p2")}
                </p>
              </div>
            </div>
          </section>

          {/* Payment Terms */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section6.heading")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section6.heading2")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section6.p1")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section6.heading3")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section6.p2")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section6.heading4")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section6.p3")}
                </p>
              </div>
            </div>
          </section>

          {/* User Conduct */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section7.heading")}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t("section7.p1")}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{t("section7.ul.li1")}</li>
              <li>{t("section7.ul.li2")}</li>
              <li>{t("section7.ul.li3")}</li>
              <li>{t("section7.ul.li4")}</li>
              <li>{t("section7.ul.li5")}</li>
              <li>{t("section7.ul.li6")}</li>
              <li>{t("section7.ul.li7")}</li>
              <li>{t("section7.ul.li8")}</li>
              <li>{t("section7.ul.li9")}</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section8.heading")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section8.heading2")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section8.p1")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section8.heading3")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section8.p2")}
                </p>
              </div>
            </div>
          </section>

          {/* Privacy and Data Protection */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section9.heading")}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t("section9.heading2")}{" "}
              <Link
                href="/privacy"
                className="text-[#BE9C05] hover:underline font-semibold"
              >
                {t("section9.link")}
              </Link>
              , {t("section9.p1")}
            </p>
            <p className="text-gray-700 leading-relaxed">{t("section9.p2")}</p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section10.heading")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section10.heading2")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section10.p1")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section10.heading3")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section10.p2")}
                </p>
              </div>
            </div>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section11.heading")}
            </h2>
            <p className="text-gray-700 leading-relaxed">{t("section11.p1")}</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
              <li>{t("section11.ul.li1")}</li>
              <li>{t("section11.ul.li2")}</li>
              <li>{t("section11.ul.li3")}</li>
              <li>{t("section11.ul.li4")}</li>
            </ul>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section12.heading")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section12.subHeading1")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section12.p1")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section12.subHeading2")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section12.p2")}
                </p>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section13.heading")}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t("section13.p1")}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{t("section13.ul.li1")}</li>
              <li>{t("section13.ul.li2")}</li>
              <li>{t("section13.ul.li3")}</li>
              <li>{t("section13.ul.li4")}</li>
            </ul>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section14.heading")}
            </h2>
            <p className="text-gray-700 leading-relaxed">{t("section14.p1")}</p>
          </section>

          {/* General Provisions */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section15.heading")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section15.subHeading1")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section15.p1")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section15.subHeading2")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section15.p2")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section15.subHeading3")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section15.p3")}
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section16.heading")}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t("section16.p1")}
            </p>
            <div className="bg-[#FFF9ED] border border-[#FAF0D6] rounded-lg p-6">
              <p className="font-semibold text-black mb-2">
                {t("section16.companyName")}
              </p>
              <p className="text-gray-700">{t("section16.email")}</p>
              {/* <p className="text-gray-700">{t("section16.address")}</p> */}
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="bg-[#FEF7D4] border border-[#E6D29A] rounded-lg p-6 mt-8">
            <h3 className="text-lg font-bold text-black mb-3">
              {t("section17.heading")}
            </h3>
            <p className="text-gray-700 leading-relaxed">{t("section17.p1")}</p>
          </section>
        </div>
      </div>
      <ScrollToTop/>
      <Footer />
    </main>
  );
}
