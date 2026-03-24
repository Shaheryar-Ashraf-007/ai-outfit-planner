import { useState, useRef } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────
   Body Shape SVGs — Reference-image style
   Thin black line-art + pink geometric shape bg
   ViewBox: 100 × 160
───────────────────────────────────────────── */
const PK = "#F4ADBF"; // pink fill
const PKS = "#E87FA0"; // pink stroke
const SK = "#1a1a1a"; // body outline
const SW = "1.6"; // stroke width
const BG = "white"; // card bg

/* ════════════ FEMALE SHAPES ════════════ */

/* Hourglass — hourglass pink bg shape */
const FemaleHourglass = () => <img src="/public/fbody1.png" />;

/* Pear — triangle pointing down */
const FemalePear = () => (
  <img src="/public/fbody2.png" className="h-[180px] w-full" />
);

/* Apple — circle/oval in mid */
const FemaleApple = () => (
  <img src="/public/fbody3.png" className="h-[180px] w-full" />
);

/* Rectangle — rectangle pink bg */
const FemaleRectangle = () => (
  <img src="/public/fbody4.png" className="h-[180px] w-full" />
);

/* Inv. Triangle — inverted triangle */
const FemaleInvTriangle = () => (
  <img src="/public/fbody5.png" className="h-[180px] w-full" />
);

/* Petite — small hourglass with flower */
const FemalePetite = () => (
      <img src="/public/fbody6.png" className="h-[180px] w-full" />

  
);

/* ════════════ MALE SHAPES ════════════ */

/* Trapezoid — classic broad-shoulders male */
const MaleTrapezoid = () => (
    <img src="/public/mbody1.png" className="h-[180px] w-full" />

  
);

/* Athletic Rectangle — even chest and hips, defined */
const MaleAthleticRect = () => (
    <img src="/public/mbody2.png" className="h-[180px] w-full" />

  
);

/* Oval — circle belly */
const MaleOval = () => (
    <img src="/public/mbody3.png" className="h-[180px] w-full" />

  
);

/* Inverted Triangle — strong V-taper */
const MaleInvTriangle = () => (
    <img src="/public/mbody4.png" className="h-[180px] w-full" />

  
);

/* Rectangle male — straight profile */
const MaleRectangle = () => (
    <img src="/public/mbody5.png" className="h-[180px] w-full" />  
);

/* Compact male — smaller stature with flower */
const MaleCompact = () => (
    <img src="/public/mbody6.png" className="h-[180px] w-full" />  

  
);

/* ─── data arrays ─── */
const femaleBodyTypes = [
  {
    label: "Hourglass",
    desc: "Balanced bust & hips",
    Illustration: FemaleHourglass,
  },
  { label: "Pear", desc: "Wider hips & thighs", Illustration: FemalePear },
  { label: "Apple", desc: "Fuller midsection", Illustration: FemaleApple },
  {
    label: "Rectangle",
    desc: "Straight silhouette",
    Illustration: FemaleRectangle,
  },
  {
    label: "Inv. Triangle",
    desc: "Broader shoulders",
    Illustration: FemaleInvTriangle,
  },
  { label: "Petite", desc: "Smaller frame", Illustration: FemalePetite },
];

const maleBodyTypes = [
  {
    label: "Trapezoid",
    desc: "Broader shoulders, tapering waist",
    Illustration: MaleTrapezoid,
  },
  {
    label: "Athletic",
    desc: "Even chest and hips, defined",
    Illustration: MaleAthleticRect,
  },
  { label: "Oval", desc: "Fuller midsection", Illustration: MaleOval },
  {
    label: "Inv. Triangle",
    desc: "Strong V-taper",
    Illustration: MaleInvTriangle,
  },
  {
    label: "Rectangle",
    desc: "Straight profile, less taper",
    Illustration: MaleRectangle,
  },
  {
    label: "Compact",
    desc: "Smaller overall stature",
    Illustration: MaleCompact,
  },
];

/* ─────────────────────────────────────────────
   Other data
───────────────────────────────────────────── */
const events = [
  { label: "Mayo", emoji: "🌿" },
  { label: "Dholki", emoji: "🥁" },
  { label: "Engagement", emoji: "💍" },
  { label: "Nikkah", emoji: "🕌" },
  { label: "Mehndi", emoji: "🌸" },
  { label: "Barat", emoji: "👰" },
  { label: "Walima", emoji: "🌹" },
  { label: "Qawali Night", emoji: "🎶" },
  { label: "Culture Day", emoji: "🏵️" },
  { label: "Chand Raat", emoji: "🌙" },
  { label: "Eid", emoji: "✨" },
  { label: "Gym", emoji: "💪" },
  { label: "Interview", emoji: "💼" },
  { label: "Friends Gathering", emoji: "🥂" },
  { label: "Bridal Shower", emoji: "🎀" },
];

