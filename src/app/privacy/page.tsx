import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="bg-white min-h-screen text-gray-900 font-nunito">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-600">
            Last Updated: November 3, 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              TheYAS Law ("we", "us", "our", or "Platform") is committed to protecting 
              your privacy and handling your personal information with the highest standards 
              of care, transparency, and security. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our legal technology 
              platform and services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This policy applies to all users of our Platform, including legal seekers, 
              legal practitioners, and visitors. By using TheYAS Law, you consent to the 
              data practices described in this Privacy Policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              2. Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  2.1 Personal Information You Provide
                </h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  We collect information you voluntarily provide when using our Services:
                </p>
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
                <h3 className="text-xl font-semibold text-black mb-2">
                  2.2 Information Collected Automatically
                </h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  When you access our Platform, we automatically collect:
                </p>
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
                <h3 className="text-xl font-semibold text-black mb-2">
                  2.3 Information from Third Parties
                </h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  We may receive information from:
                </p>
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
            <h2 className="text-2xl font-bold text-black mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use collected information for the following purposes:
            </p>
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
            <h2 className="text-2xl font-bold text-black mb-4">
              4. AI and Machine Learning Data Usage
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">4.1 Training Data</h3>
                <p className="text-gray-700 leading-relaxed">
                  We use aggregated and anonymized data to train and improve our AI models. 
                  This includes legal queries, document patterns, and interaction data. Personal 
                  identifiers and sensitive information are removed before data is used for 
                  training purposes.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">4.2 Data Protection</h3>
                <p className="text-gray-700 leading-relaxed">
                  We implement strict data governance protocols to ensure that AI training 
                  does not compromise user privacy or attorney-client privilege. Sensitive 
                  legal communications are never used for AI training without explicit 
                  de-identification and aggregation.
                </p>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              5. How We Share Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell your personal information. We share information only in the 
              following circumstances:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">5.1 With Legal Practitioners</h3>
                <p className="text-gray-700 leading-relaxed">
                  When you engage a legal practitioner through our Platform, we share necessary 
                  information to facilitate the consultation and legal services.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-black mb-2">5.2 Service Providers</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  We share information with trusted third-party service providers who assist 
                  in Platform operations:
                </p>
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
                <p className="text-gray-700 leading-relaxed mb-2">
                  We may disclose information when required by law or to:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Comply with legal processes, court orders, or government requests</li>
                  <li>Enforce our Terms and Conditions</li>
                  <li>Protect our rights, privacy, safety, or property</li>
                  <li>Investigate potential violations or fraud</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-black mb-2">5.4 Business Transfers</h3>
                <p className="text-gray-700 leading-relaxed">
                  In the event of a merger, acquisition, reorganization, or sale of assets, 
                  your information may be transferred to the acquiring entity, subject to 
                  the same privacy protections.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-black mb-2">5.5 With Your Consent</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may share information for other purposes with your explicit consent.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              6. Data Security and Protection
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement comprehensive security measures to protect your information:
            </p>
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
            <p className="text-gray-700 leading-relaxed mt-4">
              Despite our efforts, no security system is impenetrable. We cannot guarantee 
              absolute security, but we continuously work to maintain the highest protection 
              standards.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              7. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We retain your information for as long as necessary to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide our Services and maintain your account</li>
              <li>Comply with legal, regulatory, and tax obligations</li>
              <li>Resolve disputes and enforce our agreements</li>
              <li>Maintain business records and archives</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              When information is no longer needed, we securely delete or anonymize it. 
              Legal communications and case files may be retained longer to comply with 
              professional obligations and applicable laws.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              8. Your Privacy Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Depending on your jurisdiction, you may have the following rights:
            </p>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-black mb-1">Access and Portability</h4>
                <p className="text-gray-700">
                  Request access to your personal information and receive a copy in a 
                  structured, commonly used format.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-1">Correction</h4>
                <p className="text-gray-700">
                  Request correction of inaccurate or incomplete personal information.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-1">Deletion</h4>
                <p className="text-gray-700">
                  Request deletion of your personal information, subject to legal and 
                  contractual obligations.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-1">Restriction and Objection</h4>
                <p className="text-gray-700">
                  Request restriction of processing or object to certain uses of your information.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-1">Withdraw Consent</h4>
                <p className="text-gray-700">
                  Withdraw consent for processing where consent is the legal basis.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-1">Opt-Out</h4>
                <p className="text-gray-700">
                  Unsubscribe from marketing communications at any time.
                </p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, please contact us at admin@theyas.co. We will 
              respond to your request within the timeframe required by applicable law.
            </p>
          </section>

          {/* Regional Privacy Rights */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              9. Regional Privacy Rights
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">9.1 GDPR (European Union)</h3>
                <p className="text-gray-700 leading-relaxed">
                  For users in the EU/EEA, we comply with the General Data Protection Regulation 
                  (GDPR). You have enhanced rights including the right to lodge a complaint with 
                  your local supervisory authority.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">9.2 CCPA (California)</h3>
                <p className="text-gray-700 leading-relaxed">
                  California residents have specific rights under the California Consumer 
                  Privacy Act (CCPA), including the right to know what personal information 
                  is collected, sold, or disclosed, and the right to opt-out of sales.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">9.3 Other Jurisdictions</h3>
                <p className="text-gray-700 leading-relaxed">
                  We respect privacy rights under other applicable laws and regulations, 
                  including those in Australia, Canada, and other regions with privacy 
                  legislation.
                </p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              10. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Remember your preferences and settings</li>
              <li>Authenticate users and prevent fraud</li>
              <li>Analyze Platform usage and performance</li>
              <li>Personalize content and advertisements</li>
              <li>Measure marketing campaign effectiveness</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              You can control cookies through your browser settings. However, disabling cookies 
              may limit certain Platform features and functionality.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              11. Third-Party Links and Services
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our Platform may contain links to third-party websites and services. We are not 
              responsible for the privacy practices of these external sites. We encourage you 
              to review their privacy policies before providing any personal information.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              12. Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our Platform is not intended for individuals under 18 years of age. We do not 
              knowingly collect personal information from children. If we become aware that 
              we have collected information from a child, we will promptly delete it. If you 
              believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          {/* International Data Transfers */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              13. International Data Transfers
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your information may be transferred to and processed in countries other than 
              your country of residence. These countries may have data protection laws that 
              differ from your jurisdiction.
            </p>
            <p className="text-gray-700 leading-relaxed">
              When we transfer data internationally, we implement appropriate safeguards, 
              including Standard Contractual Clauses approved by relevant authorities, to 
              ensure your information receives adequate protection.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              14. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy periodically to reflect changes in our 
              practices, technology, legal requirements, or other factors. We will notify 
              you of material changes via email or prominent Platform notice. The "Last 
              Updated" date at the top indicates when the policy was last revised.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              15. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or 
              our data practices, please contact us:
            </p>
            <div className="bg-[#FFF9ED] border border-[#FAF0D6] rounded-lg p-6">
              <p className="font-semibold text-black mb-2">TheYAS Law - Privacy Team</p>
              <p className="text-gray-700">Email: admin@theyas.co</p>
              {/* <p className="text-gray-700">Address: [Company Address]</p> */}
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="bg-[#FEF7D4] border border-[#E6D29A] rounded-lg p-6 mt-8">
            <h3 className="text-lg font-bold text-black mb-3">
              Your Consent
            </h3>
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
