import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   EVOLVIAN — TheFinch-Inspired AI EdTech Landing
   ═══════════════════════════════════════════ */

const THEME = {
  bg: "#0B0F19",
  bgAlt: "#0E1524",
  card: "#111827",
  cardHover: "#1E293B",
  primary: "#2563EB",
  accent: "#06B6D4",
  text: "#FFFFFF",
  textMuted: "#94A3B8",
  border: "#1E293B",
  glow: "rgba(37, 99, 235, 0.4)"
};

// ── Scroll-reveal hook (Smooth fade) ──
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = 0, direction = "up", style = {}, className = "" }) {
  const [ref, visible] = useReveal(0.12);
  const offsets = { up: "translateY(30px)", down: "translateY(-30px)", left: "translateX(30px)", right: "translateX(-30px)", none: "none" };
  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : offsets[direction],
      transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>{children}</div>
  );
}

// ── Animated Tech Grid Background ──
function TechGrid() {
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: "100%",
      backgroundImage: `linear-gradient(to right, ${THEME.border} 1px, transparent 1px), linear-gradient(to bottom, ${THEME.border} 1px, transparent 1px)`,
      backgroundSize: "60px 60px", opacity: 0.2, zIndex: 0,
      maskImage: "radial-gradient(ellipse at top, black 20%, transparent 70%)",
      WebkitMaskImage: "radial-gradient(ellipse at top, black 20%, transparent 70%)"
    }} />
  );
}

function AmbientGlow({ top, left, right, bottom, color, size = 600, opacity = 0.15 }) {
  return (
    <div style={{
      position: "absolute", top, left, right, bottom, width: size, height: size, borderRadius: "50%",
      background: color, filter: "blur(120px)", opacity, pointerEvents: "none", zIndex: 0
    }} />
  );
}

// ── Headings (Mixed Serif/Sans-serif) ──
function FancyHeading({ children }) {
  return (
    <h2 className="ev-sec-h" style={{ 
      fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "48px", 
      color: THEME.text, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: "24px" 
    }}>
      {children}
    </h2>
  );
}

function SerifAccent({ children }) {
  return (
    <span style={{ 
      fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 600, 
      color: THEME.accent, letterSpacing: "0.02em" 
    }}>
      {children}
    </span>
  );
}

// ── Buttons ──
function Button({ children, variant = "primary", style = {}, href }) {
  const [h, setH] = useState(false);
  
  const primary = {
    padding: "16px 32px", borderRadius: "8px", fontFamily: "'Inter', sans-serif", fontWeight: 600,
    fontSize: "16px", cursor: "pointer", border: "1px solid transparent", display: "inline-flex", alignItems: "center", gap: "12px",
    background: THEME.primary, color: "#fff",
    boxShadow: h ? `0 0 24px ${THEME.glow}` : "none",
    transform: h ? "translateY(-2px)" : "none",
    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
    textDecoration: "none"
  };
  
  const secondary = {
    ...primary, 
    background: h ? THEME.cardHover : "transparent", color: THEME.text,
    border: `1px solid ${h ? THEME.primary : THEME.border}`,
    boxShadow: "none"
  };
  
  const s = variant === "primary" ? primary : secondary;
  const Tag = href ? "a" : "button";
  
  return (
    <Tag 
      href={href}
      style={{ ...s, ...style }} 
      onMouseEnter={() => setH(true)} 
      onMouseLeave={() => setH(false)}
    >
      {children}
      {variant === "primary" && (
        <span style={{ fontSize: "18px", transition: "transform 0.3s", transform: h ? "translate(2px, -2px)" : "none" }}>↗</span>
      )}
    </Tag>
  );
}

// ── Section label pill ──
function SectionLabel({ children }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px",
      borderRadius: "100px", background: THEME.card, border: `1px solid ${THEME.border}`, 
      marginBottom: "24px"
    }}>
      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: THEME.accent, boxShadow: `0 0 8px ${THEME.accent}` }} />
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: THEME.text, letterSpacing: "0.05em", textTransform: "uppercase" }}>{children}</span>
    </div>
  );
}

