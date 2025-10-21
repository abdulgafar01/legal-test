import Link from 'next/link';
import MotionSection from './MotionSection';
import { FaCheckCircle } from 'react-icons/fa';

export default function CTAForLawyers(){
  return (
  <section className="py-16 md:mx-10 md:rounded-3xl bg-[#FEF7D4] font-jost   relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#FEF7D4] via-white/40 to-[#FEF7D4]" />
      <div className="relative max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
        <MotionSection className="flex-1">
          <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-4 leading-snug">Legal Practitioner? <span className="text-gradient-gold">Grow your practice</span> with integrated AI.</h2>
          <p className="text-gray-700 text-lg mb-6 max-w-xl">Join a modern legal network. Respond to qualified client matters, leverage AI copilots for faster drafting, and build recurring advisory relationships.</p>
          <ul className="text-sm text-gray-700 space-y-2 mb-6">
            {[
              'Verified profile & domain‑specific tagging',
              'Smart proposal + billing workflow',
              'AI assisted contract & policy generation',
              'Global clients seeking remote counsel'
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <FaCheckCircle className="text-[#BE9C05] mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link href="/account?type=lawyer" className="btn-primary text-sm">Register as a Lawyer</Link>
        </MotionSection>
        <MotionSection delay={0.15} className="flex-1 grid grid-cols-2 gap-4 w-full">
          {['1200+ AI sessions monthly','48h avg lawyer response','30% lower client acquisition cost','Global compliance ready'].map(m => (
            <div key={m} className="rounded-lg bg-white/80 backdrop-blur border border-gray-200 p-4 text-sm font-semibold text-gray-800 flex items-center justify-center text-center">
              {m}
            </div>
          ))}
        </MotionSection>
      </div>
    </section>
  );
}
