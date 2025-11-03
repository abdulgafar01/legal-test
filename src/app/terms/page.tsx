import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <main className="bg-white min-h-screen text-gray-900 font-nunito">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
            Terms & Conditions
          </h1>
          <p className="text-sm text-gray-600">
            Last Updated: November 3, 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              1. Introduction and Acceptance
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to TheYAS Law ("Platform", "Service", "we", "us", or "our"). 
              These Terms and Conditions ("Terms") constitute a legally binding agreement 
              between you ("User", "you", or "your") and TheYAS Law governing your access 
              to and use of our hybrid AI-powered legal guidance platform and human legal 
              practitioner network.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By accessing, browsing, or using our Platform, you acknowledge that you have 
              read, understood, and agree to be bound by these Terms, our Privacy Policy, 
              and all applicable laws and regulations. If you do not agree with these Terms, 
              you must immediately discontinue use of the Platform.
            </p>
          </section>

          {/* Services Description */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              2. Description of Services
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              TheYAS Law provides a comprehensive legal technology platform that combines:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>AI-powered legal research and guidance tools</li>
              <li>Access to verified legal practitioners across multiple jurisdictions</li>
              <li>Secure communication channels for legal consultations</li>
              <li>Document review and analysis services</li>
              <li>Legal resource libraries and educational content</li>
              <li>Case management and tracking functionalities</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Our Services are designed to facilitate legal information access and 
              professional legal services, but do not constitute legal advice unless 
              explicitly provided by a licensed legal practitioner through our Platform.
            </p>
          </section>

          {/* User Eligibility */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              3. User Eligibility and Account Requirements
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">3.1 Age Requirements</h3>
                <p className="text-gray-700 leading-relaxed">
                  You must be at least 18 years of age or the age of legal majority in 
                  your jurisdiction to use this Platform. By using our Services, you 
                  represent and warrant that you meet these age requirements.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">3.2 Account Registration</h3>
                <p className="text-gray-700 leading-relaxed">
                  To access certain features, you must create an account providing accurate, 
                  current, and complete information. You are responsible for maintaining the 
                  confidentiality of your account credentials and for all activities under 
                  your account. You must immediately notify us of any unauthorized access or 
                  security breach.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">3.3 Practitioner Verification</h3>
                <p className="text-gray-700 leading-relaxed">
                  Legal practitioners using our Platform must provide valid credentials, 
                  licensing information, and professional qualifications. We reserve the 
                  right to verify and continuously monitor practitioner credentials.
                </p>
              </div>
            </div>
          </section>

          {/* AI Services and Limitations */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              4. AI Services and Limitations
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">4.1 Nature of AI Guidance</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our AI-powered tools provide information and guidance based on machine 
                  learning models trained on legal data. This technology:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                  <li>Does NOT constitute legal advice</li>
                  <li>Should NOT be relied upon as a substitute for professional legal counsel</li>
                  <li>May contain errors, omissions, or outdated information</li>
                  <li>Cannot account for all nuances of your specific legal situation</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">4.2 No Attorney-Client Relationship</h3>
                <p className="text-gray-700 leading-relaxed">
                  Use of AI services does not create an attorney-client relationship. Such 
                  relationships are only formed when you engage a licensed practitioner 
                  through our Platform and both parties explicitly agree to representation.
                </p>
              </div>
            </div>
          </section>

          {/* Professional Services */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              5. Professional Legal Services
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">5.1 Independent Practitioners</h3>
                <p className="text-gray-700 leading-relaxed">
                  Legal practitioners on our Platform are independent professionals. TheYAS 
                  Law serves as a technology platform facilitating connections and does not 
                  provide legal services directly. We are not responsible for the quality, 
                  timeliness, or outcomes of services provided by practitioners.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">5.2 Practitioner-Client Relationship</h3>
                <p className="text-gray-700 leading-relaxed">
                  Any legal services agreement is formed directly between you and the 
                  practitioner. You are responsible for evaluating practitioner qualifications, 
                  negotiating terms, and ensuring compliance with applicable professional 
                  conduct rules.
                </p>
              </div>
            </div>
          </section>

          {/* Payment Terms */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              6. Payment Terms and Subscription
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">6.1 Fees and Billing</h3>
                <p className="text-gray-700 leading-relaxed">
                  Access to certain Platform features requires payment of subscription fees 
                  or consultation charges. All fees are stated in USD unless otherwise 
                  specified. You agree to pay all applicable fees as described at the time 
                  of purchase.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">6.2 Automatic Renewal</h3>
                <p className="text-gray-700 leading-relaxed">
                  Subscription plans automatically renew unless canceled before the renewal 
                  date. You authorize us to charge your payment method for renewal fees.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">6.3 Refund Policy</h3>
                <p className="text-gray-700 leading-relaxed">
                  Subscription fees are generally non-refundable except as required by law 
                  or as explicitly stated in our refund policy. Consultation fees paid to 
                  practitioners are subject to the individual practitioner's policies.
                </p>
              </div>
            </div>
          </section>

          {/* User Conduct */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              7. User Conduct and Prohibited Activities
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Violate any applicable laws, regulations, or third-party rights</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Engage in fraudulent, deceptive, or misleading activities</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Attempt to gain unauthorized access to Platform systems or data</li>
              <li>Scrape, data mine, or extract data without authorization</li>
              <li>Interfere with Platform operations or other users' experience</li>
              <li>Use the Platform for any illegal or unauthorized purpose</li>
              <li>Share confidential information without proper authorization</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              8. Intellectual Property Rights
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">8.1 Platform Content</h3>
                <p className="text-gray-700 leading-relaxed">
                  All Platform content, including software, text, graphics, logos, designs, 
                  and AI models, is owned by TheYAS Law or licensed to us and protected by 
                  copyright, trademark, and other intellectual property laws.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">8.2 User Content License</h3>
                <p className="text-gray-700 leading-relaxed">
                  By uploading content to the Platform, you grant us a worldwide, 
                  non-exclusive, royalty-free license to use, store, and process such 
                  content solely for providing and improving our Services.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy and Data Protection */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              9. Privacy and Data Protection
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your use of the Platform is subject to our{" "}
              <Link href="/privacy" className="text-[#BE9C05] hover:underline font-semibold">
                Privacy Policy
              </Link>
              , which describes how we collect, use, and protect your personal information. 
              We implement industry-standard security measures to protect user data, including 
              end-to-end encryption for sensitive communications.
            </p>
            <p className="text-gray-700 leading-relaxed">
              However, no system is completely secure. You acknowledge that you provide 
              information at your own risk.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              10. Disclaimers and Limitations of Liability
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">10.1 "As Is" Provision</h3>
                <p className="text-gray-700 leading-relaxed">
                  THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF 
                  ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF 
                  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">10.2 Limitation of Liability</h3>
                <p className="text-gray-700 leading-relaxed">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, THEYAS LAW SHALL NOT BE LIABLE FOR 
                  ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, 
                  INCLUDING LOST PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION ARISING FROM 
                  YOUR USE OF THE PLATFORM.
                </p>
              </div>
            </div>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              11. Indemnification
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify, defend, and hold harmless TheYAS Law, its affiliates, 
              officers, directors, employees, and agents from any claims, liabilities, damages, 
              losses, costs, or expenses (including reasonable attorneys' fees) arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
              <li>Your use or misuse of the Platform</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Content you submit to the Platform</li>
            </ul>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              12. Dispute Resolution and Governing Law
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">12.1 Governing Law</h3>
                <p className="text-gray-700 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws 
                  of the jurisdiction where TheYAS Law is registered, without regard to 
                  conflict of law principles.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">12.2 Arbitration</h3>
                <p className="text-gray-700 leading-relaxed">
                  Any dispute arising from these Terms shall be resolved through binding 
                  arbitration in accordance with the rules of the designated arbitration 
                  organization, except where prohibited by law.
                </p>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              13. Termination
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to suspend or terminate your access to the Platform at 
              any time, with or without notice, for any reason, including violation of these 
              Terms. Upon termination:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Your right to access and use the Platform immediately ceases</li>
              <li>Any outstanding fees become immediately due and payable</li>
              <li>We may delete your account and associated data after a reasonable period</li>
              <li>Provisions that by their nature should survive termination shall remain in effect</li>
            </ul>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              14. Modifications to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users 
              of material changes via email or Platform notification. Your continued use of 
              the Platform after such modifications constitutes acceptance of the updated Terms. 
              We encourage you to review these Terms periodically.
            </p>
          </section>

          {/* General Provisions */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              15. General Provisions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">15.1 Severability</h3>
                <p className="text-gray-700 leading-relaxed">
                  If any provision of these Terms is found to be invalid or unenforceable, 
                  the remaining provisions shall continue in full force and effect.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">15.2 Waiver</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our failure to enforce any right or provision of these Terms shall not 
                  constitute a waiver of such right or provision.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">15.3 Entire Agreement</h3>
                <p className="text-gray-700 leading-relaxed">
                  These Terms, together with our Privacy Policy and any other legal notices 
                  published on the Platform, constitute the entire agreement between you and 
                  TheYAS Law regarding the use of the Platform.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">
              16. Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For questions, concerns, or notices regarding these Terms, please contact us at:
            </p>
            <div className="bg-[#FFF9ED] border border-[#FAF0D6] rounded-lg p-6">
              <p className="font-semibold text-black mb-2">TheYAS Law</p>
              <p className="text-gray-700">Email: legal@theyaslaw.com</p>
              <p className="text-gray-700">Address: [Company Address]</p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="bg-[#FEF7D4] border border-[#E6D29A] rounded-lg p-6 mt-8">
            <h3 className="text-lg font-bold text-black mb-3">
              Acknowledgment of Understanding
            </h3>
            <p className="text-gray-700 leading-relaxed">
              BY USING THE THEYAS LAW PLATFORM, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, 
              AND AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS. IF YOU DO NOT AGREE TO THESE 
              TERMS, YOU MUST NOT ACCESS OR USE OUR SERVICES.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