// ── Feature Card ──
function FeatureCard({ icon, title, description }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      background: THEME.card, borderRadius: "16px", padding: "40px 32px",
      border: `1px solid ${h ? THEME.primary : THEME.border}`,
      transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
      transform: h ? "translateY(-8px)" : "none",
      boxShadow: h ? `0 16px 40px ${THEME.glow}` : "0 4px 12px rgba(0,0,0,0.2)",
      display: "flex", flexDirection: "column", position: "relative", overflow: "hidden"
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, width: "100%", height: "4px",
        background: h ? `linear-gradient(90deg, ${THEME.primary}, ${THEME.accent})` : "transparent",
        transition: "background 0.3s"
      }} />
      <div style={{
        width: "56px", height: "56px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
        background: h ? THEME.primary : THEME.border, color: THEME.text, marginBottom: "24px", fontSize: "24px",
        transition: "all 0.4s"
      }}>{icon}</div>
      <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: "20px", fontWeight: 600, color: THEME.text, marginBottom: "12px", letterSpacing: "-0.01em" }}>{title}</h3>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: THEME.textMuted, lineHeight: 1.6, margin: 0 }}>{description}</p>
    </div>
  );
}

// ── Product Card ──
function ProductCard({ name, tagline, description, url, index, isFeatured }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={index * 0.1}>
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", height: "100%" }}
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
        <div style={{
          background: THEME.card, borderRadius: "20px", padding: "48px 40px",
          border: `1px solid ${h ? THEME.accent : THEME.border}`,
          boxShadow: h ? `0 24px 64px rgba(6, 182, 212, 0.2)` : "0 8px 24px rgba(0,0,0,0.3)",
          transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
          transform: h ? "translateY(-6px)" : "none",
          height: "100%", display: "flex", flexDirection: "column",
          position: "relative", overflow: "hidden"
        }}>
          {isFeatured && (
            <div style={{
              position: "absolute", top: "24px", right: "24px", background: THEME.accent, color: THEME.bg,
              padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase"
            }}>Flagship</div>
          )}
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: "28px", fontWeight: 700, color: THEME.text, marginBottom: "8px", letterSpacing: "-0.02em" }}>
            {name}
          </h3>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500, color: THEME.accent, marginBottom: "20px" }}>
            {tagline}
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: THEME.textMuted, lineHeight: 1.6, flex: 1, margin: 0 }}>
            {description}
          </p>
          <div style={{
            display: "flex", alignItems: "center", gap: "8px", marginTop: "32px",
            fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 600, color: h ? THEME.text : THEME.textMuted,
            transition: "color 0.3s"
          }}>
            <span>View platform details</span>
            <span style={{ transition: "transform 0.3s", transform: h ? "translate(4px, -4px)" : "none", color: h ? THEME.accent : THEME.textMuted }}>↗</span>
          </div>
        </div>
      </a>
    </Reveal>
  );
}

// ── Compact Product Card ──
function CompactProductCard({ name, tagline, description, url, index }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={index * 0.05}>
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", height: "100%" }}
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
        <div style={{
          background: THEME.bgAlt, borderRadius: "16px", padding: "32px",
          border: `1px solid ${h ? THEME.primary : THEME.border}`,
          transition: "all 0.3s ease", transform: h ? "translateY(-4px)" : "none",
          height: "100%", display: "flex", flexDirection: "column",
        }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: "20px", fontWeight: 600, color: THEME.text, marginBottom: "4px", letterSpacing: "-0.01em" }}>{name}</h3>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: THEME.primary, marginBottom: "16px", fontWeight: 500 }}>{tagline}</p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: THEME.textMuted, lineHeight: 1.6, margin: 0 }}>{description}</p>
        </div>
      </a>
    </Reveal>
  );
}

// ── FAQ (Accordion) ──
function FAQItem({ q, a, open, toggle }) {
  return (
    <div style={{ borderBottom: `1px solid ${THEME.border}` }}>
      <button onClick={toggle} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "32px 0", background: "none", border: "none", cursor: "pointer",
        fontFamily: "'Inter', sans-serif", fontSize: "18px", fontWeight: 500,
        color: open ? THEME.accent : THEME.text, textAlign: "left", transition: "color 0.2s", gap: "24px",
      }}>
        <span style={{ flex: 1 }}>{q}</span>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", color: open ? THEME.accent : THEME.textMuted,
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)", transform: open ? "rotate(135deg)" : "none"
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
      </button>
      <div style={{ maxHeight: open ? "400px" : 0, overflow: "hidden", transition: "max-height 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: THEME.textMuted, lineHeight: 1.7, margin: 0, paddingBottom: "32px" }}>{a}</p>
      </div>
    </div>
  );
}

