import { useState } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────
   Mock outfit data  (replace with API response)
───────────────────────────────────────────── */
const mockOutfits = [
  {
    id: 1,
    title: "Crimson Lehenga Set",
    subtitle: "Signature bridal look",
    match: 98,
    tags: ["Top Pick", "Trending"],
    palette: ["#8B1A2E", "#C9485B", "#E8B4A0", "#F5E6D0"],
    accentLight: "#FDE8EC",
    pieces: [
      {
        name: "Lehenga Skirt",
        detail: "Deep crimson silk with zardozi embroidery",
      },
      { name: "Choli Blouse", detail: "Backless design, gold thread work" },
      { name: "Dupatta", detail: "Sheer organza, scalloped border" },
      { name: "Accessories", detail: "Kundan choker + maang tikka + jhumkas" },
    ],
    colors: "Deep Crimson · Antique Gold · Ivory",
    fabric: "Silk · Organza",
    occasion: "Barat",
    stylistNote:
      "The cinched waist lehenga will beautifully define your hourglass silhouette. The backless choli adds elegance without overpowering your frame.",
  },
  {
    id: 2,
    title: "Dusty Rose Sharara",
    subtitle: "Ethereal & contemporary",
    match: 94,
    tags: ["New Season"],
    palette: ["#C9748E", "#E8A8B8", "#F5D0DA", "#FBE8ED"],
    accentLight: "#FDF0F4",
    pieces: [
      {
        name: "Sharara Pants",
        detail: "Flared palazzo cut, floral embroidery",
      },
      { name: "Kurti Top", detail: "Asymmetric hem, pearl buttons" },
      { name: "Net Dupatta", detail: "Powder pink, sequin scattered" },
      { name: "Footwear", detail: "Embroidered khussa or block heels" },
    ],
    colors: "Dusty Rose · Blush · Pearl",
    fabric: "Georgette · Net",
    occasion: "Mehndi",
    stylistNote:
      "The wide-leg sharara creates beautiful proportion. The embroidered hem draws the eye downward, elongating your figure gracefully.",
  },
  {
    id: 3,
    title: "Emerald Anarkali",
    subtitle: "Regal floor-length drama",
    match: 91,
    tags: ["Classic"],
    palette: ["#1A6B4A", "#2E9E6E", "#A8D8C0", "#D4EEE4"],
    accentLight: "#E8F7F0",
    pieces: [
      {
        name: "Anarkali Frock",
        detail: "Floor-length flared silhouette, heavy embroidery",
      },
      { name: "Churidar", detail: "Fitted tapered pants, matching thread" },
      { name: "Dupatta", detail: "Chiffon, zari border, tasseled edge" },
      { name: "Accessories", detail: "Gold jhumkas + glass bangles" },
    ],
    colors: "Emerald · Gold Zari · Ivory",
    fabric: "Velvet · Chiffon",
    occasion: "Walima",
    stylistNote:
      "The flared Anarkali skims the waist and flares beautifully from the hips, making it universally flattering.",
  },
  {
    id: 4,
    title: "Ivory & Gold Saree",
    subtitle: "Timeless draped elegance",
    match: 87,
    tags: ["Timeless"],
    palette: ["#C9A84C", "#E8CC80", "#F5ECD0", "#FDFAF0"],
    accentLight: "#FEFAEE",
    pieces: [
      { name: "Banarsi Saree", detail: "Ivory with heavy gold zari weave" },
      {
        name: "Fitted Blouse",
        detail: "Deep back, gold border, elbow sleeves",
      },
      { name: "Petticoat", detail: "Ivory satin, full flare" },
      { name: "Accessories", detail: "Temple jewellery + hair flowers" },
    ],
    colors: "Ivory · Antique Gold · Champagne",
    fabric: "Banarsi Silk",
    occasion: "Nikkah",
    stylistNote:
      "A saree drape creates an elongating vertical line. Choose a front-pinned style to highlight your waist beautifully.",
  },
];

const skinToneColors = {
  Fair: "#FDDBB4",
  Light: "#F0B27A",
  Medium: "#D4915A",
  Olive: "#C07A3A",
  Tan: "#A0612A",
  Deep: "#6B3A1F",
};

