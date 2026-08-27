import { ChevronRight } from "lucide-react";
import Reveal from "./Reveal";

const EXPERIENCE = [
  {
    index: "01",
    role: "Sr. Payments Analyst",
    company: "Evoke Philippines",
    period: "Jul 2024 – Aug 2026",
    body: "Reconciled high-volume daily transactions across Credorax, Trustly, PayPal & Safecharge. Led root-cause analysis on payment failures and optimized routing & approval rates.",
  },
  {
    index: "02",
    role: "Fraud & Payments SME",
    company: "Evoke Philippines",
    period: "Jan 2023 – Jul 2024",
    body: "Real-time transaction monitoring via Featurespace, SEON & Iovation. End-to-end KYC/AML verification, chargeback trend analysis, and multi-brand QA.",
  },
  {
    index: "03",
    role: "Technical Support Rep",
    company: "iQor / T-Mobile",
    period: "Mar 2022 – Dec 2022",
    body: "Omnichannel support maintaining target AHT & FCR. Resolved billing, hardware, and network issues while driving upsell revenue.",
  },
];

export default function SectionTwo() {
  return (
    <section
      id="experience"
      className="flex min-h-screen flex-col justify-between px-5 pb-12 pt-24 supports-[height:100svh]:min-h-[100svh] sm:px-8 sm:pt-28 md:px-12 md:pb-16"
    >
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <Reveal delay={120}>
          <div className="inline-flex items-center border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white">
              Professional Experience
            </span>
          </div>
        </Reveal>
        <Reveal delay={220}>
          <p className="max-w-sm text-lg leading-relaxed text-white drop-shadow-md sm:text-right sm:text-xl">
            A track record of protecting revenue, eliminating fraud, and keeping
            payment pipelines clean — at scale.
          </p>
        </Reveal>
      </div>

      <div className="flex flex-1 flex-col justify-end">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between md:gap-16">
          <div className="max-w-xl">
            <Reveal delay={180}>
              <h2 className="text-5xl font-normal leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
                Built on real
                <br />
                transactions.
              </h2>
            </Reveal>
            <Reveal delay={320}>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-white/80 drop-shadow-md sm:text-base">
                From detecting card fraud rings to reconciling multi-processor
                ledgers — every role has sharpened the instinct to find the
                signal in the noise, fast.
              </p>
            </Reveal>
            <Reveal delay={420}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="mailto:aeihla.graphics@gmail.com"
                  className="flex items-center gap-1 rounded-full bg-white px-5 py-2.5 text-xs font-medium text-black transition-colors duration-300 hover:bg-white/85 sm:text-sm"
                >
                  Let's connect
                  <ChevronRight size={14} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-xs text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/20 sm:text-sm"
                >
                  View LinkedIn
                </a>
              </div>
            </Reveal>
          </div>

          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 px-5 backdrop-blur-md sm:px-6">
            {EXPERIENCE.map((exp, i) => (
              <Reveal key={exp.index} delay={300 + i * 110}>
                <div className={`flex gap-5 py-5 ${i < EXPERIENCE.length - 1 ? "border-b border-white/15" : ""}`}>
                  <span className="mt-0.5 shrink-0 font-mono text-[11px] tracking-[0.15em] text-white/55">
                    {exp.index}
                  </span>
                  <div className="flex-1">
                    <div className="group flex items-center justify-between">
                      <div>
                        <span className="text-base font-medium text-white sm:text-lg">{exp.role}</span>
                        <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">
                          {exp.company} · {exp.period}
                        </div>
                      </div>
                      <ChevronRight size={16} className="shrink-0 text-white/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white" />
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/70">{exp.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
