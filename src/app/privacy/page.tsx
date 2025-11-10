"use client";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ScrollToTop } from "@/components/ScrollToTop";

export default function PrivacyPolicy() {
  const t = useTranslations("privacy");

  return (
    <main className="bg-white min-h-screen text-gray-900 font-nunito">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
            {t("title")}
          </h1>
          <p className="text-sm text-gray-600">{t("updated")}</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section1.title")}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t("section1.p1")}
            </p>
            <p className="text-gray-700 leading-relaxed">{t("section1.p2")}</p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section2.title")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section2.title2")}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  {t("section2.p1")}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>{t("section2.list1Strong")}:</strong>{" "}
                    {t("section2.list1")}
                  </li>
                  <li>
                    <strong>{t("section2.list2Strong")}:</strong>{" "}
                    {t("section2.list2")}
                  </li>
                  <li>
                    <strong>{t("section2.list3Strong")}:</strong>{" "}
                    {t("section2.list3")}
                  </li>
                  <li>
                    <strong>{t("section2.list4Strong")}:</strong>{" "}
                    {t("section2.list4")}
                  </li>
                  <li>
                    <strong>{t("section2.list5Strong")}:</strong>{" "}
                    {t("section2.list5")}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section22.heading")}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  {t("section2.p2")}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>{t("section22.list1Strong")}:</strong>{" "}
                    {t("section22.list1")}
                  </li>
                  <li>
                    <strong>{t("section22.list2Strong")}:</strong>{" "}
                    {t("section22.list2")}
                  </li>
                  <li>
                    <strong>{t("section22.list3Strong")}:</strong>{" "}
                    {t("section22.list3")}
                  </li>
                  <li>
                    <strong>{t("section22.list4Strong")}:</strong>{" "}
                    {t("section22.list4")}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section23.heading")}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  {t("section2.p3")}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>{t("section23.list1")}</li>
                  <li>{t("section23.list2")}</li>
                  <li>{t("section23.list3")}</li>
                  <li>{t("section23.list4")}</li>
                  <li>{t("section23.list5")}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section3.title")}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t("section3.p1")}
            </p>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-black mb-1">
                  {t("section3.heading4")}
                </h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>{t("section3.list1.item1")}</li>
                  <li>{t("section3.list1.item2")}</li>
                  <li>{t("section3.list1.item3")}</li>
                  <li>{t("section3.list1.item4")}</li>
                  <li>{t("section3.list1.item5")}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-black mb-1">
                  {t("section3.Platform Improvement")}
                </h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>{t("section3.list2.item1")}</li>
                  <li>{t("section3.list2.item2")}</li>
                  <li>{t("section3.list2.item3")}</li>
                  <li>{t("section3.list2.item4")}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-black mb-1">
                  {t("section3.Communication")}
                </h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>{t("section3.list3.item1")}</li>
                  <li>{t("section3.list3.item2")}</li>
                  <li>{t("section3.list3.item3")}</li>
                  <li>{t("section3.list3.item4")}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-black mb-1">
                  {t("section3.Security and Compliance")}
                </h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>{t("section3.list4.item1")}</li>
                  <li>{t("section3.list4.item2")}</li>
                  <li>{t("section3.list4.item3")}</li>
                  <li>{t("section3.list4.item4")}</li>
                  <li>{t("section3.list4.item5")}</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section4.title")}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t("section4.p1")}
            </p>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section5.title")}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t("section5.p1")}
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section5.heading2")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section5.p2")}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section5.heading3")}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  {t("section5.p2")}
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>{t("section5.list1.item1")}</li>
                  <li>{t("section5.list1.item2")}</li>
                  <li>{t("section5.list1.item3")}</li>
                  <li>{t("section5.list1.item4")}</li>
                  <li>{t("section5.list1.item5")}</li>
                  <li>{t("section5.list1.item6")}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section5.heading4")}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  {t("section5.p3")}
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>{t("section5.list2.item1")}</li>
                  <li>{t("section5.list2.item2")}</li>
                  <li>{t("section5.list2.item3")}</li>
                  <li>{t("section5.list2.item4")}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section5.heading5")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section5.p2")}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section5.heading6")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section5.p3")}
                </p>
              </div>
            </div>
          </section>

          {/* AI and Machine Learning */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section6.title")}
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
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section7.title")}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t("section7.p1")}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{t("section7.list.item1")}</li>
              <li>{t("section7.list.item2")}</li>
              <li>{t("section7.list.item3")}</li>
              <li>{t("section7.list.item4")}</li>
              <li>{t("section7.list.item5")}</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              {t("section7.p2")}
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section8.title")}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t("section8.p1")}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{t("section8.list.item1")}</li>
              <li>{t("section8.list.item2")}</li>
              <li>{t("section8.list.item3")}</li>
              <li>{t("section8.list.item4")}</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              {t("section8.p2")}
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section9.title")}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t("section9.p1")}
            </p>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-black mb-1">
                  {t("section9.heading2")}
                </h4>
                <p className="text-gray-700">{t("section9.p1")}</p>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-1">
                  {t("section9.heading3")}
                </h4>
                <p className="text-gray-700">{t("section9.p1")}</p>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-1">
                  {t("section9.Deletion")}
                </h4>
                <p className="text-gray-700">{t("section9.p1")}</p>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-1">
                  {t("section9.Restriction and Objection")}
                </h4>
                <p className="text-gray-700">{t("section9.p1")}</p>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-1">
                  {t("section9.Withdraw Consent")}
                </h4>
                <p className="text-gray-700">{t("section9.p1")}</p>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-1">
                  {t("section9.OptOut")}
                </h4>
                <p className="text-gray-700">{t("section9.p1")}</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              {t("section9.p2")}
            </p>
          </section>

          {/* Regional Privacy Rights */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section9_2.title")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section9_2.subTitle1")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section9_2.p1")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section9_2.subTitle2")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section9_2.p2")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t("section9_2.subTitle3")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t("section9_2.p3")}
                </p>
              </div>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section10.title")}
            </h2>
            <p className="text-gray-700 leading-relaxed">{t("section10.p1")}</p>
            <p className="text-gray-700 leading-relaxed">{t("section10.p2")}</p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section11.title")}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t("section11.p1")}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>{t("section11.list.item1Strong")}:</strong>{" "}
                {t("section11.list.item1")}
              </li>
              <li>
                <strong>{t("section11.list.item2Strong")}:</strong>{" "}
                {t("section11.list.item2")}
              </li>
              <li>
                <strong>{t("section11.list.item3Strong")}:</strong>{" "}
                {t("section11.list.item3")}
              </li>
              <li>
                <strong>{t("section11.list.item4Strong")}:</strong>{" "}
                {t("section11.list.item4")}
              </li>
              <li>
                <strong>{t("section11.list.item5Strong")}:</strong>{" "}
                {t("section11.list.item5")}
              </li>
              <li>
                <strong>{t("section11.list.item6Strong")}:</strong>{" "}
                {t("section11.list.item6")}
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              {t("section11.p2")}
            </p>
          </section>

          {/* International Data Transfers */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section12.title")}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t("section12.p1")}
            </p>
            <p className="text-gray-700 leading-relaxed">{t("section12.p2")}</p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section13.title")}
            </h2>
            <p className="text-gray-700 leading-relaxed">{t("section13.p1")}</p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section14.title")}
            </h2>
            <p className="text-gray-700 leading-relaxed">{t("section14.p1")}</p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              {t("section15.title")}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t("section15.p1")}
            </p>
            <div className="bg-[#FFF9ED] border border-[#FAF0D6] rounded-lg p-6">
              <p className="font-semibold text-black mb-2">
                TheYAS Law - Privacy Team
              </p>
              <p className="text-gray-700">{t("section15.p2")}</p>
              {/* <p className="text-gray-700">Address: [Company Address]</p> */}
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="bg-[#FEF7D4] border border-[#E6D29A] rounded-lg p-6 mt-8">
            <h3 className="text-lg font-bold text-black mb-3">
              {t("consent.heading")}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {t("consent.paragraph")}{" "}
              <Link
                href="/terms"
                className="text-[#BE9C05] hover:underline font-semibold"
              >
                {t("consent.link")}
              </Link>
            </p>
          </section>
        </div>
      </div>
      <ScrollToTop />
      <Footer />
    </main>
  );
}