/* ── Full-width editorial outfit preview ── */
const OutfitHero = ({ outfit }) => {
  const p = outfit.palette;
  const id = `hero-${outfit.id}`;
  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${p[0]}18 0%, ${p[1]}28 40%, ${p[2]}18 80%, ${p[3]}12 100%)`,
      }}
    >
      {/* large fabric‑texture SVG fills the whole space */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 400 540"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* diagonal weave */}
          <pattern
            id={`w-${id}`}
            x="0"
            y="0"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="24"
              stroke={p[0]}
              strokeWidth="0.6"
              opacity="0.18"
            />
            <line
              x1="8"
              y1="0"
              x2="8"
              y2="24"
              stroke={p[1]}
              strokeWidth="0.4"
              opacity="0.12"
            />
            <line
              x1="16"
              y1="0"
              x2="16"
              y2="24"
              stroke={p[0]}
              strokeWidth="0.6"
              opacity="0.18"
            />
          </pattern>
          {/* embroidery dots */}
          <pattern
            id={`e-${id}`}
            x="0"
            y="0"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="24" cy="24" r="2.5" fill={p[0]} opacity="0.22" />
            <circle cx="0" cy="0" r="1.5" fill={p[1]} opacity="0.16" />
            <circle cx="48" cy="0" r="1.5" fill={p[1]} opacity="0.16" />
            <circle cx="0" cy="48" r="1.5" fill={p[1]} opacity="0.16" />
            <circle cx="48" cy="48" r="1.5" fill={p[1]} opacity="0.16" />
            <path
              d="M18 24 Q24 18 30 24 Q24 30 18 24 Z"
              fill={p[1]}
              opacity="0.14"
            />
            <path
              d="M24 18 Q30 24 24 30 Q18 24 24 18 Z"
              fill={p[0]}
              opacity="0.12"
            />
          </pattern>
          <radialGradient id={`rg-${id}`} cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor={p[2]} stopOpacity="0.55" />
            <stop offset="60%" stopColor={p[1]} stopOpacity="0.25" />
            <stop offset="100%" stopColor={p[0]} stopOpacity="0.08" />
          </radialGradient>
        </defs>
        <rect width="400" height="540" fill={`url(#w-${id})`} />
        <rect width="400" height="540" fill={`url(#e-${id})`} />
        <rect width="400" height="540" fill={`url(#rg-${id})`} />
      </svg>

      {/* decorative large circles */}
      <div
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${p[1]} 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-15"
        style={{
          background: `radial-gradient(circle, ${p[0]} 0%, transparent 70%)`,
        }}
      />

      {/* outfit silhouette illustration — large centred mannequin */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 160 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: "auto",
            height: "78%",
            maxHeight: "380px",
            filter: `drop-shadow(0 20px 60px ${p[0]}55)`,
          }}
        >
          <defs>
            <linearGradient id={`fg-${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={p[0]} stopOpacity="0.95" />
              <stop offset="100%" stopColor={p[1]} stopOpacity="0.80" />
            </linearGradient>
            <linearGradient id={`lg-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={p[1]} stopOpacity="0.90" />
              <stop offset="100%" stopColor={p[0]} stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id={`sg-${id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="white" stopOpacity="0.45" />
              <stop offset="50%" stopColor="white" stopOpacity="0.75" />
              <stop offset="100%" stopColor="white" stopOpacity="0.40" />
            </linearGradient>
          </defs>

          {/* head */}
          <ellipse cx="80" cy="22" rx="18" ry="21" fill={`url(#sg-${id})`} />
          <ellipse
            cx="80"
            cy="22"
            rx="17"
            ry="20"
            fill={`url(#fg-${id})`}
            opacity="0.6"
          />

          {/* neck */}
          <path
            d="M72 41 C72 46 88 46 88 41 L88 52 C88 56 72 56 72 52 Z"
            fill={`url(#fg-${id})`}
            opacity="0.75"
          />

          {/* choli / blouse — fitted bodice */}
          <path
            d="M36 56 C24 60 18 70 20 82 C22 92 30 98 36 102 C48 108 60 110 72 112 L88 112 C100 110 112 108 124 102 C130 98 138 92 140 82 C142 70 136 60 124 56 C114 52 100 50 80 50 C60 50 46 52 36 56 Z"
            fill={`url(#fg-${id})`}
          />

          {/* dupatta drape over shoulder — left */}
          <path
            d="M36 56 C28 62 22 72 20 84 C18 96 22 116 26 132 L34 148 C30 134 24 114 26 98 C28 82 34 70 40 62 Z"
            fill={`url(#lg-${id})`}
            opacity="0.55"
          />

          {/* waistband */}
          <path
            d="M48 112 C56 116 68 118 80 118 C92 118 104 116 112 112 L116 124 C108 130 96 134 80 134 C64 134 52 130 44 124 Z"
            fill={`url(#fg-${id})`}
            opacity="0.85"
          />

          {/* lehenga skirt — full flared */}
          <path
            d="M44 124 C36 132 24 150 16 172 C8 196 6 224 8 252 C10 276 16 298 22 316 L34 348 C30 324 24 298 22 272 C20 248 22 220 28 198 C34 178 44 158 52 144 Z"
            fill={`url(#lg-${id})`}
            opacity="0.80"
          />
          <path
            d="M116 124 C124 132 136 150 144 172 C152 196 154 224 152 252 C150 276 144 298 138 316 L126 348 C130 324 136 298 138 272 C140 248 138 220 132 198 C126 178 116 158 108 144 Z"
            fill={`url(#lg-${id})`}
            opacity="0.80"
          />
          {/* skirt front panel */}
          <path
            d="M52 144 C44 160 38 184 36 210 C34 238 38 268 44 294 C50 316 58 334 64 348 L96 348 C102 334 110 316 116 294 C122 268 126 238 124 210 C122 184 116 160 108 144 C100 136 92 132 80 132 C68 132 60 136 52 144 Z"
            fill={`url(#fg-${id})`}
            opacity="0.90"
          />

          {/* skirt embroidery hem line */}
          <path
            d="M22 316 C40 332 60 344 80 346 C100 344 120 332 138 316"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
            opacity="0.45"
            strokeDasharray="4 3"
          />

          {/* legs */}
          <path
            d="M64 348 L58 420 M96 348 L102 420"
            stroke={`url(#fg-${id})`}
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* dupatta flowing right */}
          <path
            d="M112 60 C124 72 132 90 136 110 C140 132 138 158 134 180 L128 198 C132 174 134 148 130 126 C126 106 118 86 108 68 Z"
            fill={`url(#lg-${id})`}
            opacity="0.50"
          />

          {/* highlight sheen on skirt */}
          <path
            d="M72 144 C68 170 66 200 68 232 C70 260 76 290 82 312"
            stroke="white"
            strokeWidth="2.5"
            fill="none"
            opacity="0.30"
            strokeLinecap="round"
          />

          {/* jewellery — necklace dots */}
          <circle cx="80" cy="58" r="2" fill="white" opacity="0.8" />
          <circle cx="72" cy="62" r="1.5" fill="white" opacity="0.65" />
          <circle cx="88" cy="62" r="1.5" fill="white" opacity="0.65" />
          <circle cx="65" cy="68" r="1.2" fill="white" opacity="0.50" />
          <circle cx="95" cy="68" r="1.2" fill="white" opacity="0.50" />
        </svg>
      </div>

      {/* bottom gradient fade — content appears over this */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: `linear-gradient(to top, rgba(245,237,228,1) 0%, rgba(245,237,228,0.85) 30%, transparent 100%)`,
        }}
      />
    </div>
  );
};