// ── Navbar ──
function Navbar({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = ["Solutions", "Infrastructure", "Capabilities", "Insights"];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(11, 15, 25, 0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${THEME.border}` : "1px solid transparent",
      transition: "all 0.3s ease",
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", zIndex: 10 }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px", background: THEME.primary,
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 16px ${THEME.glow}`
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "20px", color: THEME.text, letterSpacing: "-0.02em" }}>Evolvian</span>
        </div>
        <div className="ev-nav-desktop" style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} style={{
              fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500, color: THEME.textMuted,
              textDecoration: "none", transition: "color 0.2s", textTransform: "uppercase", letterSpacing: "0.05em"
            }}
            onMouseEnter={e => e.target.style.color = THEME.text}
            onMouseLeave={e => e.target.style.color = THEME.textMuted}
            >{l}</a>
          ))}
          <Button variant="primary" style={{ padding: "10px 24px", fontSize: "14px" }}>Inquiry Now</Button>
        </div>
        <button className="ev-nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
          display: "none", background: "none", border: "none", cursor: "pointer", padding: "8px", zIndex: 10, color: THEME.text
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {menuOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></>
            ) : (
              <><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></>
            )}
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: THEME.bg, paddingTop: "100px", paddingLeft: "32px", paddingRight: "32px",
          display: "flex", flexDirection: "column", gap: "16px", zIndex: 5,
        }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} onClick={() => setMenuOpen(false)} style={{
              fontFamily: "'Inter', sans-serif", fontSize: "20px", fontWeight: 500, color: THEME.text,
              textDecoration: "none", padding: "16px 0", borderBottom: `1px solid ${THEME.border}`,
            }}>{l}</a>
          ))}
          <Button variant="primary" style={{ width: "100%", justifyContent: "center", marginTop: "24px" }}>Inquiry Now</Button>
        </div>
      )}
    </nav>
  );
}

// ═══════════════════════════════
//  MAIN LANDING PAGE
// ═══════════════════════════════

