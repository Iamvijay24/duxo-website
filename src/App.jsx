import { useEffect, useRef, useState } from "react";

/* ─── SEO META INJECTION ─── */
const SEOMeta = () => {
  useEffect(() => {
    document.title = "Duxo.AI — Human Intelligence. Digital Scale.";
    const metas = [
      {
        name: "description",
        content:
          "Duxo.AI replaces menus and forms with Agentic Digital Humans — intelligent entities that see, hear, reason, and act on behalf of your brand in real-time.",
      },
      {
        name: "keywords",
        content:
          "digital human AI, agentic AI platform, conversational AI, RAG, digital twin, enterprise AI agent, brand automation, AI chatbot alternative",
      },
      {
        property: "og:title",
        content: "Duxo.AI — Human Intelligence. Digital Scale.",
      },
      {
        property: "og:description",
        content:
          "Deploy intelligent digital humans that reason, converse, and act in real-time. Enterprise RAG, agentic workflows, 100+ languages.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://duxo.ai" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Duxo.AI — Human Intelligence. Digital Scale.",
      },
      {
        name: "twitter:description",
        content:
          "Agentic Digital Presence for the modern enterprise. Real-time reasoning, enterprise RAG, global deployment.",
      },
      { name: "robots", content: "index, follow" },
    ];
    const added = metas.map((attrs) => {
      const el = document.createElement("meta");
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      document.head.appendChild(el);
      return el;
    });
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Duxo.AI",
      description: "Agentic Digital Presence platform for enterprise brands",
      url: "https://duxo.ai",
      applicationCategory: "BusinessApplication",
      offers: { "@type": "Offer", price: "49", priceCurrency: "USD" },
    });
    document.head.appendChild(ld);
    return () => {
      added.forEach((e) => e.remove());
      ld.remove();
    };
  }, []);
  return null;
};

/* ─── CUSTOM CURSOR ─── */
const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const raf = useRef(null);
  const [big, setBig] = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    const onOver = (e) => {
      if (e.target.closest("button,a,[data-h]")) setBig(true);
    };
    const onOut = (e) => {
      if (e.target.closest("button,a,[data-h]")) setBig(false);
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    const tick = () => {
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${pos.current.x - 5}px,${pos.current.y - 5}px)`;
      if (ringRef.current) {
        ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.11;
        ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.11;
        ringRef.current.style.transform = `translate(${ringPos.current.x - 22}px,${ringPos.current.y - 22}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#b8ff57",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "difference",
          willChange: "transform",
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: big ? 52 : 44,
          height: big ? 52 : 44,
          borderRadius: "50%",
          border: "1px solid rgba(130,100,255,0.7)",
          pointerEvents: "none",
          zIndex: 9998,
          transition: "width 0.25s,height 0.25s",
          willChange: "transform",
        }}
      />
    </>
  );
};

/* ─── SCROLL REVEAL ─── */
const useReveal = () => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
};

const Reveal = ({ children, delay = 0, y = 28, style = {} }) => {
  const [ref, vis] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? `translateY(0)` : `translateY(${y}px)`,
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ─── TYPEWRITER ─── */
const Typewriter = ({ words, speed = 75, pause = 2200 }) => {
  const [text, setText] = useState("");
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const word = words[wi];
    let t;
    if (!del && ci < word.length)
      t = setTimeout(() => {
        setText(word.slice(0, ci + 1));
        setCi((c) => c + 1);
      }, speed);
    else if (!del && ci === word.length)
      t = setTimeout(() => setDel(true), pause);
    else if (del && ci > 0)
      t = setTimeout(() => {
        setText(word.slice(0, ci - 1));
        setCi((c) => c - 1);
      }, speed / 2);
    else if (del && ci === 0) {
      setDel(false);
      setWi((i) => (i + 1) % words.length);
    }
    return () => clearTimeout(t);
  }, [ci, del, wi, words, speed, pause]);
  return (
    <span style={{ color: "#b8ff57" }}>
      {text}
      <span
        style={{
          opacity: blink ? 1 : 0,
          color: "#8264ff",
          transition: "opacity 0.1s",
        }}
      >
        |
      </span>
    </span>
  );
};

