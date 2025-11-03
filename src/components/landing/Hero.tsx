"use client";
import Link from 'next/link';
import MotionSection from './MotionSection';
import { GradientBlob } from './Decorative';
import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Iphone from '../mock-up/Iphone';

export default function Hero(){
  return (
    <section id="home" className="relative bg-white py-24 overflow-hidden mx-auto font-jost">
      {/* soft top gradient to lift content */}
      <div className="absolute inset-x-0 -top-48 -z-10 h-72 bg-gradient-to-b from-[#FFF8EA] to-transparent" aria-hidden />
      <GradientBlob className="w-96 h-96 bg-[#E6D29A]/20 -top-12 -left-16" />
      <GradientBlob className="w-80 h-80 bg-[#FFF7E6]/40 bottom-6 -right-10" />

      <div className="md:mx-auto mx-6 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-10 flex-wrap">
        <MotionSection>
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '0px 0px -120px 0px' }}
            transition={{ duration: 0.7, ease: [0.16,0.84,0.44,1] }}
            className='max-w-2xl'
          >
         <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black leading-[1.1] mb-6">
            AI Powered Legal Guidance <span className="text-gradient-gold">meets Real Lawyers</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mb-8">
            TheYAS Law blends a smart AI legal assistant with a verified network of human legal practitioners. Get instant clarity on contracts, compliance, startups, immigration and more — then engage a professional when you need deeper help.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/account" className="btn-primary text-sm">Start Free</Link>
            <a href="#services" className="btn-secondary text-sm">Explore Services</a>
          </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                'AI trained on legal scenarios',
                'Book vetted lawyers instantly',
                'Secure chat & file sharing',
                'Transparent pricing'
              ].map(item => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full bg-[#FFF9ED] px-3 py-2 text-sm text-gray-700 border border-[#FAF0D6]">
                  <FaCheckCircle className="text-[#BE9C05] flex-shrink-0" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </motion.div>
        </MotionSection>

        <MotionSection delay={0.12} className="relative">
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px -120px 0px' }}
            transition={{ duration: 0.9, ease: [0.16,0.84,0.44,1] }}
            // className="w-full max-w-md md:max-w-none md:w-[460px] lg:w-[560px]"
          >
            <div className="relative mx-auto drop-shadow-2xl" aria-hidden>
              <div className="absolute -inset-10 blur-3xl opacity-30 bg-gradient-to-r from-[#FFF6E6] to-transparent rounded-full" />
              <Iphone />
              {/* <div className="absolute inset-0 -z-10 bg-gradient-radial from-[#FEF7D8]/60 via-transparent to-transparent rounded-full" /> */}
            </div>
            <p className="sr-only">Preview of the app on a mobile device</p>
          </motion.div>
        </MotionSection>
      </div>
    </section>
  );
}