const stylesData = [
  { label: "Traditional", icon: "🪡" },
  { label: "Fusion", icon: "🎨" },
  { label: "Western", icon: "👗" },
  { label: "Formal", icon: "🎩" },
  { label: "Casual", icon: "👕" },
  { label: "Streetwear", icon: "🧢" },
  { label: "Modest", icon: "🌿" },
  { label: "Glam", icon: "💎" },
];

const seasons = [
  { label: "Spring", icon: "🌸" },
  { label: "Summer", icon: "☀️" },
  { label: "Autumn", icon: "🍂" },
  { label: "Winter", icon: "❄️" },
];

const genders = [
  { label: "Female", icon: "👩" },
  { label: "Male", icon: "👨" },
  { label: "Other", icon: "🌈" },
];

const skinTones = [
  { label: "Fair", color: "#FDDBB4" },
  { label: "Light", color: "#F0B27A" },
  { label: "Medium", color: "#D4915A" },
  { label: "Olive", color: "#C07A3A" },
  { label: "Tan", color: "#A0612A" },
  { label: "Deep", color: "#6B3A1F" },
];

const heightCategories = [
  { label: "Petite", min: 140, max: 158 },
  { label: "Average", min: 158, max: 175 },
  { label: "Tall", min: 175, max: 190 },
  { label: "Very Tall", min: 190, max: 211 },
];

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function CreateOutfitPage() {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [event, setEvent] = useState(null);
  const [style, setStyle] = useState(null);
  const [gender, setGender] = useState(null);
  const [season, setSeason] = useState(null);
  const [height, setHeight] = useState(160);
  const [skinTone, setSkinTone] = useState(null);
  const [bodyType, setBodyType] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [step, setStep] = useState(1);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const canProceed =
    step === 1 ? true : step === 2 ? !!event : !!(style && gender && season);

  const filled = [event, style, gender, season].filter(Boolean).length;
  const progress = ((filled + (photo ? 1 : 0)) / 5) * 100;

  const heightPct = ((height - 140) / (210 - 140)) * 100;
  const activeCategory = heightCategories.find(
    (c) => height >= c.min && height < c.max,
  )?.label;

  // pick body type list based on selected gender (default female for Other)
  const bodyTypeList = gender === "Male" ? maleBodyTypes : femaleBodyTypes;

  /* shared style objects */
  const gradBg = {
    background: "linear-gradient(135deg,#78081C 0%,#FF6F91 50%,#D65DB1 100%)",
  };
  const gradText = {
    background: "linear-gradient(135deg,#78081C,#D65DB1)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };
  const glass = {
    background: "rgba(255,255,255,0.68)",
    backdropFilter: "blur(16px)",
    boxShadow: "0 8px 40px rgba(180,120,100,0.10)",
  };
  const chipSel = { ...gradBg, boxShadow: "0 6px 20px rgba(255,111,145,0.35)" };
  const cardSel = {
    background:
      "linear-gradient(135deg,rgba(120,8,28,0.92),rgba(255,111,145,0.92) 60%,rgba(214,93,177,0.92))",
    boxShadow: "0 8px 24px rgba(255,111,145,0.35)",
  };

  const SectionLabel = ({ children, optional }) => (
    <div className="flex items-center gap-2 mb-3">
      <p className="text-[11px] font-bold tracking-[0.13em] uppercase text-[#961e32] m-0">
        {children}
      </p>
      {optional && (
        <span className="text-[10px] font-semibold text-[#9A9A9A]">
          (optional)
        </span>
      )}
    </div>
  );

  const StepBadge = ({ n }) => (
    <div
      className="inline-flex items-center gap-2 rounded-full px-4 py-[5px] mb-4 border"
      style={{
        background: "rgba(255,111,145,0.10)",
        borderColor: "rgba(255,111,145,0.28)",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6F91] animate-pulse" />
      <span className="text-[10px] font-bold tracking-[0.13em] uppercase text-[#961e32]">
        Step {n} of 3
      </span>
    </div>
  );

  const StepHeading = ({ children }) => (
    <h1
      className="font-playfair italic font-black leading-tight mb-3"
      style={{ fontSize: "clamp(28px,6vw,42px)", ...gradText }}
    >
      {children}
    </h1>
  );

  return (
    <div className="h-auto bg-[#F5EDE4] overflow-x-hidden absolute w-full">
    
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700;1,900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .font-playfair { font-family: 'Playfair Display', serif !important; }
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulseRing {
          0%   { box-shadow:0 0 0 0 rgba(255,111,145,0.5); }
          70%  { box-shadow:0 0 0 12px rgba(255,111,145,0); }
          100% { box-shadow:0 0 0 0 rgba(255,111,145,0); }
        }
        .anim { animation: fadeSlideUp 0.5s ease both; }
        input[type=range] {
          -webkit-appearance:none; appearance:none;
          height:6px; border-radius:999px; outline:none; cursor:pointer; width:100%;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance:none;
          width:22px; height:22px; border-radius:50%;
          background:linear-gradient(135deg,#78081C,#FF6F91);
          cursor:pointer;
          box-shadow:0 2px 10px rgba(255,111,145,0.5);
          animation:pulseRing 2s infinite;
        }
      `}</style>

      {/* blobs */}
      <div
        className="fixed -top-20 -right-20 w-[420px] h-[420px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse,rgba(220,195,170,0.55) 0%,transparent 65%)",
        }}
      />
      <div
        className="fixed -bottom-16 -left-16 w-[360px] h-[360px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse,rgba(201,168,124,0.22) 0%,transparent 65%)",
        }}
      />
      <div
        className="fixed top-[40%] right-[5%] w-[220px] h-[220px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse,rgba(255,111,145,0.10) 0%,transparent 70%)",
        }}
      />

      {/* ── Topbar ── */}
      <div className="relative z-10 flex items-center justify-between px-6 mt-25">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
            style={{
              ...gradBg,
              boxShadow: "0 4px 14px rgba(255,111,145,0.35)",
            }}
          >
            ✨
          </div>
          <span
            className="font-playfair italic font-bold text-lg"
            style={gradText}
          >
            Perfect Outfit
          </span>
        </Link>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: step === s ? "24px" : "8px",
                background:
                  step === s
                    ? "linear-gradient(90deg,#78081C,#FF6F91)"
                    : step > s
                      ? "#FF6F91"
                      : "rgba(220,195,170,0.5)",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Progress ── */}
      <div className="relative z-10 px-6 mt-4">
        <div className="h-1 rounded-full bg-[rgba(220,195,170,0.4)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg,#78081C,#FF6F91,#D65DB1)",
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] text-[#9A9A9A]">
            {Math.round(progress)}% complete
          </span>
          <span className="text-[11px] text-[#9A9A9A]">Step {step} of 3</span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-xl mx-auto px-5 pt-6 pb-20">
        {/* ═══════════ STEP 1 — Photo ═══════════ */}
        {step === 1 && (
          <div className="anim">
            <div className="text-center mb-8">
              <StepBadge n={1} />
              <StepHeading>Upload Your Photo</StepHeading>
              <p className="text-[#4b4949] text-sm leading-[1.8] max-w-sm mx-auto">
                A front-facing photo gives the best results — but you can skip
                and choose your details manually ✨
              </p>
            </div>

            <div
              className={`relative rounded-3xl border-2 border-dashed overflow-hidden cursor-pointer transition-all duration-300 min-h-[260px] flex items-center justify-center backdrop-blur-md
                ${
                  dragOver
                    ? "border-[#FF6F91] scale-[1.01] bg-[rgba(255,111,145,0.06)]"
                    : "border-[rgba(255,111,145,0.35)] bg-white/60 hover:border-[#FF6F91] hover:bg-[rgba(255,111,145,0.05)] hover:-translate-y-0.5"
                }`}
              onClick={() => fileRef.current.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-[260px] object-cover rounded-[22px]"
                  />
                  <div
                    className="absolute inset-0 rounded-[22px]"
                    style={{
                      background:
                        "linear-gradient(to top,rgba(120,8,28,0.55) 0%,transparent 50%)",
                    }}
                  />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 rounded-full px-4 py-2 backdrop-blur-md">
                    <span className="text-sm">📸</span>
                    <span className="text-xs font-semibold text-[#78081C]">
                      Change photo
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center px-6 py-10">
                  <div
                    className="w-[72px] h-[72px] rounded-full flex items-center justify-center mx-auto mb-5 text-3xl border border-dashed border-[rgba(255,111,145,0.4)]"
                    style={{
                      background:
                        "linear-gradient(135deg,rgba(120,8,28,0.07),rgba(255,111,145,0.14))",
                    }}
                  >
                    📸
                  </div>
                  <p className="font-bold text-base text-[#3a3a3a] mb-1.5">
                    Drop your photo here
                  </p>
                  <p className="text-[#9A9A9A] text-[13px] mb-5">
                    or click to browse · JPG, PNG, WEBP
                  </p>
                  <div
                    className="inline-flex items-center rounded-full px-6 py-2.5"
                    style={gradBg}
                  >
                    <span className="text-white text-[13px] font-bold">
                      Choose Photo
                    </span>
                  </div>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>

            <div className="flex items-center gap-2 mt-3 mb-3">
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1 border border-dashed border-[rgba(120,8,28,0.25)] bg-[rgba(120,8,28,0.04)]">
                <span className="text-[10px] font-bold tracking-[0.10em] uppercase text-[#78081C]">
                  Optional
                </span>
              </div>
              <span className="text-[12px] text-[#9A9A9A]">
                Skip this step — we'll use your details instead
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {["Good lighting 💡", "Face visible 🙂", "Front-facing 📐"].map(
                (tip) => (
                  <div
                    key={tip}
                    className="text-center text-[12px] font-medium text-[#4b4949] rounded-xl py-2.5 px-2 bg-white/65 backdrop-blur-md border border-[rgba(220,195,170,0.4)]"
                  >
                    {tip}
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* ═══════════ STEP 2 — Event ═══════════ */}
        {step === 2 && (
          <div className="anim">
            <div className="text-center mb-8">
              <StepBadge n={2} />
              <StepHeading>What's the Occasion?</StepHeading>
              <p className="text-[#4b4949] text-sm leading-[1.8]">
                Pick your event so we style you just right 🎉
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {events.map((ev) => (
                <button
                  key={ev.label}
                  onClick={() => setEvent(ev.label)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-medium border-[1.5px] transition-all duration-200 cursor-pointer whitespace-nowrap
                    ${
                      event === ev.label
                        ? "text-white border-transparent -translate-y-0.5"
                        : "text-[#4b4949] border-[rgba(220,195,170,0.5)] bg-white/70 backdrop-blur-md hover:border-[#FF6F91] hover:bg-[rgba(255,111,145,0.05)] hover:-translate-y-px"
                    }`}
                  style={event === ev.label ? chipSel : {}}
                >
                  <span className="text-base">{ev.emoji}</span>
                  {ev.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════ STEP 3 — Details ═══════════ */}
        {step === 3 && (
          <div className="anim space-y-4">
            <div className="text-center mb-8">
              <StepBadge n={3} />
              <StepHeading>Your Details</StepHeading>
              <p className="text-[#4b4949] text-sm leading-[1.8]">
                Help us personalize your recommendations ✨
              </p>
            </div>

            {/* Style */}
            <div
              className="rounded-3xl p-5 border border-white/75"
              style={glass}
            >
              <SectionLabel>Style Preference</SectionLabel>
              <div className="flex flex-wrap gap-2.5">
                {stylesData.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setStyle(s.label)}
                    className={`flex flex-col items-center gap-1.5 px-4 py-3.5 rounded-[18px] border-[1.5px] cursor-pointer transition-all duration-200 min-w-[80px]
                      ${
                        style === s.label
                          ? "border-transparent text-white -translate-y-0.5"
                          : "border-[rgba(220,195,170,0.5)] bg-white/70 hover:border-[#FF6F91] hover:-translate-y-0.5"
                      }`}
                    style={style === s.label ? cardSel : {}}
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <span
                      className={`text-[12px] font-semibold ${style === s.label ? "text-white" : "text-[#4b4949]"}`}
                    >
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div
              className="rounded-3xl p-5 border border-white/75"
              style={glass}
            >
              <SectionLabel>Gender</SectionLabel>
              <div className="flex gap-3">
                {genders.map((g) => (
                  <button
                    key={g.label}
                    onClick={() => {
                      setGender(g.label);
                      setBodyType(null);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-[1.5px] text-sm font-semibold cursor-pointer transition-all duration-200
                      ${
                        gender === g.label
                          ? "border-transparent text-white"
                          : "border-[rgba(220,195,170,0.5)] bg-white/70 text-[#4b4949] hover:border-[#FF6F91] hover:bg-[rgba(255,111,145,0.05)]"
                      }`}
                    style={gender === g.label ? chipSel : {}}
                  >
                    <span className="text-lg">{g.icon}</span>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Tone */}
            <div
              className="rounded-3xl p-5 border border-white/75"
              style={glass}
            >
              <SectionLabel optional>Skin Tone</SectionLabel>
              <div className="flex gap-3 flex-wrap">
                {skinTones.map((t) => (
                  <button
                    key={t.label}
                    onClick={() =>
                      setSkinTone(skinTone === t.label ? null : t.label)
                    }
                    className="flex flex-col items-center gap-2 cursor-pointer transition-all duration-200"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl transition-all duration-200 border-[2.5px] flex items-center justify-center
                      ${skinTone === t.label ? "border-[#78081C] scale-110 shadow-lg" : "border-transparent hover:border-[#FF6F91] hover:scale-105"}`}
                      style={{ background: t.color }}
                    >
                      {skinTone === t.label && (
                        <span className="text-white text-sm font-bold drop-shadow">
                          ✓
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-semibold ${skinTone === t.label ? "text-[#78081C]" : "text-[#9A9A9A]"}`}
                    >
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Body Type */}
            <div
              className="rounded-3xl p-5 border border-white/75"
              style={glass}
            >
              <SectionLabel optional>Body Type</SectionLabel>

              {/* gender hint */}
              {!gender && (
                <p className="text-[12px] text-[#9A9A9A] mb-3 bg-[rgba(220,195,170,0.2)] rounded-xl px-3 py-2">
                  👆 Select your gender above to see matching body shapes
                </p>
              )}

              {gender && (
                <div className="mb-4">
                  <p
                    className="text-[10px] font-black tracking-[0.14em] uppercase mb-3"
                    style={{ color: "#78081C" }}
                  >
                    {gender === "Male"
                      ? "Male Body Shapes"
                      : "Female Body Shapes"}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                {bodyTypeList.map((b) => {
                  const { Illustration } = b;
                  const selected = bodyType === b.label;
                  return (
                    <button
                      key={b.label}
                      onClick={() => setBodyType(selected ? null : b.label)}
                      className={`flex flex-col items-center gap-0 rounded-2xl border-2 cursor-pointer transition-all duration-200 overflow-hidden bg-white
                        ${
                          selected
                            ? "border-[#E87FA0] -translate-y-1"
                            : "border-[rgba(220,195,170,0.45)] hover:border-[#F4ADBF] hover:-translate-y-0.5"
                        }`}
                      style={
                        selected
                          ? { boxShadow: "0 8px 28px rgba(232,127,160,0.30)" }
                          : { boxShadow: "0 2px 10px rgba(180,120,100,0.08)" }
                      }
                    >
                      {/* illustration area */}
                      <div
                        className="w-full flex items-center justify-center rounded-t-2xl transition-colors duration-200"
                        style={{
                          height: "132px",
                          background: selected
                            ? "rgba(255,245,248,1)"
                            : "#ffffff",
                        }}
                      >
                        <div style={{ width: "72px", height: "116px" }}>
                          <Illustration />
                        </div>
                      </div>

                      {/* label area */}
                      <div className="w-full px-2 py-2.5 text-center border-t border-[rgba(220,195,170,0.3)]">
                        <p
                          className="text-[12px] font-black leading-tight mb-0.5"
                          style={{ color: selected ? "#78081C" : "#2a2a2a" }}
                        >
                          {b.label}
                        </p>
                        <p
                          className="text-[10px] leading-tight"
                          style={{ color: selected ? "#961e32" : "#9A9A9A" }}
                        >
                          {b.desc}
                        </p>
                        {selected && (
                          <div
                            className="mt-1.5 mx-auto w-5 h-5 rounded-full flex items-center justify-center"
                            style={gradBg}
                          >
                            <span className="text-white text-[10px] font-bold">
                              ✓
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Season */}
            <div
              className="rounded-3xl p-5 border border-white/75"
              style={glass}
            >
              <SectionLabel>Season</SectionLabel>
              <div className="flex gap-2.5">
                {seasons.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSeason(s.label)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-2xl border-[1.5px] cursor-pointer text-center transition-all duration-200
                      ${
                        season === s.label
                          ? "border-[#FF6F91] -translate-y-0.5"
                          : "border-[rgba(220,195,170,0.5)] bg-white/65 hover:border-[#FF6F91] hover:-translate-y-px"
                      }`}
                    style={
                      season === s.label
                        ? {
                            background:
                              "linear-gradient(135deg,rgba(120,8,28,0.07),rgba(255,111,145,0.12))",
                            boxShadow: "0 6px 20px rgba(255,111,145,0.18)",
                          }
                        : {}
                    }
                  >
                    <span className="text-[22px]">{s.icon}</span>
                    <span className="text-[12px] font-semibold text-[#4b4949]">
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Height */}
            <div
              className="rounded-3xl p-5 border border-white/75"
              style={glass}
            >
              <div className="flex items-center justify-between mb-4">
                <SectionLabel>Height</SectionLabel>
                <div className="rounded-full px-4 py-1 -mt-3" style={gradBg}>
                  <span className="text-[13px] font-bold text-white">
                    {height} cm
                  </span>
                </div>
              </div>
              <input
                type="range"
                min={140}
                max={210}
                value={height}
                style={{
                  background: `linear-gradient(to right,#FF6F91 0%,#FF6F91 ${heightPct}%,rgba(220,195,170,0.4) ${heightPct}%,rgba(220,195,170,0.4) 100%)`,
                }}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
              <div className="flex justify-between mt-1.5 mb-3">
                <span className="text-[11px] text-[#9A9A9A]">140 cm</span>
                <span className="text-[11px] text-[#9A9A9A]">210 cm</span>
              </div>
              <div className="flex gap-2">
                {heightCategories.map((cat) => (
                  <div
                    key={cat.label}
                    className={`flex-1 text-center py-1.5 px-1 rounded-xl text-[11px] font-semibold transition-all duration-200 border
                      ${
                        activeCategory === cat.label
                          ? "text-[#78081C] border-[rgba(255,111,145,0.35)] bg-[rgba(255,111,145,0.12)]"
                          : "text-[#9A9A9A] border-transparent bg-[rgba(220,195,170,0.2)]"
                      }`}
                  >
                    {cat.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="flex gap-3 mt-8 items-center">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-6 py-3.5 rounded-full border-[1.5px] border-[rgba(220,195,170,0.6)] bg-transparent text-[#78081C] text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-[rgba(255,111,145,0.07)] hover:border-[#FF6F91]"
            >
              ← Back
            </button>
          )}
          {step < 3 ? (
            <button
              disabled={!canProceed}
              onClick={() => setStep((s) => s + 1)}
              className="flex-1 py-3.5 rounded-full text-white text-sm font-bold cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                ...gradBg,
                boxShadow: canProceed
                  ? "0 8px 24px rgba(255,111,145,0.35)"
                  : "none",
              }}
            >
              {step === 1 && !photo ? "Skip & Continue →" : "Continue →"}
            </button>
          ) : (
            <button
              disabled={!canProceed}
              onClick={() =>
                alert("Generating your outfit recommendations... ✨")
              }
              className="flex-1 py-4 rounded-full text-white text-base font-bold cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                ...gradBg,
                boxShadow: canProceed
                  ? "0 10px 32px rgba(255,111,145,0.40)"
                  : "none",
              }}
            >
              ✨ Generate My Outfit
            </button>
          )}
        </div>

        {/* ── Summary chips ── */}
        {step > 1 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {photo && (
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-[#78081C] bg-white/70 border border-[rgba(220,195,170,0.5)]">
                📸 Photo added
              </div>
            )}
            {event && (
              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-[#961e32] border border-[rgba(255,111,145,0.28)]"
                style={{ background: "rgba(255,111,145,0.10)" }}
              >
                {events.find((e) => e.label === event)?.emoji} {event}
              </div>
            )}
            {style && (
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-[#78081C] bg-white/70 border border-[rgba(220,195,170,0.5)]">
                {stylesData.find((s) => s.label === style)?.icon} {style}
              </div>
            )}
            {gender && (
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-[#78081C] bg-white/70 border border-[rgba(220,195,170,0.5)]">
                {genders.find((g) => g.label === gender)?.icon} {gender}
              </div>
            )}
            {skinTone && (
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-[#78081C] bg-white/70 border border-[rgba(220,195,170,0.5)]">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{
                    background: skinTones.find((t) => t.label === skinTone)
                      ?.color,
                  }}
                />
                {skinTone}
              </div>
            )}
            {bodyType && (
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-[#78081C] bg-white/70 border border-[rgba(220,195,170,0.5)]">
                👤 {bodyType}
              </div>
            )}
            {season && (
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-[#78081C] bg-white/70 border border-[rgba(220,195,170,0.5)]">
                {seasons.find((s) => s.label === season)?.icon} {season}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
