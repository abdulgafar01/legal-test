"use client";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { useTranslations } from "next-intl";

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
            <h2 className="text-2xl font-bold text-black mb-4">{t("section1.title")}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t("section1.p1")}</p>
            <p className="text-gray-700 leading-relaxed">{t("section1.p2")}</p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">{t("section2.title")}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">2.1 Personal Information You Provide</h3>
                <p className="text-gray-700 leading-relaxed mb-2">{t("section2.p1")}</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>Account Information:</strong> Name, email address, phone number,
                    password, profile photo, and date of birth
                  </li>
                  <li>
                    <strong>Professional Information (for practitioners):</strong> Legal
                    credentials, bar association membership, practice areas, education,
                    experience, certifications, and professional biography
                  </li>
                  <li>
                    <strong>Payment Information:</strong> Billing address, payment method
                    details (processed securely through third-party payment processors)
                  </li>
                  <li>
                    <strong>Legal Matter Information:</strong> Case details, legal questions,
                    documents, communications, and consultation records
                  </li>
                  <li>
                    <strong>Communications:</strong> Messages exchanged through our Platform,
                    customer support inquiries, and feedback
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-black mb-2">2.2 Information Collected Automatically</h3>
                <p className="text-gray-700 leading-relaxed mb-2">{t("section2.p2")}</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>Device Information:</strong> IP address, browser type and version,
                    operating system, device identifiers, and hardware model
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Pages visited, features used, time spent on
                    pages, links clicked, search queries, and interaction patterns
                  </li>
                  <li>
                    <strong>Location Data:</strong> General geographic location based on IP
                    address (with your consent, precise location for certain features)
                  </li>
                  <li>
                    <strong>Cookies and Tracking:</strong> We use cookies, web beacons, and
                    similar technologies to enhance user experience and analyze Platform usage
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-black mb-2">2.3 Information from Third Parties</h3>
                <p className="text-gray-700 leading-relaxed mb-2">{t("section2.p3")}</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Social media platforms when you connect your account</li>
                  <li>Professional verification services for practitioner credentials</li>
                  <li>Payment processors for transaction information</li>
                  <li>Analytics providers for usage statistics</li>
                  <li>Public databases for legal practitioner verification</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">{t("section3.title")}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t("section3.p1")}</p>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-black mb-1">Service Delivery</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Create and manage user accounts</li>
                  <li>Facilitate connections between legal seekers and practitioners</li>
                  <li>Process payments and manage subscriptions</li>
                  <li>Provide AI-powered legal guidance and research tools</li>
                  <li>Enable secure communication and document sharing</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-black mb-1">Platform Improvement</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Train and improve AI models (using anonymized data)</li>
                  <li>Develop new features and services</li>
                  <li>Conduct research and analytics</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-black mb-1">Communication</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Send transactional emails and notifications</li>
                  <li>Provide customer support</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Notify you of Platform updates and changes</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-black mb-1">Security and Compliance</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Verify practitioner credentials and qualifications</li>
                  <li>Detect and prevent fraud, abuse, and illegal activities</li>
                  <li>Ensure Platform security and integrity</li>
                  <li>Comply with legal obligations and regulations</li>
                  <li>Enforce our Terms and Conditions</li>
                </ul>
              </div>
            </div>
          </section>

          {/* AI and Machine Learning */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">{t("section6.title")}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">4.1 Training Data</h3>
                <p className="text-gray-700 leading-relaxed">{t("section6.p1")}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">4.2 Data Protection</h3>
                <p className="text-gray-700 leading-relaxed">{t("section6.p2")}</p>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">{t("section5.title")}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t("section5.p1")}</p>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">5.1 With Legal Practitioners</h3>
                <p className="text-gray-700 leading-relaxed">{t("section5.p2")}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-black mb-2">5.2 Service Providers</h3>
                <p className="text-gray-700 leading-relaxed mb-2">{t("section5.p2")}</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Cloud hosting and storage providers</li>
                  <li>Payment processors and financial institutions</li>
                  <li>Email and communication service providers</li>
                  <li>Analytics and performance monitoring services</li>
                  <li>Customer support tools</li>
                  <li>Security and fraud prevention services</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-black mb-2">5.3 Legal Requirements</h3>
                <p className="text-gray-700 leading-relaxed mb-2">{t("section5.p3")}</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Comply with legal processes, court orders, or government requests</li>
                  <li>Enforce our Terms and Conditions</li>
                  <li>Protect our rights, privacy, safety, or property</li>
                  <li>Investigate potential violations or fraud</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-black mb-2">5.4 Business Transfers</h3>
                <p className="text-gray-700 leading-relaxed">{t("section5.p2")}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-black mb-2">5.5 With Your Consent</h3>
                <p className="text-gray-700 leading-relaxed">{t("section5.p3")}</p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">{t("section11.title")}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t("section11.p1")}</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Encryption:</strong> End-to-end encryption for sensitive communications
                and data transmission using industry-standard protocols (TLS/SSL)
              </li>
              <li>
                <strong>Access Controls:</strong> Strict internal access policies ensuring
                only authorized personnel can access personal information
              </li>
              <li>
                <strong>Security Monitoring:</strong> Continuous monitoring for suspicious
                activities and potential security threats
              </li>
              <li>
                <strong>Data Minimization:</strong> Collecting only necessary information
                and retaining it only as long as required
              </li>
              <li>
                <strong>Regular Audits:</strong> Periodic security assessments and
                vulnerability testing
              </li>
              <li>
                <strong>Employee Training:</strong> Regular privacy and security training
                for all team members
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">{t("section11.p2")}</p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">{t("section8.title")}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t("section8.p1")}</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide our Services and maintain your account</li>
              <li>Comply with legal, regulatory, and tax obligations</li>
              <li>Resolve disputes and enforce our agreements</li>
              <li>Maintain business records and archives</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">{t("section8.p2")}</p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">{t("section9.title")}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t("section9.p1")}</p>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-black mb-1">Access and Portability</h4>
                <p className="text-gray-700">{t("section9.p1")}</p>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-1">Correction</h4>
                <p className="text-gray-700">{t("section9.p1")}</p>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-1">Deletion</h4>
                <p className="text-gray-700">{t("section9.p1")}</p>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-1">Restriction and Objection</h4>
                <p className="text-gray-700">{t("section9.p1")}</p>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-1">Withdraw Consent</h4>
                <p className="text-gray-700">{t("section9.p1")}</p>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-1">Opt-Out</h4>
                <p className="text-gray-700">{t("section9.p1")}</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">{t("section9.p2")}</p>
          </section>

          {/* Regional Privacy Rights */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">9. Regional Privacy Rights</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">9.1 GDPR (European Union)</h3>
                <p className="text-gray-700 leading-relaxed">For users in the EU/EEA, we comply with the General Data Protection Regulation (GDPR). You have enhanced rights including the right to lodge a complaint with your local supervisory authority.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">9.2 CCPA (California)</h3>
                <p className="text-gray-700 leading-relaxed">California residents have specific rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information is collected, sold, or disclosed, and the right to opt-out of sales.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">9.3 Other Jurisdictions</h3>
                <p className="text-gray-700 leading-relaxed">We respect privacy rights under other applicable laws and regulations, including those in Australia, Canada, and other regions with privacy legislation.</p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">{t("section7.title")}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t("section7.p1")}</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Remember your preferences and settings</li>
              <li>Authenticate users and prevent fraud</li>
              <li>Analyze Platform usage and performance</li>
              <li>Personalize content and advertisements</li>
              <li>Measure marketing campaign effectiveness</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">{t("section7.p2")}</p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">{t("section13.title")}</h2>
            <p className="text-gray-700 leading-relaxed">{t("section13.p1")}</p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">{t("section10.title")}</h2>
            <p className="text-gray-700 leading-relaxed">{t("section10.p1")}</p>
          </section>

          {/* International Data Transfers */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">{t("section12.title")}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t("section12.p1")}</p>
            <p className="text-gray-700 leading-relaxed">{t("section12.p2")}</p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">{t("section14.title")}</h2>
            <p className="text-gray-700 leading-relaxed">{t("section14.p1")}</p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">{t("section15.title")}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t("section15.p1")}</p>
            <div className="bg-[#FFF9ED] border border-[#FAF0D6] rounded-lg p-6">
              <p className="font-semibold text-black mb-2">TheYAS Law - Privacy Team</p>
              <p className="text-gray-700">{t("section15.p2")}</p>
              {/* <p className="text-gray-700">Address: [Company Address]</p> */}
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="bg-[#FEF7D4] border border-[#E6D29A] rounded-lg p-6 mt-8">
            <h3 className="text-lg font-bold text-black mb-3">Your Consent</h3>
            <p className="text-gray-700 leading-relaxed">
              By using TheYAS Law, you acknowledge that you have read and understood this
              Privacy Policy and consent to the collection, use, and disclosure of your
              information as described herein. For questions about our{" "}
              <Link href="/terms" className="text-[#BE9C05] hover:underline font-semibold">
                Terms & Conditions
              </Link>
              , please visit our terms page.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
