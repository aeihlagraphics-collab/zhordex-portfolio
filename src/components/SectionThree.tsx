import Reveal from "./Reveal";

const SKILL_GROUPS = [
  {
    category: "Fraud & Risk",
    skills: ["Featurespace", "SEON", "Iovation", "NTS", "Boss", "Openbet", "AML/KYC", "Chargeback Mgmt", "Transaction Monitoring"],
  },
  {
    category: "Payment Gateways",
    skills: ["Trustly", "PayPal", "Safecharge", "Credorax", "Bibit", "Inpay", "Paize", "SC Barclays", "Reconciliation"],
  },
  {
    category: "Data & Analytics",
    skills: ["MS Excel (Advanced)", "Pivot Tables", "Conditional Formatting", "Data Extraction", "Root-Cause Analysis"],
  },
  {
    category: "Enterprise Tools",
    skills: ["Zendesk", "UiPath (RPA)", "LivePerson", "Slack", "Qcenter", "CRM Systems"],
  },
];

const STATS = [
  { value: "4+", label: "Years in Payments & Fraud" },
  { value: "10+", label: "Payment Processors" },
  { value: "100%", label: "SLA Adherence" },
  { value: "Multi", label: "Brand Operations" },
];

export default function SectionThree() {
  return (
    <section
      id="skills"
      className="flex min-h-screen flex-col justify-between px-5 pb-12 pt-24 supports-[height:100svh]:min-h-[100svh] sm:px-8 sm:pt-28 md:px-12 md:pb-16"
    >
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <Reveal delay={120}>
          <div className="inline-flex items-center border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white">
              Skills &amp; Tool Proficiency
            </span>
          </div>
        </Reveal>
        <Reveal delay={220}>
          <p className="max-w-sm text-lg leading-relaxed text-white drop-shadow-md sm:text-right sm:text-xl">
            Deep fluency across the full payments stack — detection, processing,
            reconciliation, and compliance.
          </p>
        </Reveal>
      </div>

      <Reveal delay={200}>
        <div className="mt-12 grid grid-cols-2 overflow-hidden rounded-2xl border border-white/15 bg-white/15 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-center gap-1 bg-white/5 px-4 py-6 text-center backdrop-blur-md">
              <span className="text-3xl font-normal tracking-tight text-white drop-shadow-lg sm:text-4xl">{stat.value}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/55">{stat.label}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-12 flex flex-1 flex-col justify-end">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SKILL_GROUPS.map((group, i) => (
            <Reveal key={group.category} delay={180 + i * 100}>
              <div className="h-full rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.15em] text-white/55">{group.category}</div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span key={skill} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur-md">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
