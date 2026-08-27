import { ChevronRight } from "lucide-react";
import Reveal from "./Reveal";

const SPECIALIZATIONS = [
  "/ PAYMENTS RECONCILIATION",
  "/ FRAUD & RISK DETECTION",
  "/ AML / KYC COMPLIANCE",
];

export default function SectionOne() {
  return (
    <section
      id="about"
      className="flex min-h-screen flex-col justify-between px-5 pb-12 pt-24 supports-[height:100svh]:min-h-[100svh] sm:px-8 sm:pt-28 md:px-12 md:pb-16"
    >
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          {SPECIALIZATIONS.map((s, i) => (
            <Reveal key={s} delay={150 + i * 120}>
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-white/90 drop-shadow-md">
                {s}
              </span>
            </Reveal>
          ))}
        </div>
        <Reveal delay={300}>
          <p className="max-w-xs text-lg leading-relaxed text-white drop-shadow-md sm:text-right sm:text-xl">
            Almost 4 years driving transaction integrity, fraud mitigation, and
            payment optimization across multi-brand environments.
          </p>
        </Reveal>
      </div>

      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal delay={150}>
            <div className="mb-5 inline-flex items-center border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white">
                Sr. Payments &amp; Fraud Analyst — Open to Opportunities
              </span>
            </div>
          </Reveal>
          <Reveal delay={280}>
            <h1 className="text-5xl font-normal leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
              Precise. Secure.
              <br />
              Compliant.
            </h1>
          </Reveal>
        </div>
        <Reveal delay={420}>
          <div className="flex items-center gap-4 rounded-xl bg-white/15 p-3 backdrop-blur-md">
            <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-lg bg-white/20 text-xl font-semibold text-white">
              ZC
            </div>
            <div className="flex flex-col gap-1.5 pr-2">
              <span className="text-sm font-medium text-white">Zhordex B. Carino Jr</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">
                Sr. Payments Analyst
              </span>
              <a
                href="mailto:aeihla.graphics@gmail.com"
                className="mt-1.5 flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-medium text-black transition-colors duration-300 hover:bg-white/85"
              >
                Get in touch
                <ChevronRight size={14} />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
