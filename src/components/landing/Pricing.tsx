"use client";
import MotionSection from './MotionSection';
import { FaCheckCircle } from 'react-icons/fa';
import { DividerWave } from './Decorative';
import { useEffect, useState } from 'react';
import { API_ENDPOINTS, buildApiUrl } from '@/config/api';
import axios from 'axios';

interface Plan {
  id: string;
  code: string;
  name: string;
  description: string;
  interval_unit: string;
  interval_count: number;
  is_trial: boolean;
  price_amount: string;
  currency: string;
}

interface Tier {
  name: string; price: string; tagline: string; features: string[]; cta: string; highlight?: boolean; practitioner?: boolean;
}

export default function Pricing(){
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(()=>{
    let cancelled = false;
    (async () => {
      try {
        // Attempt authenticated fetch; if unauthenticated (401) gracefully fall back
        const url = buildApiUrl(API_ENDPOINTS.subscriptions.plans);
        const res = await axios.get<Plan[]>(url, { withCredentials: true });
        const data = res.data.filter(p => !p.is_trial);
        if(cancelled) return;
        const mapped: Tier[] = [
          {
            name: 'Guest',
            price: '$0',
            tagline: 'Limited daily AI answers',
            features: [
              'AI assistant (daily limit)',
              'Basic contract highlights',
              'Create & save 1 thread',
              'Upgrade anytime'
            ],
            cta: 'Start Free',
            highlight: false
          }
        ].concat(data.map((p,i) => ({
          name: p.name.replace(/\b(Plan|Subscription)\b/gi,'' ).trim(),
          price: `${p.currency === 'USD' ? '$' : ''}${Number(p.price_amount).toLocaleString(undefined,{minimumFractionDigits:0})}`,
          tagline: p.description || 'Full platform access',
          features: [
            'Unlimited AI queries',
            'Document insights & summaries',
            'Secure workspace',
            'Priority practitioner matching'
          ],
          cta: 'Get Started',
          highlight: i === 0
        })));
        // Append practitioner tier
        mapped.push({
          name: 'Practitioner', price: 'Apply', tagline: 'Earn on the network', features: [
            'Client leads', 'AI drafting copilots', 'Engagement dashboard', 'Compliance & KYC support', 'Proposal workflow'
          ], cta: 'Register as Lawyer', practitioner: true
        });
        setTiers(mapped);
      } catch (e:any) {
        if(cancelled) return;
        setError('Unable to load live pricing; showing defaults.');
        setTiers([
          { name: 'Guest', price: '$0', tagline: 'Limited daily AI answers', features: ['AI assistant (daily limit)','Basic contract highlights','Create & save 1 thread','Upgrade anytime'], cta: 'Start Free', highlight:false },
          { name: 'Pro', price: '$49', tagline: 'For growing teams', features: ['Unlimited AI queries','Advanced document analysis','Priority lawyer matching','Secure document vault','Collaboration workspace'], cta: 'Get Started', highlight:true },
          { name: 'Practitioner', price: 'Apply', tagline: 'Earn on the network', features: ['Client leads','AI drafting copilots','Engagement dashboard','Compliance & KYC support','Proposal workflow'], cta: 'Register as Lawyer', practitioner:true }
        ]);
      } finally { if(!cancelled) setLoading(false); }
    })();
    return ()=>{ cancelled = true; };
  },[]);

  return (
  <section id="pricing" className="relative py-28 bg-gradient-to-b from-white via-[#FEF7D4]/40 to-white font-jost border-t border-gray-100 overflow-hidden">
      <DividerWave />
      <div className="relative max-w-7xl mx-auto px-6">
        <MotionSection className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-3">Simple, transparent pricing</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">No trial tier — guests can explore the AI assistant with limited daily queries before upgrading.</p>
          {error && <p className="text-xs text-amber-600 mt-2">{error}</p>}
        </MotionSection>
        {loading ? (
          <div className="text-center text-sm text-gray-500">Loading plans...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((t,i) => (
              <MotionSection key={t.name} delay={0.08 * i} className={`relative rounded-xl border ${t.highlight? 'border-[#BE9C05] shadow-lg shadow-yellow-900/10':'border-gray-200'} bg-white/80 backdrop-blur p-8 flex flex-col`}>
                {t.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#BE9C05] text-white text-xs font-semibold px-3 py-1 rounded-full">POPULAR</span>}
                <h3 className="text-lg font-bold text-black mb-1">{t.name}</h3>
                <p className="text-sm text-gray-500 mb-6">{t.tagline}</p>
                <div className="text-4xl font-extrabold text-black mb-6">{t.price}<span className="text-base font-medium text-gray-500 ml-1">{t.price !== 'Apply' && '/mo'}</span></div>
                <ul className="space-y-2 text-sm text-gray-600 mb-8 flex-1">
                  {t.features.map(f => (
                    <li key={f} className="flex items-start gap-2">
                      <FaCheckCircle className="text-[#BE9C05] mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href={t.practitioner? '/signup/practitioner':'/signup/seeker'} className={`text-center ${t.highlight? 'btn-primary':'btn-secondary'} text-sm`}>{t.cta}</a>
              </MotionSection>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