/* ─── COUNTER ─── */
const Counter = ({ end, suffix = "", dur = 1800 }) => {
  const [n, setN] = useState(0);
  const [ref, vis] = useReveal();
  const done = useRef(false);
  useEffect(() => {
    if (vis && !done.current) {
      done.current = true;
      let s = 0;
      const steps = 55;
      const step = end / steps;
      const iv = setInterval(() => {
        s += step;
        if (s >= end) {
          setN(end);
          clearInterval(iv);
        } else setN(Math.floor(s));
      }, dur / steps);
    }
  }, [vis, end, dur]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
};

/* ─── CSS ─── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Manrope:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#060612;--bg2:#0c0c20;--bg3:#11112c;
  --border:rgba(130,100,255,0.1);--border2:rgba(130,100,255,0.22);
  --w:#eeeeff;--m:rgba(238,238,255,0.48);--m2:rgba(238,238,255,0.24);
  --v:#8264ff;--v2:#a68dff;--v3:#c4b0ff;
  --lime:#b8ff57;--lime2:#d4ff90;
  --sky:#57d4ff;
  --gv:rgba(130,100,255,0.16);--gl:rgba(184,255,87,0.1);
}
html{cursor:none;scroll-behavior:smooth;}
body{background:var(--bg);color:var(--w);font-family:'Manrope',sans-serif;font-weight:300;overflow-x:hidden;}
*,button,a{cursor:none!important;}
.syne{font-family:'Syne',sans-serif;}
.page{min-height:100vh;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-track{background:var(--bg);}
::-webkit-scrollbar-thumb{background:var(--v);border-radius:2px;}

/* NAV */
nav{
  position:fixed;top:0;left:0;right:0;z-index:500;
  display:flex;align-items:center;justify-content:space-between;
  padding:20px 56px;border-bottom:1px solid var(--border);
  backdrop-filter:blur(24px) saturate(1.5);background:rgba(6,6,18,0.78);
  animation:navSlide 0.8s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes navSlide{from{transform:translateY(-100%);opacity:0}to{transform:none;opacity:1}}
.nav-logo{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:var(--w);letter-spacing:-0.02em;}
.nav-logo span{color:var(--lime);}
.nav-links{display:flex;gap:36px;}
.nav-links a{
  color:var(--m);font-size:13px;text-decoration:none;font-weight:400;
  letter-spacing:0.02em;transition:color 0.25s;position:relative;padding-bottom:4px;
}
.nav-links a::after{
  content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
  background:var(--lime);transform:scaleX(0);transform-origin:left;
  transition:transform 0.35s cubic-bezier(0.16,1,0.3,1);
}
.nav-links a:hover{color:var(--w);}
.nav-links a:hover::after{transform:scaleX(1);}
.nav-cta{
  font-family:'Syne',sans-serif;background:var(--lime);color:var(--bg);
  font-size:12px;font-weight:700;padding:11px 26px;border-radius:2px;border:none;
  letter-spacing:0.08em;text-transform:uppercase;transition:all 0.28s;
  position:relative;overflow:hidden;
}
.nav-cta::before{
  content:'';position:absolute;inset:0;background:var(--v);
  transform:translateX(-101%);transition:transform 0.3s cubic-bezier(0.16,1,0.3,1);
}
.nav-cta:hover::before{transform:translateX(0);}
.nav-cta:hover{color:var(--w);}
.nav-cta-inner{position:relative;z-index:1;}

/* HERO */
.hero{
  min-height:100vh;display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  padding:130px 56px 80px;position:relative;overflow:hidden;text-align:center;
}
.h-glow1{
  position:absolute;width:900px;height:900px;border-radius:50%;pointer-events:none;
  background:radial-gradient(circle,var(--gv),transparent 65%);
  top:-300px;left:50%;transform:translateX(-50%);
  animation:drift1 9s ease-in-out infinite alternate;
}
.h-glow2{
  position:absolute;width:600px;height:600px;border-radius:50%;pointer-events:none;
  background:radial-gradient(circle,var(--gl),transparent 65%);
  bottom:-100px;right:-80px;
  animation:drift1 11s ease-in-out infinite alternate-reverse;
}
@keyframes drift1{from{transform:translateX(-50%) translateY(0)}to{transform:translateX(-50%) translateY(50px)}}
.h-grid{
  position:absolute;inset:0;pointer-events:none;
  background-image:linear-gradient(rgba(130,100,255,0.07) 1px,transparent 1px),
    linear-gradient(90deg,rgba(130,100,255,0.07) 1px,transparent 1px);
  background-size:76px 76px;
  mask-image:radial-gradient(ellipse 75% 75% at 50% 50%,black 20%,transparent 72%);
}
.eyebrow{
  display:inline-flex;align-items:center;gap:10px;
  border:1px solid var(--border2);border-radius:100px;
  padding:7px 18px;margin-bottom:36px;
  font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;
  color:var(--v3);background:rgba(130,100,255,0.07);
  animation:fadeUp 0.8s 0.3s cubic-bezier(0.16,1,0.3,1) both;
}
.e-dot{width:7px;height:7px;border-radius:50%;background:var(--lime);box-shadow:0 0 10px var(--lime);animation:blink 2s infinite;}
@keyframes blink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.35;transform:scale(1.5)}}

