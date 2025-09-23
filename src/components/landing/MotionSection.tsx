"use client";
import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef, ReactNode } from 'react';

interface MotionSectionProps { children: ReactNode; className?: string; delay?: number; y?: number; }

export default function MotionSection({ children, className='', delay=0, y=24 }: MotionSectionProps){
  const ref = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });

  useEffect(()=>{ if(inView) controls.start('visible'); },[inView,controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity:0, y },
        visible: { opacity:1, y:0, transition:{ duration:0.7, ease:[0.16,0.84,0.44,1], delay } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
