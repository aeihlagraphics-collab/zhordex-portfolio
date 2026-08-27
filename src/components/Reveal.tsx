import { useReveal } from "../hooks/useReveal";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
}

export default function Reveal({ children, delay = 0 }: RevealProps) {
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
