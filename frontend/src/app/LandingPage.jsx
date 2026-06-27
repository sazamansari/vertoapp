"use client";

import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   EVOLVIAN — Light Premium EdTech Landing
   ═══════════════════════════════════════════ */

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
  const offsets = { up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(40px)", right: "translateX(-40px)", none: "none" };
  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : offsets[direction],
      transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>{children}</div>
  );
}

// ── Animated gradient blob ──
function GradientBlob({ top, left, right, size = 500, color1 = "#c4b5fd", color2 = "#93c5fd", opacity = 0.35, blur = 80 }) {
  return (
    <div style={{
      position: "absolute", top, left, right, width: size, height: size, borderRadius: "50%",
      background: `radial-gradient(circle, ${color1} 0%, ${color2} 50%, transparent 70%)`,
      opacity, filter: `blur(${blur}px)`, pointerEvents: "none", zIndex: 0,
      animation: "blobFloat 12s ease-in-out infinite alternate",
    }} />
  );
}

// ── Gradient text ──
function GradientText({ children, style = {} }) {
  return (
    <span style={{
      background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 40%, #06B6D4 100%)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", ...style,
    }}>{children}</span>
  );
}

// ── Buttons ──
function Button({ children, variant = "primary", style = {} }) {
  const [h, setH] = useState(false);
  const primary = {
    padding: "15px 34px", borderRadius: 14, fontFamily: "'Outfit', sans-serif", fontWeight: 600,
    fontSize: 16, cursor: "pointer", border: "none", display: "inline-flex", alignItems: "center", gap: 10,
    background: h ? "linear-gradient(135deg, #6D28D9, #1D4ED8)" : "linear-gradient(135deg, #7C3AED, #2563EB)",
    color: "#fff", boxShadow: h ? "0 12px 40px rgba(124,58,237,0.35)" : "0 6px 24px rgba(124,58,237,0.2)",
    transform: h ? "translateY(-2px)" : "none", transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
    letterSpacing: "-0.01em",
  };
  const secondary = {
    ...primary, background: h ? "#F5F3FF" : "#fff", color: "#5B21B6",
    border: "1.5px solid #DDD6FE", boxShadow: h ? "0 8px 24px rgba(124,58,237,0.12)" : "0 2px 8px rgba(0,0,0,0.06)",
  };
  const s = variant === "primary" ? primary : secondary;
  return <button style={{ ...s, ...style }} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>{children}</button>;
}

// ── Section label pill ──
function SectionLabel({ children }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px",
      borderRadius: 100, background: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
      border: "1px solid #DDD6FE", marginBottom: 22,
    }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #2563EB)" }} />
      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, color: "#6D28D9", letterSpacing: "0.04em", textTransform: "uppercase" }}>{children}</span>
    </div>
  );
}

// ── Feature card (bento style) ──
function FeatureCard({ icon, title, description, span = false }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      background: h ? "#FAFAFE" : "#fff", border: `1px solid ${h ? "#C4B5FD" : "#E9E5F5"}`,
      borderRadius: 20, padding: span ? "40px 36px" : "32px 28px",
      transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
      transform: h ? "translateY(-6px)" : "none",
      boxShadow: h ? "0 20px 60px rgba(124,58,237,0.1), 0 4px 16px rgba(0,0,0,0.04)" : "0 2px 8px rgba(0,0,0,0.03)",
      gridColumn: span ? "span 2" : "span 1",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)",
        transition: "all 0.4s", transform: h ? "scale(2)" : "scale(1)",
      }} />
      <div style={{
        width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #F5F3FF, #EDE9FE)", marginBottom: 20, fontSize: 24,
        border: "1px solid #DDD6FE", position: "relative",
      }}>{icon}</div>
      <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, color: "#1E1B4B", marginBottom: 10, letterSpacing: "-0.02em", position: "relative" }}>{title}</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#64748B", lineHeight: 1.7, margin: 0, position: "relative" }}>{description}</p>
    </div>
  );
}

// ── Use case card ──
function UseCaseCard({ icon, title, description, index }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={index * 0.06}>
      <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
        background: "#fff", border: `1.5px solid ${h ? "#C4B5FD" : "#F1F0FB"}`,
        borderRadius: 18, padding: "30px 26px", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        transform: h ? "translateY(-5px) scale(1.01)" : "none",
        boxShadow: h ? "0 16px 48px rgba(124,58,237,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
        height: "100%", display: "flex", flexDirection: "column",
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
          background: h ? "linear-gradient(135deg, #7C3AED, #2563EB)" : "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
          transition: "all 0.3s", marginBottom: 18, fontSize: 22,
          filter: h ? "none" : "grayscale(0)",
        }}>
          <span style={{ filter: h ? "brightness(10)" : "none", transition: "all 0.3s" }}>{icon}</span>
        </div>
        <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 700, color: "#1E1B4B", margin: "0 0 10px", letterSpacing: "-0.01em" }}>{title}</h4>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: "#64748B", lineHeight: 1.65, margin: 0, flex: 1 }}>{description}</p>
      </div>
    </Reveal>
  );
}

