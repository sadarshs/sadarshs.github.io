import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Sub-components ────────────────────────────────────────────────────── */

function FadeUp({ children, delay = 0, style = {}, className = "" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(48px)",
        transition: `opacity 1s cubic-bezier(.16,1,.3,1) ${delay}s, transform 1s cubic-bezier(.16,1,.3,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SkillBar({ name, level }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 600, color: "#1a3d28", letterSpacing: ".02em" }}>{name}</span>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#5a7a68", fontWeight: 300 }}>{level}%</span>
      </div>
      <div style={{ height: 3, background: "rgba(45,122,80,.12)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: on ? `${level}%` : "0%",
          background: "linear-gradient(90deg,#7dd8a4,#2d7a50)",
          borderRadius: 2,
          transition: "width 1.6s cubic-bezier(.16,1,.3,1)",
        }} />
      </div>
    </div>
  );
}

function ProjectCard({ project, i }) {
  const cardEl = useRef(null);
  const handleMove = (e) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = cardEl.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -14;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 14;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.025)`;
    el.style.boxShadow = "0 28px 70px rgba(0,0,0,.13)";
  };
  const handleLeave = () => {
    const el = cardEl.current; if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    el.style.boxShadow = "0 6px 30px rgba(0,0,0,.06)";
  };
  return (
    <FadeUp delay={0.1 * i} style={{ height: "100%" }}>
      <div
        ref={cardEl}
        className="project-card"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          background: project.bg,
          borderRadius: 26,
          padding: "36px 36px 32px",
          border: "1px solid rgba(255,255,255,.85)",
          boxShadow: "0 6px 30px rgba(0,0,0,.06)",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          transition: "transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s ease",
          transformStyle: "preserve-3d",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* glow blob */}
        <div style={{
          position: "absolute", top: 0, right: 0, width: 220, height: 220,
          background: `radial-gradient(circle, ${project.accent}28 0%, transparent 70%)`,
          transform: "translate(35%,-35%)", pointerEvents: "none",
        }} />

        {/* category + icon */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <span style={{
            fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: ".13em", textTransform: "uppercase", color: project.accent, opacity: .85,
          }}>{project.cat}</span>
          <span style={{ fontSize: 28, lineHeight: 1 }}>{project.icon}</span>
        </div>

        {/* mock UI preview */}
        <div className="project-preview" style={{
          background: "#fff", borderRadius: 16, height: 148, marginBottom: 26,
          padding: "14px 16px 16px", boxShadow: "0 6px 24px rgba(0,0,0,.07)",
          display: "flex", flexDirection: "column", gap: 7, overflow: "hidden",
        }}>
          <div style={{ display: "flex", gap: 5, paddingBottom: 10, borderBottom: "1px solid #f2f2f0" }}>
            {["#ff6058","#ffbd2e","#28c840"].map(c => (
              <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
            ))}
          </div>
          {[82,58,95,46,68].map((w,k) => (
            <div key={k} style={{ height: 7, width: `${w}%`, background: `${project.accent}28`, borderRadius: 3 }} />
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
            <div style={{ width: 56, height: 20, borderRadius: 6, background: `${project.accent}55` }} />
            <div style={{ width: 80, height: 20, borderRadius: 6, background: `${project.accent}28` }} />
          </div>
        </div>

        <h3 style={{
          fontFamily: "'Syne',sans-serif", fontSize: "1.6rem", fontWeight: 800,
          color: "#1a1a1a", letterSpacing: "-.025em", marginBottom: 10, lineHeight: 1.1,
        }}>{project.title}</h3>
        <p style={{
          fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#5a5a5a",
          lineHeight: 1.65, marginBottom: 22, fontWeight: 300,
        }}>{project.desc}</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {project.tags.map(t => (
            <span key={t} style={{
              fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700,
              padding: "4px 12px", borderRadius: 100,
              background: "rgba(255,255,255,.82)", color: project.accent,
              border: `1px solid ${project.accent}30`, letterSpacing: ".06em",
            }}>{t}</span>
          ))}
        </div>
      </div>
    </FadeUp>
  );
}

/* ─── Data ────────────────────────────────────────────────────────────────── */

const PROJECTS = [
  { id:1, cat:"Machine Learning", title:"Neural Vision", icon:"👁",
    desc:"Real-time object detection pipeline using YOLOv8 with custom fine-tuning for industrial quality inspection.",
    bg:"#d4f0e2", accent:"#2d7a50", tags:["PyTorch","YOLOv8","FastAPI"] },
  { id:2, cat:"Natural Language", title:"ContextAI", icon:"🧠",
    desc:"Retrieval-augmented generation system that answers complex queries over private enterprise document sets.",
    bg:"#ece4f8", accent:"#6b3fa0", tags:["LangChain","Pinecone","GPT-4"] },
  { id:3, cat:"Data Science", title:"PredictFlow", icon:"📈",
    desc:"Time-series forecasting platform with AutoML for financial market prediction and portfolio optimization.",
    bg:"#f5eddc", accent:"#8a5a00", tags:["Prophet","XGBoost","Streamlit"] },
  { id:4, cat:"Generative AI", title:"SynthStudio", icon:"✨",
    desc:"Multi-modal content generation tool combining text, image, and audio synthesis for creative workflows.",
    bg:"#d8ecf7", accent:"#1a5c7a", tags:["Diffusion","Whisper","React"] },
];

const SKILLS = [
  { name:"Machine Learning", level:92 },
  { name:"Deep Learning / Neural Nets", level:88 },
  { name:"Python · PyTorch · JAX", level:95 },
  { name:"NLP & Large Language Models", level:85 },
  { name:"Data Engineering", level:80 },
  { name:"MLOps & Deployment", level:78 },
];

const EXPERIENCE = [
  { year:"2024–Now", role:"Senior AI Engineer", company:"TechCorp AI",
    desc:"Leading development of production LLM pipelines serving 2M+ daily active users, cutting latency by 60%." },
  { year:"2023", role:"ML Engineer", company:"DataStartup",
    desc:"Built computer vision systems for automated quality control, reducing manufacturing defects by 40%." },
  { year:"2022", role:"Data Scientist", company:"Analytics Co.",
    desc:"Developed predictive churn models with 94% accuracy, saving $2M+ in annual customer acquisition costs." },
];

/* ─── Main Component ──────────────────────────────────────────────────────── */

const NAV_ITEMS = ["Work", "About", "Projects", "Experience", "Contact"];

export default function Portfolio() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (menuOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReduceMotion(media.matches);
    updateMotionPreference();
    media.addEventListener?.("change", updateMotionPreference);
    return () => media.removeEventListener?.("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    const closeMenuOnDesktop = () => {
      if (window.innerWidth > 720) setMenuOpen(false);
    };
    window.addEventListener("resize", closeMenuOnDesktop);
    return () => window.removeEventListener("resize", closeMenuOnDesktop);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  /* Google Fonts injection */
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  /* Three.js hero scene */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduceMotion) {
      setLoaded(true);
      return;
    }
    const parent = canvas.parentElement;
    let mounted = true;
    let renderer;
    let onResize = () => {};
    let raf;
    let loadTimer;

    const initScene = async () => {
      const THREE = await import("three");
      if (!mounted || !parent) return;

      const W = parent.offsetWidth;
      const H = parent.offsetHeight;

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
      camera.position.z = 7;

      const sphereData = [
        { r:1.5, x:-5,  y:1.8,  z:-3,   c:0x5cc28a, op:.45 },
        { r:.8,  x:4.5, y:-1.2, z:-1.5, c:0x7dd8a4, op:.55 },
        { r:.55, x:2.8, y:2.4,  z:.2,   c:0x3fa871, op:.40 },
        { r:1.0, x:-3.2,y:-2.4, z:-1,   c:0x9edcba, op:.50 },
        { r:.42, x:.8,  y:-3,   z:.6,   c:0xc4eddb, op:.65 },
        { r:1.8, x:5.5, y:1.2,  z:-4,   c:0x4caf80, op:.28 },
        { r:.35, x:-1.5,y:3,    z:1,    c:0x8dd8b0, op:.60 },
      ];

      const spheres = sphereData.map(({ r, x, y, z, c, op }) => {
        const geo = new THREE.SphereGeometry(r, 64, 64);
        const mat = new THREE.MeshPhongMaterial({
          color: c, transparent: true, opacity: op,
          shininess: 220, specular: new THREE.Color(0xffffff),
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        mesh.userData = { ox: x, oy: y, phase: Math.random() * Math.PI * 2, sp: .18 + Math.random() * .22 };
        scene.add(mesh);
        return mesh;
      });

      scene.add(new THREE.AmbientLight(0xffffff, .6));
      const sun = new THREE.DirectionalLight(0xffffff, 1.8);
      sun.position.set(4, 6, 6); scene.add(sun);
      const fill = new THREE.PointLight(0x7dd8a4, 4, 25); fill.position.set(-5, 3, 4); scene.add(fill);
      const rim  = new THREE.PointLight(0xb0f0d0, 2.5, 18); rim.position.set(5, -3, 3); scene.add(rim);

      const clock = new THREE.Clock();
      const animate = () => {
        raf = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        spheres.forEach((s) => {
          const { ox, oy, phase, sp } = s.userData;
          s.position.y = oy + Math.sin(t * sp + phase) * .45;
          s.position.x = ox + Math.cos(t * sp * .65 + phase) * .22;
          s.rotation.y += .004;
          s.rotation.z += .002;
        });
        camera.position.x += (mouseRef.current.x * .9 - camera.position.x) * .025;
        camera.position.y += (-mouseRef.current.y * .55 - camera.position.y) * .025;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      };
      animate();

      onResize = () => {
        const nw = parent.offsetWidth;
        const nh = parent.offsetHeight;
        renderer.setSize(nw, nh);
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
      };

      window.addEventListener("resize", onResize);
      loadTimer = setTimeout(() => {
        if (mounted) setLoaded(true);
      }, 180);
    };

    initScene();

    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      clearTimeout(loadTimer);
      window.removeEventListener("resize", onResize);
      renderer?.dispose();
    };
  }, [reduceMotion]);

  /* Mouse + Scroll */
  const handleMouse = useCallback((e) => {
    mouseRef.current = {
      x: (e.clientX / window.innerWidth - .5) * 2,
      y: (e.clientY / window.innerHeight - .5) * 2,
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) return undefined;
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [handleMouse, reduceMotion]);

  /* ─── Styles ─────────────────────────────────────────────────────────── */
  const heroAnim = (delay) =>
    reduceMotion
      ? { opacity: 1, transform: "none" }
      :
    loaded
      ? { animation: `heroUp 1.35s cubic-bezier(.16,1,.3,1) ${delay}s both` }
      : { opacity: 0 };

  const scrollToSection = (section) => {
    document.getElementById(section.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <style>{`
        @keyframes heroUp {
          from { opacity:0; transform: translateY(64px) scale(.96); }
          to   { opacity:1; transform: translateY(0)   scale(1); }
        }
        @keyframes navDrop {
          from { opacity:0; transform:translateY(-22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes starPulse {
          0%,100%{ transform:scale(1) rotate(0deg); opacity:1; }
          50%    { transform:scale(1.25) rotate(18deg); opacity:.7; }
        }
        @keyframes floatY {
          0%,100%{ transform:translateY(0); }
          50%    { transform:translateY(-14px); }
        }
        @keyframes scrollBar {
          0%   { transform:scaleY(0); transform-origin:top; opacity:1; }
          70%  { transform:scaleY(1); opacity:1; }
          100% { transform:scaleY(1); opacity:0; }
        }

        html { scroll-behavior:smooth; }
        * { box-sizing:border-box; margin:0; padding:0; }
        body { overflow-x:hidden; touch-action:pan-y; }
        a, button, input, textarea { -webkit-tap-highlight-color: transparent; }
        a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible {
          outline:3px solid rgba(125,216,164,.9);
          outline-offset:3px;
        }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#f2efe8; }
        ::-webkit-scrollbar-thumb { background:#7dd8a4; border-radius:4px; }

        .nav-pill { animation: navDrop .7s cubic-bezier(.16,1,.3,1) .05s both; }
        .nav-a {
          font-family:'Syne',sans-serif; font-size:14px; font-weight:600;
          color:#bcd8c6; text-decoration:none; padding:6px 16px;
          border-radius:100px; letter-spacing:.01em;
          transition:background .25s,color .25s;
        }
        .nav-a:hover { background:rgba(255,255,255,.12); color:#fff; }
        .nav-shell {
          width:min(92vw,780px);
          justify-content:space-between;
          position:relative;
        }
        .desktop-nav {
          display:flex;
          align-items:center;
          gap:4px;
        }
        .mobile-nav-toggle,
        .mobile-nav-panel { display:none; }
        .mobile-nav-toggle {
          font-family:'Syne',sans-serif;
          font-size:13px;
          font-weight:700;
          color:#e6fff0;
          background:rgba(255,255,255,.08);
          border:1px solid rgba(168,216,188,.18);
          border-radius:999px;
          padding:10px 16px;
          min-height:44px;
        }
        .mobile-nav-panel {
          position:absolute;
          top:100%;
          left:50%;
          transform:translate(-50%,-8px);
          width:min(92vw,420px);
          margin-top:12px;
          padding:14px;
          border-radius:24px;
          background:rgba(12,31,20,.94);
          backdrop-filter:blur(22px);
          border:1px solid rgba(100,180,140,.18);
          box-shadow:0 18px 48px rgba(0,0,0,.28);
          opacity:0;
          pointer-events:none;
          transition:opacity .25s ease, transform .25s ease;
        }
        .mobile-nav-panel.open {
          opacity:1;
          pointer-events:auto;
          transform:translate(-50%,0);
        }
        .mobile-nav-link {
          display:block;
          width:100%;
          font-family:'Syne',sans-serif;
          font-size:15px;
          font-weight:700;
          color:#d4efde;
          text-align:left;
          text-decoration:none;
          background:transparent;
          border:none;
          border-radius:16px;
          padding:14px 16px;
          min-height:48px;
        }
        .mobile-nav-link:hover { background:rgba(255,255,255,.08); }

        .star { animation: starPulse 3.5s ease-in-out infinite; }
        .star2 { animation: starPulse 3.5s ease-in-out 1.2s infinite; }
        .float-btn { animation: floatY 4s ease-in-out infinite; }

        .cta-primary {
          font-family:'Syne',sans-serif; font-size:15px; font-weight:700;
          color:#fff; background:linear-gradient(135deg,#3a9b68,#1a5c3a);
          border:none; padding:16px 36px; border-radius:100px; cursor:pointer;
          box-shadow:0 10px 36px rgba(26,92,58,.4);
          transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s ease;
          letter-spacing:.01em;
          min-height:52px;
        }
        .cta-primary:hover { transform:translateY(-2px) scale(1.04); box-shadow:0 16px 44px rgba(26,92,58,.5); }

        .cta-ghost {
          font-family:'Syne',sans-serif; font-size:15px; font-weight:600;
          color:#a8d8bc; background:rgba(255,255,255,.08);
          border:1.5px solid rgba(168,216,188,.35); padding:15px 32px;
          border-radius:100px; cursor:pointer; letter-spacing:.01em;
          transition:background .25s,border-color .25s,transform .3s cubic-bezier(.16,1,.3,1);
          min-height:52px;
        }
        .cta-ghost:hover { background:rgba(255,255,255,.14); border-color:rgba(168,216,188,.6); transform:translateY(-2px); }

        .section-label {
          font-family:'Syne',sans-serif; font-size:11px; font-weight:700;
          letter-spacing:.18em; text-transform:uppercase; color:#2d7a50;
          margin-bottom:12px; display:block;
        }
        .section-title {
          font-family:'Syne',sans-serif; font-weight:800;
          color:#1a3d28; letter-spacing:-.032em; line-height:1.08;
        }

        .timeline-dot::before {
          content:''; position:absolute; left:0; top:7px;
          width:11px; height:11px; border-radius:50%; background:#2d7a50;
        }
        .timeline-dot::after {
          content:''; position:absolute; left:4.5px; top:20px;
          width:2px; bottom:-28px; background:linear-gradient(to bottom,#7dd8a4,transparent);
        }
        .timeline-dot:last-child::after { display:none; }

        .form-field {
          font-family:'DM Sans',sans-serif; font-size:15px;
          width:100%; padding:16px 20px; border-radius:16px;
          border:1.5px solid rgba(45,122,80,.18);
          background:rgba(255,255,255,.78); color:#1a3d28;
          transition:border-color .3s,box-shadow .3s;
          outline:none; resize:none;
        }
        .form-field::placeholder { color:#8aaa96; }
        .form-field:focus {
          border-color:#2d7a50;
          box-shadow:0 0 0 4px rgba(45,122,80,.12);
        }
        .form-btn {
          font-family:'Syne',sans-serif; font-size:15px; font-weight:700;
          color:#fff; background:linear-gradient(135deg,#3a9b68,#1a5c3a);
          border:none; width:100%; padding:17px; border-radius:16px;
          cursor:pointer; letter-spacing:.02em;
          box-shadow:0 8px 30px rgba(26,92,58,.35);
          transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s;
          min-height:54px;
        }
        .form-btn:hover { transform:translateY(-2px); box-shadow:0 14px 40px rgba(26,92,58,.45); }

        .footer-link {
          font-family:'Syne',sans-serif; font-size:13px; font-weight:500;
          color:#5a7a68; text-decoration:none;
          transition:color .25s;
        }
        .footer-link:hover { color:#2d7a50; }

        .section-shell {
          padding-inline:max(24px, env(safe-area-inset-left));
          padding-right:max(24px, env(safe-area-inset-right));
        }
        .hero-shell {
          padding:calc(110px + env(safe-area-inset-top)) 24px calc(64px + env(safe-area-inset-bottom));
        }
        .hero-copy { width:min(100%, 760px); }
        .hero-actions {
          display:flex;
          gap:16px;
          margin-top:44px;
          flex-wrap:wrap;
          justify-content:center;
        }
        .contact-socials {
          display:flex;
          justify-content:center;
          gap:28px;
          margin-top:48px;
          flex-wrap:wrap;
        }
        .footer-inner {
          display:flex;
          justify-content:space-between;
          align-items:center;
          flex-wrap:wrap;
          gap:12px;
        }

        @media(hover:hover) and (pointer:fine){
          .project-card:hover {
            box-shadow:0 18px 46px rgba(0,0,0,.12) !important;
          }
        }

        @media(hover:none), (pointer:coarse){
          .nav-a, .footer-link { padding-block:10px; }
          .project-card {
            transform:none !important;
            transition:box-shadow .2s ease !important;
          }
          .star, .star2 { animation-duration:6s; }
        }

        @media(max-width:960px){
          .section-shell { padding-inline:20px; }
          .project-card { padding:28px 24px 24px !important; border-radius:22px !important; }
          .project-preview { height:132px !important; margin-bottom:22px !important; }
          .projects-grid { grid-template-columns:1fr !important; }
          .about-grid { grid-template-columns:1fr !important; gap:52px !important; }
        }
        @media(max-width:720px){
          .nav-shell {
            width:min(calc(100vw - 24px), 520px);
            padding:8px 10px !important;
          }
          .desktop-nav { display:none; }
          .mobile-nav-toggle,
          .mobile-nav-panel { display:block; }
          .hero-shell {
            min-height:100svh !important;
            justify-content:flex-start !important;
            padding:calc(128px + env(safe-area-inset-top)) 20px calc(84px + env(safe-area-inset-bottom));
          }
          .hero-copy {
            width:100%;
            max-width:560px;
          }
          .hero-actions {
            width:100%;
            flex-direction:column;
            align-items:stretch;
            gap:12px;
          }
          .cta-primary, .cta-ghost {
            width:100%;
            padding-inline:20px;
          }
          .section-shell { padding-inline:16px; }
          .contact-socials {
            flex-direction:column;
            gap:14px;
            margin-top:36px;
          }
          .footer-inner {
            flex-direction:column;
            align-items:flex-start;
          }
        }
        @media(max-width:480px){
          .project-card { padding:24px 18px 20px !important; }
          .project-preview { height:118px !important; padding:12px 14px 14px !important; }
          .section-shell { padding-inline:14px; }
          .section-label { font-size:10px; letter-spacing:.14em; }
          .footer-link { font-size:14px; }
        }

        @media(prefers-reduced-motion:reduce){
          html { scroll-behavior:auto; }
          *, *::before, *::after {
            animation-duration:.01ms !important;
            animation-iteration-count:1 !important;
            transition-duration:.01ms !important;
          }
        }
      `}</style>

      {/* ── NAVBAR ───────────────────────────────────────────────────────── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:50, display:"flex", justifyContent:"center", paddingTop:22 }}>
        <div
          className="nav-pill nav-shell"
          style={{
            display:"flex", alignItems:"center", gap:4,
            padding:"8px 12px", borderRadius:100,
            background:"rgba(15,35,22,.62)", backdropFilter:"blur(20px)",
            border:"1px solid rgba(100,180,140,.18)",
            boxShadow:"0 4px 30px rgba(0,0,0,.25)",
          }}
        >
          <div className="desktop-nav">
            {NAV_ITEMS.map((n) => (
              <a key={n} href={`#${n.toLowerCase()}`} className="nav-a">{n}</a>
            ))}
          </div>
          <button
            type="button"
            className="mobile-nav-toggle"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
        <div className={`mobile-nav-panel ${menuOpen ? "open" : ""}`}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              type="button"
              className="mobile-nav-link"
              onClick={() => scrollToSection(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section id="work" style={{ position:"relative", minHeight:"100vh", overflow:"hidden",
        background:"linear-gradient(155deg,#081a10 0%,#0f2a1a 30%,#173324 55%,#1e3f2c 75%,#152c1e 100%)" }}>

        {/* Three.js canvas */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position:"absolute",
            inset:0,
            width:"100%",
            height:"100%",
            pointerEvents:"none",
            opacity: reduceMotion ? 0 : 1,
          }}
        />

        {/* Noise grain */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E")`,
          opacity:.6,
        }} />

        {/* Radial glows */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none",
          background:"radial-gradient(ellipse 60% 55% at 25% 55%,rgba(60,160,100,.18) 0%,transparent 70%), radial-gradient(ellipse 50% 45% at 75% 35%,rgba(90,180,130,.12) 0%,transparent 60%)",
        }} />

        {/* Hero content */}
        <div className="hero-shell" style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", textAlign:"center" }}>

          {/* Sparkle decorators */}
          <div className="star" style={{ position:"absolute", top:"22%", left:"14%", color:"rgba(140,220,170,.7)", fontSize:22, userSelect:"none" }}>✦</div>
          <div className="star2" style={{ position:"absolute", top:"33%", right:"11%", color:"rgba(140,220,170,.55)", fontSize:16, userSelect:"none" }}>✦</div>
          <div className="star" style={{ position:"absolute", bottom:"28%", left:"8%", color:"rgba(140,220,170,.45)", fontSize:13, userSelect:"none", animationDelay:"2s" }}>✦</div>

          {/* Status badge */}
          <div className="hero-copy" style={{ ...heroAnim(.15) }}>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:8,
              background:"rgba(60,160,100,.15)", border:"1px solid rgba(100,200,140,.22)",
              borderRadius:100, padding:"7px 18px", marginBottom:36,
              backdropFilter:"blur(8px)",
            }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#5cc28a", boxShadow:"0 0 8px #5cc28a" }} />
              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:600, color:"#8dd8b0", letterSpacing:".06em" }}>
                OPEN TO OPPORTUNITIES
              </span>
            </div>
          </div>

          {/* Main headline */}
          <div className="hero-copy" style={{ ...heroAnim(.3) }}>
            <h1 style={{
              fontFamily:"'Syne',sans-serif", fontWeight:800,
              fontSize:"clamp(3.2rem,10.5vw,8.2rem)",
              lineHeight:1.0, letterSpacing:"-.035em",
              color:"#c8edda", marginBottom:".08em",
            }}>
              Hi. I'm Sadarsh.
            </h1>
          </div>
          <div className="hero-copy" style={{ ...heroAnim(.5) }}>
            <h1 style={{
              fontFamily:"'Syne',sans-serif", fontWeight:800,
              fontSize:"clamp(2.6rem,9vw,7rem)",
              lineHeight:1.0, letterSpacing:"-.035em",
              color:"#5cc28a", marginBottom:0,
            }}>
              An AI Engineer.
            </h1>
          </div>

          {/* Sub */}
          <div className="hero-copy" style={{ ...heroAnim(.75) }}>
            <p style={{
              fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(1rem,1.8vw,1.2rem)",
              color:"#7aaa90", maxWidth:460, lineHeight:1.7,
              fontWeight:300, marginTop:32,
            }}>
              I build intelligent systems using AI, ML, and Data Science — transforming complex problems into elegant, production-ready solutions.
            </p>
          </div>

          {/* CTAs */}
          <div className="hero-actions" style={{ ...heroAnim(1) }}>
            <button className="cta-primary" onClick={() => scrollToSection("Projects")}>
              View My Work →
            </button>
            <button className="cta-ghost" onClick={() => scrollToSection("Contact")}>
              Get in Touch
            </button>
          </div>

          {/* Scroll indicator */}
          <div style={{ position:"absolute", bottom:36, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:10, ...heroAnim(1.4) }}>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:10, letterSpacing:".16em", color:"rgba(124,180,148,.5)", fontWeight:600 }}>SCROLL</span>
            <div style={{ width:1.5, height:48, background:"linear-gradient(to bottom,rgba(92,194,138,.5),transparent)", animation:"scrollBar 2s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ── BODY (light) ─────────────────────────────────────────────────── */}
      <div style={{ background:"linear-gradient(175deg,#f2efe8 0%,#edf5ee 35%,#f5f5f0 70%,#f0ede6 100%)" }}>

        {/* ── PROJECTS ───────────────────────────────────────────────────── */}
        <section id="projects" className="section-shell" style={{ paddingTop:120, paddingBottom:100 }}>
          <div style={{ maxWidth:1120, margin:"0 auto" }}>
            <FadeUp><span className="section-label">Selected Work</span></FadeUp>
            <FadeUp delay={.1}>
              <h2 className="section-title" style={{ fontSize:"clamp(2.8rem,6vw,4.5rem)", marginBottom:64 }}>
                Projects.
              </h2>
            </FadeUp>
            <div
              className="projects-grid"
              style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:24 }}
            >
              {PROJECTS.map((p, i) => <ProjectCard key={p.id} project={p} i={i} />)}
            </div>
          </div>
        </section>

        {/* ── ABOUT ──────────────────────────────────────────────────────── */}
        <section id="about" className="section-shell" style={{ paddingTop:100, paddingBottom:100 }}>
          <div style={{ maxWidth:1020, margin:"0 auto" }}>
            <FadeUp><span className="section-label">About Me</span></FadeUp>
            <div
              className="about-grid"
              style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"start" }}
            >
              <div>
                <FadeUp delay={.05}>
                  <h2 className="section-title" style={{ fontSize:"clamp(2rem,4vw,3rem)", marginBottom:28 }}>
                    Building the future with intelligent systems.
                  </h2>
                </FadeUp>
                <FadeUp delay={.15}>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:16, color:"#4a6b58", lineHeight:1.85, marginBottom:18, fontWeight:300 }}>
                    I'm an AI Engineer passionate about crafting intelligent systems that solve real-world problems. From training neural networks to deploying production ML pipelines, I bridge the gap between research and practical impact.
                  </p>
                </FadeUp>
                <FadeUp delay={.25}>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:16, color:"#4a6b58", lineHeight:1.85, fontWeight:300 }}>
                    When I'm not building models, I'm exploring new architectures, contributing to open source, and sharing insights with the community.
                  </p>
                </FadeUp>

                {/* Tags */}
                <FadeUp delay={.35}>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginTop:32 }}>
                    {["Python","PyTorch","TensorFlow","LangChain","Kubernetes","AWS","Spark","dbt"].map(t => (
                      <span key={t} style={{
                        fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:700,
                        padding:"6px 16px", borderRadius:100,
                        background:"rgba(45,122,80,.1)", color:"#2d7a50",
                        border:"1px solid rgba(45,122,80,.2)", letterSpacing:".04em",
                      }}>{t}</span>
                    ))}
                  </div>
                </FadeUp>
              </div>

              <div>
                <FadeUp delay={.2}>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, color:"#1a3d28", letterSpacing:".08em", textTransform:"uppercase", marginBottom:28 }}>
                    Core Skills
                  </h3>
                  {SKILLS.map(s => <SkillBar key={s.name} {...s} />)}
                </FadeUp>
              </div>
            </div>
          </div>
        </section>

        {/* ── EXPERIENCE ─────────────────────────────────────────────────── */}
        <section id="experience" className="section-shell" style={{ paddingTop:100, paddingBottom:100 }}>
          <div style={{ maxWidth:680, margin:"0 auto" }}>
            <FadeUp><span className="section-label">Experience</span></FadeUp>
            <FadeUp delay={.1}>
              <h2 className="section-title" style={{ fontSize:"clamp(2.5rem,5.5vw,4rem)", marginBottom:60 }}>
                Journey.
              </h2>
            </FadeUp>

            <div style={{ display:"flex", flexDirection:"column", gap:44 }}>
              {EXPERIENCE.map((e, i) => (
                <FadeUp key={i} delay={.1 * (i + 1)}>
                  <div className="timeline-dot" style={{ position:"relative", paddingLeft:30 }}>
                    <span style={{ fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", color:"#3a9b68" }}>
                      {e.year}
                    </span>
                    <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, color:"#1a3d28", margin:"6px 0 3px" }}>
                      {e.role}
                    </h3>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:600, color:"#2d7a50", marginBottom:10 }}>
                      {e.company}
                    </div>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"#5a7a68", lineHeight:1.7, fontWeight:300 }}>
                      {e.desc}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ────────────────────────────────────────────────────── */}
        <section id="contact" className="section-shell" style={{ paddingTop:100, paddingBottom:120 }}>
          <div style={{ maxWidth:560, margin:"0 auto", textAlign:"center" }}>
            <FadeUp><span className="section-label">Say Hello</span></FadeUp>
            <FadeUp delay={.1}>
              <h2 className="section-title" style={{ fontSize:"clamp(2.5rem,5.5vw,4rem)", marginBottom:18 }}>
                Let's Build Something.
              </h2>
            </FadeUp>
            <FadeUp delay={.2}>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:16, color:"#4a6b58", marginBottom:44, fontWeight:300, lineHeight:1.7 }}>
                Have a project in mind? I'd love to collaborate and create something extraordinary together.
              </p>
            </FadeUp>
            <FadeUp delay={.3}>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <input className="form-field" type="text" placeholder="Your Name" />
                <input className="form-field" type="email" placeholder="Email Address" />
                <textarea className="form-field" rows={5} placeholder="Tell me about your project…" />
                <div style={{ marginTop:8 }}>
                  <button className="form-btn">Send Message →</button>
                </div>
              </div>
            </FadeUp>

            {/* Social links */}
<FadeUp delay={.45}>
  <div className="contact-socials">
    
    <a
      href="https://github.com/sadarshs"
      target="_blank"
      rel="noopener noreferrer"
      className="footer-link"
    >
      GitHub ↗
    </a>

    <a
      href="https://www.linkedin.com/in/sadarsh-s-256b4926a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      target="_blank"
      rel="noopener noreferrer"
      className="footer-link"
    >
      LinkedIn ↗
    </a>
  </div>
</FadeUp>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────────────── */}
        <footer className="section-shell" style={{ borderTop:"1px solid rgba(45,122,80,.1)", paddingTop:28, paddingBottom:28 }}>
          <div className="footer-inner" style={{ maxWidth:1120, margin:"0 auto" }}>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:13, color:"#7a9a88" }}>
              © 2024 Sadarsh · Built with Python, coffee & curiosity.
            </span>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#9ab4a4", fontWeight:300 }}>
              AI Engineer · ML Architect · Data Scientist
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