export default function EvolvianLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const products = [
    {
      name: "TaskOrbit",
      tagline: "Resource Allocation",
      description: "Manage institutional resources, staff assignments, and academic scheduling through a unified interface. Prevent conflicts before they occur.",
      url: "/sign-in",
    },
    {
      name: "CodeSkill",
      tagline: "Technical Evaluation",
      description: "Assess programming competency with automated grading environments. Monitor code execution, performance metrics, and syntactical accuracy.",
      url: "https://codeskill.evolvian.com",
    },
  ];

  const moreProducts = [
    {
      name: "AllOps",
      tagline: "Administrative Core",
      description: "Centralize student records, compliance reporting, and enrollment pipelines.",
      url: "https://allops.evolvian.com",
    },
    {
      name: "LearnCraft",
      tagline: "Curriculum Delivery",
      description: "Deploy instructional content at scale. Structure syllabi and track progression.",
      url: "https://learncraft.evolvian.com",
    },
    {
      name: "QuizForge",
      tagline: "Assessment Generation",
      description: "Standardize testing protocols with automated question banks.",
      url: "https://quizforge.evolvian.com",
    },
  ];

  const features = [
    { icon: "⚡", title: "Low Latency Architecture", description: "Built on edge networks to ensure immediate feedback and synchronization across distributed campuses." },
    { icon: "🛡️", title: "Enterprise Compliance", description: "Designed to meet stringent regulatory frameworks including SOC 2 Type II, FERPA, and GDPR standards." },
    { icon: "🔗", title: "API-First Integration", description: "Connect existing systems seamlessly with comprehensive REST and GraphQL endpoints." },
    { icon: "📈", title: "Elastic Scalability", description: "Infrastructure that provisions resources dynamically, supporting institutions from small academies to global universities." },
    { icon: "🧩", title: "Modular Adoption", description: "Implement distinct components independently without requiring a complete overhaul of your existing technology stack." },
    { icon: "🌍", title: "Global Accessibility", description: "Ensure inclusive access with built-in localization, screen-reader compatibility, and WCAG compliance." },
  ];

  const faqs = [
    { q: "What is the typical deployment timeline for Evolvian products?", a: "Initial configuration generally requires two to four weeks. Data migration and system integration timelines vary based on the complexity of your existing infrastructure, but dedicated engineering support is provided throughout the process." },
    { q: "How does Evolvian integrate with legacy Learning Management Systems?", a: "We provide standardized connectors for major platforms (Canvas, Blackboard, Moodle) via LTI protocols and robust REST APIs, allowing our specialized modules to enhance rather than replace your core LMS." },
    { q: "Where is institutional data stored?", a: "Data is housed in geographically isolated, SOC 2 compliant data centers. You retain full ownership and governance over your records, with granular access controls and audit logging enabled by default." },
    { q: "Do you offer SLA guarantees?", a: "Yes. Enterprise agreements include 99.99% uptime guarantees, dedicated technical account managers, and immediate incident response protocols." },
  ];

  const sec = { maxWidth: "1280px", margin: "0 auto", padding: "0 32px" };

  return (
    <div style={{ background: THEME.bg, color: THEME.text, fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${THEME.bg}; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        ::selection { background: ${THEME.primary}; color: #fff; }
        @media (max-width: 900px) {
          .ev-nav-desktop { display: none !important; }
          .ev-nav-hamburger { display: block !important; }
          .ev-hero-h { font-size: 48px !important; }
        }
        @media (max-width: 768px) {
          .ev-hero-h { font-size: 36px !important; }
          .ev-hero-btns { flex-direction: column !important; }
          .ev-hero-btns button, .ev-hero-btns a { width: 100% !important; justify-content: center !important; }
          .ev-g2, .ev-g3 { grid-template-columns: 1fr !important; }
          .ev-section { padding-top: 80px !important; padding-bottom: 80px !important; }
          .ev-hero { padding-top: 140px !important; padding-bottom: 80px !important; }
          .ev-footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .ev-hero-h { font-size: 32px !important; }
          .ev-footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Navbar scrolled={scrolled} />

      {/* ═══ HERO ═══ */}
      <section className="ev-hero" style={{ position: "relative", paddingTop: "200px", paddingBottom: "120px", overflow: "hidden", minHeight: "90vh", display: "flex", alignItems: "center" }}>
        <TechGrid />
        <AmbientGlow top="-10%" left="20%" color={THEME.primary} size={600} opacity={0.15} />
        <AmbientGlow top="20%" right="-10%" color={THEME.accent} size={500} opacity={0.1} />
        
        <div style={{ ...sec, position: "relative", zIndex: 2 }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "100px", background: "rgba(37, 99, 235, 0.1)", border: `1px solid ${THEME.primary}`, marginBottom: "32px" }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: THEME.accent, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Evolvian Infrastructure 2.0</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="ev-hero-h" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "68px", color: THEME.text, letterSpacing: "-0.03em", maxWidth: "900px", margin: "0 0 32px 0", lineHeight: 1.1 }}>
              Intelligent infrastructure for <SerifAccent>modern education.</SerifAccent>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "20px", color: THEME.textMuted, lineHeight: 1.6, maxWidth: "600px", margin: "0 0 48px 0" }}>
              Evolvian provides the foundational AI-driven software institutions need to manage operations, deliver content, and scale learning effectively.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="ev-hero-btns" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Button variant="primary" href="/sign-in">Launch TaskOrbit</Button>
              <Button variant="secondary" href="#solutions">Explore Platform</Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ LOGOS (TheFinch Style Trust Banner) ═══ */}
      <section style={{ borderTop: `1px solid ${THEME.border}`, borderBottom: `1px solid ${THEME.border}`, padding: "40px 0", background: THEME.bgAlt }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", alignItems: "center", padding: "0 32px", gap: "40px", opacity: 0.5 }}>
            {["Meridian", "Apex Systems", "NovaBridge", "Luminos", "EduCore"].map((n, i) => (
              <span key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: "20px", fontWeight: 700, color: THEME.text, letterSpacing: "-0.02em" }}>
                {n}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ SOLUTIONS ═══ */}
      <section id="solutions" className="ev-section" style={{ paddingTop: "140px", paddingBottom: "140px", position: "relative" }}>
        <AmbientGlow top="40%" left="-10%" color={THEME.primary} size={800} opacity={0.08} />
        <div style={sec}>
          <Reveal>
            <div style={{ marginBottom: "64px" }}>
              <SectionLabel>Core Solutions</SectionLabel>
              <FancyHeading>
                Modular software for specific <br/><SerifAccent>operational requirements.</SerifAccent>
              </FancyHeading>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: THEME.textMuted, lineHeight: 1.6, maxWidth: "600px" }}>
                Deploy individual components to solve immediate technical challenges, or integrate the full suite for a comprehensive institutional backend.
              </p>
            </div>
          </Reveal>

          <div className="ev-g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {products.map((p, i) => <ProductCard key={i} {...p} index={i} isFeatured={p.name === "TaskOrbit"} />)}
          </div>

          <div className="ev-g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {moreProducts.map((p, i) => <CompactProductCard key={i} {...p} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══ CAPABILITIES ═══ */}
      <section id="capabilities" className="ev-section" style={{ paddingTop: "140px", paddingBottom: "140px", background: THEME.bgAlt, borderTop: `1px solid ${THEME.border}` }}>
        <div style={sec}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "80px" }}>
              <SectionLabel>Platform Capabilities</SectionLabel>
              <FancyHeading>
                Engineered for <SerifAccent>reliability.</SerifAccent>
              </FancyHeading>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: THEME.textMuted, lineHeight: 1.6, maxWidth: "600px", margin: "0 auto" }}>
                A robust technical foundation designed to handle the complexity and scale of modern educational environments without compromising performance.
              </p>
            </div>
          </Reveal>
          <div className="ev-g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <FeatureCard {...f} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="ev-section" style={{ paddingTop: "140px", paddingBottom: "140px" }}>
        <div style={{ ...sec, maxWidth: "800px" }}>
          <Reveal>
            <div style={{ marginBottom: "64px" }}>
              <SectionLabel>FAQ</SectionLabel>
              <FancyHeading>
                Technical documentation <br/><SerifAccent>& support</SerifAccent>
              </FancyHeading>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ borderTop: `1px solid ${THEME.border}` }}>
              {faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} open={openFaq === i} toggle={() => setOpenFaq(openFaq === i ? null : i)} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="ev-section" style={{ paddingTop: "80px", paddingBottom: "140px", position: "relative" }}>
        <div style={sec}>
          <Reveal>
            <div style={{
              position: "relative", textAlign: "center", padding: "100px 40px", borderRadius: "24px",
              background: THEME.cardHover, border: `1px solid ${THEME.border}`, overflow: "hidden"
            }}>
              <TechGrid />
              <AmbientGlow top="0" left="20%" color={THEME.primary} size={500} opacity={0.2} />
              
              <div style={{ position: "relative", zIndex: 2 }}>
                <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "48px", color: THEME.text, letterSpacing: "-0.03em", marginBottom: "24px" }}>
                  Deploy reliable systems <SerifAccent>today.</SerifAccent>
                </h2>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: THEME.textMuted, lineHeight: 1.6, maxWidth: "500px", margin: "0 auto 48px" }}>
                  Connect with our engineering team to discuss architecture, integrations, and deployment strategies tailored to your institution.
                </p>
                <div className="ev-hero-btns" style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                  <Button variant="primary" href="/sign-in">Launch TaskOrbit</Button>
                  <Button variant="secondary">Contact Engineering</Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: `1px solid ${THEME.border}`, background: THEME.bgAlt, paddingTop: "80px", paddingBottom: "40px" }}>
        <div style={sec}>
          <div className="ev-footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "64px", marginBottom: "80px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "8px", background: THEME.primary,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "20px", color: THEME.text, letterSpacing: "-0.02em" }}>Evolvian</span>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: THEME.textMuted, lineHeight: 1.6, maxWidth: "300px" }}>
                Engineering robust infrastructure for the next generation of educational technology.
              </p>
            </div>
            {[
              { title: "Products", links: ["TaskOrbit", "CodeSkill", "AllOps", "LearnCraft", "Pricing"] },
              { title: "Company", links: ["About", "Careers", "Blog", "Security", "Contact"] },
              { title: "Developers", links: ["Documentation", "API Reference", "Status", "GitHub"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "14px", color: THEME.text, marginBottom: "24px", textTransform: "uppercase", letterSpacing: "1px" }}>{col.title}</h4>
                {col.links.map((l, j) => (
                  <a key={j} href="#" style={{
                    display: "block", fontFamily: "'Inter', sans-serif", fontSize: "15px", color: THEME.textMuted,
                    textDecoration: "none", marginBottom: "16px", transition: "color 0.2s",
                  }}
                  onMouseEnter={e => e.target.style.color = THEME.accent}
                  onMouseLeave={e => e.target.style.color = THEME.textMuted}
                  >{l}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${THEME.border}`, paddingTop: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: THEME.textMuted }}>© 2026 Evolvian Inc.</span>
            <div style={{ display: "flex", gap: "32px" }}>
              {["Privacy Policy", "Terms of Service"].map((l, i) => (
                <a key={i} href="#" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: THEME.textMuted, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = THEME.accent}
                  onMouseLeave={e => e.target.style.color = THEME.textMuted}
                >{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
