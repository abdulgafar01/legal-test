"use client";
import { useTranslations } from 'next-intl';
import MotionSection from './MotionSection';
interface Testimonial {
  name: string;
  country: string;
  quote: string;
}


export default function Testimonials(){
  const t = useTranslations('testimonials');
 const testimonials: Testimonial[] = [
    {
      quote: t('testimonial1.quote'),
      name: t('testimonial1.name'),
      country: t('testimonial1.country')
    },
    {
      quote: t('testimonial2.quote'),
      name: t('testimonial2.name'),
      country: t('testimonial2.country')
    },
    {
      quote: t('testimonial3.quote'),
      name: t('testimonial3.name'),
      country: t('testimonial3.country')
    }
  ];
  return (
  <section className="py-28 bg-white font-jost relative overflow-hidden" id="reviews"
  dir='ltr'>
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FEF7D4]/30 to-white" />
      <div className="relative max-w-6xl mx-auto px-6">
        <MotionSection className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-3">{t('heading')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t("subheading")}</p>
        </MotionSection>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t,i) => (
            <MotionSection key={t.name} delay={0.1 * i} className="rounded-xl border border-gray-200 p-6 bg-white/80 backdrop-blur">
              <p className="text-sm text-gray-700 leading-relaxed mb-6">“{t.quote}”</p>
              <div className="text-sm font-semibold text-black">{t.name}</div>
              <div className="text-xs text-gray-500">{t.country}</div>
            </MotionSection>
          ))}
        </div>
      </div>
    </section>
  );
}