/* ORB */
.orb-wrap{width:220px;height:220px;position:relative;margin:0 auto 52px;animation:fadeUp 1s 0.15s cubic-bezier(0.16,1,0.3,1) both;}
.orb-conic{
  position:absolute;inset:0;border-radius:50%;padding:2px;
  background:conic-gradient(from 0deg,var(--v),var(--lime),var(--sky),var(--v));
  animation:spin 7s linear infinite;
}
.orb-fill{
  background:var(--bg2);border-radius:50%;width:100%;height:100%;
  display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;
}
.orb-fill::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 35% 30%,rgba(130,100,255,0.35),transparent 58%);}
.orb-emoji{font-size:78px;position:relative;z-index:1;filter:drop-shadow(0 0 18px rgba(130,100,255,0.55));}
.orb-r{position:absolute;border-radius:50%;border:1px dashed var(--border2);}
.orb-r.r1{inset:-26px;animation:spin 22s linear infinite;}
.orb-r.r2{inset:-50px;animation:spin 34s linear infinite reverse;}
.orb-d{position:absolute;border-radius:50%;}
.orb-d.d1{width:9px;height:9px;background:var(--lime);box-shadow:0 0 12px var(--lime);top:-4px;left:50%;transform:translateX(-50%);}
.orb-d.d2{width:6px;height:6px;background:var(--v);box-shadow:0 0 8px var(--v);bottom:-3px;right:22%;}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}

.h1{font-family:'Syne',sans-serif;font-size:clamp(50px,6.5vw,94px);font-weight:800;line-height:1.0;letter-spacing:-0.04em;color:var(--w);margin-bottom:26px;max-width:980px;animation:fadeUp 0.9s 0.5s cubic-bezier(0.16,1,0.3,1) both;}
.hero-sub{font-size:18px;font-weight:300;line-height:1.75;color:var(--m);max-width:520px;margin:0 auto 48px;animation:fadeUp 0.9s 0.7s cubic-bezier(0.16,1,0.3,1) both;}
.hero-btns{display:flex;gap:16px;align-items:center;justify-content:center;margin-bottom:72px;animation:fadeUp 0.9s 0.9s cubic-bezier(0.16,1,0.3,1) both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}

