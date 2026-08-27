import ScrollVideo from "./components/ScrollVideo";
import Navbar from "./components/Navbar";
import SectionOne from "./components/SectionOne";
import SectionTwo from "./components/SectionTwo";
import SectionThree from "./components/SectionThree";
import SectionFour from "./components/SectionFour";

export default function App() {
  return (
    <div className="relative" style={{ background: "#0a0a0a" }}>
      <ScrollVideo />
      <div className="relative z-10">
        <Navbar />
        <main>
          <SectionOne />
          <div className="h-[80vh]" aria-hidden="true" />
          <SectionTwo />
          <div className="h-[80vh]" aria-hidden="true" />
          <SectionThree />
          <div className="h-[80vh]" aria-hidden="true" />
          <SectionFour />
        </main>
        <footer className="border-t border-white/10 px-5 py-6 sm:px-8 md:px-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/35">
              © 2026 Zhordex B. Carino Jr · Sr. Payments &amp; Fraud Analyst
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/35">
              Trece Martires City, Cavite · Philippines
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
