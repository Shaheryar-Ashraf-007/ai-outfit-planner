import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3000/api/data" });
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

const skinToneColors = {
  Fair: "#FDDBB4", Light: "#F0B27A", Medium: "#D4915A",
  Olive: "#C07A3A", Tan: "#A0612A", Deep: "#6B3A1F",
};

/* ─── Outfit Card ─── */
const OutfitCard = ({ outfit, isFavorite, onFavorite, onDelete, onShare, onView, favLoading, deleteLoading }) => {
  const gradBg = { background: "linear-gradient(135deg,#78081C 0%,#FF6F91 50%,#D65DB1 100%)" };
  const p = outfit.palette || ["#8B1A2E", "#C9485B", "#E8B4A0", "#F5E6D0"];

  return (
    <div
      className="relative rounded-3xl overflow-hidden border border-white/75 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(16px)", boxShadow: "0 4px 24px rgba(180,120,100,0.12)" }}
      onClick={() => onView(outfit)}>

      <div className="relative" style={{ height: "180px" }}>
        {outfit.image ? (
          <img src={outfit.image} alt={outfit.title} className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full flex flex-wrap">
            {p.slice(0, 4).map((c, i) => <div key={i} className="w-1/2 h-1/2" style={{ background: c }} />)}
          </div>
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.35) 0%,transparent 60%)" }} />

        {outfit.match && (
          <div className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold text-white" style={gradBg}>
            {outfit.match}% match
          </div>
        )}

        <div className="absolute top-3 right-3 flex gap-1.5" onClick={e => e.stopPropagation()}>
          <button
            disabled={favLoading}
            onClick={() => onFavorite(outfit)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm border-2 backdrop-blur-sm transition-all duration-200
              ${isFavorite ? "bg-[#FF6F91] border-[#FF6F91] text-white" : "bg-white/80 border-white/60 text-[#9A9A9A] hover:border-[#FF6F91]"}`}>
            {favLoading
              ? <svg className="spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" /><path d="M12 2 A10 10 0 0 1 22 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
              : isFavorite ? "♥" : "♡"}
          </button>
          <button onClick={() => onShare(outfit)} className="w-8 h-8 rounded-xl flex items-center justify-center text-sm bg-white/80 border-2 border-white/60 text-[#9A9A9A] hover:border-[#FF6F91] backdrop-blur-sm transition-all">↗</button>
          <button
            disabled={deleteLoading}
            onClick={() => onDelete(outfit)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm bg-white/80 border-2 border-white/60 text-[#E84040] hover:border-[#E84040] backdrop-blur-sm transition-all">
            {deleteLoading
              ? <svg className="spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" /><path d="M12 2 A10 10 0 0 1 22 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
              : "🗑"}
          </button>
        </div>

        <div className="absolute bottom-3 left-3 flex gap-1 flex-wrap">
          {outfit.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="rounded-full px-2 py-0.5 text-[9px] font-bold text-white"
              style={{ background: "rgba(120,8,28,0.75)", backdropFilter: "blur(4px)" }}>{tag}</span>
          ))}
        </div>
      </div>

      <div className="px-4 py-3.5">
        <h3 className="font-playfair italic font-bold text-[16px] text-[#2a2a2a] leading-tight truncate">{outfit.title}</h3>
        <p className="text-[11px] text-[#9A9A9A] mt-0.5 truncate">{outfit.subtitle}</p>
        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
          {outfit.occasion && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-[#78081C] bg-[rgba(255,111,145,0.10)] rounded-full px-2 py-0.5 border border-[rgba(255,111,145,0.22)]">
              🎉 {outfit.occasion}
            </span>
          )}
          {outfit.fabric && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-[#78081C] bg-white/70 rounded-full px-2 py-0.5 border border-[rgba(220,195,170,0.5)]">
              🧵 {outfit.fabric}
            </span>
          )}
        </div>
        <div className="flex gap-1.5 mt-3">
          {p.slice(0, 4).map(c => (
            <div key={c} className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ background: c }} />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Delete Modal ─── */
const DeleteModal = ({ outfit, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-5"
    style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
    onClick={onCancel}>
    <div className="w-full max-w-sm rounded-3xl p-6 border border-white/75"
      style={{ background: "rgba(255,255,255,0.96)", backdropFilter: "blur(20px)", boxShadow: "0 24px 64px rgba(120,8,28,0.18)" }}
      onClick={e => e.stopPropagation()}>
      <div className="w-14 h-14 rounded-2xl bg-[rgba(232,64,64,0.10)] flex items-center justify-center text-2xl mx-auto mb-4">🗑️</div>
      <h3 className="font-playfair italic font-bold text-[20px] text-[#2a2a2a] text-center mb-2">Delete Outfit?</h3>
      <p className="text-[13px] text-[#9A9A9A] text-center leading-relaxed mb-6">
        "<span className="text-[#2a2a2a] font-semibold">{outfit?.title}</span>" will be permanently removed.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-3 rounded-2xl border-[1.5px] border-[rgba(220,195,170,0.5)] text-[#4b4949] text-[13px] font-semibold hover:bg-[rgba(220,195,170,0.1)] transition-all">Cancel</button>
        <button onClick={onConfirm} disabled={loading}
          className="flex-1 py-3 rounded-2xl text-white text-[13px] font-bold transition-all disabled:opacity-50"
          style={{ background: "#E84040", boxShadow: "0 6px 20px rgba(232,64,64,0.35)" }}>
          {loading ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  </div>
);

/* ─── Empty State ─── */
const EmptyState = ({ tab }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-5xl mb-4">{tab === "favorites" ? "♡" : "👗"}</div>
    <h3 className="font-playfair italic font-bold text-[20px] text-[#3a3a3a] mb-2">
      {tab === "favorites" ? "No favorites yet" : "No outfits yet"}
    </h3>
    <p className="text-[13px] text-[#9A9A9A] mb-6 max-w-[240px] leading-relaxed">
      {tab === "favorites" ? "Heart an outfit from your collection to save it here" : "Generate your first AI outfit recommendation"}
    </p>
    <Link to="/create-outfit" className="no-underline rounded-full px-6 py-3 text-white text-[13px] font-bold"
      style={{ background: "linear-gradient(135deg,#78081C 0%,#FF6F91 50%,#D65DB1 100%)", boxShadow: "0 8px 24px rgba(255,111,145,0.35)" }}>
      ✨ Create New Outfit
    </Link>
  </div>
);

/* ─── Skeleton ─── */
const SkeletonCard = () => (
  <div className="rounded-3xl overflow-hidden border border-white/60 animate-pulse" style={{ background: "rgba(255,255,255,0.5)" }}>
    <div className="h-[180px] bg-[rgba(220,195,170,0.3)]" />
    <div className="px-4 py-3.5 space-y-2">
      <div className="h-4 bg-[rgba(220,195,170,0.4)] rounded-full w-3/4" />
      <div className="h-3 bg-[rgba(220,195,170,0.3)] rounded-full w-1/2" />
      <div className="flex gap-1.5 mt-3">{[1,2,3,4].map(i => <div key={i} className="w-4 h-4 rounded-full bg-[rgba(220,195,170,0.4)]" />)}</div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function MyOutfitsPage() {
  const navigate = useNavigate();

  const [activeTab,     setActiveTab]     = useState("all");
  const [allOutfits,    setAllOutfits]    = useState([]);
  const [favorites,     setFavorites]     = useState([]);
  const [favoriteIds,   setFavoriteIds]   = useState(new Set());
  const [loading,       setLoading]       = useState(true);
  const [favLoading,    setFavLoading]    = useState({});
  const [deleteLoading, setDeleteLoading] = useState({});
  const [toast,         setToast]         = useState("");
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [searchQuery,   setSearchQuery]   = useState("");

  const gradBg   = { background: "linear-gradient(135deg,#78081C 0%,#FF6F91 50%,#D65DB1 100%)" };
  const gradText = { background: "linear-gradient(135deg,#78081C,#D65DB1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  /* ── Fetch all outfits ── */
  const fetchAllOutfits = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/my");
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setAllOutfits(data);
    } catch (err) {
      console.error("fetchAllOutfits:", err);
      setAllOutfits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Fetch favorites ── */
  const fetchFavorites = useCallback(async () => {
    try {
      const res = await api.get("/favorites");
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setFavorites(data);
      setFavoriteIds(new Set(data.map(o => o.id)));
    } catch (err) {
      console.error("fetchFavorites:", err);
    }
  }, []);

  useEffect(() => {
    fetchAllOutfits();
    fetchFavorites();
  }, [fetchAllOutfits, fetchFavorites]);

  /* ── Toggle favorite ── ✅ Fixed: outfit is first param */
  const handleFavorite = async (outfit) => {
    const id = outfit.id;
    setFavLoading(p => ({ ...p, [id]: true }));
    try {
      const res = await api.post(`/favorite/${id}`);
      const added = res.data?.added;

      setFavoriteIds(prev => {
        const next = new Set(prev);
        added ? next.add(id) : next.delete(id);
        return next;
      });

      if (added) {
        setFavorites(prev => prev.some(o => o.id === id) ? prev : [outfit, ...prev]);
      } else {
        setFavorites(prev => prev.filter(o => o.id !== id));
      }

      showToast(added ? "Added to favorites ♥" : "Removed from favorites");

    } catch (err) {
      console.error("toggleFavorite:", err);
      showToast("Failed to update favorites");
    } finally {
      setFavLoading(p => ({ ...p, [id]: false }));
    }
  };

  /* ── Delete ── */
  const confirmDelete = (outfit) => setDeleteTarget(outfit);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleteLoading(p => ({ ...p, [id]: true }));
    try {
      await api.delete(`/${id}`);
      setAllOutfits(prev => prev.filter(o => o.id !== id));
      setFavorites(prev => prev.filter(o => o.id !== id));
      setFavoriteIds(prev => { const next = new Set(prev); next.delete(id); return next; });
      showToast("Outfit deleted");
    } catch (err) {
      console.error("deleteOutfit:", err);
      showToast("Failed to delete outfit");
    } finally {
      setDeleteLoading(p => ({ ...p, [id]: false }));
      setDeleteTarget(null);
    }
  };

  /* ── Share ── */
  const handleShare = async (outfit) => {
    try {
      const res = await api.post(`/share/${outfit.id}`);
      const url = res.data?.shareUrl || res.data?.url || window.location.href;
      await navigator.clipboard.writeText(url);
    } catch {
      await navigator.clipboard.writeText(window.location.href);
    }
    showToast("Link copied! 🔗");
  };

  /* ── View ── */
  const handleView = (outfit) => navigate("/view-outfit", { state: { outfitData: [outfit] } });

  /* ── Filter ── */
  const displayedOutfits = (activeTab === "favorites" ? favorites : allOutfits).filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.title?.toLowerCase().includes(q) ||
      o.occasion?.toLowerCase().includes(q) ||
      o.style?.toLowerCase().includes(q) ||
      o.fabric?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative min-h-screen bg-[#F5EDE4] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,700;1,900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family:'DM Sans',sans-serif; }
        .font-playfair { font-family:'Playfair Display',serif !important; }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes shimmer { 0%{opacity:1} 50%{opacity:0.5} 100%{opacity:1} }
        .fade-up    { animation:fadeUp  0.5s ease both; }
        .fade-in    { animation:fadeIn  0.3s ease both; }
        .spin       { animation:spin 0.85s linear infinite; }
        .toast-anim { animation:toastIn 0.4s cubic-bezier(.34,1.56,.64,1) both; }
        .animate-pulse { animation:shimmer 1.5s ease-in-out infinite; }
        .tab-pill { flex:1; padding:10px 12px; border:none; border-radius:999px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s ease; color:#9A9A9A; background:transparent; }
        .tab-pill.active { background:linear-gradient(135deg,#78081C 0%,#FF6F91 50%,#D65DB1 100%); color:white; box-shadow:0 4px 16px rgba(255,111,145,0.35); }
        .search-input:focus { outline:none; }
      `}</style>

      {/* blobs */}
      <div className="fixed -top-24 -right-24 w-[420px] h-[420px] rounded-full pointer-events-none z-0" style={{ background: "radial-gradient(ellipse,rgba(220,195,170,0.55) 0%,transparent 65%)" }} />
      <div className="fixed -bottom-16 -left-16 w-[360px] h-[360px] rounded-full pointer-events-none z-0" style={{ background: "radial-gradient(ellipse,rgba(201,168,124,0.22) 0%,transparent 65%)" }} />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 toast-anim" style={{ transform: "translateX(-50%)" }}>
          <div className="rounded-2xl px-5 py-3 text-white text-[13px] font-semibold whitespace-nowrap"
            style={{ ...gradBg, boxShadow: "0 8px 32px rgba(255,111,145,0.45)" }}>{toast}</div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal outfit={deleteTarget} loading={!!deleteLoading[deleteTarget?.id]}
          onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}

      {/* Topbar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-12 pb-4">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base" style={{ ...gradBg, boxShadow: "0 4px 14px rgba(255,111,145,0.35)" }}>✨</div>
          <span className="font-playfair italic font-bold text-[18px] hidden sm:block" style={gradText}>Perfect Outfit</span>
        </Link>
        <Link to="/create-outfit" className="no-underline flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold text-white"
          style={{ ...gradBg, boxShadow: "0 4px 16px rgba(255,111,145,0.35)" }}>+ New Outfit</Link>
      </div>

      {/* Header */}
      <div className="relative z-10 px-5 mb-6 fade-up">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-[5px] mb-3 border"
          style={{ background: "rgba(255,111,145,0.10)", borderColor: "rgba(255,111,145,0.28)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6F91] animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.13em] uppercase text-[#961e32]">
            {allOutfits.length} saved · {favorites.length} favourited
          </span>
        </div>
        <h1 className="font-playfair italic font-black leading-tight mb-1" style={{ fontSize: "clamp(28px,6vw,38px)", ...gradText }}>My Outfits</h1>
        <p className="text-[#4b4949] text-sm">Your AI-generated style collection</p>
      </div>

      {/* Search */}
      <div className="relative z-10 px-5 mb-5">
        <div className="flex items-center gap-3 px-4 rounded-2xl border-[1.5px] border-[rgba(220,195,170,0.5)] bg-white/70 backdrop-blur-sm" style={{ height: "48px" }}>
          <span className="text-base opacity-50">🔍</span>
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title, occasion, fabric…"
            className="search-input flex-1 bg-transparent text-[14px] text-[#2a2a2a] placeholder-[#C8B4A0] font-medium" />
          {searchQuery && <button onClick={() => setSearchQuery("")} className="text-[#C8B4A0] hover:text-[#78081C] transition-colors text-lg">×</button>}
        </div>
      </div>

      {/* Tabs */}
      <div className="relative z-10 px-5 mb-6">
        <div className="flex gap-1 p-1 rounded-2xl border border-[rgba(220,195,170,0.35)]"
          style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(12px)" }}>
          <button className={`tab-pill ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
            All Outfits {allOutfits.length > 0 && `(${allOutfits.length})`}
          </button>
          <button className={`tab-pill ${activeTab === "favorites" ? "active" : ""}`} onClick={() => setActiveTab("favorites")}>
            ♥ Favorites {favorites.length > 0 && `(${favorites.length})`}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-5 pb-20">
        {loading && <div className="grid grid-cols-2 gap-3">{[1,2,3,4].map(i => <SkeletonCard key={i} />)}</div>}

        {!loading && displayedOutfits.length === 0 && (
          <div className="fade-in">
            {searchQuery ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="font-playfair italic font-bold text-[18px] text-[#3a3a3a] mb-2">No results found</h3>
                <p className="text-[13px] text-[#9A9A9A] mb-4">Try searching for something else</p>
                <button onClick={() => setSearchQuery("")} className="text-[13px] font-semibold text-[#78081C] hover:underline">Clear search</button>
              </div>
            ) : <EmptyState tab={activeTab} />}
          </div>
        )}

        {!loading && displayedOutfits.length > 0 && (
          <div className="grid grid-cols-2 gap-3 fade-in">
            {displayedOutfits.map((outfit, i) => (
              <div key={outfit.id} style={{ animationDelay: `${i * 0.05}s` }}>
                <OutfitCard
                  outfit={outfit}
                  isFavorite={favoriteIds.has(outfit.id)}
                  onFavorite={handleFavorite}
                  onDelete={confirmDelete}
                  onShare={handleShare}
                  onView={handleView}
                  favLoading={!!favLoading[outfit.id]}
                  deleteLoading={!!deleteLoading[outfit.id]}
                />
              </div>
            ))}
          </div>
        )}

        {!loading && allOutfits.length > 0 && (
          <div className="flex justify-center mt-8">
            <button onClick={() => { fetchAllOutfits(); fetchFavorites(); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border-[1.5px] border-[rgba(220,195,170,0.5)] bg-white/70 text-[12px] font-semibold text-[#4b4949] hover:border-[#FF6F91] hover:text-[#78081C] transition-all">
              ↻ Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}