/* BUTTONS */
.btn-p{
  background:var(--lime);color:var(--bg);font-size:13px;font-weight:700;
  padding:15px 36px;border-radius:2px;border:none;
  letter-spacing:0.07em;text-transform:uppercase;font-family:'Syne',sans-serif;
  transition:all 0.3s;position:relative;overflow:hidden;
}
.btn-p:hover{box-shadow:0 0 36px rgba(184,255,87,0.35);transform:translateY(-1px);}
.btn-g{
  background:transparent;color:var(--w);font-size:13px;font-weight:400;
  padding:15px 36px;border-radius:2px;border:1px solid var(--border2);
  letter-spacing:0.06em;font-family:'Manrope',sans-serif;transition:all 0.3s;
}
.btn-g:hover{border-color:var(--v);color:var(--v2);box-shadow:0 0 24px rgba(130,100,255,0.15);}

/* TRUST BAR */
.tbar{border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:20px 0;background:var(--bg2);overflow:hidden;display:flex;align-items:center;gap:0;}
.tbar-label{font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:var(--m2);white-space:nowrap;padding:0 40px;flex-shrink:0;}
.tbar-scroll{display:flex;gap:0;animation:scrollL 28s linear infinite;white-space:nowrap;}
.tbar-scroll:hover{animation-play-state:paused;}
@keyframes scrollL{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.tbar-item{font-size:12px;color:var(--m2);padding:0 32px;letter-spacing:0.03em;border-right:1px solid var(--border);}

/* STATS */
.stats-band{background:var(--bg2);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
.stats-inner{max-width:1240px;margin:0 auto;padding:72px 56px;display:grid;grid-template-columns:repeat(4,1fr);gap:32px;}
.stat{text-align:center;padding:0 16px;}
.stat-n{font-family:'Syne',sans-serif;font-size:54px;font-weight:800;line-height:1;letter-spacing:-0.04em;color:var(--lime);margin-bottom:8px;}
.stat-l{font-size:13px;color:var(--m);font-weight:300;}

/* SECTIONS */
.sw{padding:120px 56px;max-width:1240px;margin:0 auto;}
.slabel{display:inline-flex;align-items:center;gap:8px;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:var(--lime);margin-bottom:18px;font-weight:500;}
.slabel::before{content:'';width:22px;height:1px;background:var(--lime);}
.stitle{font-family:'Syne',sans-serif;font-size:clamp(34px,4vw,56px);font-weight:800;line-height:1.06;letter-spacing:-0.04em;color:var(--w);margin-bottom:20px;}
.stitle em{font-style:italic;color:var(--v2);font-weight:400;}
.sbody{font-size:16px;font-weight:300;line-height:1.8;color:var(--m);max-width:520px;}

/* CAPS */
.caps-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:4px;overflow:hidden;margin-top:64px;}
.cap{
  background:var(--bg2);padding:52px 44px;
  transition:background 0.4s;position:relative;overflow:hidden;
}
.cap::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--gv),transparent 55%);opacity:0;transition:opacity 0.4s;}
.cap:hover{background:var(--bg3);}
.cap:hover::before{opacity:1;}
.cap-num{font-size:10px;letter-spacing:0.14em;color:var(--m2);margin-bottom:28px;font-family:'Syne',sans-serif;}
.cap-ico{
  width:48px;height:48px;border-radius:8px;margin-bottom:24px;
  background:rgba(130,100,255,0.1);border:1px solid var(--border2);
  display:flex;align-items:center;justify-content:center;font-size:22px;
  transition:background 0.3s,border-color 0.3s;
}
.cap:hover .cap-ico{background:rgba(130,100,255,0.25);border-color:var(--v);}
.cap-title{font-family:'Syne',sans-serif;font-size:22px;font-weight:700;color:var(--w);margin-bottom:12px;letter-spacing:-0.02em;}
.cap-desc{font-size:14px;font-weight:300;line-height:1.75;color:var(--m);}

