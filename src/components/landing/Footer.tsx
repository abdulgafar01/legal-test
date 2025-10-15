import MotionSection from './MotionSection';

export default function Footer(){
  return (
  <footer className="relative bg-[#FEF7D4] border-t border-gray-200 font-jost overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-[#FEF7D4] via-[#FEF7D4]/80 to-[#FEF7D4] opacity-60 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <MotionSection>
          <h3 className="text-xl font-extrabold text-black mb-3">TheYAS<span className="text-gradient-gold">Law</span></h3>
          <p className="text-sm text-gray-600 leading-relaxed max-w-xs">Hybrid AI + human legal network delivering faster clarity and better outcomes for modern businesses & professionals.</p>
        </MotionSection>
        <MotionSection delay={0.05}>
          <h4 className="text-sm font-bold text-black mb-3 uppercase tracking-wide">Company</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            {['About','Blog','Careers','Press'].map(i => <li key={i}><a href="#" className="hover:text-black">{i}</a></li>)}
          </ul>
        </MotionSection>
        <MotionSection delay={0.1}>
          <h4 className="text-sm font-bold text-black mb-3 uppercase tracking-wide">Resources</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            {['Help Center','Security','API','Status'].map(i => <li key={i}><a href="#" className="hover:text-black">{i}</a></li>)}
          </ul>
        </MotionSection>
        <MotionSection delay={0.15}>
          <h4 className="text-sm font-bold text-black mb-3 uppercase tracking-wide">Legal</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            {['Privacy','Terms','Cookies','Licenses'].map(i => <li key={i}><a href="#" className="hover:text-black">{i}</a></li>)}
          </ul>
        </MotionSection>
      </div>
  <div className="relative border-t border-gray-300 py-6 text-center text-xs text-gray-600">© {new Date().getFullYear()} TheYAS Law. All rights reserved.</div>
    </footer>
  );
}
