import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "./../authServices.js";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Petal = ({ style }) => (
  <div className="absolute rounded-full pointer-events-none"
    style={{ background:"radial-gradient(circle,rgba(255,111,145,0.18) 0%,rgba(214,93,177,0.10) 100%)", ...style }}/>
);

const Field = ({ label, type, name, value, onChange, error, placeholder, icon, rightEl }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#961e32]">{label}</label>
      <div className="flex items-center gap-3 px-4 rounded-2xl border-[1.5px] transition-all duration-200 bg-white/70 backdrop-blur-sm"
        style={{
          borderColor: error ? "#E84040" : focused ? "#FF6F91" : "rgba(220,195,170,0.55)",
          boxShadow: focused ? "0 0 0 3px rgba(255,111,145,0.12)" : "none",
          height: "52px",
        }}>
        {icon && <span className="text-base flex-shrink-0 opacity-55">{icon}</span>}
        <input type={type} name={name} value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={name}
          className="flex-1 bg-transparent outline-none text-[14px] text-[#2a2a2a] placeholder-[#C8B4A0] font-medium"
        />
        {rightEl}
      </div>
      {error && (
        <p className="text-[11px] text-[#E84040] font-medium flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

export default function LoginPage() {
  const navigate = useNavigate();

  const [form,       setForm]       = useState({ email: "", password: "" });
  const [errors,     setErrors]     = useState({});
  const [apiError,   setApiError]   = useState("");
  const [loading,    setLoading]    = useState(false);
  const [googleLoad, setGoogleLoad] = useState(false);
  const [showPw,     setShowPw]     = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [toast,      setToast]      = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const validate = () => {
    const e = {};
    if (!form.email)                                              e.email    = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))    e.email    = "Enter a valid email";
    if (!form.password)                                          e.password = "Password is required";
    else if (form.password.length < 6)                           e.password = "At least 6 characters required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: "" }));
    if (apiError)     setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    const result = await loginUser({ email: form.email, password: form.password });
    setLoading(false);
    if (result.success) {
      showToast("Welcome back! ✨");
      setTimeout(() => navigate("/"), 1000);
    } else {
      setApiError(result.message);
    }
  };

  /* ── Google login with @react-oauth/google ── */
  const googleLogin = useGoogleLogin({
  onSuccess: async (tokenRes) => {
    setGoogleLoad(true);
    try {
      // 1️⃣ Send Google access token to your backend
      const res = await axios.post("http://localhost:3000/api/auth/google-login", {
        accessToken: tokenRes.access_token,
      });

      // 2️⃣ Backend verifies Google token, creates/returns your server JWT
      const { token, user } = res.data;

      // 3️⃣ Save server JWT & user info in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      showToast("Welcome! ✨");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error("Google login failed:", err);
      setApiError("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoad(false);
    }
  },
  onError: (err) => {
    console.error("Google login error:", err);
    setApiError("Google sign-in was cancelled or failed.");
    setGoogleLoad(false);
  },
});

  const gradBg   = { background:"linear-gradient(135deg,#78081C 0%,#FF6F91 50%,#D65DB1 100%)" };
  const gradText = { background:"linear-gradient(135deg,#78081C,#D65DB1)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" };
  const glass    = { background:"rgba(255,255,255,0.72)", backdropFilter:"blur(20px)", boxShadow:"0 8px 48px rgba(180,120,100,0.12)" };

  return (
    <div className="relative min-h-screen bg-[#F5EDE4] flex flex-col overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,700;1,900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
        .font-playfair { font-family:'Playfair Display',serif !important; }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float1  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-14px) rotate(6deg)} }
        @keyframes float2  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px) rotate(-4deg)} }
        @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes shake   { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        .fade-up    { animation:fadeUp 0.5s ease both; }
        .petal-1    { animation:float1 7s ease-in-out infinite; }
        .petal-2    { animation:float2 9s ease-in-out infinite 1.5s; }
        .toast-anim { animation:toastIn 0.4s cubic-bezier(.34,1.56,.64,1) both; }
        .spin       { animation:spin 0.8s linear infinite; }
        .shake      { animation:shake 0.4s ease; }
        input:-webkit-autofill {
          -webkit-box-shadow:0 0 0 40px rgba(255,255,255,0.70) inset !important;
          -webkit-text-fill-color:#2a2a2a !important;
        }
      `}</style>

      {/* blobs */}
      <div className="fixed -top-24 -right-24 w-[480px] h-[480px] rounded-full pointer-events-none z-0"
        style={{ background:"radial-gradient(ellipse,rgba(220,195,170,0.55) 0%,transparent 65%)" }}/>
      <div className="fixed -bottom-20 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none z-0"
        style={{ background:"radial-gradient(ellipse,rgba(201,168,124,0.25) 0%,transparent 65%)" }}/>
      <div className="fixed top-[30%] left-[5%] w-[260px] h-[260px] rounded-full pointer-events-none z-0"
        style={{ background:"radial-gradient(ellipse,rgba(255,111,145,0.10) 0%,transparent 70%)" }}/>

      {/* petals */}
      <Petal className="petal-1 z-0" style={{ top:"8%",  left:"8%",  width:"60px", height:"60px" }}/>
      <Petal className="petal-2 z-0" style={{ top:"18%", right:"7%", width:"44px", height:"44px" }}/>
      <Petal className="petal-1 z-0" style={{ top:"65%", left:"5%",  width:"36px", height:"36px" }}/>
      <Petal className="petal-2 z-0" style={{ top:"72%", right:"6%", width:"52px", height:"52px" }}/>

      {/* toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 toast-anim" style={{ transform:"translateX(-50%)" }}>
          <div className="rounded-2xl px-5 py-3 text-white text-[13px] font-semibold shadow-2xl whitespace-nowrap"
            style={{ ...gradBg, boxShadow:"0 8px 32px rgba(255,111,145,0.45)" }}>
            {toast}
          </div>
        </div>
      )}

      {/* topbar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5 fade-up">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
            style={{ ...gradBg, boxShadow:"0 4px 14px rgba(255,111,145,0.35)" }}>✨</div>
          <span className="font-playfair italic font-bold text-[18px]" style={gradText}>Perfect Outfit</span>
        </Link>
        <Link to="/" className="text-[13px] font-semibold text-[#9A9A9A] hover:text-[#78081C] transition-colors no-underline">
          ← Back
        </Link>
      </div>

      {/* content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-5 pb-12 pt-2">
        <div className="w-full max-w-[420px]">

          {/* header */}
          <div className="text-center mb-7 fade-up" style={{ animationDelay:"0.06s" }}>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-[5px] mb-4 border"
              style={{ background:"rgba(255,111,145,0.10)", borderColor:"rgba(255,111,145,0.28)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6F91] animate-pulse"/>
              <span className="text-[10px] font-bold tracking-[0.13em] uppercase text-[#961e32]">Welcome back</span>
            </div>
            <h1 className="font-playfair italic font-black leading-tight mb-2"
              style={{ fontSize:"clamp(30px,7vw,40px)", ...gradText }}>
              Sign In
            </h1>
            <p className="text-[#4b4949] text-sm leading-relaxed">
              Enter your credentials to access your outfits
            </p>
          </div>

          {/* glass card */}
          <div className="rounded-3xl p-6 border border-white/75 fade-up" style={{ ...glass, animationDelay:"0.12s" }}>

            {/* Google button */}
            <button
              onClick={() => { setGoogleLoad(true); googleLogin(); }}
              disabled={googleLoad || loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border-[1.5px] border-[rgba(220,195,170,0.5)] bg-white/80 text-[14px] font-semibold text-[#2a2a2a] transition-all duration-200 hover:border-[#FF6F91] hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mb-5">
              {googleLoad ? (
                <svg className="spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.12)" strokeWidth="3"/>
                  <path d="M12 2 A10 10 0 0 1 22 12" stroke="#4285F4" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  <path fill="none" d="M0 0h48v48H0z"/>
                </svg>
              )}
              Continue with Google
            </button>

            {/* divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-[rgba(220,195,170,0.45)]"/>
              <span className="text-[11px] font-semibold text-[#C8B4A0]">or sign in with email</span>
              <div className="flex-1 h-px bg-[rgba(220,195,170,0.45)]"/>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {apiError && (
                <div className="flex items-center gap-2.5 rounded-2xl px-4 py-3 border border-[rgba(232,64,64,0.25)] shake"
                  style={{ background:"rgba(232,64,64,0.06)" }}>
                  <span className="text-base flex-shrink-0">⚠️</span>
                  <p className="text-[13px] text-[#E84040] font-semibold">{apiError}</p>
                </div>
              )}

              <Field label="Email Address" type="email" name="email"
                value={form.email} onChange={handleChange} error={errors.email}
                placeholder="you@example.com" icon="✉️"/>

              <Field label="Password" type={showPw ? "text" : "password"} name="password"
                value={form.password} onChange={handleChange} error={errors.password}
                placeholder="Enter your password" icon="🔒"
                rightEl={
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    className="flex-shrink-0 text-[#C8B4A0] hover:text-[#FF6F91] transition-colors p-1 text-sm">
                    {showPw ? "🙈" : "👁️"}
                  </button>
                }/>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div onClick={() => setRememberMe(p => !p)}
                    className="w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer"
                    style={{
                      borderColor: rememberMe ? "transparent" : "rgba(220,195,170,0.6)",
                      background:  rememberMe ? "linear-gradient(135deg,#78081C,#FF6F91)" : "white",
                    }}>
                    {rememberMe && <span className="text-white text-[10px] font-bold leading-none">✓</span>}
                  </div>
                  <span className="text-[12px] font-medium text-[#4b4949]">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-[12px] font-semibold text-[#78081C] hover:underline no-underline">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" disabled={loading || googleLoad}
                className="w-full py-4 rounded-2xl text-white text-[15px] font-bold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ ...gradBg, boxShadow:(loading||googleLoad) ? "none" : "0 10px 32px rgba(255,111,145,0.40)" }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                      <path d="M12 2 A10 10 0 0 1 22 12" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Signing in…
                  </span>
                ) : "Sign In →"}
              </button>
            </form>
          </div>

          <p className="text-center text-[13px] text-[#9A9A9A] mt-5 fade-up" style={{ animationDelay:"0.18s" }}>
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-[#78081C] hover:underline no-underline">
              Create one free
            </Link>
          </p>

          <div className="flex items-center justify-center gap-5 mt-4 opacity-55">
            {["🔒 Secure", "✨ Free to start", "🌸 No spam"].map(b => (
              <span key={b} className="text-[11px] font-semibold text-[#9A9A9A]">{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}