/* STEPS */
.how-bg{background:var(--bg);}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:56px;margin-top:72px;position:relative;}
.steps::before{content:'';position:absolute;top:27px;left:calc(16.66% + 12px);right:calc(16.66% + 12px);height:1px;background:linear-gradient(90deg,var(--v),var(--lime));}
.step-badge{
  width:54px;height:54px;border-radius:50%;margin-bottom:28px;
  background:var(--bg2);border:1px solid var(--border2);
  display:flex;align-items:center;justify-content:center;
  font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--v2);
  transition:background 0.3s,border-color 0.3s,color 0.3s;
}
.step:hover .step-badge{background:var(--v);border-color:var(--v);color:var(--bg);}
.step-t{font-family:'Syne',sans-serif;font-size:18px;font-weight:600;color:var(--w);margin-bottom:10px;}
.step-d{font-size:14px;font-weight:300;line-height:1.75;color:var(--m);}

/* PRICING */
.pg{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:64px;}
.pc{
  border:1px solid var(--border);border-radius:4px;background:var(--bg2);
  padding:40px 32px;display:flex;flex-direction:column;gap:24px;
  transition:transform 0.35s cubic-bezier(0.16,1,0.3,1),border-color 0.3s,box-shadow 0.3s;
  position:relative;overflow:hidden;
}
.pc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--v),transparent);opacity:0;transition:opacity 0.3s;}
.pc:hover{transform:translateY(-8px);border-color:var(--border2);box-shadow:0 24px 64px rgba(130,100,255,0.12);}
.pc:hover::before{opacity:1;}
.pc.feat{background:linear-gradient(145deg,rgba(130,100,255,0.1),var(--bg2));border-color:rgba(130,100,255,0.42);}
.pc.feat::before{opacity:1;background:linear-gradient(90deg,var(--v),var(--lime));}
.pt{font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:var(--m2);font-family:'Syne',sans-serif;}
.pbadge{display:inline-block;background:var(--lime);color:var(--bg);font-size:9px;letter-spacing:0.1em;text-transform:uppercase;padding:4px 10px;border-radius:2px;font-weight:700;margin-top:6px;font-family:'Syne',sans-serif;}
.pamt{font-family:'Syne',sans-serif;font-size:56px;color:var(--w);line-height:1;letter-spacing:-0.04em;}
.pamt span{font-size:18px;color:var(--m);font-family:'Manrope',sans-serif;font-weight:300;}
.pdiv{height:1px;background:var(--border);}
.pfeats{display:flex;flex-direction:column;gap:12px;flex:1;}
.pfeat{display:flex;align-items:flex-start;gap:12px;font-size:13px;font-weight:300;color:var(--m);line-height:1.5;}
.pcheck{width:16px;height:16px;border-radius:50%;background:rgba(130,100,255,0.15);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;font-size:9px;color:var(--lime);}
.pbtn{width:100%;padding:14px;border-radius:2px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;font-family:'Syne',sans-serif;font-weight:700;transition:all 0.3s;border:none;}
.pbtn-o{background:transparent;color:var(--w);border:1px solid var(--border2)!important;}
.pbtn-o:hover{border-color:var(--v)!important;color:var(--v2);}
.pbtn-f{background:var(--v);color:var(--w);}
.pbtn-f:hover{background:var(--v2);box-shadow:0 0 32px rgba(130,100,255,0.45);}

/* TRUST SECTION */
.tsec{background:var(--bg2);border-top:1px solid var(--border);}
.tcols{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:64px;}
.tc{
  border:1px solid var(--border);border-radius:4px;padding:40px 32px;background:var(--bg);
  transition:border-color 0.3s,transform 0.35s cubic-bezier(0.16,1,0.3,1);
}
.tc:hover{border-color:var(--v);transform:translateY(-5px);}
.tc-ico{width:44px;height:44px;border-radius:8px;margin-bottom:20px;background:rgba(130,100,255,0.1);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:20px;}
.tc-title{font-family:'Syne',sans-serif;font-size:17px;font-weight:700;color:var(--w);margin-bottom:10px;}
.tc-text{font-size:13px;font-weight:300;line-height:1.75;color:var(--m);}

