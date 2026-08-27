import { ChevronRight, Mail, Phone, MapPin } from "lucide-react";
import Reveal from "./Reveal";

const CONTACT_ITEMS = [
  { icon: Mail, label: "Email", value: "aeihla.graphics@gmail.com", href: "mailto:aeihla.graphics@gmail.com" },
  { icon: Phone, label: "Mobile", value: "0956-834-8313", href: "tel:+639568348313" },
  { icon: MapPin, label: "Location", value: "Trece Martires City, Cavite, PH", href: null },
];

export default function SectionFour() {
  return (
    <section
      id="contact"
      className="flex min-h-screen flex-col justify-between px-5 pb-12 pt-24 supports-[height:100svh]:min-h-[100svh] sm:px-8 sm:pt-28 md:px-12 md:pb-16"
    >
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <Reveal delay={120}>
          <div className="inline-flex items-center border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white">Get In Touch</span>
          </div>
        </Reveal>
        <Reveal delay={220}>
          <p className="max-w-sm text-lg leading-relaxed text-white drop-shadow-md sm:text-right sm:text-xl">
            Available for senior payments, fraud analytics, and fintech compliance roles globally.
          </p>
        </Reveal>
      </div>

      <div className="flex flex-1 flex-col justify-end">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between md:gap-16">
          <div className="max-w-xl">
            <Reveal delay={180}>
              <h2 className="text-5xl font-normal leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
                Ready to
                <br />
                add value.
              </h2>
            </Reveal>
            <Reveal delay={320}>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-white/80 drop-shadow-md sm:text-base">
                Whether you need tighter fraud controls, cleaner reconciliation flows, or a payments expert who thrives in high-volume fintech — let's talk.
              </p>
            </Reveal>
            <Reveal delay={420}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="mailto:aeihla.graphics@gmail.com" className="flex items-center gap-1 rounded-full bg-white px-5 py-2.5 text-xs font-medium text-black transition-colors duration-300 hover:bg-white/85 sm:text-sm">
                  Send me an email <ChevronRight size={14} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-xs text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/20 sm:text-sm">
                  LinkedIn Profile
                </a>
              </div>
            </Reveal>
          </div>

          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 px-5 backdrop-blur-md sm:px-6">
            {CONTACT_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.label} delay={300 + i * 110}>
                  <div className={`flex gap-5 py-5 ${i < CONTACT_ITEMS.length - 1 ? "border-b border-white/15" : ""}`}>
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10">
                      <Icon size={14} className="text-white/70" />
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="mt-0.5 text-sm font-medium text-white transition-colors duration-300 hover:text-white/80 sm:text-base">{item.value}</a>
                      ) : (
                        <p className="mt-0.5 text-sm font-medium text-white sm:text-base">{item.value}</p>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
            <Reveal delay={630}>
              <div className="border-t border-white/15 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
                  Cavite, Philippines · UTC+8 · Open to Remote &amp; On-site
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
