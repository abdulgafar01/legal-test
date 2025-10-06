import MotionSection from './MotionSection';

const services = [
  { title: 'Startup & Company', desc: 'Entity setup, shareholder agreements, fundraising docs.' },
  { title: 'Contracts & Reviews', desc: 'AI pre-scan plus expert redlines for key agreements.' },
  { title: 'Immigration & Global Mobility', desc: 'Guidance for founders, expats & remote teams.' },
  { title: 'Intellectual Property', desc: 'Protect branding, code, data & proprietary algorithms.' },
  { title: 'Regulatory & Compliance', desc: 'Policy drafting, risk analysis, governance alignment.' },
  { title: 'Dispute Strategy', desc: 'Early case assessment & practitioner escalation.' },
];

export default function Services(){
  return (
  <section id="services" className="relative py-24 bg-white font-[family-name:var(--font-jost)] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#FEF7D4]/20 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-6">
        <MotionSection className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-3">Services we power</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">AI gives you instant direction. Human experts finalize strategy & execution. A hybrid legal workflow built for speed, accuracy and affordability.</p>
        </MotionSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s,i) => (
            <MotionSection key={s.title} delay={0.05 * i} className="group border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition">
              <h3 className="font-bold text-lg mb-2 text-black group-hover:text-[#BE9C05]">{s.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
            </MotionSection>
          ))}
        </div>
      </div>
    </section>
  );
}
