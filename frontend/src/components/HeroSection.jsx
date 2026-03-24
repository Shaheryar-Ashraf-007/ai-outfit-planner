import { Link } from "react-router-dom";

const HeroSection = () => {
  const stats = [
    { icon: "🪝", num: "50K+", label: "OUTFITS GENERATED" },
    { icon: "📅", num: "20+",  label: "EVENTS COVERED"    },
    { icon: "⭐", num: "4.9★", label: "USER RATING"       },
    { icon: "❤️", num: "100%", label: "FREE TO START"     },
  ];

  return (
    <div className="absolute w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#F5EDE4] px-6 py-20">

      {/* ── Google Font ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,700;1,900&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes floatUp   { 0%,100%{ transform:translateY(0)   } 50%{ transform:translateY(-12px) } }
        @keyframes floatDown { 0%,100%{ transform:translateY(0)   } 50%{ transform:translateY( 10px) } }
        @keyframes fadeIn    { from{ opacity:0; transform:translateY(20px) } to{ opacity:1; transform:translateY(0) } }
        .hero-title    { animation: fadeIn 0.8s ease both 0.1s; opacity:0 }
        .hero-desc     { animation: fadeIn 0.8s ease both 0.25s; opacity:0 }
        .hero-cta      { animation: fadeIn 0.8s ease both 0.4s;  opacity:0 }
        .hero-stats    { animation: fadeIn 0.8s ease both 0.55s; opacity:0 }
        .bridal-img    { animation: floatUp   6s ease-in-out infinite 0.5s }
        .leaf-img      { animation: floatDown 8s ease-in-out infinite }
        .cta-btn:hover { transform:translateY(-3px) !important; box-shadow:0 16px 40px rgba(255,111,145,0.55) !important }
        .stat-col:hover{ background:rgba(255,111,145,0.05) }
      `}</style>

      {/* ── Decorative background blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* large warm blob top-right */}
        <div className="absolute -top-10 -right-10 w-[500px] h-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(220,195,170,0.60)_0%,transparent_65%)]" />
        {/* blob bottom-right */}
        <div className="absolute -bottom-20 right-0 w-[380px] h-[380px] rounded-full bg-[radial-gradient(ellipse,rgba(234,215,197,0.65)_0%,transparent_65%)]" />
        {/* soft pink blob center-left */}
        <div className="absolute top-[30%] -left-10 w-[280px] h-[280px] rounded-full bg-[radial-gradient(ellipse,rgba(255,138,138,0.14)_0%,transparent_70%)]" />
        {/* tiny pink glow behind heading */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[radial-gradient(ellipse,rgba(255,111,145,0.07)_0%,transparent_70%)]" />

        {/* scattered dots */}
        {[
          {t:100,l:160},{t:185,l:240},{t:280,l:125},{t:150,l:305},{t:225,l:385},{t:335,l:285},
          {t:420,l:155},{t:500,l:220},{t:360,l:400},{t:120,l:440},
        ].map((d,i)=>(
          <div key={i} className="absolute rounded-full bg-[rgba(180,120,90,0.22)]"
            style={{ top:d.t, left:d.l, width: i%3===0?6:i%3===1?4:5, height: i%3===0?6:i%3===1?4:5 }}/>
        ))}
      </div>

      {/* ── Pink decorative circles ── */}
      <div className="absolute left-20 top-[36%] w-20 h-20 rounded-full bg-[rgba(255,138,138,0.16)] border border-[rgba(255,138,138,0.25)]" />
      <div className="absolute left-10 top-[56%] w-8 h-8 rounded-full bg-[rgba(214,93,177,0.13)]" />
      <div className="absolute right-[280px] bottom-[15%] w-5 h-5 rounded-full bg-[rgba(255,111,145,0.18)]" />

      {/* ── Watercolor wash bottom-left ── */}
      <div className="absolute -left-10 -bottom-8 w-[260px] h-[260px] rounded-full bg-[radial-gradient(ellipse,rgba(201,168,124,0.25)_0%,transparent_65%)]" />

      {/* ── Leaf / barley image — bottom left ── */}
      <div className=" ... rotate-[270deg] leaf-img absolute md:left-[-330px] top-20 opacity-30 w-full z-0 select-none pointer-events-none">
        <img
          src="/public/flower.png"
          alt=""
          className="w-full md:h-[800px] h-[500px] object-contain drop-shadow-[0_8px_24px_rgba(180,120,80,0.20)]"
          style={{ filter: "sepia(0.15) saturate(0.9) brightness(1.02)" }}
        />
      </div>

      {/* ── Bridal girl — right ── */}
      <div className="bridal-img absolute right-0 top-28 z-0 select-none pointer-events-none
        w-[450px] sm:w-[350px] md:w-[440px] lg:w-[550px] opacity-60 xl:w-[660px]">
        <img
          src="/public/bridal1.png"
          alt="Bridal girl"
          className="w-full object-contain object-bottom
            drop-shadow-[0_16px_48px_rgba(201,76,124,0.18)]"
          style={{ filter: "drop-shadow(0 0 30px rgba(255,111,145,0.12))" }}
        />
      </div>

      {/* ── Floating rose petals (CSS shapes) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          {t:"8%", l:"18%", r:18, o:0.18, d:"0s"},
          {t:"14%",l:"72%", r:14, o:0.15, d:"1.5s"},
          {t:"42%",l:"12%", r:12, o:0.12, d:"0.8s"},
          {t:"65%",l:"78%", r:10, o:0.14, d:"2.2s"},
          {t:"78%",l:"30%", r:16, o:0.10, d:"1.2s"},
          {t:"25%",l:"55%", r:10, o:0.10, d:"3s"},
        ].map((p,i)=>(
          <div key={i} className="absolute rounded-full"
            style={{
              top:p.t, left:p.l,
              width:p.r*2, height:p.r*2,
              background:`rgba(201,76,124,${p.o})`,
              animation:`floatUp ${5+i}s ease-in-out infinite ${p.d}`,
            }}/>
        ))}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 text-center w-full max-w-xl xl:max-w-2xl mx-auto"
        style={{ fontFamily:"'DM Sans', sans-serif" }}>

        {/* Sub-badge */}
        <div className="hero-title inline-flex items-center gap-2 bg-[rgba(255,111,145,0.10)] border border-[rgba(255,111,145,0.28)] rounded-full px-5 py-2 mb-6 mt-24">
          <span className="w-2 h-2 rounded-full bg-[#FF6F91] shadow-[0_0_6px_rgba(255,111,145,0.8)] animate-pulse" />
          <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#961e32]">
            AI-Powered Outfit Recommendation
          </span>
        </div>

        {/* Main heading */}
        <h1 className="hero-title font-black italic leading-tight mb-6"
          style={{
            fontFamily:"'Playfair Display', serif",
            fontSize:"clamp(52px, 8vw, 90px)",
            background:"linear-gradient(135deg, #78081C 100%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>
          Perfect Outfit
        </h1>

        {/* Description */}
        <p className="hero-desc text-[#4b4949] leading-[1.9] mb-10 max-w-[520px] mx-auto text-[15px]">
          Upload your photo and get personalized outfit recommendations based on
          your skin tone, body type, and event — from Mehndi to Eid, powered by AI ✨
        </p>

        {/* CTA button */}
        <div className="hero-cta">
          <Link to="/create-outfit">
            <button
              className="cta-btn px-12 py-[18px] rounded-full border-none cursor-pointer text-white text-base font-bold tracking-wide transition-all duration-200"
              style={{
                background:"linear-gradient(135deg, #78081C 0%, #FF6F91 50%, #D65DB1 100%)",
                boxShadow:"0 8px 28px rgba(255,111,145,0.40)",
                fontFamily:"'DM Sans', sans-serif",
              }}>
              Get Your Outfit → It's Free
            </button>
          </Link>
        </div>

        {/* Stats bar */}
        <div className="hero-stats flex flex-wrap justify-center mt-12
          bg-white/70 border border-white/60 rounded-2xl
          shadow-[0_4px_32px_rgba(180,120,100,0.12)]
          backdrop-blur-md overflow-hidden">
          {stats.map((s, i) => (
            <div key={i}
              className={`stat-col flex flex-col items-center px-8 py-7 flex-1 basis-24
                transition-colors duration-200 cursor-default
                ${i < stats.length-1 ? "border-r border-[rgba(220,195,170,0.45)]" : ""}`}>
              <span className="text-[22px] mb-2">{s.icon}</span>
              <span className="text-[26px] font-extrabold text-[#3a3a3a] leading-none mb-1"
                style={{ fontFamily:"'DM Sans', sans-serif" }}>
                {s.num}
              </span>
              <span className="text-[9.5px] tracking-[0.13em] text-[#9A9A9A] font-semibold uppercase">
                {s.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default HeroSection;