// ── Product card (links to live products) ──
function ProductCard({ name, tagline, description, icon, color, gradient, url, index }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={index * 0.1}>
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", height: "100%" }}
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
        <div style={{
          background: "#fff", borderRadius: 24, padding: "40px 32px",
          border: `1.5px solid ${h ? color + "55" : "#F1F0FB"}`,
          boxShadow: h ? `0 24px 64px ${color}18, 0 8px 24px rgba(0,0,0,0.06)` : "0 2px 12px rgba(0,0,0,0.04)",
          transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
          transform: h ? "translateY(-8px)" : "none",
          height: "100%", display: "flex", flexDirection: "column",
          position: "relative", overflow: "hidden", cursor: "pointer",
        }}>
          {/* Top gradient line */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: h ? 5 : 4,
            background: gradient, transition: "height 0.3s",
          }} />
          {/* Hover glow */}
          <div style={{
            position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%",
            background: `radial-gradient(circle, ${color}12 0%, transparent 70%)`,
            transform: h ? "scale(2.5)" : "scale(1)", transition: "transform 0.5s ease-out",
          }} />
          {/* Icon */}
          <div style={{
            width: 64, height: 64, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center",
            background: h ? gradient : `${color}10`, border: `1.5px solid ${color}20`,
            marginBottom: 24, fontSize: 28, transition: "all 0.35s", position: "relative",
            boxShadow: h ? `0 8px 24px ${color}25` : "none",
          }}>
            <span style={{ filter: h ? "brightness(10)" : "none", transition: "filter 0.3s" }}>{icon}</span>
          </div>
          {/* Content */}
          <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
            <h3 style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 800,
              color: "#1E1B4B", marginBottom: 6, letterSpacing: "-0.025em",
            }}>{name}</h3>
            <p style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600,
              color, marginBottom: 16, letterSpacing: "-0.01em",
            }}>{tagline}</p>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15.5, color: "#64748B",
              lineHeight: 1.7, margin: 0, flex: 1,
            }}>{description}</p>
            {/* Visit arrow */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginTop: 24,
              fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, color,
              transition: "gap 0.3s", ...(h ? { gap: 12 } : {}),
            }}>
              <span>Explore {name}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ transition: "transform 0.3s", transform: h ? "translateX(4px)" : "none" }}>
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </a>
    </Reveal>
  );
}

// ── Compact product card (secondary products) ──
function CompactProductCard({ name, tagline, description, icon, color, gradient, url, index }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={index * 0.08}>
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", height: "100%" }}
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: "30px 26px",
          border: `1.5px solid ${h ? color + "44" : "#F1F0FB"}`,
          boxShadow: h ? `0 16px 48px ${color}12, 0 4px 16px rgba(0,0,0,0.04)` : "0 2px 8px rgba(0,0,0,0.03)",
          transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
          transform: h ? "translateY(-6px)" : "none",
          height: "100%", display: "flex", flexDirection: "column",
          position: "relative", overflow: "hidden", cursor: "pointer",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: h ? 4 : 3,
            background: gradient, transition: "height 0.3s",
          }} />
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 14 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
              background: h ? gradient : `${color}10`, border: `1px solid ${color}18`,
              fontSize: 22, transition: "all 0.3s", flexShrink: 0,
              boxShadow: h ? `0 6px 18px ${color}20` : "none",
            }}>
              <span style={{ filter: h ? "brightness(10)" : "none", transition: "filter 0.3s" }}>{icon}</span>
            </div>
            <div>
              <h3 style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 800,
                color: "#1E1B4B", marginBottom: 3, letterSpacing: "-0.02em",
              }}>{name}</h3>
              <p style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600,
                color, margin: 0,
              }}>{tagline}</p>
            </div>
          </div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: "#64748B",
            lineHeight: 1.65, margin: 0, flex: 1,
          }}>{description}</p>
          <div style={{
            display: "flex", alignItems: "center", gap: 6, marginTop: 18,
            fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, color,
          }}>
            <span>Learn more</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ transition: "transform 0.3s", transform: h ? "translateX(4px)" : "none" }}>
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </a>
    </Reveal>
  );
}

