import MotionSection from './MotionSection';

const testimonials = [
  { name: 'Startup Founder', country: 'Estonia', quote: 'We validated a funding term sheet in hours, not days. AI clarified the basics, the lawyer polished the final edits.' },
  { name: 'Operations Lead', country: 'Portugal', quote: 'Contract review flow is brilliant. The hybrid model saves both budget and internal time.' },
  { name: 'Immigration Client', country: 'UAE', quote: 'Clear AI guidance first, then a specialist lawyer who handled everything seamlessly.' },
];

export default function Testimonials(){
  return (
  <section className="py-28 bg-white font-[family-name:var(--font-jost)] relative overflow-hidden" id="reviews">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FEF7D4]/30 to-white" />
      <div className="relative max-w-6xl mx-auto px-6">
        <MotionSection className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-3">What clients say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Trusted by founders, operators and remote professionals solving real legal matters daily.</p>
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
