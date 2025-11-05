import Link from 'next/link';
import MotionSection from './MotionSection';
import { GradientBlob } from './Decorative';
import Image from 'next/image';
import { FaCheckCircle } from 'react-icons/fa';
import Iphone from '../mock-up/Iphone';

export default function Hero(){
  return (
  <section id="home" className="relative bg-white pt-20 pb-32 overflow-hidden mx-auto font-jost">
      <div className="absolute inset-x-0 -top-40 -z-10 h-64 bg-gradient-to-b from-yellow-50 to-transparent" />
      <GradientBlob className="w-80 h-80 bg-[#BE9C05]/30 -top-10 -left-10" />
      <GradientBlob className="w-96 h-96 bg-[#FEF7D4] bottom-0 -right-10" />
      <div className="max-w-[96rem] mx-auto px-6 lg:px-12 grid md:grid-cols-[1fr_1.6fr] gap-16 items-center relative">
        <MotionSection>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black leading-[1.1] mb-6">
            AI Powered Legal Guidance <span className="text-gradient-gold">meets Real Lawyers</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mb-8">
            TheYAS Law blends a smart AI legal assistant with a verified network of human legal practitioners. Get instant clarity on contracts, compliance, startups, immigration and more — then engage a professional when you need deeper help.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/signup/seeker" className="btn-primary text-sm">Start Free</Link>
            <a href="#services" className="btn-secondary text-sm">Explore Services</a>
          </div>
          <ul className="mt-8 text-sm text-gray-600 space-y-2">
            {[
              'Instant AI answers trained for legal context',
              'On‑demand consultations with vetted lawyers',
              'Secure workspace for documents & chats'
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <FaCheckCircle className="text-[#BE9C05] mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </MotionSection>
        
        <MotionSection delay={0.15} className="relative flex items-center justify-center overflow-visible">
          <div className="relative w-full overflow-visible ">
            {/* <Image src="/landing-page-laptop.png" alt="Platform preview" width={2200} height={1350} priority className="w-full max-w-4xl md:max-w-[70rem] lg:max-w-[85rem] xl:max-w-[92rem] mx-auto h-auto select-none pointer-events-none" /> */}
            <Iphone/>
            <div className="absolute -z-10 inset-0 bg-gradient-radial from-[#FEF7D4]/70 via-transparent to-transparent" />
          </div>
          {/* <Iphone/> */}
        </MotionSection>
      </div>
    </section>
  );
}