// ── FAQ ──
function FAQItem({ q, a, open, toggle }) {
  return (
    <div style={{ borderBottom: "1px solid #F1F0FB" }}>
      <button onClick={toggle} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "24px 0", background: "none", border: "none", cursor: "pointer",
        fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 600,
        color: open ? "#6D28D9" : "#1E1B4B", textAlign: "left", transition: "color 0.2s", gap: 20,
      }}>
        <span style={{ flex: 1 }}>{q}</span>
        <div style={{
          width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
          background: open ? "linear-gradient(135deg, #7C3AED, #2563EB)" : "#F5F3FF",
          transition: "all 0.3s", flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transition: "transform 0.3s", transform: open ? "rotate(45deg)" : "none" }}>
            <path d="M7 1v12M1 7h12" stroke={open ? "#fff" : "#7C3AED"} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </button>
      <div style={{ maxHeight: open ? 400 : 0, overflow: "hidden", transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#64748B", lineHeight: 1.8, margin: 0, paddingBottom: 24 }}>{a}</p>
      </div>
    </div>
  );
}

// ── Metric card ──
function MetricCard({ value, label, icon }) {
  return (
    <div style={{
      textAlign: "center", padding: "28px 20px", borderRadius: 18,
      background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)",
      border: "1px solid rgba(124,58,237,0.1)",
    }}>
      <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>
        <GradientText>{value}</GradientText>
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#64748B", marginTop: 8 }}>{label}</div>
    </div>
  );
}

