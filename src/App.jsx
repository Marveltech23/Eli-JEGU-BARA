import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Menu, X, ArrowRight, ArrowUpRight, ChevronLeft, Mail, Phone, User,
  MapPin, Landmark, Scale, GraduationCap, Users, ShieldCheck,
} from "lucide-react";

/* lucide-react has no brand/logo icons (trademark reasons) — small inline SVGs instead. */
const Twitter = (props) => (
  <svg viewBox="0 0 24 24" width={props.size || 24} height={props.size || 24} fill="currentColor" {...props}>
    <path d="M18.9 2H22l-7.5 8.6L23.3 22h-6.9l-5.4-7-6.2 7H1.6l8-9.2L.8 2h7.1l4.9 6.4L18.9 2zm-1.2 18h1.9L7.4 4H5.4l12.3 16z" />
  </svg>
);
const Facebook = (props) => (
  <svg viewBox="0 0 24 24" width={props.size || 24} height={props.size || 24} fill="currentColor" {...props}>
    <path d="M13.5 21v-7.9h2.6l.4-3.1h-3v-2c0-.9.25-1.5 1.55-1.5H16.6V3.8C16.3 3.76 15.3 3.68 14.1 3.68c-2.4 0-4.1 1.47-4.1 4.16v2.32H7.4v3.1H10v7.9h3.5z" />
  </svg>
);
const Instagram = (props) => (
  <svg viewBox="0 0 24 24" width={props.size || 24} height={props.size || 24} fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const Youtube = (props) => (
  <svg viewBox="0 0 24 24" width={props.size || 24} height={props.size || 24} fill="currentColor" {...props}>
    <path d="M22.5 7.2s-.22-1.55-.9-2.24c-.85-.9-1.8-.9-2.24-.95C16.2 3.75 12 3.75 12 3.75h-.01s-4.2 0-7.36.26c-.44.05-1.39.05-2.24.95-.68.69-.9 2.24-.9 2.24S1.2 9 1.2 10.8v1.4c0 1.8.29 3.6.29 3.6s.22 1.55.9 2.24c.85.9 1.96.87 2.46.97C6.6 19.15 12 19.2 12 19.2s4.2 0 7.36-.27c.44-.05 1.39-.05 2.24-.95.68-.69.9-2.24.9-2.24s.29-1.8.29-3.6v-1.4c0-1.8-.29-3.6-.29-3.6zM9.75 14.6V8.9l5.5 2.85-5.5 2.85z" />
  </svg>
);
const Linkedin = (props) => (
  <svg viewBox="0 0 24 24" width={props.size || 24} height={props.size || 24} fill="currentColor" {...props}>
    <path d="M4.98 3.5a2.5 2.5 0 11-.02 5.001A2.5 2.5 0 014.98 3.5zM3 8.98h4v11.52H3zM9.5 8.98H13v1.57h.05c.5-.9 1.7-1.85 3.5-1.85 3.74 0 4.43 2.36 4.43 5.42v6.38h-4v-5.66c0-1.35-.02-3.08-1.87-3.08-1.88 0-2.17 1.46-2.17 2.98v5.76h-4V8.98z" />
  </svg>
);

/* ---------------------------------------------------------------------
   DESIGN TOKENS  (unchanged from the original build)
------------------------------------------------------------------------*/

const CONTAINER = "w-full max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-20";
const READ = "max-w-[62ch]";

/* ---------------------------------------------------------------------
   IMAGE PATHS — the ONLY place you need to edit.
   Put your files in  public/images/  and write the path starting with "/images/..."
   (do NOT write "public" in the path). Leave "" to keep the placeholder.
------------------------------------------------------------------------*/
const IMAGES = {
  logo: "/images/logo.png",                          // Logo mark: nav, footer, contact header (square / round works best)
  hero: "/images/govormor.jpeg",     // HOME: hero right panel (portrait)
  featured: "",                      // HOME: Featured priority "Kiri Dam Irrigation" (landscape)
  homeCards: ["/images/Health.jpeg", "/images/security.jpeg", "/images/agriculture.jpeg"],           // HOME: 3 manifesto cards, in order: Health, Security, Agriculture
  focusTop: "",                      // HOME: card "Two decades in law, governance…"
  focusBottom: "",                   // HOME: card "A manifesto built on health…"
  aboutPortrait: "/images/aboutpicture.jpeg",                 // ABOUT: biography portrait
  aboutBanner: "",                   // ABOUT: "No one left behind." banner (wide)
  manifestoHero: "",                 // MANIFESTO: header banner (wide)
  pillars: ["/images/healthmanifest.jpg", "/images/security.jpeg", "images/foodsecuirty.jpg", "/images/sport.jpg", "/images/infrastructure.jpg", "/images/policymachnaism.jpeg"], // MANIFESTO: 6 cards, in order: Health, Security, Agriculture, Sports/Youth/Education, Infrastructure, Policy & Funding
  contactPortrait: "/images/contact.jpeg",               // CONTACT: side portrait
};

function getImage(name, index) {
  const v = IMAGES[name];
  return Array.isArray(v) ? v[index] : v;
}

/* Renders nothing while the path is empty, so placeholders stay visible */
function Photo({ name, index, alt = "", fit = "cover", className = "" }) {
  const src = getImage(name, index);
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`absolute inset-0 w-full h-full ${fit === "contain" ? "object-contain" : "object-cover"} ${className}`}
    />
  );
}

