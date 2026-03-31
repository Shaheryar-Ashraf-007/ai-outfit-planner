import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

/* ─────────────────────────────────────────────
   API helper
───────────────────────────────────────────── */
const api = axios.create({ baseURL: "http://localhost:3000/api" });
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

const skinToneColors = {
  Fair: "#FDDBB4", Light: "#F0B27A", Medium: "#D4915A",
  Olive: "#C07A3A", Tan: "#A0612A", Deep: "#6B3A1F",
};

/* ─────────────────────────────────────────────
   Thumbnail Card
   Shows Flux image if available, else palette swatches
───────────────────────────────────────────── */
const ThumbCard = ({ outfit, active, favorite, onSelect, onFavorite }) => {
  const gradBg = { background: "linear-gradient(135deg,#78081C 0%,#FF6F91 50%,#D65DB1 100%)" };

  return (
    <div
      onClick={onSelect}
      className={`flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2
        ${active
          ? "border-[#FF6F91] -translate-y-1"
          : "border-transparent hover:border-[rgba(255,111,145,0.4)] hover:-translate-y-0.5"}`}
      style={{
        width: "110px",
        boxShadow: active
          ? "0 12px 36px rgba(120,8,28,0.22)"
          : "0 3px 14px rgba(180,120,100,0.13)",
      }}>

      {/* preview — real image or palette swatches */}
      <div className="relative" style={{ height: "120px" }}>
        {outfit.image ? (
          <img
            src={outfit.image}
            alt={outfit.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-wrap">
            {outfit.palette?.slice(0, 4).map((c, i) => (
              <div key={i} className="w-1/2 h-1/2" style={{ background: c }} />
            ))}
          </div>
        )}

        {/* match badge */}
        <div
          className="absolute top-1.5 left-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white"
          style={gradBg}>
          {outfit.match}%
        </div>

        {/* favorite button */}
        <button
          className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs border transition-all duration-200
            ${favorite
              ? "bg-[#FF6F91] border-[#FF6F91] text-white"
              : "bg-white/85 border-white/60 text-[#9A9A9A]"}`}
          onClick={e => { e.stopPropagation(); onFavorite(); }}>
          {favorite ? "♥" : "♡"}
        </button>
      </div>

      {/* label */}
      <div className="px-2 py-2 bg-white/90 backdrop-blur-sm">
        <p className="text-[10px] font-bold text-[#3a3a3a] leading-tight truncate">{outfit.title}</p>
        <p className="text-[9px] text-[#9A9A9A] truncate mt-0.5">{outfit.subtitle}</p>
        <div className="flex gap-1 mt-1.5">
          {outfit.palette?.slice(0, 3).map(c => (
            <div key={c} className="w-3 h-3 rounded-full border border-white/70 shadow-sm"
              style={{ background: c }} />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Hero Section
   Shows Flux image full-width if available,
   else shows the animated fabric pattern
───────────────────────────────────────────── */
const OutfitHero = ({ outfit }) => {
  const p   = outfit.palette || ["#8B1A2E", "#C9485B", "#E8B4A0", "#F5E6D0"];
  const uid = `hero-${outfit.id ?? Math.random()}`;

  /* if Flux image exists — show it as a full hero */
  if (outfit.image) {
    return (
      <div className="w-full h-full relative overflow-hidden">
        <img
          src={outfit.image}
          alt={outfit.title}
          className="w-full h-full object-cover object-top"
        />
        {/* bottom fade so text overlay reads cleanly */}
        <div
          className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(245,237,228,1) 0%, rgba(245,237,228,0.7) 40%, transparent 100%)",
          }}
        />
      </div>
    );
  }

  /* fallback — animated fabric pattern */
  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg,${p[0]}18 0%,${p[1]}28 40%,${p[2]}18 80%,${p[3]}12 100%)`,
      }}>
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 400 540"
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={`w-${uid}`} x="0" y="0" width="24" height="24"
            patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="24" stroke={p[0]} strokeWidth="0.6" opacity="0.18" />
            <line x1="8" y1="0" x2="8" y2="24" stroke={p[1]} strokeWidth="0.4" opacity="0.12" />
            <line x1="16" y1="0" x2="16" y2="24" stroke={p[0]} strokeWidth="0.6" opacity="0.18" />
          </pattern>
          <pattern id={`e-${uid}`} x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="24" cy="24" r="2.5" fill={p[0]} opacity="0.22" />
            <circle cx="0"  cy="0"  r="1.5" fill={p[1]} opacity="0.16" />
            <circle cx="48" cy="48" r="1.5" fill={p[1]} opacity="0.16" />
            <path d="M18 24 Q24 18 30 24 Q24 30 18 24 Z" fill={p[1]} opacity="0.14" />
          </pattern>
          <radialGradient id={`rg-${uid}`} cx="50%" cy="40%" r="55%">
            <stop offset="0%"   stopColor={p[2]} stopOpacity="0.55" />
            <stop offset="60%"  stopColor={p[1]} stopOpacity="0.25" />
            <stop offset="100%" stopColor={p[0]} stopOpacity="0.08" />
          </radialGradient>
        </defs>
        <rect width="400" height="540" fill={`url(#w-${uid})`} />
        <rect width="400" height="540" fill={`url(#e-${uid})`} />
        <rect width="400" height="540" fill={`url(#rg-${uid})`} />
      </svg>
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20"
        style={{ background: `radial-gradient(circle,${p[1]} 0%,transparent 70%)` }} />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-15"
        style={{ background: `radial-gradient(circle,${p[0]} 0%,transparent 70%)` }} />
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top,rgba(245,237,228,1) 0%,rgba(245,237,228,0.85) 30%,transparent 100%)",
        }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function ViewOutfitPage() {
  const location = useLocation();
  const navigate = useNavigate();

  /* ──────────────────────────────────────────
     From your CreateOutfitPage:
       navigate("/view-outfit", { state: { outfitData } })
     where outfitData is the ARRAY of outfits
     Each outfit has: id, title, subtitle, match,
       tags, palette, accentLight, colors, fabric,
       occasion, pieces[], stylistNote, image (url|null)
  ────────────────────────────────────────── */
  const outfitData  = location.state?.outfitData;      // array of outfits
  const outfits     = Array.isArray(outfitData) ? outfitData : [];
  const stylingTips = location.state?.stylingTips ?? [];
  const userProfile = location.state?.userProfile  ?? {};
  const firestoreId = location.state?.firestoreId  ?? null;

  /* ── local state ── */
  const [activeId,    setActiveId]    = useState(outfits[0]?.id ?? 1);
  const [activeTab,   setActiveTab]   = useState("outfit");
  const [favorites,   setFavorites]   = useState({});
  const [favLoading,  setFavLoading]  = useState({});
  const [shareToast,  setShareToast]  = useState("");
  const [showProfile, setShowProfile] = useState(false);

  const active = outfits.find(o => o.id === activeId) ?? outfits[0];

  /* redirect if no data */
  useEffect(() => {
    if (outfits.length === 0) navigate("/create-outfit");
  }, []);

  /* sync activeId when outfits load */
  useEffect(() => {
    if (outfits.length > 0 && !outfits.find(o => o.id === activeId)) {
      setActiveId(outfits[0].id);
    }
  }, [outfits]);

  /* ── style tokens ── */
  const gradBg   = { background: "linear-gradient(135deg,#78081C 0%,#FF6F91 50%,#D65DB1 100%)" };
  const gradText = { background: "linear-gradient(135deg,#78081C,#D65DB1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" };
  const glass    = { background: "rgba(255,255,255,0.72)", backdropFilter: "blur(18px)", boxShadow: "0 8px 40px rgba(180,120,100,0.10)" };

  const showToast = (setter, msg) => {
    setter(msg);
    setTimeout(() => setter(""), 2800);
  };

  /* ── toggleFavorite — POST /api/outfit/:id/favorite ── */
  const handleFavorite = async (outfit) => {
    const outfitId = outfit.firestoreId || outfit.id;
    if (!outfitId) return;
    setFavLoading(p => ({ ...p, [outfitId]: true }));
    try {
      await api.post(`/outfit/${outfitId}/favorite`);
      setFavorites(p => ({ ...p, [outfitId]: !p[outfitId] }));
    } catch (err) {
      console.error("Favorite failed:", err);
    } finally {
      setFavLoading(p => ({ ...p, [outfitId]: false }));
    }
  };

  /* ── shareOutfit — GET /api/outfit/:id/share ── */
  const handleShare = async () => {
    const outfitId = active?.firestoreId || active?.id;
    try {
      if (outfitId) {
        const res = await api.get(`/outfit/${outfitId}/share`);
        await navigator.clipboard.writeText(res.data?.shareUrl || window.location.href);
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
      showToast(setShareToast, "Link copied! 🔗");
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      showToast(setShareToast, "Link copied! 🔗");
    }
  };


  /* ── Regenerate — go back to create-outfit ── */
  const handleRegenerate = () => {
    navigate("/create-outfit", {
      state: {
        prefill:       userProfile,
        excludeTitles: outfits.map(o => o.title),
      },
    });
  };

  const isFav = (o) => !!favorites[o?.firestoreId || o?.id];

  if (!active) return null;

  return (
    <div className="relative min-h-screen bg-[#F5EDE4] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,700;1,900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family:'DM Sans',sans-serif; }
        .font-playfair { font-family:'Playfair Display',serif !important; }

        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes heroIn  { from{opacity:0;transform:scale(1.03)} to{opacity:1;transform:scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

        .fade-up   { animation:fadeUp  0.5s ease both; }
        .fade-in   { animation:fadeIn  0.35s ease both; }
        .hero-in   { animation:heroIn  0.6s cubic-bezier(.25,.8,.25,1) both; }
        .slide-up  { animation:slideUp 0.5s cubic-bezier(.25,.8,.25,1) both; }
        .spin      { animation:spin 0.85s linear infinite; }
        .toast-anim{ animation:toastIn 0.4s cubic-bezier(.34,1.56,.64,1) both; }

        .tab-btn {
          flex:1; padding:11px 8px; font-size:12px; font-weight:600;
          color:#9A9A9A; border:none; background:transparent; cursor:pointer;
          transition:color 0.2s; position:relative;
        }
        .tab-btn.act { color:#78081C; }
        .tab-btn.act::after {
          content:''; position:absolute; bottom:0; left:12px; right:12px;
          height:2.5px; border-radius:2px;
          background:linear-gradient(90deg,#78081C,#FF6F91);
        }
        .piece-row { transition:background 0.15s; border-radius:12px; }
        .piece-row:hover { background:rgba(255,111,145,0.05); }
        .fav-btn { transition:all 0.2s cubic-bezier(.34,1.56,.64,1); }
        .fav-btn:hover { transform:scale(1.12); }
        .fav-btn.active-fav { transform:scale(1.15); }
        .match-ring {
          background: conic-gradient(
            #FF6F91 0% var(--pct),
            rgba(220,195,170,0.3) var(--pct) 100%
          );
        }
        ::-webkit-scrollbar { display:none; }
      `}</style>

      {/* blobs */}
      <div className="fixed -top-20 -right-20 w-96 h-96 rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse,rgba(220,195,170,0.5) 0%,transparent 65%)" }} />
      <div className="fixed -bottom-16 -left-16 w-80 h-80 rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse,rgba(201,168,124,0.2) 0%,transparent 65%)" }} />


      {/* ════════════════════
          TOPBAR
      ════════════════════ */}
      <div className="relative z-20 flex items-center justify-between px-5 py-4">
        <Link to="/create-outfit" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
            style={{ background: "rgba(255,255,255,0.85)", color: "#78081C", backdropFilter: "blur(8px)", boxShadow: "0 2px 12px rgba(120,8,28,0.12)" }}>
            ←
          </div>
          <span className="text-[13px] font-semibold text-[#78081C]">Edit</span>
        </Link>

        <span className="font-playfair italic font-bold text-lg" style={gradText}>Perfect Outfit</span>

        {/* profile pill */}
        <button
          onClick={() => setShowProfile(p => !p)}
          className="flex items-center gap-2 rounded-full px-3 py-1.5 border"
          style={{ background: "rgba(255,255,255,0.85)", borderColor: "rgba(220,195,170,0.5)", backdropFilter: "blur(8px)" }}>
          {userProfile.skinTone && (
            <span className="w-3.5 h-3.5 rounded-full border border-white/60"
              style={{ background: skinToneColors[userProfile.skinTone] ?? "#C8A882" }} />
          )}
          <span className="text-[11px] font-semibold text-[#4b4949]">
            {userProfile.event ?? `${outfits.length} looks`}
          </span>
          <span className="text-[9px] text-[#9A9A9A]">▾</span>
        </button>
      </div>

      {/* profile popover */}
      {showProfile && (
        <div className="relative z-20 mx-4 mb-3 rounded-2xl p-4 border border-white/75 fade-in" style={glass}>
          <p className="text-[10px] font-bold tracking-[0.13em] uppercase text-[#961e32] mb-2.5">Your Profile</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              userProfile.event    && { label: userProfile.event,         icon: "🎉" },
              userProfile.style    && { label: userProfile.style,         icon: "✨" },
              userProfile.gender   && { label: userProfile.gender,        icon: "👤" },
              userProfile.season   && { label: userProfile.season,        icon: "🌿" },
              userProfile.height   && { label: `${userProfile.height}cm`, icon: "📏" },
              userProfile.skinTone && { label: userProfile.skinTone,      icon: "🎨" },
              userProfile.bodyType && { label: userProfile.bodyType,      icon: "👗" },
            ].filter(Boolean).map(item => (
              <div key={item.label}
                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold text-[#78081C] bg-white/80 border border-[rgba(220,195,170,0.5)]">
                <span>{item.icon}</span>{item.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════
          FULL-WIDTH HERO
      ════════════════════ */}
      <div
        className="relative z-10 hero-in"
        key={`hero-${active.id}`}
        style={{ marginTop: "-64px" }}>

        <div className="w-full relative" style={{ height: "72vh", minHeight: "420px", maxHeight: "620px" }}>

          <OutfitHero outfit={active} />

          {/* match ring */}
          <div className="absolute bottom-44 right-5 z-10">
            <div className="match-ring w-14 h-14 rounded-full p-[3px]"
              style={{ "--pct": `${active.match ?? 0}%` }}>
              <div className="w-full h-full rounded-full bg-white/95 flex flex-col items-center justify-center">
                <span className="text-[13px] font-black text-[#78081C] leading-none">{active.match ?? "—"}%</span>
                <span className="text-[7px] font-semibold text-[#9A9A9A] uppercase tracking-wide">match</span>
              </div>
            </div>
          </div>

          {/* tags */}
          <div className="absolute top-20 left-5 flex gap-1.5 z-10 flex-wrap">
            {active.tags?.map(tag => (
              <div key={tag} className="rounded-full px-2.5 py-1 text-[10px] font-bold text-white" style={gradBg}>
                {tag}
              </div>
            ))}
          </div>

          {/* action buttons */}
          <div className="absolute top-20 right-5 flex gap-2 z-10">
            <button
              className={`fav-btn w-9 h-9 rounded-2xl flex items-center justify-center text-base border-2 backdrop-blur-sm
                ${isFav(active) ? "bg-[#FF6F91] border-[#FF6F91] text-white active-fav" : "bg-white/80 border-white/60 text-[#9A9A9A]"}`}
              onClick={() => handleFavorite(active)}
              disabled={favLoading[active?.firestoreId || active?.id]}>
              {favLoading[active?.firestoreId || active?.id] ? (
                <svg className="spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                  <path d="M12 2 A10 10 0 0 1 22 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : isFav(active) ? "♥" : "♡"}
            </button>
            <button
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-base bg-white/80 border-2 border-white/60 text-[#9A9A9A] backdrop-blur-sm hover:border-[#FF6F91] transition-all"
              onClick={handleShare}>
              ↗
            </button>
          </div>

          {/* outfit info overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 z-10">
            <div className="flex items-end justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="font-playfair italic font-bold text-[24px] text-[#3a3a3a] leading-tight truncate">
                  {active.title}
                </h2>
                <p className="text-[13px] text-[#78081C] font-semibold mt-0.5">{active.subtitle}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1.5">
                    {active.palette?.map(c => (
                      <div key={c} className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ background: c }} />
                    ))}
                  </div>
                  {active.colors && (
                    <span className="text-[10px] text-[#9A9A9A] font-medium truncate hidden sm:block">
                      {active.colors}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 items-end flex-shrink-0">
                {active.occasion && (
                  <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold text-[#78081C] bg-white/85 border border-[rgba(220,195,170,0.5)]">
                    🎉 {active.occasion}
                  </div>
                )}
                {active.fabric && (
                  <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold text-[#78081C] bg-white/85 border border-[rgba(220,195,170,0.5)]">
                    🧵 {active.fabric}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════
          THUMBNAIL CAROUSEL
      ════════════════════ */}
      <div className="relative z-10 px-5 mb-5 slide-up" style={{ animationDelay: "0.1s" }}>
        <p className="text-[10px] font-bold tracking-[0.13em] uppercase text-[#961e32] mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6F91] animate-pulse inline-block" />
          {outfits.length} outfits matched for you
        </p>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {outfits.map(outfit => (
            <ThumbCard
              key={outfit.id}
              outfit={outfit}
              active={activeId === outfit.id}
              favorite={isFav(outfit)}
              onSelect={() => { setActiveId(outfit.id); setActiveTab("outfit"); }}
              onFavorite={() => handleFavorite(outfit)}
            />
          ))}
        </div>
      </div>

      {/* ════════════════════
          DETAIL CARD — tabs
      ════════════════════ */}
      <div
        className="relative z-10 mx-4 mb-5 rounded-3xl overflow-hidden border border-white/75 slide-up"
        key={`detail-${active.id}`}
        style={{ ...glass, animationDelay: "0.15s" }}>

        {/* tabs */}
        <div className="flex border-b border-[rgba(220,195,170,0.3)]">
          {[
            { id: "outfit",  label: "Outfit Pieces" },
            { id: "stylist", label: "Stylist Note"  },
            { id: "colours", label: "Colour Story"  },
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "act" : ""}`}
              onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* tab content */}
        <div className="px-4 py-4 fade-in" key={activeTab + active.id}>

          {/* ── Outfit Pieces ── */}
          {activeTab === "outfit" && (
            <div className="space-y-0.5">
              {active.pieces?.map((piece, i) => (
                <div key={i} className="piece-row flex items-center gap-3 px-2 py-3 transition-colors">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-[12px] font-black text-white"
                    style={{
                      background: `linear-gradient(135deg,${active.palette?.[0] ?? "#78081C"},${active.palette?.[1] ?? "#FF6F91"})`,
                    }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#2a2a2a] leading-tight">{piece.name}</p>
                    <p className="text-[11px] text-[#9A9A9A] mt-0.5 leading-snug">{piece.detail}</p>
                  </div>
                  <span className="text-[#C8A882] text-lg font-light">›</span>
                </div>
              ))}
            </div>
          )}

          {/* ── Stylist Note ── */}
          {activeTab === "stylist" && (
            <div
              className="rounded-2xl p-4 border border-[rgba(255,111,145,0.18)]"
              style={{ background: "rgba(255,111,145,0.04)" }}>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={gradBg}>
                  <span className="text-white text-sm">✦</span>
                </div>
                <span className="text-[11px] font-black text-[#78081C] uppercase tracking-widest">
                  Stylist's Advice
                </span>
              </div>
              <p className="font-playfair italic text-[14px] text-[#4b4949] leading-[1.85]">
                "{active.stylistNote}"
              </p>
              {(userProfile.bodyType || userProfile.skinTone) && (
                <div className="mt-4 pt-3 border-t border-[rgba(255,111,145,0.12)] flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-[#9A9A9A]">Matched to your</span>
                  {userProfile.bodyType && (
                    <span className="text-[10px] font-bold text-[#961e32] bg-[rgba(255,111,145,0.10)] rounded-full px-2 py-0.5 border border-[rgba(255,111,145,0.22)]">
                      {userProfile.bodyType} shape
                    </span>
                  )}
                  {userProfile.skinTone && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#961e32] bg-[rgba(255,111,145,0.10)] rounded-full px-2 py-0.5 border border-[rgba(255,111,145,0.22)]">
                      <span className="w-2 h-2 rounded-full"
                        style={{ background: skinToneColors[userProfile.skinTone] }} />
                      {userProfile.skinTone} skin
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Colour Story ── */}
          {activeTab === "colours" && (
            <div className="space-y-3">
              <p className="text-[11px] text-[#9A9A9A] mb-3 leading-relaxed">
                Colours selected to complement
                {userProfile.skinTone ? ` your ${userProfile.skinTone} skin tone` : " your look"} and the {active.occasion} vibe.
              </p>
              {active.palette?.map((color, i) => {
                const names = active.colors?.split(" · ") ?? [];
                return (
                  <div key={color} className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl border-2 border-white shadow-sm flex-shrink-0"
                      style={{ background: color }} />
                    <div className="flex-1">
                      <p className="text-[12px] font-semibold text-[#2a2a2a]">{names[i] ?? `Colour ${i + 1}`}</p>
                      <p className="text-[10px] text-[#9A9A9A] font-mono">{color.toUpperCase()}</p>
                    </div>
                    <div className="w-16 h-1.5 rounded-full bg-[rgba(220,195,170,0.3)] overflow-hidden">
                      <div className="h-full rounded-full"
                        style={{ width: `${[55, 25, 15, 5][i] ?? 10}%`, background: color }} />
                    </div>
                    <span className="text-[9px] text-[#9A9A9A] w-6 text-right">{[55, 25, 15, 5][i] ?? 10}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════
          STYLING TIPS
      ════════════════════ */}
      {stylingTips.length > 0 && (
        <div
          className="relative z-10 mx-4 mb-5 rounded-3xl p-4 border border-white/75 slide-up"
          style={{ ...glass, animationDelay: "0.2s" }}>
          <p className="text-[10px] font-bold tracking-[0.13em] uppercase text-[#961e32] mb-3">Styling Tips</p>
          <div className="space-y-2">
            {stylingTips.map((t, i) => (
              <div key={i}
                className="flex items-start gap-2.5 px-2 py-2 rounded-xl hover:bg-[rgba(255,111,145,0.05)] transition-colors">
                <span className="text-sm flex-shrink-0 mt-0.5">{t.icon}</span>
                <p className="text-[12px] text-[#4b4949] leading-snug">{t.tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════
          CTA FOOTER
      ════════════════════ */}
      <div className="relative z-10 mx-4 mb-10 slide-up" style={{ animationDelay: "0.25s" }}>
        <div className="flex gap-3">
          <button
            onClick={handleRegenerate}
            className="flex-1 py-4 rounded-full text-sm font-bold border-2 border-[rgba(120,8,28,0.22)] bg-white/70 text-[#78081C] hover:bg-[rgba(255,111,145,0.08)] hover:border-[#FF6F91] transition-all">
            ← Regenerate
          </button>
        </div>
      </div>

    </div>
  );
}