/* ─── Thumbnail card ─── */
const ThumbCard = ({ outfit, active, saved, onSelect, onSave }) => {
  const gradBg = {
    background: "linear-gradient(135deg,#78081C 0%,#FF6F91 50%,#D65DB1 100%)",
  };
  return (
    <div
      onClick={onSelect}
      className={`flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2
        ${active ? "border-[#FF6F91] -translate-y-1" : "border-transparent hover:border-[rgba(255,111,145,0.4)] hover:-translate-y-0.5"}`}
      style={{
        width: "110px",
        boxShadow: active
          ? "0 12px 36px rgba(120,8,28,0.22)"
          : "0 3px 14px rgba(180,120,100,0.13)",
      }}
    >
      {/* mini preview */}
      <div className="relative" style={{ height: "120px" }}>
        <div
          className="w-full h-full"
          style={{
            background: `linear-gradient(145deg, ${outfit.palette[0]}25, ${outfit.palette[1]}40, ${outfit.palette[2]}25)`,
          }}
        >
          <svg
            className="w-full h-full opacity-25"
            viewBox="0 0 110 120"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern
                id={`tp-${outfit.id}`}
                width="16"
                height="16"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(30)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="16"
                  stroke={outfit.palette[0]}
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="110" height="120" fill={`url(#tp-${outfit.id})`} />
          </svg>
          {/* mini silhouette */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 40 100"
              fill="none"
              style={{ width: "36px", height: "72px" }}
            >
              <ellipse
                cx="20"
                cy="8"
                rx="7"
                ry="8"
                fill={outfit.palette[0]}
                opacity="0.8"
              />
              <path
                d="M13 16 C9 18 6 23 7 30 C8 36 12 39 15 41 C13 46 10 52 10 60 C10 72 14 82 18 88 L22 88 C26 82 30 72 30 60 C30 52 27 46 25 41 C28 39 32 36 33 30 C34 23 31 18 27 16 C24 14 20 14 20 14 C20 14 16 14 13 16 Z"
                fill={outfit.palette[0]}
                opacity="0.7"
              />
              <path
                d="M18 88 L16 100 M22 88 L24 100"
                stroke={outfit.palette[0]}
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.7"
              />
            </svg>
          </div>
        </div>
        {/* match badge */}
        <div
          className="absolute top-1.5 left-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white"
          style={gradBg}
        >
          {outfit.match}%
        </div>
        {/* save */}
        <button
          className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs border transition-all duration-200
            ${saved ? "bg-[#FF6F91] border-[#FF6F91] text-white" : "bg-white/80 border-white/60 text-[#9A9A9A]"}`}
          onClick={(e) => {
            e.stopPropagation();
            onSave();
          }}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>
      {/* label */}
      <div className="px-2 py-2 bg-white/90 backdrop-blur-sm">
        <p className="text-[10px] font-bold text-[#3a3a3a] leading-tight truncate">
          {outfit.title}
        </p>
        <div className="flex gap-1 mt-1.5">
          {outfit.palette.slice(0, 3).map((c) => (
            <div
              key={c}
              className="w-3.5 h-3.5 rounded-full border border-white/70 shadow-sm"
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function ViewOutfitPage() {
  const userProfile = {
    event: "Barat",
    style: "Traditional",
    gender: "Female",
    season: "Winter",
    height: 165,
    skinTone: "Medium",
    bodyType: "Hourglass",
  };

  const [activeId, setActiveId] = useState(1);
  const [saved, setSaved] = useState([]);
  const [activeTab, setActiveTab] = useState("outfit");
  const [showProfile, setShowProfile] = useState(false);

  const active = mockOutfits.find((o) => o.id === activeId);
  const toggleSave = (id) =>
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const gradBg = {
    background: "linear-gradient(135deg,#78081C 0%,#FF6F91 50%,#D65DB1 100%)",
  };
  const gradText = {
    background: "linear-gradient(135deg,#78081C,#D65DB1)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };
  const glass = {
    background: "rgba(255,255,255,0.72)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 8px 40px rgba(180,120,100,0.10)",
  };

  return (
    <div className="h-auto w-full absolute bg-[#F5EDE4] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,700;1,900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family:'DM Sans',sans-serif; }
        .font-playfair { font-family:'Playfair Display',serif !important; }

        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes heroIn  { from{opacity:0;transform:scale(1.03)} to{opacity:1;transform:scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }

        .fade-up  { animation: fadeUp  0.5s ease both; }
        .fade-in  { animation: fadeIn  0.35s ease both; }
        .hero-in  { animation: heroIn  0.6s cubic-bezier(.25,.8,.25,1) both; }
        .slide-up { animation: slideUp 0.55s cubic-bezier(.25,.8,.25,1) both; }

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
        .piece-row:hover { background:rgba(255,111,145,0.05); border-radius:12px; }
        .save-btn { transition:all 0.2s cubic-bezier(.34,1.56,.64,1); }
        .save-btn:hover { transform:scale(1.12); }
        .match-ring {
          background: conic-gradient(#FF6F91 0% var(--pct), rgba(220,195,170,0.3) var(--pct) 100%);
        }
        ::-webkit-scrollbar { display:none; }
      `}</style>

      {/* blobs */}
      <div
        className="fixed -top-20 -right-20 w-96 h-96 rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse,rgba(220,195,170,0.5) 0%,transparent 65%)",
        }}
      />
      <div
        className="fixed -bottom-16 -left-16 w-80 h-80 rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse,rgba(201,168,124,0.2) 0%,transparent 65%)",
        }}
      />

      {/* ════════════════════════════════════════
          FLOATING TOPBAR — sits above hero
      ════════════════════════════════════════ */}
      <div className="relative z-20 flex items-center justify-between px-5 py-25">
        <Link
          to="/create-outfit"
          className="flex items-center gap-2 no-underline"
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
            style={{
              background: "rgba(255,255,255,0.85)",
              color: "#78081C",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 12px rgba(120,8,28,0.12)",
            }}
          >
            ←
          </div>
          <span className="text-[13px] font-semibold text-[#78081C]">Edit</span>
        </Link>

        <span
          className="font-playfair italic font-bold text-lg"
          style={gradText}
        >
          Perfect Outfit
        </span>

        <button
          onClick={() => setShowProfile((p) => !p)}
          className="flex items-center gap-2 rounded-full px-3 py-1.5 border"
          style={{
            background: "rgba(255,255,255,0.85)",
            borderColor: "rgba(220,195,170,0.5)",
            backdropFilter: "blur(8px)",
          }}
        >
          {userProfile.skinTone && (
            <span
              className="w-3.5 h-3.5 rounded-full border border-white/60"
              style={{ background: skinToneColors[userProfile.skinTone] }}
            />
          )}
          <span className="text-[11px] font-semibold text-[#4b4949]">
            {userProfile.event}
          </span>
          <span className="text-[9px] text-[#9A9A9A]">▾</span>
        </button>
      </div>

      {/* profile popover */}
      {showProfile && (
        <div
          className="relative z-20 mx-4 mb-3 rounded-2xl p-4 border border-white/75 fade-in"
          style={glass}
        >
          <p className="text-[10px] font-bold tracking-[0.13em] uppercase text-[#961e32] mb-2.5">
            Your Profile
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: userProfile.event, icon: "🎉" },
              { label: userProfile.style, icon: "✨" },
              { label: userProfile.gender, icon: "👤" },
              { label: userProfile.season, icon: "🌿" },
              { label: `${userProfile.height}cm`, icon: "📏" },
              userProfile.skinTone && {
                label: userProfile.skinTone,
                icon: "🎨",
              },
              userProfile.bodyType && {
                label: userProfile.bodyType,
                icon: "👗",
              },
            ]
              .filter(Boolean)
              .map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold text-[#78081C] bg-white/80 border border-[rgba(220,195,170,0.5)]"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          FULL-WIDTH HERO PREVIEW
          — tall, edge-to-edge, no horizontal padding
      ════════════════════════════════════════ */}
      {active && (
        <div
          className="relative z-10 hero-in"
          key={`hero-${active.id}`}
          style={{ marginTop: "-64px" /* pull up behind topbar */ }}
        >
          {/* THE FULL-WIDTH PREVIEW — full width, tall */}
          <div
            className="w-full relative"
            style={{ height: "72vh", minHeight: "420px", maxHeight: "620px" }}
          >
            <OutfitHero outfit={active} />

            {/* match ring — bottom right corner */}
            <div className="absolute bottom-44 right-5 z-10">
              <div
                className="match-ring w-14 h-14 rounded-full p-[3px]"
                style={{ "--pct": `${active.match}%` }}
              >
                <div className="w-full h-full rounded-full bg-white/95 flex flex-col items-center justify-center">
                  <span className="text-[13px] font-black text-[#78081C] leading-none">
                    {active.match}%
                  </span>
                  <span className="text-[7px] font-semibold text-[#9A9A9A] uppercase tracking-wide">
                    match
                  </span>
                </div>
              </div>
            </div>

            {/* tags — top left (below topbar) */}
            <div className="absolute top-20 left-5 flex gap-1.5 z-10">
              {active.tags.map((tag) => (
                <div
                  key={tag}
                  className="rounded-full px-2.5 py-1 text-[10px] font-bold text-white"
                  style={gradBg}
                >
                  {tag}
                </div>
              ))}
            </div>

            {/* save + share — top right (below topbar) */}
            <div className="absolute top-20 right-5 flex gap-2 z-10">
              <button
                className={`save-btn w-9 h-9 rounded-2xl flex items-center justify-center text-base border-2 backdrop-blur-sm
                  ${saved.includes(active.id) ? "bg-[#FF6F91] border-[#FF6F91] text-white" : "bg-white/80 border-white/60 text-[#9A9A9A]"}`}
                onClick={() => toggleSave(active.id)}
              >
                {saved.includes(active.id) ? "♥" : "♡"}
              </button>
              <button className="w-9 h-9 rounded-2xl flex items-center justify-center text-base bg-white/80 border-2 border-white/60 text-[#9A9A9A] backdrop-blur-sm">
                ↗
              </button>
            </div>

            {/* outfit name overlay — bottom, over fade */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 z-10">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="font-playfair italic font-bold text-[26px] text-[#3a3a3a] leading-tight">
                    {active.title}
                  </h2>
                  <p className="text-[13px] text-[#78081C] font-semibold mt-0.5">
                    {active.subtitle}
                  </p>
                  {/* palette dots */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex gap-1.5">
                      {active.palette.map((c) => (
                        <div
                          key={c}
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {/* meta chips */}
                <div className="flex flex-col gap-1.5 items-end">
                  <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold text-[#78081C] bg-white/85 border border-[rgba(220,195,170,0.5)]">
                    🎉 {active.occasion}
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold text-[#78081C] bg-white/85 border border-[rgba(220,195,170,0.5)]">
                    🧵 {active.fabric}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          THUMBNAIL CAROUSEL
      ════════════════════════════════════════ */}
      <div
        className="relative z-10 px-5 mb-5 slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        <p className="text-[10px] font-bold tracking-[0.13em] uppercase text-[#961e32] mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6F91] animate-pulse inline-block" />
          {mockOutfits.length} outfits matched
        </p>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {mockOutfits.map((outfit) => (
            <ThumbCard
              key={outfit.id}
              outfit={outfit}
              active={activeId === outfit.id}
              saved={saved.includes(outfit.id)}
              onSelect={() => setActiveId(outfit.id)}
              onSave={() => toggleSave(outfit.id)}
            />
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          DETAIL CARD — tabs
      ════════════════════════════════════════ */}
      {active && (
        <div
          className="relative z-10 mx-4 mb-5 rounded-3xl overflow-hidden border border-white/75 slide-up"
          key={`detail-${active.id}`}
          style={{ ...glass, animationDelay: "0.15s" }}
        >
          {/* tabs row */}
          <div className="flex border-b border-[rgba(220,195,170,0.3)]">
            {[
              { id: "outfit", label: "Outfit Pieces" },
              { id: "stylist", label: "Stylist Note" },
              { id: "colours", label: "Colour Story" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? "act" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* tab content */}
          <div className="px-4 py-4 fade-in" key={activeTab + active.id}>
            {/* Outfit Pieces */}
            {activeTab === "outfit" && (
              <div className="space-y-0.5">
                {active.pieces.map((piece, i) => (
                  <div
                    key={i}
                    className="piece-row flex items-center gap-3 px-2 py-3 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-[12px] font-black text-white"
                      style={{
                        background: `linear-gradient(135deg,${active.palette[0]},${active.palette[1]})`,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-[#2a2a2a] leading-tight">
                        {piece.name}
                      </p>
                      <p className="text-[11px] text-[#9A9A9A] mt-0.5 leading-snug">
                        {piece.detail}
                      </p>
                    </div>
                    <span className="text-[#C8A882] text-lg font-light">›</span>
                  </div>
                ))}
              </div>
            )}

            {/* Stylist Note */}
            {activeTab === "stylist" && (
              <div
                className="rounded-2xl p-4 border border-[rgba(255,111,145,0.18)]"
                style={{ background: "rgba(255,111,145,0.04)" }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={gradBg}
                  >
                    <span className="text-white text-sm">✦</span>
                  </div>
                  <span className="text-[11px] font-black text-[#78081C] uppercase tracking-widest">
                    Stylist's Advice
                  </span>
                </div>
                <p className="font-playfair italic text-[14px] text-[#4b4949] leading-[1.85]">
                  "{active.stylistNote}"
                </p>
                <div className="mt-4 pt-3 border-t border-[rgba(255,111,145,0.12)] flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-[#9A9A9A]">
                    Matched to your
                  </span>
                  {userProfile.bodyType && (
                    <span className="text-[10px] font-bold text-[#961e32] bg-[rgba(255,111,145,0.10)] rounded-full px-2 py-0.5 border border-[rgba(255,111,145,0.22)]">
                      {userProfile.bodyType} shape
                    </span>
                  )}
                  {userProfile.skinTone && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#961e32] bg-[rgba(255,111,145,0.10)] rounded-full px-2 py-0.5 border border-[rgba(255,111,145,0.22)]">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: skinToneColors[userProfile.skinTone],
                        }}
                      />
                      {userProfile.skinTone} skin
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Colour Story */}
            {activeTab === "colours" && (
              <div className="space-y-3">
                <p className="text-[11px] text-[#9A9A9A] mb-3 leading-relaxed">
                  Colours selected to complement your skin tone and the{" "}
                  {active.occasion} vibe.
                </p>
                {active.palette.map((color, i) => {
                  const names = active.colors.split(" · ");
                  return (
                    <div key={color} className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl border-2 border-white shadow-sm flex-shrink-0"
                        style={{ background: color }}
                      />
                      <div className="flex-1">
                        <p className="text-[12px] font-semibold text-[#2a2a2a]">
                          {names[i] ?? `Accent ${i + 1}`}
                        </p>
                        <p className="text-[10px] text-[#9A9A9A] font-mono">
                          {color.toUpperCase()}
                        </p>
                      </div>
                      <div className="w-16 h-1.5 rounded-full bg-[rgba(220,195,170,0.3)] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${[55, 25, 15, 5][i] ?? 10}%`,
                            background: color,
                          }}
                        />
                      </div>
                      <span className="text-[9px] text-[#9A9A9A] w-6 text-right">
                        {[55, 25, 15, 5][i] ?? 10}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          STYLING TIPS
      ════════════════════════════════════════ */}
      <div
        className="relative z-10 mx-4 mb-5 rounded-3xl p-4 border border-white/75 slide-up"
        style={{ ...glass, animationDelay: "0.2s" }}
      >
        <p className="text-[10px] font-bold tracking-[0.13em] uppercase text-[#961e32] mb-3">
          Styling Tips
        </p>
        <div className="space-y-2">
          {[
            {
              icon: "💡",
              tip: `For ${userProfile.event}, opt for rich fabrics like silk or velvet.`,
            },
            {
              icon: "👟",
              tip: `At ${userProfile.height}cm, embroidered platforms add a perfect finish.`,
            },
            {
              icon: "💎",
              tip: `${userProfile.skinTone} skin tones glow in jewel tones and antique gold.`,
            },
          ].map((t, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 px-2 py-2 rounded-xl hover:bg-[rgba(255,111,145,0.05)] transition-colors"
            >
              <span className="text-sm flex-shrink-0 mt-0.5">{t.icon}</span>
              <p className="text-[12px] text-[#4b4949] leading-snug">{t.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          SAVED BAR
      ════════════════════════════════════════ */}
      {saved.length > 0 && (
        <div className="relative z-10 mx-4 mb-5 fade-up">
          <p className="text-[10px] font-bold tracking-[0.13em] uppercase text-[#961e32] mb-2">
            Saved ({saved.length})
          </p>
          <div className="flex gap-2 flex-wrap">
            {mockOutfits
              .filter((o) => saved.includes(o.id))
              .map((o) => (
                <div
                  key={o.id}
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 border border-[rgba(255,111,145,0.28)] bg-white/70 cursor-pointer hover:border-[#FF6F91] transition-all"
                  onClick={() => setActiveId(o.id)}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: o.palette[0] }}
                  />
                  <span className="text-[11px] font-semibold text-[#78081C]">
                    {o.title}
                  </span>
                  <button
                    className="text-[#9A9A9A] text-xs hover:text-[#FF6F91]"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(o.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          CTA FOOTER
      ════════════════════════════════════════ */}
      <div
        className="relative z-10 mx-4 mb-10 slide-up"
        style={{ animationDelay: "0.25s" }}
      >
        <div className="flex gap-3">
          <Link to="/create-outfit" className="flex-1 no-underline">
            <button className="w-full py-4 rounded-full text-sm font-bold border-2 border-[rgba(120,8,28,0.22)] bg-white/70 text-[#78081C] hover:bg-[rgba(255,111,145,0.08)] hover:border-[#FF6F91] transition-all">
              ← Regenerate
            </button>
          </Link>
          <button
            className="flex-1 py-4 rounded-full text-white text-sm font-bold hover:-translate-y-0.5 transition-all"
            style={{
              ...gradBg,
              boxShadow: "0 10px 32px rgba(255,111,145,0.38)",
            }}
            onClick={() => alert("Sharing your outfit... 🌸")}
          >
            Share Look ↗
          </button>
        </div>
      </div>
    </div>
  );
}