/* Dark overlay that only appears when the slot has a photo (keeps text readable) */
function Shade({ name, index, className = "bg-black/40" }) {
  return getImage(name, index) ? <div className={`absolute inset-0 ${className}`} /> : null;
}

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
`;

/* Seal — signature mark / watermark */
function Seal({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <circle cx="32" cy="32" r="30" fill="#15171A" stroke="#E7E5E0" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="25" fill="none" stroke="#3A3D42" strokeWidth="0.75" />
      <circle cx="32" cy="32" r="20" fill="none" stroke="#3A3D42" strokeWidth="0.4" />
      <circle cx="32" cy="24" r="8" fill="#C9A876" />
      <path d="M20 50c2-9 6-13 12-13s10 4 12 13" fill="#C9A876" />
    </svg>
  );
}
function SealOutline({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="0.3" />
      <circle cx="32" cy="24" r="8" stroke="currentColor" strokeWidth="0.5" />
      <path d="M20 50c2-9 6-13 12-13s10 4 12 13" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
}

/* ---------------------------------------------------------------------
   SCROLL REVEAL
------------------------------------------------------------------------*/
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      } ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}

function useCountUp(target, inView, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const reduce = typeof window !== "undefined" &&
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(target);
      return;
    }
    let raf;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return value;
}

function StatCounter({ target, suffix = "", label }) {
  const [ref, inView] = useInView(0.6);
  const value = useCountUp(target, inView);
  return (
    <div ref={ref}>
      <div className="text-white text-3xl sm:text-4xl font-semibold tabular-nums" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {value}{suffix}
      </div>
      <div className="text-white/45 text-[11.5px] tracking-wide mt-1.5 max-w-[14ch]">{label}</div>
    </div>
  );
}

function Logo({ light, compact }) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      {/* IMAGE: logo */}
      <div className={`relative shrink-0 ${compact ? "w-9 h-9" : "w-9 h-9 sm:w-11 sm:h-11"}`}>
        {!IMAGES.logo && <Seal className="w-full h-full" />}
        <Photo name="logo" alt="Campaign logo" fit="contain" />
      </div>
      <div className="leading-tight">
        <div
          className={`font-semibold text-[13px] sm:text-[15px] tracking-tight ${light ? "text-white" : "text-[#15171A]"}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Chief Eli Jegu&#8209;Bara<br />Gamaliel
        </div>
        <div className={`text-[9px] sm:text-[10px] mt-0.5 ${light ? "text-white/50" : "text-black/40"}`}>
          Guyuk/Shelleng Federal Constituency &middot; Adamawa State
        </div>
      </div>
    </div>
  );
}

function Eyebrow({ children, dark }) {
  return (
    <div className="flex items-center gap-3 mb-7 sm:mb-9 lg:mb-10">
      <span className={`w-10 h-px ${dark ? "bg-white/40" : "bg-[#15171A]"}`} />
      <h2
        className={`font-semibold text-lg sm:text-xl lg:text-[22px] ${dark ? "text-white/70" : "text-[#7C8DA6]"}`}
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {children}
      </h2>
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="text-[10.5px] tracking-[0.16em] font-semibold text-[#E23A55] bg-[#E23A55]/10 px-3 py-1.5 rounded-full">
      {children.toUpperCase()}
    </span>
  );
}

