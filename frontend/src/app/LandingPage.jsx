"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* ═══════════════════════════════════════════
   EVOLVIAN — Premium UI Design (Original Content)
   ═══════════════════════════════════════════ */

const THEME = {
  bg: "#FFFFFF",
  bgAlt: "#F8FAFC",
  card: "#FFFFFF",
  cardHover: "#F1F5F9",
  primary: "#1A2DF3",
  accent: "#0B3CD9",
  text: "#0F172A",
  textMuted: "#475569",
  border: "#E2E8F0",
  glow: "rgba(26, 45, 243, 0.4)",
  navDark: "#0B0F19"
};

// ── Scroll-reveal hook ──
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

// ── Buttons ──
function Button({ children, variant = "primary", style = {}, href }) {
  const [h, setH] = useState(false);
  
  const primary = {
    padding: "18px 36px", borderRadius: "100px", fontFamily: "'Inter', sans-serif", fontWeight: 700,
    fontSize: "15px", cursor: "pointer", border: "none", display: "inline-flex", alignItems: "center", gap: "12px",
    background: THEME.primary, color: "#fff",
    boxShadow: h ? `0 16px 32px ${THEME.glow}` : "0 8px 16px rgba(26, 45, 243, 0.2)",
    transform: h ? "translateY(-4px)" : "none",
    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
    textDecoration: "none",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  };
  
  const secondary = {
    ...primary, 
    background: h ? THEME.bgAlt : "#fff", color: THEME.text,
    border: `1px solid ${THEME.border}`,
    boxShadow: h ? "0 8px 24px rgba(0,0,0,0.05)" : "none"
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
        <span style={{ fontSize: "18px", transition: "transform 0.3s", transform: h ? "translate(4px, -4px)" : "none" }}>↗</span>
      )}
    </Tag>
  );
}

// ── Section label pill ──
function SectionLabel({ children }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 20px",
      borderRadius: "100px", background: "#fff", border: `1px solid ${THEME.border}`, 
      marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
    }}>
      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: THEME.primary, boxShadow: `0 0 8px ${THEME.primary}` }} />
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700, color: THEME.text, letterSpacing: "0.05em", textTransform: "uppercase" }}>{children}</span>
    </div>
  );
}

// ── Navbar ──
function Navbar({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = ["Solutions", "Infrastructure", "Capabilities", "Insights"];
  
  return (
    <>
      <nav style={{
        position: "fixed", top: scrolled ? "16px" : "40px", left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? "16px 24px" : "24px 40px",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        pointerEvents: "none"
      }}>
        <div style={{
          maxWidth: scrolled ? "1000px" : "100%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: scrolled ? THEME.navDark : "transparent",
          padding: scrolled ? "12px 24px" : "0",
          borderRadius: scrolled ? "100px" : "0",
          boxShadow: scrolled ? "0 20px 40px rgba(0,0,0,0.2)" : "none",
          transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
          pointerEvents: "auto"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "8px", background: scrolled ? "#fff" : THEME.primary,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke={scrolled ? THEME.navDark : "#fff"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {(!scrolled) && (
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "24px", color: THEME.text, letterSpacing: "-0.04em" }}>Evolvian</span>
            )}
          </div>
          
          <div className="ev-nav-desktop" style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} style={{
                fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600, color: scrolled ? "#fff" : THEME.textMuted,
                textDecoration: "none", transition: "color 0.2s"
              }}
              onMouseEnter={e => e.target.style.color = scrolled ? THEME.primary : THEME.text}
              onMouseLeave={e => e.target.style.color = scrolled ? "#fff" : THEME.textMuted}
              >{l}</a>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="#" style={{
              background: THEME.primary, color: "#fff", padding: "12px 28px", borderRadius: "100px",
              fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", textDecoration: "none",
              letterSpacing: "0.05em", transition: "transform 0.2s", display: "inline-block"
            }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
              Inquiry Now
            </a>
            
            <button className="ev-nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
              display: "none", background: "none", border: "none", cursor: "pointer", padding: "8px", color: scrolled ? "#fff" : THEME.text
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
        </div>
        
        {menuOpen && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: THEME.bg, paddingTop: "120px", paddingLeft: "32px", paddingRight: "32px",
            display: "flex", flexDirection: "column", gap: "16px", zIndex: -1, pointerEvents: "auto"
          }}>
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} onClick={() => setMenuOpen(false)} style={{
                fontFamily: "'Inter', sans-serif", fontSize: "24px", fontWeight: 600, color: THEME.text,
                textDecoration: "none", padding: "16px 0", borderBottom: `1px solid ${THEME.border}`,
              }}>{l}</a>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}

// ── Feature Card ──
function FeatureCard({ icon, title, description }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      background: THEME.card, borderRadius: "24px", padding: "40px 32px",
      border: `1px solid ${h ? THEME.primary : THEME.border}`,
      transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
      transform: h ? "translateY(-8px)" : "none",
      boxShadow: h ? `0 24px 48px rgba(0,0,0,0.05)` : "0 4px 12px rgba(0,0,0,0.02)",
      display: "flex", flexDirection: "column"
    }}>
      <div style={{
        width: "56px", height: "56px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center",
        background: THEME.bgAlt, color: THEME.primary, marginBottom: "24px", fontSize: "24px",
      }}>{icon}</div>
      <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: "20px", fontWeight: 700, color: THEME.text, marginBottom: "12px", letterSpacing: "-0.01em" }}>{title}</h3>
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
          background: THEME.card, borderRadius: "24px", padding: "48px 40px",
          border: `1px solid ${h ? THEME.primary : THEME.border}`,
          boxShadow: h ? `0 24px 64px rgba(26, 45, 243, 0.1)` : "0 8px 24px rgba(0,0,0,0.02)",
          transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
          transform: h ? "translateY(-6px)" : "none",
          height: "100%", display: "flex", flexDirection: "column",
          position: "relative", overflow: "hidden"
        }}>
          {isFeatured && (
            <div style={{
              position: "absolute", top: "24px", right: "24px", background: THEME.bgAlt, color: THEME.primary,
              padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase"
            }}>Flagship</div>
          )}
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: "28px", fontWeight: 800, color: THEME.text, marginBottom: "8px", letterSpacing: "-0.02em" }}>
            {name}
          </h3>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600, color: THEME.primary, marginBottom: "20px" }}>
            {tagline}
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: THEME.textMuted, lineHeight: 1.6, flex: 1, margin: 0 }}>
            {description}
          </p>
          <div style={{
            display: "flex", alignItems: "center", gap: "8px", marginTop: "32px",
            fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 700, color: h ? THEME.text : THEME.textMuted,
            transition: "color 0.3s"
          }}>
            <span>View platform details</span>
            <span style={{ transition: "transform 0.3s", transform: h ? "translate(4px, -4px)" : "none", color: h ? THEME.primary : THEME.textMuted }}>↗</span>
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
          background: THEME.card, borderRadius: "20px", padding: "32px",
          border: `1px solid ${h ? THEME.primary : THEME.border}`,
          transition: "all 0.3s ease", transform: h ? "translateY(-4px)" : "none",
          boxShadow: h ? `0 12px 32px rgba(0,0,0,0.05)` : "none",
          height: "100%", display: "flex", flexDirection: "column",
        }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: "20px", fontWeight: 700, color: THEME.text, marginBottom: "4px", letterSpacing: "-0.01em" }}>{name}</h3>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: THEME.primary, marginBottom: "16px", fontWeight: 600 }}>{tagline}</p>
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
        fontFamily: "'Inter', sans-serif", fontSize: "18px", fontWeight: 600,
        color: open ? THEME.primary : THEME.text, textAlign: "left", transition: "color 0.2s", gap: "24px",
      }}>
        <span style={{ flex: 1 }}>{q}</span>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", color: open ? THEME.primary : THEME.textMuted,
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