// ── Navbar ──
function Navbar({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = ["Products", "Solutions", "Use Cases", "Features", "FAQ"];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0)",
      backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
      borderBottom: scrolled ? "1px solid rgba(124,58,237,0.08)" : "1px solid transparent",
      transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 76 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, zIndex: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #7C3AED, #2563EB)", boxShadow: "0 4px 16px rgba(124,58,237,0.25)",
          }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 24, color: "#1E1B4B", letterSpacing: "-0.04em" }}>Evolvian</span>
        </div>
        <div className="ev-nav-desktop" style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, color: "#64748B",
              textDecoration: "none", transition: "color 0.2s", position: "relative",
            }}
            onMouseEnter={e => e.target.style.color = "#6D28D9"}
            onMouseLeave={e => e.target.style.color = "#64748B"}
            >{l}</a>
          ))}
          <Button variant="primary" style={{ padding: "11px 26px", fontSize: 14, borderRadius: 12 }}>Book a Demo</Button>
        </div>
        <button className="ev-nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
          display: "none", background: "none", border: "none", cursor: "pointer", padding: 8, zIndex: 10,
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            {menuOpen
              ? <path d="M6 6l12 12M6 18L18 6" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" />
              : <><line x1="3" y1="6" x2="21" y2="6" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="12" x2="21" y2="12" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="18" x2="16" y2="18" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round"/></>
            }
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(255,255,255,0.97)", backdropFilter: "blur(24px)",
          paddingTop: 100, paddingLeft: 28, paddingRight: 28,
          display: "flex", flexDirection: "column", gap: 8, zIndex: 5,
        }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} onClick={() => setMenuOpen(false)} style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 700, color: "#1E1B4B",
              textDecoration: "none", padding: "16px 0", borderBottom: "1px solid #F1F0FB",
            }}>{l}</a>
          ))}
          <Button variant="primary" style={{ marginTop: 24, width: "100%", justifyContent: "center", padding: "16px 34px" }}>Book a Demo</Button>
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
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const products = [
    {
      name: "TaskOrbit",
      tagline: "Intelligent Task Management",
      description: "Orchestrate assignments, deadlines, and team workflows with AI-driven prioritization. TaskOrbit keeps every stakeholder aligned and every deliverable on track.",
      icon: <img src="/icon.svg" alt="TaskOrbit Logo" style={{ width: 32, height: 32, objectFit: "contain" }} />,
      color: "#7C3AED",
      gradient: "linear-gradient(135deg, #7C3AED, #A78BFA)",
      url: "/sign-in",
    },
    {
      name: "CodeSkill",
      tagline: "Learn to Code, Intelligently",
      description: "An adaptive coding education platform with real-time feedback, AI-guided exercises, and skill progression maps tailored to each learner's level and goals.",
      icon: "💻",
      color: "#2563EB",
      gradient: "linear-gradient(135deg, #2563EB, #60A5FA)",
      url: "https://codeskill.evolvian.com",
    },
    {
      name: "AllOps",
      tagline: "Unified Operations Hub",
      description: "Centralize institutional operations — enrollment, scheduling, compliance, and reporting — into one AI-powered platform that eliminates silos and manual overhead.",
      icon: "⚡",
      color: "#0891B2",
      gradient: "linear-gradient(135deg, #0891B2, #22D3EE)",
      url: "https://allops.evolvian.com",
    },
    {
      name: "LearnCraft",
      tagline: "AI-Powered Course Builder",
      description: "Transform raw subject matter into structured, engaging courses in minutes. LearnCraft handles content generation, assessments, and multimedia — you bring the expertise.",
      icon: "✨",
      color: "#9333EA",
      gradient: "linear-gradient(135deg, #9333EA, #C084FC)",
      url: "https://learncraft.evolvian.com",
    },
  ];

  const moreProducts = [
    {
      name: "InsightBoard",
      tagline: "Learning Analytics & Dashboards",
      description: "Visualize engagement, retention, and performance across cohorts with real-time dashboards that turn raw data into decisions.",
      icon: "📊",
      color: "#0D9488",
      gradient: "linear-gradient(135deg, #0D9488, #2DD4BF)",
      url: "https://insightboard.evolvian.com",
    },
    {
      name: "QuizForge",
      tagline: "AI Assessment Generation",
      description: "Generate rubric-aligned quizzes, exams, and practice sets in seconds — calibrated to learning objectives and difficulty levels.",
      icon: "🎯",
      color: "#DC2626",
      gradient: "linear-gradient(135deg, #DC2626, #F87171)",
      url: "https://quizforge.evolvian.com",
    },
    {
      name: "MentorAI",
      tagline: "Intelligent Tutoring Assistant",
      description: "An always-available AI tutor that explains concepts, answers questions, and adapts its teaching style to each learner's needs.",
      icon: "🤖",
      color: "#4F46E5",
      gradient: "linear-gradient(135deg, #4F46E5, #818CF8)",
      url: "https://mentorai.evolvian.com",
    },
    {
      name: "CertifyHub",
      tagline: "Credentials & Compliance",
      description: "Issue, verify, and manage digital certificates and micro-credentials with blockchain-backed authenticity and automated compliance tracking.",
      icon: "🏅",
      color: "#B45309",
      gradient: "linear-gradient(135deg, #B45309, #F59E0B)",
      url: "https://certifyhub.evolvian.com",
    },
    {
      name: "SkillMap",
      tagline: "Career Pathway Intelligence",
      description: "Map skill gaps, recommend learning paths, and align individual growth with industry demands using AI-driven competency analysis.",
      icon: "🗺️",
      color: "#7C3AED",
      gradient: "linear-gradient(135deg, #6D28D9, #A78BFA)",
      url: "https://skillmap.evolvian.com",
    },
    {
      name: "ClassSync",
      tagline: "Real-Time Virtual Classroom",
      description: "Host live sessions with AI-powered transcription, smart breakout rooms, engagement tracking, and instant content capture — all in one place.",
      icon: "📡",
      color: "#0369A1",
      gradient: "linear-gradient(135deg, #0369A1, #38BDF8)",
      url: "https://classsync.evolvian.com",
    },
  ];

  const useCases = [
    { icon: "🎯", title: "Personalized Learning Paths", description: "Adapt curricula in real time based on each learner's pace, strengths, and knowledge gaps — automatically." },
    { icon: "🤖", title: "Intelligent Tutoring", description: "AI tutors that explain concepts, answer questions, and guide practice with patience that never runs out." },
    { icon: "📝", title: "Automated Course Creation", description: "Generate structured modules, lesson plans, and multimedia content from raw subject matter in minutes." },
    { icon: "📊", title: "Assessment Generation", description: "Create rubric-aligned quizzes, assignments, and exams calibrated precisely to learning objectives." },
    { icon: "📈", title: "Learning Analytics", description: "Surface actionable insights on engagement, retention, and performance at individual and cohort levels." },
    { icon: "💬", title: "Student Support Systems", description: "Automate advising, FAQ resolution, and wellness check-ins so no student falls through the cracks." },
    { icon: "⚙️", title: "Admin Workflow Automation", description: "Streamline enrollment, scheduling, credentialing, and compliance across every department." },
    { icon: "🔗", title: "LMS Integration", description: "Plug into Canvas, Moodle, Blackboard, and custom platforms without rearchitecting your stack." },
  ];

  const features = [
    { icon: "🧠", title: "Adaptive Intelligence", description: "Models that learn your institution's patterns and continuously refine recommendations as data accumulates over time." },
    { icon: "📐", title: "Scalable Architecture", description: "Serve ten learners or ten million with the same infrastructure. Cloud-native and horizontally elastic by design." },
    { icon: "⚡", title: "Real-Time Processing", description: "Feedback, grading, and content generation in seconds — fast enough to keep every learner in flow state." },
    { icon: "🔌", title: "Drop-In Integration", description: "RESTful APIs, webhooks, LTI compliance, and pre-built connectors for every tool your team already uses." },
    { icon: "🔒", title: "Enterprise Security", description: "SOC 2 Type II, FERPA and GDPR compliant, with end-to-end encryption and role-based access controls." },
    { icon: "🌍", title: "Multilingual by Default", description: "Content, tutoring, and assessment in 40+ languages with culturally aware localization built in." },
  ];

  const faqs = [
    { q: "How quickly can we deploy Evolvian?", a: "Most institutions are running a pilot within two weeks. Full deployment — including LMS integration, data migration, and team onboarding — typically takes four to six weeks depending on complexity." },
    { q: "Does Evolvian replace our existing LMS?", a: "No. Evolvian layers on top of your current infrastructure. It integrates with Canvas, Moodle, Blackboard, and custom platforms via LTI and API connectors. You keep what works and add intelligence." },
    { q: "What kind of data does Evolvian use?", a: "Evolvian processes learning interaction data, assessment results, and engagement metrics. All data is encrypted at rest and in transit, stored in SOC 2 Type II certified facilities, and handled in compliance with FERPA, GDPR, and regional regulations." },
    { q: "Can it handle large-scale deployments?", a: "Yes. Our architecture is built for elastic scale. We currently serve institutions ranging from 500 to over 2 million active learners without any performance degradation." },
    { q: "What customization is available?", a: "Extensive. Configure learning models, branding, assessment rubrics, workflow rules, and reporting dashboards. Our solutions team works with you to align the platform to your pedagogy and operations." },
    { q: "Is there a free trial?", a: "We offer a 30-day guided pilot for qualified institutions and training organizations. This includes onboarding support, sample integrations, and a dedicated success manager." },
  ];

  const sec = { maxWidth: 1200, margin: "0 auto", padding: "0 28px" };
  const h2Style = { fontFamily: "'Outfit', sans-serif", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.12, color: "#1E1B4B" };

  return (
    <div style={{ background: "#fff", color: "#1E1B4B", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #fff; }
        ::selection { background: #DDD6FE; color: #1E1B4B; }
        @keyframes blobFloat {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
          100% { transform: translate(10px, -10px) scale(1.02); }
        }
        @keyframes heroGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 900px) {
          .ev-nav-desktop { display: none !important; }
          .ev-nav-hamburger { display: block !important; }
        }
        @media (max-width: 768px) {
          .ev-hero-h { font-size: 38px !important; }
          .ev-hero-sub { font-size: 17px !important; }
          .ev-hero-btns { flex-direction: column !important; }
          .ev-hero-btns button { width: 100% !important; justify-content: center !important; }
          .ev-g2 { grid-template-columns: 1fr !important; }
          .ev-g3 { grid-template-columns: 1fr !important; }
          .ev-g4 { grid-template-columns: 1fr 1fr !important; }
          .ev-stats { grid-template-columns: 1fr 1fr !important; }
          .ev-sec-h { font-size: 30px !important; }
          .ev-section { padding-top: 80px !important; padding-bottom: 80px !important; }
          .ev-hero { padding-top: 130px !important; padding-bottom: 70px !important; }
          .ev-bento .ev-span2 { grid-column: span 1 !important; }
          .ev-footer-grid { grid-template-columns: 1fr 1fr !important; }
          .ev-cta-inner { padding: 48px 24px !important; }
        }
        @media (max-width: 480px) {
          .ev-hero-h { font-size: 30px !important; }
          .ev-g4 { grid-template-columns: 1fr !important; }
          .ev-stats { grid-template-columns: 1fr 1fr !important; }
          .ev-footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Navbar scrolled={scrolled} />

      {/* ═══ HERO ═══ */}
      <section className="ev-hero" style={{ position: "relative", paddingTop: 170, paddingBottom: 130, overflow: "hidden" }}>
        <GradientBlob top="-250px" left="-150px" size={650} color1="#c4b5fd" color2="#bfdbfe" opacity={0.3} blur={90} />
        <GradientBlob top="100px" right="-200px" size={500} color1="#93c5fd" color2="#c4b5fd" opacity={0.2} blur={80} />
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 60%)",
          animation: "heroGlow 6s ease-in-out infinite", pointerEvents: "none",
        }} />
        <div style={{ ...sec, position: "relative", zIndex: 2, textAlign: "center" }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "8px 20px", borderRadius: 100, background: "#F5F3FF", border: "1px solid #DDD6FE", marginBottom: 36 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 10px rgba(34,197,94,0.5)", animation: "heroGlow 2s ease-in-out infinite" }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6D28D9", fontWeight: 500 }}>Now available for institutions worldwide</span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="ev-hero-h" style={{ ...h2Style, fontSize: 68, maxWidth: 850, margin: "0 auto 28px" }}>
              Transform Intelligence<br />for <GradientText>Every Learning Need</GradientText>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="ev-hero-sub" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, color: "#64748B", lineHeight: 1.7, maxWidth: 620, margin: "0 auto 48px" }}>
              Evolvian helps education teams, institutions, and learners unlock smarter solutions with AI-powered systems built for real-world learning.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="ev-hero-btns" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="#products" style={{ textDecoration: "none" }}>
                <Button variant="primary">
                  Explore Evolvian
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Button>
              </a>
              <a href="#use-cases" style={{ textDecoration: "none" }}>
                <Button variant="secondary">See Use Cases</Button>
              </a>
            </div>
          </Reveal>
        </div>
        {/* Stats */}
        <Reveal delay={0.35}>
          <div className="ev-stats" style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20,
            maxWidth: 880, margin: "80px auto 0", padding: "0 28px",
          }}>
            <MetricCard value="2M+" label="Active Learners" icon="🎓" />
            <MetricCard value="340+" label="Institutions" icon="🏛️" />
            <MetricCard value="34%" label="Higher Completion" icon="📈" />
            <MetricCard value="8×" label="Faster Content" icon="⚡" />
          </div>
        </Reveal>
      </section>

      {/* ═══ LOGOS ═══ */}
      <section style={{ paddingTop: 40, paddingBottom: 80 }}>
        <Reveal>
          <p style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 28 }}>Trusted by forward-thinking institutions</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 52, flexWrap: "wrap", alignItems: "center", padding: "0 28px" }}>
            {["Meridian University", "Apex Training", "NovaBridge", "Luminos Institute", "EduCore", "Pathwright"].map((n, i) => (
              <span key={i} style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 700, color: "#CBD5E1", letterSpacing: "-0.01em", whiteSpace: "nowrap", transition: "color 0.3s", cursor: "default" }}
                onMouseEnter={e => e.target.style.color = "#7C3AED"}
                onMouseLeave={e => e.target.style.color = "#CBD5E1"}
              >{n}</span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ PRODUCTS ═══ */}
      <section id="products" className="ev-section" style={{ paddingTop: 110, paddingBottom: 120, position: "relative", overflow: "hidden" }}>
        <GradientBlob top="-100px" right="-150px" size={500} color1="#c4b5fd" color2="#bfdbfe" opacity={0.15} blur={80} />
        <GradientBlob top="60%" left="-120px" size={400} color1="#93c5fd" color2="#c4b5fd" opacity={0.1} blur={70} />
        <div style={sec}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 68 }}>
              <SectionLabel>Our Products</SectionLabel>
              <h2 className="ev-sec-h" style={{ ...h2Style, fontSize: 44, maxWidth: 700, margin: "0 auto 20px" }}>
                Purpose-Built Products for <GradientText>Every Need</GradientText>
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: "#64748B", lineHeight: 1.7, maxWidth: 580, margin: "0 auto" }}>
                Each product in the Evolvian ecosystem solves a specific challenge — and they work even better together.
              </p>
            </div>
          </Reveal>

          {/* Flagship Products */}
          <div className="ev-g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
            {products.map((p, i) => <ProductCard key={i} {...p} index={i} />)}
          </div>

          {/* Divider */}
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 20, margin: "56px 0 44px" }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #E9E5F5, transparent)" }} />
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>More from Evolvian</span>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #E9E5F5, transparent)" }} />
            </div>
          </Reveal>

          {/* More Products */}
          <div className="ev-g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
            {moreProducts.map((p, i) => <CompactProductCard key={i} {...p} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══ PROBLEM ═══ */}
      <section id="solutions" className="ev-section" style={{ paddingTop: 110, paddingBottom: 110, background: "linear-gradient(180deg, #FAFAFE 0%, #fff 100%)", position: "relative" }}>
        <div style={sec}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <SectionLabel>The Challenge</SectionLabel>
              <h2 className="ev-sec-h" style={{ ...h2Style, fontSize: 44, maxWidth: 680, margin: "0 auto 20px" }}>
                Education Deserves Better Than <GradientText>Fragmented Tools</GradientText>
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: "#64748B", lineHeight: 1.7, maxWidth: 580, margin: "0 auto" }}>
                Most institutions juggle disconnected platforms, manual workflows, and one-size-fits-all content — leaving learners underserved and teams overworked.
              </p>
            </div>
          </Reveal>
          <div className="ev-g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            {[
              { title: "Inefficient Workflows", desc: "Staff spend more time on administration than instruction. Manual grading and reporting drain resources that should go toward learners.", icon: "📋", color: "#F5F3FF" },
              { title: "Lack of Personalization", desc: "Static curricula ignore the reality that every learner moves at a different pace. Without adaptation, engagement drops.", icon: "👤", color: "#EFF6FF" },
              { title: "Slow Content Production", desc: "Creating quality learning material takes weeks or months. By the time it ships, the subject may have already evolved.", icon: "⏳", color: "#F5F3FF" },
              { title: "Siloed Data & Systems", desc: "Insights are trapped in disconnected tools. Without a unified view, institutions can't act on what the data reveals.", icon: "🧩", color: "#EFF6FF" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{
                  background: "#fff", border: "1.5px solid #F1F0FB", borderRadius: 20, padding: 36,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)", height: "100%",
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                    background: item.color, marginBottom: 20, fontSize: 24,
                  }}>{item.icon}</div>
                  <h3 style={{ ...h2Style, fontSize: 20, marginBottom: 12, fontWeight: 700 }}>{item.title}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15.5, color: "#64748B", lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SOLUTION ═══ */}
      <section className="ev-section" style={{ paddingTop: 110, paddingBottom: 110, position: "relative", overflow: "hidden" }}>
        <GradientBlob top="20%" left="-100px" size={400} color1="#c4b5fd" color2="#bfdbfe" opacity={0.15} />
        <div style={sec}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <SectionLabel>The Evolvian Approach</SectionLabel>
              <h2 className="ev-sec-h" style={{ ...h2Style, fontSize: 44, maxWidth: 750, margin: "0 auto 20px" }}>
                Intelligence That Adapts to <GradientText>How You Teach & Learn</GradientText>
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: "#64748B", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
                Evolvian connects your learning ecosystem with AI models purpose-built for education — turning fragmented tools into one intelligent platform.
              </p>
            </div>
          </Reveal>
          <div className="ev-g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { icon: "🔬", title: "Understand", description: "Evolvian ingests your content, data, and workflows to build a precise model of your educational environment.", color: "#7C3AED" },
              { icon: "🧬", title: "Adapt", description: "AI layers optimize every touchpoint — from content delivery to student support — using continuous learning signals.", color: "#2563EB" },
              { icon: "🚀", title: "Evolve", description: "The platform improves with every interaction, surfacing new opportunities and refining outcomes automatically.", color: "#06B6D4" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{
                  background: "#fff", border: "1.5px solid #F1F0FB", borderRadius: 22, padding: "40px 32px",
                  position: "relative", overflow: "hidden", height: "100%",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                }}>
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 4,
                    background: `linear-gradient(90deg, ${item.color}, transparent)`,
                  }} />
                  <div style={{
                    width: 60, height: 60, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
                    background: `linear-gradient(135deg, ${item.color}10, ${item.color}08)`,
                    border: `1px solid ${item.color}20`, marginBottom: 24, fontSize: 28,
                  }}>{item.icon}</div>
                  <h3 style={{ ...h2Style, fontSize: 24, marginBottom: 14, fontWeight: 700 }}>{item.title}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#64748B", lineHeight: 1.75 }}>{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ USE CASES ═══ */}
      <section id="use-cases" className="ev-section" style={{ paddingTop: 110, paddingBottom: 110, background: "linear-gradient(180deg, #FAFAFE 0%, #fff 100%)" }}>
        <div style={sec}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <SectionLabel>Use Cases</SectionLabel>
              <h2 className="ev-sec-h" style={{ ...h2Style, fontSize: 44, maxWidth: 650, margin: "0 auto 20px" }}>
                Built for the <GradientText>Full Spectrum</GradientText> of Education
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: "#64748B", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
                From classroom personalization to institutional operations — a solution for every layer of the learning stack.
              </p>
            </div>
          </Reveal>
          <div className="ev-g4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {useCases.map((uc, i) => <UseCaseCard key={i} {...uc} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES (Bento) ═══ */}
      <section id="features" className="ev-section" style={{ paddingTop: 110, paddingBottom: 110, position: "relative", overflow: "hidden" }}>
        <GradientBlob top="10%" right="-100px" size={500} color1="#bfdbfe" color2="#c4b5fd" opacity={0.12} />
        <div style={sec}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <SectionLabel>Platform Capabilities</SectionLabel>
              <h2 className="ev-sec-h" style={{ ...h2Style, fontSize: 44, maxWidth: 650, margin: "0 auto 20px" }}>
                Everything You Need,<br /><GradientText>Nothing You Don't</GradientText>
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: "#64748B", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
                Purpose-built for education, not retrofitted from generic enterprise AI. Every capability exists because an educator asked for it.
              </p>
            </div>
          </Reveal>
          <div className="ev-g3 ev-bento" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <FeatureCard {...f} span={false} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ═══ FAQ ═══ */}
      <section id="faq" className="ev-section" style={{ paddingTop: 110, paddingBottom: 110 }}>
        <div style={{ ...sec, maxWidth: 780 }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <SectionLabel>FAQ</SectionLabel>
              <h2 className="ev-sec-h" style={{ ...h2Style, fontSize: 44 }}>Common Questions</h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ background: "#fff", borderRadius: 22, border: "1.5px solid #F1F0FB", padding: "8px 36px", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
              {faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} open={openFaq === i} toggle={() => setOpenFaq(openFaq === i ? null : i)} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="ev-section" style={{ paddingTop: 80, paddingBottom: 140, position: "relative", overflow: "hidden" }}>
        <div style={sec}>
          <Reveal>
            <div className="ev-cta-inner" style={{
              textAlign: "center", padding: "88px 56px", borderRadius: 28,
              background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #3730A3 100%)",
              position: "relative", overflow: "hidden",
              boxShadow: "0 32px 80px rgba(30,27,75,0.25)",
            }}>
              <GradientBlob top="-200px" left="-100px" size={500} color1="rgba(139,92,246,0.3)" color2="rgba(59,130,246,0.2)" opacity={0.5} blur={60} />
              <GradientBlob top="50px" right="-150px" size={400} color1="rgba(34,211,238,0.2)" color2="rgba(139,92,246,0.2)" opacity={0.4} blur={50} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <h2 className="ev-sec-h" style={{ ...h2Style, fontSize: 44, maxWidth: 580, margin: "0 auto 20px", color: "#fff" }}>
                  Ready to Transform Your Learning Ecosystem?
                </h2>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 44px" }}>
                  Join 340+ institutions already using Evolvian to deliver faster, smarter, and more personalized education at scale.
                </p>
                <div className="ev-hero-btns" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                  <Button variant="primary" style={{
                    background: "#fff", color: "#4C1D95",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  }}>
                    Book a Demo
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </Button>
                  <Button variant="secondary" style={{
                    background: "rgba(255,255,255,0.1)", color: "#fff",
                    border: "1.5px solid rgba(255,255,255,0.25)",
                  }}>Contact Sales</Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: "1px solid #F1F0FB", background: "#FAFAFE", paddingTop: 72, paddingBottom: 48 }}>
        <div style={sec}>
          <div className="ev-footer-grid" style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "linear-gradient(135deg, #7C3AED, #2563EB)",
                }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 21, color: "#1E1B4B", letterSpacing: "-0.03em" }}>Evolvian</span>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#94A3B8", lineHeight: 1.7, maxWidth: 280 }}>
                Transforming intelligence for every education use case. AI-powered solutions for institutions, educators, and learners worldwide.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                {["X", "Li", "Gh"].map((s, i) => (
                  <div key={i} style={{
                    width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "#F1F0FB", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 13,
                    fontWeight: 700, color: "#64748B", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#7C3AED"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#F1F0FB"; e.currentTarget.style.color = "#64748B"; }}
                  >{s}</div>
                ))}
              </div>
            </div>
            {[
              { title: "Product", links: ["Features", "Use Cases", "Pricing", "Integrations", "Changelog"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press", "Contact"] },
              { title: "Resources", links: ["Documentation", "API Reference", "Community", "Support", "Status"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13, color: "#94A3B8", marginBottom: 22, textTransform: "uppercase", letterSpacing: "0.08em" }}>{col.title}</h4>
                {col.links.map((l, j) => (
                  <a key={j} href="#" style={{
                    display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#64748B",
                    textDecoration: "none", marginBottom: 14, transition: "color 0.2s", fontWeight: 500,
                  }}
                  onMouseEnter={e => e.target.style.color = "#6D28D9"}
                  onMouseLeave={e => e.target.style.color = "#64748B"}
                  >{l}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #E9E5F5", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#94A3B8" }}>© 2026 Evolvian. All rights reserved.</span>
            <div style={{ display: "flex", gap: 28 }}>
              {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((l, i) => (
                <a key={i} href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#94A3B8", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "#6D28D9"}
                  onMouseLeave={e => e.target.style.color = "#94A3B8"}
                >{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