function ButtonPrimary({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 bg-[#E23A55] text-white text-[12.5px] sm:text-[13px] font-semibold px-6 sm:px-7 py-4 tracking-wide rounded-full hover:bg-[#c72e47] active:scale-[0.98] transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E23A55] focus-visible:ring-offset-2 ${className}`}
    >
      {children}
      <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  );
}

function ButtonGhost({ children, onClick, light, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 text-[12.5px] sm:text-[13px] font-semibold px-6 sm:px-7 py-4 tracking-wide rounded-full border transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E23A55] focus-visible:ring-offset-2 ${
        light ? "border-white/25 text-white hover:border-white/60" : "border-black/15 text-[#15171A] hover:border-[#15171A]"
      } ${className}`}
    >
      {children}
    </button>
  );
}

/* ---------------------------------------------------------------------
   SCROLL PROGRESS
------------------------------------------------------------------------*/
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      setPct(max > 0 ? (scrolled / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-transparent motion-reduce:hidden">
      <div className="h-full bg-[#E23A55] transition-[width] duration-150 ease-out" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ---------------------------------------------------------------------
   NAV
------------------------------------------------------------------------*/
function Nav({ route, go }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const links = [
    ["home", "Home"],
    ["about", "About Chief Gamaliel"],
    ["speeches", "The Manifesto"],
    ["contact", "Contact"],
  ];

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur border-b transition-shadow duration-300 ${
        scrolled ? "border-[#E7E5E0] shadow-[0_1px_0_rgba(0,0,0,0.02),0_8px_24px_-16px_rgba(0,0,0,0.15)]" : "border-[#E7E5E0]/70"
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-[#15171A] focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:z-[100]">
        Skip to content
      </a>
      <div className={`${CONTAINER} h-[64px] sm:h-[76px] lg:h-[84px] flex items-center justify-between`}>
        <button onClick={() => go("home")} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E23A55] focus-visible:ring-offset-2 rounded-sm -m-1 p-1">
          <Logo />
        </button>

        <nav className="hidden lg:flex items-center gap-8 xl:gap-11" aria-label="Primary">
          {links.map(([id, label]) => (
            <button
              key={id}
              onClick={() => go(id)}
              aria-current={route === id ? "page" : undefined}
              className="relative py-2 text-[13.5px] xl:text-[14px] font-medium tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E23A55] rounded-sm group"
            >
              <span className={route === id ? "text-[#15171A]" : "text-black/55 group-hover:text-[#15171A]"}>{label}</span>
              <span className={`absolute left-0 -bottom-[1px] h-[2px] bg-[#E23A55] transition-all duration-300 ease-out ${route === id ? "w-full" : "w-0 group-hover:w-full"}`} />
            </button>
          ))}
        </nav>

        <div className="hidden lg:block">
          <ButtonGhost onClick={() => go("contact")} className="!py-3 !px-5 text-[12px]">Contact the Campaign</ButtonGhost>
        </div>

        <button
          className="lg:hidden relative w-11 h-11 -mr-2 flex items-center justify-center text-[#15171A] rounded-full hover:bg-black/5 active:bg-black/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E23A55]"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className="relative w-5 h-5">
            <Menu size={20} className={`absolute inset-0 transition-all duration-200 ${open ? "opacity-0 rotate-45 scale-75" : "opacity-100 rotate-0 scale-100"}`} />
            <X size={20} className={`absolute inset-0 transition-all duration-200 ${open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-45 scale-75"}`} />
          </span>
        </button>
      </div>

      <div
        className={`lg:hidden fixed inset-0 top-[64px] bg-black/30 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        className={`lg:hidden absolute left-0 right-0 top-full bg-white border-b border-[#E7E5E0] shadow-lg overflow-hidden transition-all duration-300 ease-out ${open ? "max-h-[460px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-5 py-3 flex flex-col gap-1">
          {links.map(([id, label], i) => (
            <button
              key={id}
              onClick={() => { go(id); setOpen(false); }}
              className="text-left text-[16px] font-medium text-[#15171A] py-4 px-3 rounded-lg hover:bg-black/[0.03] active:bg-black/[0.06] transition-colors flex items-center justify-between"
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
            >
              <span className={route === id ? "text-[#E23A55]" : ""}>{label}</span>
              <ArrowRight size={15} className="text-black/25" />
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------------
   FOOTER
------------------------------------------------------------------------*/
function Footer({ go }) {
  return (
    <footer className="bg-[#15171A] text-white">
      <div className={`${CONTAINER} pt-16 sm:pt-20 lg:pt-24 pb-8`}>
        <div className="grid lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10 lg:gap-8 pb-14 sm:pb-16 border-b border-white/10">
          <div>
            {/* IMAGE: logo (footer) */}
            <div className="relative w-12 h-12 mb-5">
              {!IMAGES.logo && <Seal className="w-full h-full" />}
              <Photo name="logo" alt="Campaign logo" fit="contain" />
            </div>
            <p className="text-white/50 text-[13.5px] leading-relaxed max-w-xs mb-6">
              The campaign of Chief Eli Jegu&#8209;Bara Gamaliel (ICMC, CMC, JP) for the Federal House of Representatives, representing Guyuk/Shelleng Federal Constituency, Adamawa State.
            </p>
            <div className="flex items-center gap-2.5">
              {[Twitter, Facebook, Instagram, Youtube, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 hover:bg-white/5 hover:scale-110 active:scale-95 transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] tracking-[0.15em] text-[#E23A55] font-semibold mb-5">EXPLORE</div>
            <ul className="space-y-3 text-[13.5px] text-white/60">
              <li><button onClick={() => go("home")} className="hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => go("about")} className="hover:text-white transition-colors">About Chief Gamaliel</button></li>
              <li><button onClick={() => go("speeches")} className="hover:text-white transition-colors">The Manifesto</button></li>
              <li><button onClick={() => go("contact")} className="hover:text-white transition-colors">Contact</button></li>
            </ul>
          </div>

          <div>
            <div className="text-[11px] tracking-[0.15em] text-[#E23A55] font-semibold mb-5">FOCUS AREAS</div>
            <ul className="space-y-3 text-[13.5px] text-white/60">
              <li>Health &amp; Rural PHCs</li>
              <li>Security &amp; Community Policing</li>
              <li>Agriculture &amp; Food Security</li>
              <li>Youth, Sports &amp; Infrastructure</li>
            </ul>
          </div>

          <div>
            <div className="text-[11px] tracking-[0.15em] text-[#E23A55] font-semibold mb-5">CREDENTIALS</div>
            <ul className="space-y-3 text-[13.5px] text-white/60">
              <li>Called to the Bar — 2005</li>
              <li>Founder, Lex Auxano &amp; Partners</li>
              <li>20+ years in legal practice</li>
              <li>Seeking — Guyuk/Shelleng Constituency</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-center sm:text-left">
          <p className="text-white/40 text-[12px] max-w-lg">
            &copy; 2026 Chief Eli Jegu&#8209;Bara Gamaliel Campaign. All rights reserved.
          </p>
          <p className="text-white/30 text-[12px]">Guyuk/Shelleng Federal Constituency, Adamawa State.</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------------
   HOME
------------------------------------------------------------------------*/
const AFFILIATIONS = ["University of Jos", "Nigerian Law School, Enugu/Abuja", "JK Gadzama SAN & Partners", "Lex Auxano & Partners", "Nigerian Bar Association"];

function Home({ go }) {
  const posts = [
    { tag: "Policy", label: "Manifesto Priority", title: "Health services & rural PHCs" },
    { tag: "Policy", label: "Manifesto Priority", title: "Security & community policing" },
    { tag: "Policy", label: "Manifesto Priority", title: "Agriculture & food security" },
  ];
  return (
    <>
      {/* HERO */}
      <section className="relative bg-[#15171A] overflow-hidden">
        <div className={`${CONTAINER} grid lg:grid-cols-2 gap-0 items-stretch min-h-[560px] sm:min-h-[640px] lg:min-h-[720px]`}>
          <div className="relative z-10 py-16 sm:py-20 lg:py-0 flex flex-col justify-center lg:pr-14">
            <Reveal>
              <p className="text-white/55 text-[11px] tracking-[0.25em] mb-5">GUYUK/SHELLENG FEDERAL CONSTITUENCY &middot; ADAMAWA STATE</p>
            </Reveal>
            
<Reveal delay={80}>
  <h1
    className="text-[length:clamp(2.4rem,5.6vw,4.6rem)] leading-[1.02] tracking-[-0.03em]"
    style={{
      fontFamily: "'Space Grotesk', sans-serif",
      color: "#FFFFFF"
    }}
  >
    A voice for<br />Guyuk/Shelleng.
  </h1>
</Reveal>

            <Reveal delay={160}>
              <p className="text-white/65 max-w-md mt-6 sm:mt-7 text-[14.5px] sm:text-[16px] leading-7 sm:leading-8">
                Chief Eli Jegu&#8209;Bara Gamaliel (ICMC, CMC, JP) — legal practitioner, businessman and corporate&#8209;governance advocate, born and bred in Adamawa State — seeking to represent Guyuk/Shelleng Federal Constituency in the Federal House of Representatives.
              </p>
            </Reveal>
            <Reveal delay={240} className="flex flex-wrap gap-4 mt-9 sm:mt-10">
              <ButtonPrimary onClick={() => go("speeches")}>Read the Manifesto</ButtonPrimary>
              <ButtonGhost light onClick={() => go("about")}>About Chief Gamaliel</ButtonGhost>
            </Reveal>
            <Reveal delay={320} className="grid grid-cols-3 gap-6 sm:gap-10 mt-14 sm:mt-16 max-w-sm">
              <StatCounter target={20} suffix="+" label="Years in legal & public life" />
              <StatCounter target={11} label="Professional memberships" />
              <StatCounter target={6} label="Manifesto policy pillars" />
            </Reveal>
          </div>

          <div className="relative min-h-[300px] lg:min-h-full flex items-center justify-center">
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(circle at 65% 35%, rgba(201,168,118,0.14), transparent 55%), linear-gradient(160deg,#1a2420,#101614 65%)" }}
            />
            {/* IMAGE: hero */}
            <Photo name="hero" alt="Chief Eli Jegu-Bara Gamaliel" />
            {!IMAGES.hero && (
              <>
                <SealOutline className="absolute w-[120%] max-w-none text-white/[0.06] pointer-events-none" />
                <div className="relative z-10 w-28 h-28 sm:w-36 sm:h-36"><Seal className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" /></div>
              </>
            )}

            <Reveal delay={200} className="absolute bottom-6 left-6 right-6 sm:left-10 sm:right-auto sm:bottom-10 bg-white rounded-2xl px-6 py-5 sm:w-[300px] shadow-2xl shadow-black/40">
              <div className="text-[11px] tracking-[0.15em] text-[#E23A55] font-semibold mb-1.5">FOUNDER</div>
              <div className="text-[#15171A] font-semibold text-[15px] leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Lex Auxano &amp; Partners
              </div>
              <p className="text-black/50 text-[12px] mt-2 leading-relaxed">Champions corporate governance, fundamental-rights enforcement and technology law.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* AFFILIATIONS STRIP */}
      <section className="bg-white border-b border-[#E7E5E0] py-10 mt-2">
        <div className={`${CONTAINER} flex flex-wrap items-center justify-center gap-x-10 sm:gap-x-14 gap-y-5 opacity-70`}>
          {AFFILIATIONS.map((a) => (
            <span key={a} className="font-semibold text-[13.5px] sm:text-[15px] text-[#15171A] whitespace-nowrap" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{a}</span>
          ))}
        </div>
      </section>

      {/* FEATURED POLICY PRIORITY */}
      <section className={`${CONTAINER} pt-16 sm:pt-20 lg:pt-28 pb-2`}>
        <Reveal><Eyebrow>Featured Priority</Eyebrow></Reveal>
        <Reveal delay={80}>
          <div className="grid md:grid-cols-[minmax(260px,380px)_1fr] rounded-2xl overflow-hidden border border-[#E7E5E0]">
            <div className="bg-[#15171A] text-white p-7 sm:p-9 lg:p-11 flex flex-col justify-between min-h-[220px] md:min-h-[280px] lg:min-h-[320px]">
              <div>
                <Pill>Manifesto</Pill>
                <h3 className="mt-5 text-xl lg:text-[26px] leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Agriculture & Food Security: the Kiri Dam opportunity
                </h3>
              </div>
              <p className="text-white/40 text-[12px] mt-8">Guyuk/Shelleng Constituency</p>
            </div>
            <button onClick={() => go("speeches")} className="relative flex items-center justify-center group overflow-hidden min-h-[280px] lg:min-h-[320px] focus:outline-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1e4b3f] via-[#173c33] to-[#101c18] transition-transform duration-700 ease-out group-hover:scale-105" />
              {/* IMAGE: featured */}
              <Photo name="featured" alt="Kiri Dam irrigation" className="transition-transform duration-700 ease-out group-hover:scale-105" />
              <Shade name="featured" />
              {!IMAGES.featured && <SealOutline className="absolute w-[70%] text-white/10 pointer-events-none" />}
              <span className="absolute top-8 left-8 text-white/90 text-[12px] tracking-[0.3em]">AGRICULTURE IS OUR BACKBONE</span>
              <span className="absolute bottom-10 left-8 right-8 text-white text-2xl md:text-3xl lg:text-[2.1rem] leading-tight text-left" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Kiri Dam Irrigation &amp;<br />Agro&#8209;Processing
              </span>
              <span className="relative z-10 w-16 h-16 lg:w-[76px] lg:h-[76px] rounded-full bg-[#E23A55] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_10px_30px_-8px_rgba(226,58,85,0.6)]">
                <ArrowUpRight size={22} className="text-white" />
              </span>
            </button>
          </div>
        </Reveal>
      </section>

      {/* MANIFESTO PREVIEW CARDS */}
      <section className={`${CONTAINER} pt-16 sm:pt-20 lg:pt-24`}>
        <div className="flex items-end justify-between mb-2 flex-wrap gap-4">
          <Reveal><Eyebrow>Manifesto Priorities</Eyebrow></Reveal>
          <Reveal delay={80} className="hidden sm:block mb-9">
            <button onClick={() => go("speeches")} className="text-[13px] font-semibold text-[#15171A] inline-flex items-center gap-2 hover:gap-3 transition-all group">
              View full manifesto <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </Reveal>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {posts.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <button
                onClick={() => go("speeches")}
                className="w-full text-left border border-[#E7E5E0] rounded-2xl overflow-hidden hover:border-[#15171A] hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.25)] transition-all duration-300 group"
              >
                <div className="relative h-[160px] sm:h-[180px] lg:h-[200px] overflow-hidden bg-gradient-to-br from-[#eef2ee] to-[#dfe6e0] flex items-center justify-center">
                  {/* IMAGE: homeCards[i] */}
                  <Photo name="homeCards" index={i} alt={p.title} className="transition-transform duration-500 group-hover:scale-105" />
                  {!getImage("homeCards", i) && (
                    <div className="w-16 h-16 opacity-80 transition-transform duration-500 group-hover:scale-110"><Seal className="w-full h-full" /></div>
                  )}
                </div>
                <div className="p-5 sm:p-6 lg:p-7">
                  <Pill>{p.tag}</Pill>
                  <h4 className="mt-3.5 text-[16px] lg:text-[17px] leading-snug font-medium text-[#15171A] group-hover:text-[#E23A55] transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {p.title}
                  </h4>
                  <div className="flex items-center justify-between mt-5">
                    <p className="text-black/40 text-[12px] tracking-wide">{p.label.toUpperCase()}</p>
                    <ArrowUpRight size={15} className="text-black/25 group-hover:text-[#E23A55] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PHOTO + FOCUS AREAS */}
      <section className={`${CONTAINER} pt-16 sm:pt-20 pb-20 sm:pb-28 lg:pb-32`}>
        <div className="grid lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          <Reveal className="grid sm:grid-rows-2 gap-5 sm:gap-6">
            <div className="relative rounded-2xl overflow-hidden bg-[#1e2a26] min-h-[150px] sm:h-[190px] lg:h-[210px] flex items-end p-6">
              {/* IMAGE: focusTop */}
              <Photo name="focusTop" alt="Law, governance and public service" />
              <Shade name="focusTop" />
              <p className="relative text-white text-[14px] font-medium leading-snug max-w-xs">Two decades in law, governance and public service</p>
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-[#2b2b2b] min-h-[150px] sm:h-[190px] lg:h-[210px] flex items-end p-6">
              {/* IMAGE: focusBottom */}
              <Photo name="focusBottom" alt="Health, security, agriculture and youth" />
              <Shade name="focusBottom" />
              <p className="relative text-white text-[14px] font-medium leading-snug max-w-xs">A manifesto built on health, security, agriculture and youth</p>
            </div>
          </Reveal>
          <Reveal delay={100} className="relative rounded-2xl overflow-hidden bg-[#15171A] text-white p-7 sm:p-10 lg:p-12 flex flex-col justify-center min-h-[300px] lg:min-h-[420px]">
            <span className="text-white/40 text-[11px] tracking-[0.2em] mb-5">FOCUS AREAS</span>
            <p className="text-[19px] lg:text-[22px] leading-relaxed lg:leading-relaxed">
              A seasoned legal practitioner, businessman and corporate&#8209;governance
              advocate born and bred in Adamawa State, Chief Gamaliel has spent
              two decades building the legal acumen and networks now shaping a
              manifesto for Guyuk/Shelleng &mdash; covering health, security,
              agriculture, youth empowerment and infrastructure.
            </p>
            <p className="text-white/40 text-[12px] mt-6">Guyuk/Shelleng Federal Constituency, Adamawa State</p>
          </Reveal>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-[#E23A55] py-16 sm:py-20 text-center px-6">
        <Reveal>
          <h2 className="text-white text-[length:clamp(1.8rem,4vw,3rem)] leading-tight mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Read the full manifesto for Guyuk/Shelleng
          </h2>
          <p className="text-white/80 text-[15px] mb-9 max-w-xl mx-auto">Six policy pillars — health, security, agriculture, youth, infrastructure and funding — grounded in evidence for the constituency.</p>
          <button onClick={() => go("speeches")} className="inline-flex items-center gap-2 bg-[#15171A] text-white font-semibold text-[13px] px-8 py-4 rounded-full hover:bg-black transition group">
            Browse the Manifesto
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </Reveal>
      </section>
    </>
  );
}

/* ---------------------------------------------------------------------
   ABOUT
------------------------------------------------------------------------*/
const TIMELINE = [
  { year: "1991", title: "Primary education", body: "Attended Play and Learn Nursery & Primary School, Jimeta, Yola, earning his Primary School Leaving Certificate.", icon: GraduationCap },
  { year: "1998", title: "Secondary education", body: "Completed his SSCE at Baptist High School, Jos.", icon: GraduationCap },
  { year: "2004", title: "Bachelor of Laws", body: "Earned an LL.B from the University of Jos, Plateau State.", icon: Scale },
  { year: "2005", title: "Called to the Nigerian Bar", body: "Completed a B.L. at the Nigerian Law School, Enugu/Abuja, qualifying as a Barrister-at-Law.", icon: Scale },
  { year: "2010", title: "Chartered credentials", body: "Became an Associate Member of the Institute of Chartered Secretaries and Administrators of Nigeria (ACIS) and a Notary Public of the Federal Republic of Nigeria.", icon: Landmark },
  { year: "2023", title: "Certified Chartered Mediator", body: "Qualified as a Certified Chartered Mediator and Conciliator.", icon: Users },
  { year: "2024", title: "Executive education", body: "Completed a programme at the London School of Business Administration.", icon: GraduationCap },
  { year: "2025", title: "Public leadership training", body: "Completed a Certificate in Public Leadership and Policy (CPLP) at the School of Politics, Policy and Governance.", icon: Landmark },
];

const VALUES = [
  { title: "Rule of Law", body: "A legal career spent prosecuting landmark cases and championing fundamental-rights enforcement.", icon: Scale },
  { title: "Corporate Governance", body: "Founder of Lex Auxano & Partners, championing governance, compliance and technology law.", icon: Landmark },
  { title: "Community & Youth", body: "A manifesto built around a proposed constituency Youth Empowerment Fund and vocational training for Guyuk/Shelleng's young people.", icon: Users },
  { title: "Rural Development", body: "Priorities spanning health, agriculture, security and infrastructure for a largely rural, agricultural constituency.", icon: ShieldCheck },
];

const MEMBERSHIPS = [
  "Nigerian Bar Association (NBA)",
  "Section on Business Law Practice (SBLP) of the NBA",
  "Institute of Chartered Mediators and Conciliators (ICMC)",
  "Institute of Chartered Secretaries and Administrators of Nigeria — Associate Member (ACIS)",
  "Real Estate Developers Association",
  "Association of Public Analysts",
  "Legal Aid Nigeria",
  "Nigerian Football Federation",
  "Boys Brigade of Nigeria",
  "Full Gospel Businessmen's Fellowship Nigeria",
  "Anchor Businessmen's Fellowship",
];

const AWARDS = [
  "BURKHA NUNGURABA — Pathfinder of the Lunguda Nation, conferred by the Lunguda Traditional Council (2023)",
  "Award of Excellence — conferred by the Lunguda Traditional Council",
  "Celebrated graduate, Koinonia School of Ministry (2022)",
  "Master of Ceremony, Jerusalem Pilgrimage Conferment Ceremony, held in Bethlehem",
];

function About({ go }) {
  const sections = [
    ["biography", "Biography"],
    ["timeline", "Education & Career"],
    ["values", "Guiding Principles"],
    ["recognition", "Memberships & Recognition"],
  ];
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section className="relative bg-[#15171A] text-white pt-16 sm:pt-24 pb-16 sm:pb-20 overflow-hidden">
        <SealOutline className="absolute -right-24 -top-24 w-[420px] text-white/[0.05] pointer-events-none" />
        <div className={`${CONTAINER} relative`}>
          <button onClick={() => go("home")} className="flex items-center gap-1.5 text-white/50 text-[12px] mb-8 hover:text-white transition-colors group">
            <ChevronLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" /> Back home
          </button>
          <p className="text-white/55 text-[11px] tracking-[0.25em] mb-4">LEGAL PRACTITIONER &middot; CORPORATE GOVERNANCE ADVOCATE</p>
   
<h1
  className="text-[length:clamp(2.2rem,5vw,4rem)] max-w-2xl leading-[1.05]"
  style={{
    fontFamily: "'Space Grotesk', sans-serif",
    color: "#FFFFFF"
  }}
>
  About Chief Gamaliel
</h1>

          
        </div>
      </section>

      <section className={`${CONTAINER} py-14 sm:py-20 lg:py-24`}>
        <div className="grid lg:grid-cols-[220px_minmax(0,1fr)] gap-10 lg:gap-16">
          <div className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-1">
              {sections.map(([id, label]) => (
                <button key={id} onClick={() => scrollTo(id)} className="text-left px-4 py-2.5 rounded-lg text-[13.5px] text-black/55 hover:bg-[#F1F4F1] hover:text-[#15171A] transition-colors">
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-20 sm:space-y-24">
            <div id="biography" className="grid md:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14 scroll-mt-28">
              <div>
                <Eyebrow>Biography</Eyebrow>
                <div className={`text-[15px] lg:text-[16px] leading-[1.85] lg:leading-[1.9] text-black/75 space-y-5 ${READ}`}>
                  <p>
                    Chief Eli Jegu&#8209;Bara Gamaliel (ICMC, CMC, JP) is a seasoned
                    legal practitioner, businessman, corporate&#8209;governance
                    enthusiast and committed philanthropist with over two decades
                    of distinguished service at the intersection of law, business
                    and public interest. Born and bred in Adamawa State, he carries
                    the mandate of Guyuk/Shelleng and is seeking to represent the
                    constituency in the Federal House of Representatives.
                  </p>
                  <p>
                    His professional journey runs from the chambers of JK Gadzama
                    SAN &amp; Partners, where he prosecuted landmark cases, to
                    founding and growing Lex Auxano &amp; Partners, where he has
                    championed corporate governance, fundamental&#8209;rights
                    enforcement and technology law — a combination of legal acumen,
                    strategic thinking and resolve he now brings to public service.
                  </p>
                </div>
              </div>
              <div className="border border-[#E7E5E0] rounded-2xl p-2 h-fit">
                <div className="relative h-[210px] sm:h-[240px] rounded-xl overflow-hidden bg-gradient-to-br from-[#dfe3e6] to-[#c7cdd2] flex items-center justify-center">
                  {/* IMAGE: aboutPortrait */}
                  <Photo name="aboutPortrait" alt="Chief Eli Jegu-Bara Gamaliel" />
                  {!IMAGES.aboutPortrait && <div className="w-14 h-14 opacity-70"><Seal className="w-full h-full" /></div>}
                </div>
                <p className="text-[11.5px] text-black/40 px-2 py-3 leading-snug">Chief Eli Jegu&#8209;Bara Gamaliel, candidate for Guyuk/Shelleng Federal Constituency</p>
              </div>
            </div>

            <div id="timeline" className="scroll-mt-28">
              <Eyebrow>Education &amp; Career</Eyebrow>
              <div className="relative pl-8 sm:pl-10 border-l border-[#E7E5E0] space-y-12 sm:space-y-14">
                {TIMELINE.map((t, i) => {
                  const Icon = t.icon;
                  return (
                    <Reveal key={t.title} delay={i * 60} className="relative">
                      <span className="absolute -left-[38px] sm:-left-[46px] top-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#15171A] ring-4 ring-white flex items-center justify-center">
                        <Icon size={15} className="text-[#C9A876]" />
                      </span>
                      <span className="text-[#7C8DA6] text-[11.5px] sm:text-[12px] font-semibold tracking-widest">{t.year.toUpperCase()}</span>
                      <h3 className="mt-1 text-[16.5px] sm:text-[18px] font-medium text-[#15171A]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t.title}</h3>
                      <p className={`mt-2 text-[14px] sm:text-[14.5px] text-black/65 leading-relaxed ${READ}`}>{t.body}</p>
                    </Reveal>
                  );
                })}
              </div>
            </div>

            <div id="values" className="scroll-mt-28">
              <Eyebrow>Guiding Principles</Eyebrow>
              <div className="grid sm:grid-cols-2 gap-5">
                {VALUES.map((v, i) => {
                  const Icon = v.icon;
                  return (
                    <Reveal key={v.title} delay={i * 70} className="bg-[#F1F4F1] rounded-2xl p-6 sm:p-7">
                      <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center mb-5">
                        <Icon size={18} className="text-[#1E4B3F]" />
                      </div>
                      <h3 className="font-semibold text-[#15171A] mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{v.title}</h3>
                      <p className="text-black/60 text-[13.5px] leading-relaxed">{v.body}</p>
                    </Reveal>
                  );
                })}
              </div>
            </div>

            <div id="recognition" className="scroll-mt-28">
              <Eyebrow>Memberships &amp; Recognition</Eyebrow>
              <div className="grid sm:grid-cols-2 gap-5">
                <Reveal className="bg-[#F1F4F1] rounded-2xl p-6 sm:p-7">
                  <h3 className="font-semibold text-[#15171A] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Professional Memberships</h3>
                  <ul className="space-y-2.5 text-black/65 text-[13.5px] leading-relaxed list-disc pl-4">
                    {MEMBERSHIPS.map((m) => <li key={m}>{m}</li>)}
                  </ul>
                </Reveal>
                <Reveal delay={70} className="bg-[#F1F4F1] rounded-2xl p-6 sm:p-7">
                  <h3 className="font-semibold text-[#15171A] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Awards, Honours &amp; Recognitions</h3>
                  <ul className="space-y-2.5 text-black/65 text-[13.5px] leading-relaxed list-disc pl-4">
                    {AWARDS.map((a) => <li key={a}>{a}</li>)}
                  </ul>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-[220px] sm:h-[300px] lg:h-[340px] flex items-center justify-center bg-[#1c1c1c] overflow-hidden px-5">
        {/* IMAGE: aboutBanner */}
        <Photo name="aboutBanner" alt="" />
        <Shade name="aboutBanner" className="bg-black/50" />
        {!IMAGES.aboutBanner && (
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "repeating-linear-gradient(120deg,#2a2a2a 0 3px,#1c1c1c 3px 6px)" }} />
        )}
        <Reveal>
          <h2 className="relative text-white text-[length:clamp(1.9rem,5vw,3.4rem)] text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>No one left behind.</h2>
        </Reveal>
      </section>

      <section className="bg-[#E23A55] py-16 sm:py-20 text-center px-6">
        <h2 className="text-white text-[length:clamp(1.7rem,3.6vw,2.6rem)] mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Be part of the manifesto</h2>
        <p className="text-white/80 mb-9 max-w-md mx-auto text-[15px]">Read the full manifesto for Guyuk/Shelleng Federal Constituency.</p>
        <button onClick={() => go("speeches")} className="bg-[#15171A] text-white font-semibold text-sm px-8 py-4 rounded-full inline-flex items-center gap-2 hover:bg-black transition group">
          Read the Manifesto <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </section>
    </>
  );
}

/* ---------------------------------------------------------------------
   MANIFESTO (route id kept as "speeches" for minimal code changes)
------------------------------------------------------------------------*/
const PILLARS = [
  { name: "Health Services", blurb: "Upgrading clinics and funding decentralised PHC financing so every ward has a functional primary health centre." },
  { name: "Security & Community Policing", blurb: "Formalising community-police liaison committees and training local vigilante groups under police supervision." },
  { name: "Agriculture & Food Security", blurb: "Expanding irrigation from the Kiri Dam, subsidised farm inputs, and local agro-processing hubs." },
  { name: "Sports, Youth & Education", blurb: "Vocational training centres, a proposed constituency Youth Empowerment Fund, and sports programmes for reconciliation." },
  { name: "Infrastructure & Development", blurb: "The Guyuk–Shelleng road link, rural electrification, safe drinking water and a functional constituency office." },
  { name: "Policy Mechanisms & Funding", blurb: "Leveraging the BHCPF, sponsoring community-policing legislation, and partnering with NGOs for rural development." },
];

const KEY_METRICS = [
  { area: "Health", metric: "PHCs established/upgraded in all wards (target 100% coverage by 2027); skilled-birth attendance; child immunisation rates." },
  { area: "Agriculture", metric: "Hectares under irrigation expanded; farmers receiving subsidised inputs; produce processed locally; farm income growth." },
  { area: "Security", metric: "Community security dialogues held; incidents of communal violence recorded; weapons voluntarily surrendered." },
  { area: "Youth", metric: "Graduates from vocational/IT centres; youth employment rate; micro-enterprises launched; sports events organised." },
  { area: "Infrastructure", metric: "Road length constructed/rehabilitated; households electrified; water points or boreholes installed; schools built." },
];

function Speeches({ go }) {
  return (
    <>
      <section className="relative min-h-[220px] sm:h-[300px] lg:h-[340px] bg-[#15171A] overflow-hidden flex items-end">
        {/* IMAGE: manifestoHero */}
        <Photo name="manifestoHero" alt="" />
        <Shade name="manifestoHero" className="bg-black/50" />
        {!IMAGES.manifestoHero && (
          <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, rgba(226,58,85,0.25), transparent 55%), repeating-linear-gradient(100deg,#26282c 0 2px,#17181b 2px 5px)" }} />
        )}
        <div className={`relative ${CONTAINER} pb-10 sm:pb-12`}>
          <p className="text-white/55 text-[11px] tracking-[0.25em] mb-4">A PLAN FOR GUYUK/SHELLENG</p>
          <span className="inline-block text-white text-[length:clamp(1.8rem,4vw,2.9rem)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>The Manifesto</span>
        </div>
      </section>

      <section className={`${CONTAINER} py-14 sm:py-20 lg:py-24`}>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <Eyebrow>Policy Priorities</Eyebrow>
          <p className="text-black/40 text-[13px] mb-9 hidden sm:block">Six pillars for the constituency</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {PILLARS.map((p, i) => (
            <Reveal key={p.name} delay={(i % 6) * 60}>
              <button
                onClick={() => go("home")}
                className="w-full text-left border border-[#E7E5E0] rounded-2xl overflow-hidden hover:border-[#15171A] hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.25)] transition-all duration-300 group"
              >
                <div
                  className="relative h-[150px] sm:h-[190px] lg:h-[210px] overflow-hidden flex items-center justify-center"
                  style={{ background: `linear-gradient(150deg, hsl(${(i * 37) % 360} 12% 20%), hsl(${(i * 37) % 360} 8% 32%))` }}
                >
                  {/* IMAGE: pillars[i] */}
                  <Photo name="pillars" index={i} alt={p.name} className="transition-transform duration-500 group-hover:scale-105" />
                  {!getImage("pillars", i) && <SealOutline className="absolute w-[70%] text-white/10 pointer-events-none" />}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                    <span className="w-11 h-11 rounded-full bg-[#E23A55] flex items-center justify-center">
                      <ArrowUpRight size={18} className="text-white" />
                    </span>
                  </div>
                </div>
                <div className="p-5 lg:p-6">
                  <span className="text-[16px] lg:text-[18px] font-medium text-[#15171A] leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{p.name}</span>
                  <p className="text-black/55 text-[13px] leading-relaxed mt-2.5">{p.blurb}</p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 sm:mt-20">
          <Eyebrow>Key Metrics for Success</Eyebrow>
          <div className="grid sm:grid-cols-2 gap-5">
            {KEY_METRICS.map((k, i) => (
              <Reveal key={k.area} delay={i * 60} className="bg-[#F1F4F1] rounded-2xl p-6">
                <h3 className="font-semibold text-[#15171A] mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{k.area}</h3>
                <p className="text-black/60 text-[13.5px] leading-relaxed">{k.metric}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------------------------------------------------------------------
   CONTACT
------------------------------------------------------------------------*/
function Contact({ go }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  const update = useCallback((field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  }, []);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Enter a message";
    return e;
  }

  function submit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus("loading");
    // Backend integration point: POST `form` to your contact-form endpoint here.
    setTimeout(() => setStatus("success"), 900);
  }

  const fields = [
    { key: "name", placeholder: "Name", icon: User, type: "text" },
    { key: "email", placeholder: "Email", icon: Mail, type: "email" },
    { key: "phone", placeholder: "Mobile Number", icon: Phone, type: "text" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className={`${CONTAINER} pt-6 sm:pt-10 flex items-center justify-between gap-4`}>
        <Logo compact />
        <button onClick={() => go("home")} className="flex items-center gap-2 text-[11.5px] sm:text-[12.5px] tracking-widest text-black/60 hover:text-[#15171A] transition-colors group">
          <ChevronLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span className="hidden sm:inline">BACK TO MAIN WEBSITE</span>
          <span className="sm:hidden">BACK</span>
        </button>
      </div>

      <div className={`${CONTAINER} py-10 sm:py-16 lg:py-20 grid md:grid-cols-2 gap-10 lg:gap-20 flex-1 items-start`}>
        <div className="max-w-xl">
          <h1 className="text-[length:clamp(1.9rem,4.5vw,3.2rem)] leading-[1.05] tracking-[-0.02em]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Hello, there! We'll be glad to hear from you.
          </h1>
          <p className="text-black/50 text-[14.5px] mt-5 max-w-md leading-relaxed">
            Send a message to the campaign team for Chief Eli Jegu&#8209;Bara Gamaliel, representing Guyuk/Shelleng Federal Constituency, Adamawa State.
          </p>

          {status === "success" ? (
            <div className="mt-8 border border-[#1E4B3F]/30 bg-[#1E4B3F]/5 rounded-2xl p-6 max-w-md motion-safe:animate-[fadeIn_0.4s_ease-out]">
              <p className="text-[#1E4B3F] font-medium">Message sent.</p>
              <p className="text-black/60 text-[13.5px] mt-1">Thank you — we'll follow up by email.</p>
              <button
                onClick={() => { setStatus("idle"); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                className="mt-4 text-[13px] text-[#E23A55] font-medium hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-9 sm:mt-10 space-y-5 max-w-md" noValidate>
              {fields.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.key}>
                    <div className="relative">
                      <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        aria-label={f.placeholder}
                        value={form[f.key]}
                        onChange={(e) => update(f.key, e.target.value)}
                        className={`w-full border rounded-xl pl-11 pr-4 py-3.5 text-[15px] sm:text-[14px] placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-[#15171A]/10 focus:border-[#15171A] transition-all duration-150 ${errors[f.key] ? "border-[#E23A55]" : "border-[#E7E5E0]"}`}
                      />
                    </div>
                    {errors[f.key] && <p className="text-[#E23A55] text-[12px] mt-1.5">{errors[f.key]}</p>}
                  </div>
                );
              })}
              <input
                type="text"
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                className="w-full border border-[#E7E5E0] rounded-xl px-4 py-3.5 text-[15px] sm:text-[14px] placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-[#15171A]/10 focus:border-[#15171A] transition-all duration-150"
              />
              <div>
                <textarea
                  placeholder="Message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3.5 text-[15px] sm:text-[14px] placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-[#15171A]/10 focus:border-[#15171A] transition-all duration-150 resize-none ${errors.message ? "border-[#E23A55]" : "border-[#E7E5E0]"}`}
                />
                {errors.message && <p className="text-[#E23A55] text-[12px] mt-1.5">{errors.message}</p>}
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#15171A] text-white text-[13px] font-semibold tracking-widest py-4 rounded-full flex items-center justify-center gap-2 hover:bg-black active:scale-[0.99] transition-all duration-150 disabled:opacity-60 group"
              >
                {status === "loading" ? "SENDING…" : (<>GET IN TOUCH <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" /></>)}
              </button>
              {status === "error" && <p className="text-[#E23A55] text-[13px]">Something went wrong — please try again.</p>}
            </form>
          )}
        </div>

        <div className="flex flex-col items-center w-full">
          <div className="relative w-full max-w-sm lg:max-w-md aspect-[4/3] sm:aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-b from-[#eef0f1] to-[#d7dbde] flex items-center justify-center">
            {/* IMAGE: contactPortrait */}
            <Photo name="contactPortrait" alt="Chief Eli Jegu-Bara Gamaliel" />
            {!IMAGES.contactPortrait && (
              <>
                <SealOutline className="absolute w-[80%] text-black/[0.06] pointer-events-none" />
                <div className="relative w-24 h-24"><Seal className="w-full h-full" /></div>
              </>
            )}
          </div>
          <div className="flex items-center flex-wrap justify-center gap-4 mt-8">
            {[Twitter, Facebook, Instagram, Youtube, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-black/70 hover:text-white hover:bg-[#15171A] hover:border-[#15171A] hover:scale-110 active:scale-95 transition-all duration-200"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   APP SHELL
------------------------------------------------------------------------*/
export default function App() {
  const [route, setRoute] = useState("home");
  const topRef = useRef(null);

  function go(r) {
    setRoute(r);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  useEffect(() => {
    if (typeof document !== "undefined" && !document.getElementById("ovp-fonts")) {
      const style = document.createElement("style");
      style.id = "ovp-fonts";
      style.innerHTML = `${FONTS}
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        html { scroll-behavior: smooth; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const isContact = route === "contact";

  return (
    <div ref={topRef} className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-white text-[#15171A]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <ScrollProgress />
      {!isContact && <Nav route={route} go={go} />}
      <main id="main">
        {route === "home" && <Home go={go} />}
        {route === "about" && <About go={go} />}
        {route === "speeches" && <Speeches go={go} />}
        {route === "contact" && <Contact go={go} />}
      </main>
      {!isContact && <Footer go={go} />}
    </div>
  );
}