/* CTA */
.cta{padding:130px 56px;text-align:center;position:relative;overflow:hidden;background:var(--bg);}
.cta-glow{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 70% 70% at 50% 50%,rgba(130,100,255,0.09),transparent 70%);}
.cta-t{font-family:'Syne',sans-serif;font-size:clamp(40px,5.5vw,76px);font-weight:800;line-height:1.04;letter-spacing:-0.04em;color:var(--w);margin-bottom:20px;}
.cta-t em{color:var(--lime);font-style:italic;font-weight:400;}
.cta-s{font-size:17px;font-weight:300;color:var(--m);margin-bottom:48px;}
.cta-btns{display:flex;gap:16px;justify-content:center;align-items:center;}

/* FOOTER */
footer{border-top:1px solid var(--border);padding:48px 56px;display:flex;align-items:center;justify-content:space-between;background:var(--bg2);}
.flogo{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--w);}
.flogo span{color:var(--lime);}
.fcopy{font-size:12px;color:var(--m2);}
.flinks{display:flex;gap:28px;}
.flinks a{font-size:12px;color:var(--m2);text-decoration:none;transition:color 0.2s;}
.flinks a:hover{color:var(--v2);}
`;

/* ─── DATA ─── */
const caps = [
  {
    n: "01",
    i: "◎",
    title: "Real-Time Reasoning",
    desc: "Unlike static video bots, Duxo agents process intent in real-time, enabling fluid, unscripted conversations that feel genuinely natural and intelligent.",
  },
  {
    n: "02",
    i: "⬡",
    title: "Enterprise Knowledge RAG",
    desc: "Connect digital humans to your private data — SharePoint, Notion, custom APIs — for hallucination-free, expert-level interactions grounded in your truth.",
  },
  {
    n: "03",
    i: "⟶",
    title: "Actionable Workflows",
    desc: "Give your agents hands. Duxo triggers API calls, books meetings, and updates CRMs directly from the video interface — zero handoffs required.",
  },
  {
    n: "04",
    i: "◈",
    title: "Global Presence",
    desc: "Instantly localize your brand across 100+ languages with culturally nuanced non-verbal cues. One agent. Every market. Every timezone.",
  },
];

const plans = [
  {
    tier: "Starter",
    price: "49",
    feats: [
      "1 Active Agent",
      "60 Interaction Minutes",
      "Standard Knowledge Base",
      "Duxo Watermark",
    ],
    btn: "Start Free",
    bt: "pbtn-o",
  },
  {
    tier: "Growth",
    price: "199",
    feat: true,
    feats: [
      "5 Active Agents",
      "300 Interaction Minutes",
      "Advanced RAG Integration",
      "White-label UI",
    ],
    btn: "Scale Now",
    bt: "pbtn-f",
  },
  {
    tier: "Enterprise",
    price: null,
    feats: [
      "Unlimited Agents",
      "Custom Volume",
      "Private Cloud / On-Prem",
      "Dedicated Support",
    ],
    btn: "Contact Sales",
    bt: "pbtn-o",
  },
];

const trust = [
  {
    i: "⬡",
    title: "Identity Ethics",
    text: "Every Digital Twin is created with explicit biometric consent and blockchain-backed verification. Digital sovereignty, guaranteed.",
  },
  {
    i: "◎",
    title: "Enterprise Security",
    text: "SOC2 compliant infrastructure with zero-data retention options for sensitive government or medical applications.",
  },
  {
    i: "◈",
    title: "Proven Reliability",
    text: "Built on the Aatral Innovation Lab framework — delivering intelligent solutions for the software-first world, trusted worldwide.",
  },
];

const brands = [
  "Aatral Innovation Labs",
  "Global Education Partners",
  "Enterprise Innovation Hubs",
  "Research Institutes",
  "Fortune 500 Pilots",
  "GovTech Accelerators",
];

/* ─── APP ─── */
export default function DuxoLanding() {
  const doubled = [...brands, ...brands];

  return (
    <div className="page">
      <style>{css}</style>
      <SEOMeta />
      <Cursor />

      {/* NAV */}
      <nav role="navigation" aria-label="Main navigation">
        <div className="nav-logo syne">
          duxo<span>.ai</span>
        </div>
        <div className="nav-links">
          {[
            ["Capabilities", "#capabilities"],
            ["How it Works", "#how"],
            ["Pricing", "#pricing"],
            ["Trust", "#trust"],
          ].map(([l, h]) => (
            <a key={l} href={h}>
              {l}
            </a>
          ))}
        </div>
        <button className="nav-cta">
          <span className="nav-cta-inner">Get Started</span>
        </button>
      </nav>

      <main>
        {/* HERO */}
        <section className="hero" id="home" aria-label="Duxo.AI hero">
          <div className="h-glow1" aria-hidden="true" />
          <div className="h-glow2" aria-hidden="true" />
          <div className="h-grid" aria-hidden="true" />

          <div className="orb-wrap" aria-hidden="true">
            <div className="orb-r r2">
              <div className="orb-d d2" />
            </div>
            <div className="orb-r r1">
              <div className="orb-d d1" />
            </div>
            <div className="orb-conic">
              <div className="orb-fill">
                <div className="orb-emoji">🧑‍💼</div>
              </div>
            </div>
          </div>

          <div className="eyebrow" role="text">
            <div className="e-dot" aria-hidden="true" />
            Agentic Digital Presence
          </div>

          <h1 className="h1 syne">
            <Typewriter
              words={[
                "Human Intelligence.",
                "Digital Empathy.",
                "Agentic Presence.",
                "Brand Intelligence.",
              ]}
              speed={72}
              pause={2100}
            />
            <br />
            Digital Scale.
          </h1>

          <p className="hero-sub">
            Traditional interfaces are friction points. Duxo.AI replaces menus
            and forms with intelligent entities that see, hear, and act on
            behalf of your brand.
          </p>

          <div className="hero-btns">
            <button className="btn-p">Start Free</button>
            <button className="btn-g">Watch Demo</button>
          </div>
        </section>

        {/* TRUST BAR */}
        <div className="tbar" aria-label="Trusted organizations">
          <span className="tbar-label">Trusted by</span>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div className="tbar-scroll" aria-hidden="true">
              {doubled.map((b, i) => (
                <span className="tbar-item" key={i}>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-band" aria-label="Platform metrics">
          <div className="stats-inner">
            {[
              { e: 100, s: "+", l: "Languages Supported" },
              { e: 99, s: "%", l: "Uptime SLA" },
              { e: 5, s: "M+", l: "Interactions Served" },
              { e: 300, s: "ms", l: "Avg Response Time" },
            ].map((x, i) => (
              <Reveal key={x.l} delay={i * 80}>
                <div className="stat">
                  <div className="stat-n">
                    <Counter end={x.e} suffix={x.s} />
                  </div>
                  <div className="stat-l">{x.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* CAPABILITIES */}
        <section id="capabilities" aria-labelledby="caps-heading">
          <div className="sw">
            <Reveal>
              <div className="slabel">Capabilities</div>
              <h2 className="stitle" id="caps-heading">
                The <em>Agentic</em> Difference
              </h2>
              <p className="sbody">
                Four pillars that transform passive digital faces into active
                brand ambassadors — ones that think, connect, and close.
              </p>
            </Reveal>
            <div className="caps-grid" role="list">
              {caps.map((c, i) => (
                <Reveal key={c.n} delay={i * 70}>
                  <article className="cap" role="listitem" data-h="1">
                    <div className="cap-num">{c.n}</div>
                    <div className="cap-ico" aria-hidden="true">
                      {c.i}
                    </div>
                    <h3 className="cap-title">{c.title}</h3>
                    <p className="cap-desc">{c.desc}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* HOW */}
        <div className="how-bg" id="how">
          <div className="sw">
            <Reveal>
              <div className="slabel">Process</div>
              <h2 className="stitle">
                From Idea to <em>Live Agent</em>
              </h2>
            </Reveal>
            <div className="steps" role="list">
              {[
                {
                  n: "01",
                  t: "Design your presence",
                  d: "Upload your brand persona, connect your knowledge base, and define your agent's personality and scope.",
                },
                {
                  n: "02",
                  t: "Connect & configure",
                  d: "Integrate with SharePoint, Notion, CRM systems, or custom APIs. Define workflows the agent can trigger autonomously.",
                },
                {
                  n: "03",
                  t: "Deploy everywhere",
                  d: "Embed on any website or portal. Your digital human goes live — speaking, reasoning, and acting in real-time.",
                },
              ].map((s, i) => (
                <Reveal key={s.n} delay={i * 110} y={20}>
                  <div className="step" data-h="1" role="listitem">
                    <div className="step-badge">{s.n}</div>
                    <h3 className="step-t">{s.t}</h3>
                    <p className="step-d">{s.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* PRICING */}
        <section id="pricing" aria-labelledby="pricing-heading">
          <div className="sw">
            <Reveal>
              <div className="slabel">Pricing</div>
              <h2 className="stitle" id="pricing-heading">
                Simple, Transparent <em>Tiers</em>
              </h2>
              <p className="sbody">
                Start free, scale as your presence grows. No hidden fees, no
                per-seat surprises.
              </p>
            </Reveal>
            <div className="pg" role="list">
              {plans.map((p, i) => (
                <Reveal key={p.tier} delay={i * 90}>
                  <article
                    className={`pc${p.feat ? " feat" : ""}`}
                    role="listitem"
                    data-h="1"
                  >
                    <div>
                      <div className="pt">{p.tier}</div>
                      {p.feat && <div className="pbadge">Most Popular</div>}
                    </div>
                    <div className="pamt">
                      {p.price ? (
                        <>
                          ${p.price}
                          <span>/mo</span>
                        </>
                      ) : (
                        <span
                          style={{
                            fontSize: 28,
                            fontFamily: "'Manrope',sans-serif",
                            fontWeight: 300,
                          }}
                        >
                          Custom
                        </span>
                      )}
                    </div>
                    <div className="pdiv" />
                    <div className="pfeats">
                      {p.feats.map((f) => (
                        <div className="pfeat" key={f}>
                          <div className="pcheck" aria-hidden="true">
                            ✓
                          </div>
                          {f}
                        </div>
                      ))}
                    </div>
                    <button
                      className={`pbtn ${p.bt}`}
                      aria-label={`${p.btn} — ${p.tier} plan`}
                    >
                      {p.btn}
                    </button>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST */}
        <div className="tsec" id="trust">
          <div className="sw">
            <Reveal>
              <div className="slabel">Trust & Governance</div>
              <h2 className="stitle">
                Built on a Foundation of <em>Responsibility</em>
              </h2>
            </Reveal>
            <div className="tcols" role="list">
              {trust.map((t, i) => (
                <Reveal key={t.title} delay={i * 90}>
                  <article className="tc" role="listitem" data-h="1">
                    <div className="tc-ico" aria-hidden="true">
                      {t.i}
                    </div>
                    <h3 className="tc-title">{t.title}</h3>
                    <p className="tc-text">{t.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="cta">
          <div className="cta-glow" aria-hidden="true" />
          <Reveal>
            <h2 className="cta-t syne">
              Your brand,
              <br />
              <em>always present.</em>
            </h2>
            <p className="cta-s">
              Deploy your first digital human in minutes. No code required.
            </p>
            <div className="cta-btns">
              <button className="btn-p">Start Free — No Credit Card</button>
              <button className="btn-g">Schedule a Demo</button>
            </div>
          </Reveal>
        </div>
      </main>

      {/* FOOTER */}
      <footer role="contentinfo">
        <div className="flogo syne">
          duxo<span>.ai</span>
        </div>
        <p className="fcopy">© 2025 Duxo.AI · Aatral Innovation Lab</p>
        <nav className="flinks" aria-label="Footer links">
          {["Privacy", "Terms", "Ethics", "Contact"].map((l) => (
            <a key={l} href={`/${l.toLowerCase()}`}>
              {l}
            </a>
          ))}
        </nav>
      </footer>
    </div>
  );
}
