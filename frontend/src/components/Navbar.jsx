import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, isLoggedIn, logoutUser } from "./../authServices.js";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dropRef = useRef(null);

  const [user, setUser] = useState(getCurrentUser());
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  /* ── FIX 1: re-read auth from localStorage on EVERY route change ──
     This is what makes Sign In / Sign Out reflect instantly without
     a manual refresh. When LoginPage saves the token and calls
     navigate("/"), this effect fires and picks up the new state.     */
  useEffect(() => {
    setUser(getCurrentUser());
    setLoggedIn(isLoggedIn());
    setMobileOpen(false);
    setDropOpen(false);
  }, [location.pathname]);

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* navbar shadow on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logoutUser();
    setLoggingOut(false);
    setUser(null);
    setLoggedIn(false);
    setDropOpen(false);
    navigate("/");
  };

  const gradBg = {
    background: "linear-gradient(135deg,#78081C 0%,#FF6F91 50%,#D65DB1 100%)",
  };
  const gradText = {
    background: "linear-gradient(135deg,#78081C,#D65DB1)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  /* user initials for avatar */
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  /* ── FIX 2: define navLinks so mobile menu doesn't crash ── */
  const navLinks = [
    { label: "Home", to: "/" },
    { label: "My Outfits", to: "/view-outfit" },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&family=DM+Sans:wght@400;500;600;700&display=swap');
        .navbar-root * { font-family:'DM Sans',sans-serif; }
        .font-playfair { font-family:'Playfair Display',serif !important; }

        @keyframes dropIn  { from{opacity:0;transform:translateY(-8px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes mobileIn{ from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        .drop-in    { animation:dropIn   0.22s cubic-bezier(.34,1.2,.64,1) both; }
        .mobile-in  { animation:mobileIn 0.25s ease both; }
        .spin       { animation:spin 0.8s linear infinite; }
        .nav-link { position:relative; }
        .nav-link::after {
          content:''; position:absolute; bottom:-2px; left:0; right:0;
          height:2px; border-radius:2px; transform:scaleX(0); transition:transform 0.2s ease;
          background:linear-gradient(90deg,#78081C,#FF6F91);
        }
        .nav-link:hover::after, .nav-link.active::after { transform:scaleX(1); }
        .avatar-btn:hover { transform:scale(1.05); }
        .sign-in-btn:hover { transform:translateY(-1px); box-shadow:0 8px 24px rgba(255,111,145,0.45) !important; }
      `}</style>

      <nav
        className={`navbar-root sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`}
        style={{
          background: scrolled
            ? "rgba(245,237,228,0.95)"
            : "rgba(245,237,228,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(220,195,170,0.35)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 h-[64px] flex items-center justify-between gap-4">
          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-2 no-underline flex-shrink-0"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-transform hover:scale-105"
              style={{
                ...gradBg,
                boxShadow: "0 4px 14px rgba(255,111,145,0.35)",
              }}
            >
              ✨
            </div>
            <span
              className="font-playfair italic font-bold text-[18px] hidden sm:block"
              style={gradText}
            >
              Smart Ethenic Wear Recommendation system
            </span>
          </Link>

          {/* ── Right side ── */}
          <div className="flex items-center gap-3">
            {/* ── NOT logged in: Sign In button ── */}
            {!loggedIn && (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:block px-4 py-2 rounded-xl text-[13px] font-semibold text-[#78081C] border-[1.5px] border-[rgba(120,8,28,0.25)] bg-transparent hover:bg-[rgba(255,111,145,0.07)] hover:border-[#FF6F91] transition-all duration-200 no-underline"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="sign-in-btn px-5 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all duration-200 no-underline"
                  style={{
                    ...gradBg,
                    boxShadow: "0 4px 16px rgba(255,111,145,0.35)",
                  }}
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* ── Logged in: avatar + dropdown ── */}
            {loggedIn && (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen((p) => !p)}
                  className="avatar-btn flex items-center gap-2.5 rounded-2xl px-3 py-1.5 border-[1.5px] transition-all duration-200"
                  style={{
                    borderColor: dropOpen ? "#FF6F91" : "rgba(220,195,170,0.5)",
                    background: "rgba(255,255,255,0.75)",
                    backdropFilter: "blur(8px)",
                    boxShadow: dropOpen
                      ? "0 0 0 3px rgba(255,111,145,0.12)"
                      : "none",
                  }}
                >
                  {/* avatar */}
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
                    style={gradBg}
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt=""
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <span className="text-[13px] font-semibold text-[#2a2a2a] hidden sm:block max-w-[120px] truncate">
                    {user?.name?.split(" ")[0] ?? "My Account"}
                  </span>
                  <span
                    className="text-[10px] text-[#9A9A9A] transition-transform duration-200"
                    style={{
                      transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    ▾
                  </span>
                </button>

                {/* dropdown */}
                {dropOpen && (
                  <div
                    className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-2xl overflow-hidden border border-white/75 drop-in"
                    style={{
                      background: "rgba(255,255,255,0.96)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 16px 48px rgba(180,120,100,0.18)",
                    }}
                  >
                    {/* user info header */}
                    <div
                      className="px-4 py-3.5 border-b border-[rgba(220,195,170,0.3)]"
                      style={{ background: "rgba(255,111,145,0.04)" }}
                    >
                      <div className="flex items-center gap-2.5">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt=""
                            className="w-8 h-8 rounded-xl object-cover"
                          />
                        ) : (
                          initials
                        )}
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-[#2a2a2a] truncate">
                            {user?.name ?? "User"}
                          </p>
                          <p className="text-[11px] text-[#9A9A9A] truncate">
                            {user?.email ?? ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* menu items */}
                    {[
                      { icon: "👗", label: "My Outfits", to: "/view-outfit" },
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-[13px] font-medium text-[#4b4949] hover:bg-[rgba(255,111,145,0.06)] hover:text-[#78081C] transition-colors no-underline"
                      >
                        <span className="text-base">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}

                    <div className="border-t border-[rgba(220,195,170,0.3)] mt-0.5">
                      <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-semibold text-[#E84040] hover:bg-[rgba(232,64,64,0.05)] transition-colors disabled:opacity-50"
                      >
                        {loggingOut ? (
                          <>
                            <svg
                              className="spin w-4 h-4"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="rgba(232,64,64,0.2)"
                                strokeWidth="3"
                              />
                              <path
                                d="M12 2 A10 10 0 0 1 22 12"
                                stroke="#E84040"
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                            </svg>
                            Signing out…
                          </>
                        ) : (
                          <>
                            <span className="text-base">🚪</span>Sign Out
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div
            className="md:hidden border-t border-[rgba(220,195,170,0.35)] mobile-in"
            style={{
              background: "rgba(245,237,228,0.97)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3 rounded-xl text-[14px] font-semibold no-underline transition-colors
                    ${isActive(link.to) ? "text-[#78081C] bg-[rgba(255,111,145,0.08)]" : "text-[#4b4949] hover:bg-[rgba(255,111,145,0.05)] hover:text-[#78081C]"}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-[rgba(220,195,170,0.3)] mt-2 pt-3 flex flex-col gap-2">
                {!loggedIn ? (
                  <>
                    <Link
                      to="/login"
                      className="px-4 py-3 rounded-xl text-[14px] font-semibold text-[#78081C] border border-[rgba(120,8,28,0.2)] text-center no-underline hover:bg-[rgba(255,111,145,0.07)] transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="px-4 py-3 rounded-xl text-[14px] font-bold text-white text-center no-underline transition-all"
                      style={gradBg}
                    >
                      Get Started ✨
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="px-4 py-3 rounded-xl text-[14px] font-semibold text-[#E84040] border border-[rgba(232,64,64,0.2)] text-center hover:bg-[rgba(232,64,64,0.05)] transition-colors disabled:opacity-50"
                  >
                    {loggingOut ? "Signing out…" : "🚪 Sign Out"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
