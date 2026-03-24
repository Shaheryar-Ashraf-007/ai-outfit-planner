import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const profileRef = useRef(null);

  const [user] = useState(() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } });
  const [userProfile] = useState(() => { try { return JSON.parse(localStorage.getItem("userProfile")); } catch { return null; } });

  useEffect(() => {
    const fn = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-5xl z-50 bg-white/90 backdrop-blur-md rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(180,120,100,0.10)] px-5 py-2.5 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ce3f59] to-[#aa3853] flex items-center justify-center text-xl shadow-[0_4px_12px_rgba(255,111,145,0.30)]">
            👗
          </div>
          <span className="text-sm font-semibold text-[#5F5F5F]">
            Smart AI <span className="text-[#a8233b] font-bold">Ethnic Wear</span> Recommendation System
          </span>
        </div>

        {/* Right side */}
        {user && userProfile ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(p => !p)}
              className="flex items-center gap-2.5 bg-white/70 border border-[#FF6F91]/20 rounded-full pl-1.5 pr-4 py-1.5 cursor-pointer hover:border-[#FF6F91]/40 transition-all duration-200"
            >
              <img src={userProfile.picture} alt="" className="w-7 h-7 rounded-full object-cover" />
              <span className="text-sm font-semibold text-[#5F5F5F]">{userProfile.given_name}</span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-[calc(130%+8px)] w-56 bg-white/95 border border-[#FF6F91]/15 rounded-2xl shadow-[0_12px_40px_rgba(180,100,80,0.15)] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#f0e0d8] flex items-center gap-2.5">
                  <img src={userProfile.picture} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#5F5F5F] truncate">{userProfile.name}</p>
                    <p className="text-[11px] text-[#9A9A9A] truncate">{userProfile.email}</p>
                  </div>
                </div>
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#5F5F5F] hover:bg-[#FF6F91]/07 transition-colors text-left">
                  👗 <span>My Outfits</span>
                </button>
                <div className="border-t border-[#f0e0d8]">
                  <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors text-left">
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setOpenDialog(true)}
            className="flex items-center gap-2.5 bg-white/70 border border-[#FF6F91]/20 rounded-full pl-1.5 pr-4 py-1.5 cursor-pointer hover:border-[#FF6F91]/40 transition-all duration-200"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#e8c9a0] to-[#c9a87c] flex items-center justify-center text-sm">
              👤
            </div>
            <span className="text-sm font-semibold text-[#5F5F5F]">Sign in</span>
          </button>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-20" />

      {/* Dialog */}
      {openDialog && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[rgba(100,60,40,0.30)] backdrop-blur-md"
            onClick={() => setOpenDialog(false)}
          />
          <div className="relative bg-white/92 border border-white/70 rounded-3xl shadow-[0_24px_60px_rgba(180,100,80,0.18)] w-full max-w-sm p-9 flex flex-col items-center gap-5 backdrop-blur-xl">
            <button
              onClick={() => setOpenDialog(false)}
              className="absolute top-3.5 right-4 text-xl text-[#9A9A9A] hover:text-[#5F5F5F] transition-colors bg-none border-none cursor-pointer leading-none"
            >×</button>

            <div className="w-16 h-16 rounded-[18px] bg-gradient-to-br from-[#FF8A8A]/20 to-[#D65DB1]/20 border border-[#FF6F91]/25 flex items-center justify-center text-3xl">
              👗
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-[#C94C7C] mb-2">Welcome to AI Outfit Stylist</h2>
              <p className="text-xs text-[#9A9A9A] leading-relaxed">
                Sign in to get personalized outfit recommendations based on your style, body type, and events.
              </p>
            </div>

            <button className="w-full py-3 rounded-2xl border border-[#DCC3AA]/60 bg-white/60 text-sm font-semibold text-[#5F5F5F] cursor-pointer hover:bg-[#FF6F91]/07 transition-colors">
              Continue with Google
            </button>

            <p className="text-xs text-[#9A9A9A]">Discover your perfect outfit with AI ✨</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;