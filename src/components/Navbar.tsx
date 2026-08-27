import { Hexagon } from "lucide-react";
import { useReveal } from "../hooks/useReveal";

const NAV_LINKS = [
  { label: "About" },
  { label: "Experience" },
  { label: "Skills" },
  { label: "Contact" },
];

function RevealItem({ children, delay }: { children: React.ReactNode; delay: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        opacity: visible ? 1 : 0,
        transition: "all 700ms ease-out",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/15"
      style={{ background: "rgba(10,10,10,0.50)", backdropFilter: "blur(16px)" }}
    >
      <div className="mx-auto flex w-full items-center justify-between px-5 py-3 sm:px-8 md:px-12">
        <RevealItem delay={0}>
          <a href="/" className="flex items-center gap-2 text-white no-underline">
            <Hexagon size={24} strokeWidth={1.5} className="text-white" />
            <span className="text-lg font-medium tracking-tight sm:text-xl">
              zhordex.dev
            </span>
          </a>
        </RevealItem>
        <div className="hidden items-center gap-8 md:flex lg:gap-10">
          {NAV_LINKS.map((link, i) => (
            <RevealItem key={link.label} delay={100 + i * 100}>
              <a
                href={`#${link.label.toLowerCase()}`}
                className="text-sm text-white/85 transition-colors duration-300 hover:text-white"
              >
                {link.label}
              </a>
            </RevealItem>
          ))}
        </div>
        <RevealItem delay={500}>
          <a
            href="mailto:aeihla.graphics@gmail.com"
            className="rounded-md border border-white/20 bg-white/15 px-4 py-2 text-xs text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/25 sm:px-5 sm:text-sm"
          >
            Hire Me
          </a>
        </RevealItem>
      </div>
    </nav>
  );
}
