import React, { useState } from 'react';
import { Check, Sparkles, Shield, Zap, HelpCircle } from 'lucide-react';

export const PricingSection = ({ onSelectTier }) => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'

  const isAnnual = billingCycle === 'annual';

  const tiers = [
    {
      id: 'free',
      name: 'Free Canvas',
      badge: 'Starter',
      description: 'Essential multi-modal reasoning for individuals exploring document chat.',
      price: {
        monthly: 0,
        annual: 0,
      },
      period: 'forever',
      buttonText: 'Start Free',
      buttonStyle: 'secondary',
      popular: false,
      features: [
        '5 document uploads / month',
        'Max 25MB file size limit',
        'Standard Deep Sea reasoning model',
        'Real-time context grounding inspector',
        'Community Discord support',
      ],
      unavailable: [
        'Advanced visual OCR & bounding boxes',
        'Python code execution sandbox',
        'Priority low-latency retrieval',
      ],
    },
    {
      id: 'pro',
      name: 'Pro Reasoning',
      badge: 'Most Popular',
      description: 'Full computational power for researchers, engineers, and power analysts.',
      price: {
        monthly: 20,
        annual: 16,
      },
      period: isAnnual ? '/mo, billed annually' : '/month',
      buttonText: 'Get Started with Pro',
      buttonStyle: 'primary',
      popular: true,
      features: [
        'Unlimited document & dataset uploads',
        'Up to 250MB per document (PDF, DOCX, CSV)',
        'Priority Deep Sea Engine v2.4 reasoning',
        'Sub-pixel OCR & visual bounding inspector',
        'In-memory Python 3.11 execution sandbox',
        'Export citations as Markdown & PDF reports',
        'Priority email & developer ticket support',
      ],
      unavailable: [],
    },
    {
      id: 'enterprise',
      name: 'Enterprise Grid',
      badge: 'Dedicated Scale',
      description: 'Custom security, VPC deployments, and dedicated compute for organizations.',
      price: {
        monthly: 'Custom',
        annual: 'Custom',
      },
      period: 'contact sales for pricing',
      buttonText: 'Contact Sales',
      buttonStyle: 'secondary',
      popular: false,
      features: [
        'Dedicated isolated compute VPC instances',
        'Guaranteed zero data retention (ZDR)',
        'SOC-2 Type II & HIPAA compliance SLA',
        'Custom REST API & vector database sync',
        'SAML 2.0 SSO & role-based access control',
        'Dedicated Technical Account Manager',
        '99.99% uptime guarantee SLA',
      ],
      unavailable: [],
    },
  ];

  return (
    <section id="pricing" className="py-24 px-4 md:px-10 max-w-[1440px] mx-auto text-center scroll-mt-20">
      {/* Section Badge & Title */}
      <div className="max-w-3xl mx-auto mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#08101d] border border-[#38bdf8]/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
          <span className="font-mono text-xs font-bold text-[#38bdf8] tracking-wider uppercase">
            TRANSPARENT PRICING
          </span>
        </div>

        <h2
          className="text-3xl sm:text-4xl md:text-5xl text-[#f4f4f5] tracking-tight font-extrabold"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Predictable plans for individuals and teams.
        </h2>

        <p className="text-base sm:text-lg text-[#94a3b8] max-w-2xl mx-auto leading-relaxed font-sans">
          Scale effortlessly from individual document analysis to enterprise-wide knowledge infrastructure.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <div className="bg-[#08101d] p-1 rounded-xl border border-[#1e293b] inline-flex items-center shadow-inner">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                !isAnnual
                  ? 'bg-[#38bdf8] text-slate-950 shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f4f4f5]'
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                isAnnual
                  ? 'bg-[#38bdf8] text-slate-950 shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f4f4f5]'
              }`}
            >
              <span>Annual billing</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold tracking-tight ${
                  isAnnual ? 'bg-slate-950/20 text-slate-950' : 'bg-[#38bdf8]/20 text-[#38bdf8]'
                }`}
              >
                SAVE 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Tier Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto text-left items-stretch">
        {tiers.map((tier) => {
          const isPrimary = tier.popular;
          const displayPrice = isAnnual ? tier.price.annual : tier.price.monthly;

          return (
            <div
              key={tier.id}
              className={`rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ease-out relative hover:scale-[1.01] active:scale-[0.99] ${
                isPrimary
                  ? 'bg-[#091424] border-2 border-[#38bdf8] shadow-[0_0_40px_rgba(56,189,248,0.25)] hover:shadow-[0_0_50px_rgba(56,189,248,0.35)] lg:-translate-y-2'
                  : 'bg-[#08101d] border border-[#1e293b] hover:border-[#38bdf8]/50 hover:bg-[#091424]/70 hover:shadow-[0_0_30px_rgba(56,189,248,0.15)] shadow-lg'
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#38bdf8] text-slate-950 text-[10px] font-mono font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                  {tier.badge}
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className="text-xl text-[#f4f4f5] font-bold"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    {tier.name}
                  </h3>
                  {!tier.popular && (
                    <span className="text-[10px] font-mono text-[#94a3b8] bg-[#1e293b]/50 px-2 py-0.5 rounded border border-[#1e293b]">
                      {tier.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#94a3b8] leading-relaxed min-h-[36px] mb-6">
                  {tier.description}
                </p>

                {/* Price Display */}
                <div className="mb-6 pb-6 border-b border-[#1e293b]">
                  <div className="flex items-baseline gap-1">
                    {typeof displayPrice === 'number' ? (
                      <>
                        <span
                          className="text-4xl sm:text-5xl font-extrabold text-[#f4f4f5] tracking-tight"
                          style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                          ${displayPrice}
                        </span>
                        <span className="text-xs font-mono text-[#94a3b8]">
                          {tier.period}
                        </span>
                      </>
                    ) : (
                      <span
                        className="text-3xl sm:text-4xl font-extrabold text-[#f4f4f5] tracking-tight"
                        style={{ fontFamily: 'Sora, sans-serif' }}
                      >
                        {displayPrice}
                      </span>
                    )}
                  </div>
                  {isAnnual && typeof displayPrice === 'number' && displayPrice > 0 && (
                    <span className="text-[11px] font-mono text-[#38bdf8] block mt-1">
                      Billed as ${(displayPrice * 12)} / year
                    </span>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <div className="text-[11px] font-mono font-bold text-[#64748b] uppercase tracking-wider">
                    Included Capabilities
                  </div>

                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#f4f4f5]">
                      <div className="w-4 h-4 rounded-full bg-[#38bdf8]/15 text-[#38bdf8] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span className="leading-snug">{feature}</span>
                    </div>
                  ))}

                  {tier.unavailable &&
                    tier.unavailable.map((feature, idx) => (
                      <div
                        key={`un-${idx}`}
                        className="flex items-start gap-2.5 text-xs text-[#64748b] opacity-60"
                      >
                        <div className="w-4 h-4 rounded-full bg-slate-800 text-[#64748b] flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] leading-none">✕</span>
                        </div>
                        <span className="leading-snug line-through">{feature}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectTier(tier.id)}
                className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  tier.buttonStyle === 'primary'
                    ? 'bg-[#38bdf8] text-slate-950 hover:bg-[#38bdf8]/90 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_35px_rgba(56,189,248,0.65)] hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-[#0e1928] border border-[#1e293b] text-[#f4f4f5] hover:border-[#38bdf8]/50 hover:bg-[#15273e]'
                }`}
              >
                {tier.buttonText}
              </button>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="mt-14 max-w-4xl mx-auto pt-8 border-t border-[#1e293b]/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
        <div className="flex items-center gap-3 justify-center sm:justify-start text-xs text-[#94a3b8]">
          <Shield className="w-4 h-4 text-[#38bdf8] shrink-0" />
          <span>Zero-Data Retention Guaranteed</span>
        </div>
        <div className="flex items-center gap-3 justify-center sm:justify-start text-xs text-[#94a3b8]">
          <Zap className="w-4 h-4 text-[#38bdf8] shrink-0" />
          <span>Instant setup with no lock-in</span>
        </div>
        <div className="flex items-center gap-3 justify-center sm:justify-start text-xs text-[#94a3b8]">
          <Sparkles className="w-4 h-4 text-[#38bdf8] shrink-0" />
          <span>14-day money-back guarantee</span>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