// ═══════════════════════════════
//  MAIN LANDING PAGE
// ═══════════════════════════════

export default function EvolvianLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 80);
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

  const sec = { maxWidth: "1280px", margin: "0 auto", padding: "0 40px" };

  return (
    <div style={{ background: THEME.bg, color: THEME.text, fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${THEME.bg}; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        ::selection { background: ${THEME.primary}; color: #fff; }
        
        .ev-hero-title {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 80px;
          line-height: 1.05;
          letter-spacing: -0.04em;
          color: ${THEME.text};
          max-width: 1100px;
          margin-bottom: 32px;
        }
        
        .ev-hero-italic {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-weight: 700;
        }

        .ev-hero-bold {
          font-weight: 800;
        }

        @media (max-width: 1024px) {
          .ev-nav-desktop { display: none !important; }
          .ev-nav-hamburger { display: block !important; }
          .ev-hero-title { font-size: 64px; }
        }
        @media (max-width: 768px) {
          .ev-hero-title { font-size: 48px; }
          .ev-section { padding-top: 80px !important; padding-bottom: 80px !important; }
          .ev-hero { padding-top: 180px !important; padding-bottom: 100px !important; }
          .ev-footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .ev-hero-title { font-size: 36px; }
          .ev-footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Navbar scrolled={scrolled} />

      {/* ═══ HERO ═══ */}
      <section className="ev-hero" style={{ paddingTop: "240px", paddingBottom: "160px", position: "relative" }}>
        {/* Decorative dot */}
        <div style={{ position: "absolute", top: "300px", right: "20%", width: "12px", height: "12px", borderRadius: "50%", background: THEME.primary }} />

        <div style={sec}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "100px", background: THEME.bgAlt, border: `1px solid ${THEME.border}`, marginBottom: "32px" }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: THEME.primary, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Evolvian Infrastructure 2.0</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="ev-hero-title">
              Intelligent infrastructure for <br/>
              <span className="ev-hero-italic">modern education.</span>
            </h1>
          </Reveal>
          
          <Reveal delay={0.2}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "20px", color: THEME.textMuted, lineHeight: 1.6, maxWidth: "600px", margin: "0 0 64px 0", fontWeight: 400 }}>
              Evolvian provides the foundational AI-driven software institutions need to manage operations, deliver content, and scale learning effectively.
            </p>
          </Reveal>
          
          <Reveal delay={0.3}>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ display: "inline-block", position: "relative" }}>
                <div style={{
                  position: "absolute", top: "20%", left: "10%", right: "10%", bottom: "-20%",
                  background: THEME.primary, filter: "blur(30px)", opacity: 0.4, zIndex: 0
                }} />
                <Button variant="primary" href="/sign-in" style={{ position: "relative", zIndex: 1 }}>
                  Launch TaskOrbit
                </Button>
              </div>
              <Button variant="secondary" href="#solutions" style={{ position: "relative", zIndex: 1 }}>
                Explore Platform
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
      
      {/* ═══ LOGOS ═══ */}
      <section style={{ borderTop: `1px solid ${THEME.border}`, borderBottom: `1px solid ${THEME.border}`, padding: "40px 0", background: THEME.bgAlt }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", alignItems: "center", padding: "0 32px", gap: "40px", opacity: 0.4 }}>
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
        <div style={sec}>
          <Reveal>
            <div style={{ marginBottom: "64px" }}>
              <SectionLabel>Core Solutions</SectionLabel>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "40px", color: THEME.text, letterSpacing: "-0.03em", marginBottom: "24px" }}>
                Modular software for specific <span className="ev-hero-italic" style={{ color: THEME.primary }}>operational requirements.</span>
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: THEME.textMuted, lineHeight: 1.6, maxWidth: "600px" }}>
                Deploy individual components to solve immediate technical challenges, or integrate the full suite for a comprehensive institutional backend.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px", marginBottom: "24px" }}>
            {products.map((p, i) => <ProductCard key={i} {...p} index={i} isFeatured={p.name === "TaskOrbit"} />)}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {moreProducts.map((p, i) => <CompactProductCard key={i} {...p} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══ CAPABILITIES ═══ */}
      <section id="capabilities" className="ev-section" style={{ background: THEME.bgAlt, paddingTop: "140px", paddingBottom: "140px", borderTop: `1px solid ${THEME.border}` }}>
        <div style={sec}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "80px" }}>
              <SectionLabel>Platform Capabilities</SectionLabel>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "40px", color: THEME.text, letterSpacing: "-0.03em", marginBottom: "24px" }}>
                Engineered for <span className="ev-hero-italic" style={{ color: THEME.primary }}>reliability.</span>
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: THEME.textMuted, lineHeight: 1.6, maxWidth: "600px", margin: "0 auto" }}>
                A robust technical foundation designed to handle the complexity and scale of modern educational environments without compromising performance.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px" }}>
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
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "40px", color: THEME.text, letterSpacing: "-0.03em", marginBottom: "24px" }}>
                Technical documentation <br/><span className="ev-hero-italic" style={{ color: THEME.primary }}>& support</span>
              </h2>
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

      {/* ═══ CTA SECTION ═══ */}
      <section className="ev-section" style={{ paddingTop: "80px", paddingBottom: "140px", textAlign: "center" }}>
        <div style={sec}>
          <Reveal>
            <div style={{
              position: "relative", textAlign: "center", padding: "100px 40px", borderRadius: "24px",
              background: THEME.bgAlt, border: `1px solid ${THEME.border}`, overflow: "hidden"
            }}>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "48px", color: THEME.text, letterSpacing: "-0.03em", marginBottom: "32px" }}>
                Deploy reliable systems <span className="ev-hero-italic" style={{ fontWeight: 700, color: THEME.primary }}>today.</span>
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "20px", color: THEME.textMuted, lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 48px" }}>
                Connect with our engineering team to discuss architecture, integrations, and deployment strategies tailored to your institution.
              </p>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <Button variant="primary" href="/sign-in">Launch TaskOrbit</Button>
                <Button variant="secondary">Contact Engineering</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: `1px solid ${THEME.border}`, background: THEME.bg, paddingTop: "80px", paddingBottom: "40px" }}>
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
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "20px", color: THEME.text, letterSpacing: "-0.02em" }}>Evolvian</span>
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
                <h4 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "13px", color: THEME.text, marginBottom: "24px", textTransform: "uppercase", letterSpacing: "1px" }}>{col.title}</h4>
                {col.links.map((l, j) => (
                  <a key={j} href="#" style={{
                    display: "block", fontFamily: "'Inter', sans-serif", fontSize: "15px", color: THEME.textMuted,
                    textDecoration: "none", marginBottom: "16px", transition: "color 0.2s", fontWeight: 500
                  }}
                  onMouseEnter={e => e.target.style.color = THEME.primary}
                  onMouseLeave={e => e.target.style.color = THEME.textMuted}
                  >{l}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${THEME.border}`, paddingTop: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: THEME.textMuted, fontWeight: 500 }}>© 2026 Evolvian Inc.</span>
            <div style={{ display: "flex", gap: "32px" }}>
              {["Privacy Policy", "Terms of Service"].map((l, i) => (
                <a key={i} href="#" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: THEME.textMuted, textDecoration: "none", transition: "color 0.2s", fontWeight: 500 }}
                  onMouseEnter={e => e.target.style.color = THEME.primary}
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
